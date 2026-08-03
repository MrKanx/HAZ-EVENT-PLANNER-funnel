/**
 * Captura y gestiona fbclid, UTMs, _fbc y _fbp para atribución completa de Meta Ads.
 *
 * fbclid       → generado por Meta al hacer click en un anuncio
 * fbc          → cookie estándar Meta: fb.1.{ts}.{fbclid}
 * fbp          → cookie de browser ID de Meta (generada por el Pixel)
 * utm_source   → ej. "facebook", "meta", "instagram"
 * utm_medium   → ej. "cpc", "paid_ad"
 * utm_campaign → ej. "bodas_2026"
 * utm_content  → ID o nombre del anuncio
 * utm_term     → ID del adset (opcional)
 * utm_id       → ID numérico de la campaña (opcional)
 */

const STORAGE_KEY = 'os_fb'

export interface FbParams {
  fbclid: string
  fbc: string
  fbp: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  utm_id: string
}

export interface LeadAttributionPayload extends FbParams {
  source: string
  lead_source: string
  attributionSource: string
  page_url: string
  referrer: string
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : ''
}

function buildFbc(fbclid: string): string {
  return `fb.1.${Date.now()}.${fbclid}`
}

function extractFbclidFromFbcCookie(fbcCookie: string): string {
  if (!fbcCookie) return ''
  const parts = fbcCookie.split('.')
  return parts.length >= 4 ? parts[parts.length - 1] : ''
}

/**
 * Captura fbclid + UTMs de la URL y los persiste en sessionStorage y localStorage.
 */
export function captureFbParams(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  let fbclid = params.get('fbclid') ?? ''

  const cookieFbc = getCookie('_fbc')
  if (!fbclid && cookieFbc) {
    fbclid = extractFbclidFromFbcCookie(cookieFbc)
  }

  const existing = getStoredFbParams()

  // Si no hay fbclid en URL pero teníamos uno en storage o cookie, conservarlo
  if (!fbclid && existing.fbclid) {
    fbclid = existing.fbclid
  }

  let fbc = cookieFbc || existing.fbc
  if (!fbc && fbclid) {
    fbc = buildFbc(fbclid)
  }

  const fbp = getCookie('_fbp') || existing.fbp

  const rawUtmSource = params.get('utm_source') ?? existing.utm_source ?? ''
  const rawUtmMedium = params.get('utm_medium') ?? existing.utm_medium ?? ''

  // Si viene con fbclid pero sin utm_source explícito, asignar por defecto "facebook" y "cpc"
  const utm_source = rawUtmSource || (fbclid ? 'facebook' : '')
  const utm_medium = rawUtmMedium || (fbclid ? 'cpc' : '')

  const data: FbParams = {
    fbclid,
    fbc,
    fbp,
    utm_source,
    utm_medium,
    utm_campaign: params.get('utm_campaign') ?? existing.utm_campaign ?? '',
    utm_content:  params.get('utm_content')  ?? existing.utm_content  ?? '',
    utm_term:     params.get('utm_term')     ?? existing.utm_term     ?? '',
    utm_id:       params.get('utm_id')       ?? existing.utm_id       ?? '',
  }

  const serialized = JSON.stringify(data)
  try {
    sessionStorage.setItem(STORAGE_KEY, serialized)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch { /* ignorar */ }
}

/**
 * Retorna todos los parámetros de atribución almacenados en esta sesión.
 */
export function getStoredFbParams(): FbParams {
  let params: FbParams = {
    fbclid: '', fbc: '', fbp: '',
    utm_source: '', utm_medium: '', utm_campaign: '',
    utm_content: '', utm_term: '', utm_id: '',
  }

  if (typeof window === 'undefined') return params

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
    if (raw) params = JSON.parse(raw) as FbParams
  } catch { /* ignorar */ }

  const cookieFbc = getCookie('_fbc')
  if (cookieFbc) {
    params.fbc = cookieFbc
    if (!params.fbclid) {
      params.fbclid = extractFbclidFromFbcCookie(cookieFbc)
    }
  } else if (!params.fbc && params.fbclid) {
    params.fbc = buildFbc(params.fbclid)
  }

  const cookieFbp = getCookie('_fbp')
  if (cookieFbp) {
    params.fbp = cookieFbp
  }

  if (params.fbclid && !params.utm_source) {
    params.utm_source = 'facebook'
    params.utm_medium = 'cpc'
  }

  try {
    const serialized = JSON.stringify(params)
    sessionStorage.setItem(STORAGE_KEY, serialized)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch { /* ignorar */ }

  return params
}

/**
 * Genera el objeto de atribución completo con los nombres de campos que espera GoHighLevel y Meta.
 */
export function getLeadAttributionPayload(): LeadAttributionPayload {
  const params = getStoredFbParams()
  const isMetaAd = Boolean(params.fbclid || (params.utm_source && ['facebook', 'meta', 'instagram', 'ig'].includes(params.utm_source.toLowerCase())))

  let source = 'HAZ-EVENT-PLANNER-web'
  if (params.utm_source) {
    source = params.utm_source
  } else if (isMetaAd) {
    source = 'Facebook Ads'
  }

  return {
    ...params,
    source,
    lead_source: isMetaAd ? 'Facebook Ads' : 'Organic Web',
    attributionSource: isMetaAd ? 'Facebook Ads' : 'HAZ-EVENT-PLANNER-web',
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  }
}

/**
 * Dispara eventos de Meta Pixel con datos avanzados de coincidencia (Advanced Matching).
 */
export function trackMetaPixelEvent(
  eventName: string,
  customData: Record<string, any> = {},
  eventId?: string,
  userData?: { email?: string; phone?: string; firstName?: string; lastName?: string }
): void {
  if (typeof window === 'undefined') return

  const pixelId = import.meta.env.VITE_PIXEL_ID || '2308342313253528'
  const fbq = (window as any).fbq

  if (typeof fbq === 'function') {
    if (userData) {
      const cleanUserData: Record<string, string> = {}
      if (userData.email) cleanUserData.em = userData.email.trim().toLowerCase()
      if (userData.phone) cleanUserData.ph = userData.phone.replace(/\D/g, '')
      if (userData.firstName) cleanUserData.fn = userData.firstName.trim().toLowerCase()
      if (userData.lastName) cleanUserData.ln = userData.lastName.trim().toLowerCase()

      try {
        fbq('init', pixelId, cleanUserData)
      } catch { /* ignorar */ }
    }

    const options: Record<string, any> = {}
    if (eventId) options.eventID = eventId

    try {
      fbq('track', eventName, customData, options)
    } catch { /* ignorar */ }
  }
}

