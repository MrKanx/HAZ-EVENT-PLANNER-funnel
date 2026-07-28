import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import FunnelView from '../views/FunnelView.vue'
import VideoView from '../views/VideoView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import LegalNoticeView from '../views/LegalNoticeView.vue'
import BookingView from '../views/BookingView.vue'
import BookedView from '../views/BookedView.vue'
import NoSpaceView from '../views/NoSpaceView.vue'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogUrl: string
    jsonLd?: object[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      alias: '/registro-vsl-tr',
      name: 'funnel',
      component: FunnelView,
      meta: {
        title: 'Haz Event Planner | Casa del Río & Eventos 360° en Guayaquil',
        description:
          'Descubre el Método de Sincronización Operativa 360° con Gabriel Gutiérrez. Tu celebración en el exclusivo salón Casa del Río o en tu locación ideal sin estrés.',
        canonical: 'https://hazeventplanner.com/',
        ogTitle: 'Haz Event Planner | Casa del Río & Eventos 360°',
        ogDescription:
          'Descubre el Método de Sincronización Operativa 360° con Gabriel Gutiérrez. Tu celebración en el exclusivo salón Casa del Río o en tu locación ideal sin estrés.',
        ogUrl: 'https://hazeventplanner.com/',
      } satisfies RouteMeta,
    },
    {
      path: '/ver-video',
      name: 'video',
      component: VideoView,
      meta: {
        title: 'Mira el Video | Haz Event Planner — Paso 1 de 2',
        description: 'Descubre cómo blindar tu celebración y eliminar el caos logístico con el Método de Sincronización Operativa 360°.',
        canonical: 'https://hazeventplanner.com/ver-video',
        ogTitle: 'Mira el Video | Haz Event Planner',
        ogDescription: 'Ve el video exclusivo y agenda tu Cita Estratégica gratuita.',
        ogUrl: 'https://hazeventplanner.com/ver-video',
      } satisfies RouteMeta,
    },
    {
      path: '/agendar',
      name: 'booking',
      component: BookingView,
      meta: {
        title: 'Agenda tu Cita Estratégica | Haz Event Planner — Paso 2 de 2',
        description: 'Selecciona el día y hora para tu sesión gratuita de Diagnóstico y Planificación de Timing Operativo.',
        canonical: 'https://hazeventplanner.com/agendar',
        ogTitle: 'Agenda tu Cita Estratégica | Haz Event Planner',
        ogDescription: 'Elige tu horario y reserva tu Diagnóstico y Planificación de Timing Operativo.',
        ogUrl: 'https://hazeventplanner.com/agendar',
      } satisfies RouteMeta,
    },
    {
      path: '/cita-confirmada',
      name: 'booked',
      component: BookedView,
      meta: {
        title: 'Cita Confirmada | Haz Event Planner',
        description: 'Tu Cita Estratégica con Gabriel Gutiérrez está confirmada. Revisa tu correo.',
        canonical: 'https://hazeventplanner.com/cita-confirmada',
        ogTitle: 'Cita Confirmada | Haz Event Planner',
        ogDescription: 'Tu Cita Estratégica está reservada. Te contactaremos pronto.',
        ogUrl: 'https://hazeventplanner.com/cita-confirmada',
      } satisfies RouteMeta,
    },
    {
      path: '/sin-espacio',
      name: 'no-space',
      component: NoSpaceView,
      meta: {
        title: 'Sin Cupos Disponibles | Haz Event Planner',
        description: 'En este momento las fechas para producciones integrales en Casa del Río y exteriores están completas.',
        canonical: 'https://hazeventplanner.com/sin-espacio',
        ogTitle: 'Sin Cupos Disponibles | Haz Event Planner',
        ogDescription: 'Los cupos para nuevas celebraciones están completos. Te avisaremos en cuanto se libere disponibilidad.',
        ogUrl: 'https://hazeventplanner.com/sin-espacio',
      } satisfies RouteMeta,
    },
    {
      path: '/politicas-privacidad',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
      meta: {
        title: 'Política de Privacidad | Haz Event Planner',
        description: 'Política de privacidad de Haz Event Planner. Información sobre el tratamiento de datos personales.',
        canonical: 'https://hazeventplanner.com/politicas-privacidad',
        ogTitle: 'Política de Privacidad | Haz Event Planner',
        ogDescription: 'Política de privacidad de Haz Event Planner.',
        ogUrl: 'https://hazeventplanner.com/politicas-privacidad',
      } satisfies RouteMeta,
    },
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: LegalNoticeView,
      meta: {
        title: 'Aviso Legal | Haz Event Planner',
        description: 'Aviso legal de Haz Event Planner. Términos y condiciones de uso del sitio web.',
        canonical: 'https://hazeventplanner.com/aviso-legal',
        ogTitle: 'Aviso Legal | Haz Event Planner',
        ogDescription: 'Aviso legal de Haz Event Planner.',
        ogUrl: 'https://hazeventplanner.com/aviso-legal',
      } satisfies RouteMeta,
    },
  ],
})

// ── SEO dinámico por ruta ──────────────────────────────────────────────────────
const setMeta = (name: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.content = content
}

const setOgMeta = (property: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.content = content
}

const setCanonical = (href: string) => {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
  el.href = href
}

router.afterEach((to) => {
  const meta = to.meta
  document.title = meta.title ?? 'Haz Event Planner'
  setMeta('description', meta.description ?? '')
  setOgMeta('og:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('og:description', meta.ogDescription ?? meta.description ?? '')
  setOgMeta('og:url', meta.ogUrl ?? '')
  setOgMeta('twitter:title', meta.ogTitle ?? meta.title ?? '')
  setOgMeta('twitter:description', meta.ogDescription ?? meta.description ?? '')
  setCanonical(meta.canonical ?? '')
})

// ── Router Guards ──────────────────────────────────────────────────────────────
const BOOKED_TTL_MS = 3 * 24 * 60 * 60 * 1000
const DISQ_TTL_MS   = 48 * 60 * 60 * 1000

const readTimestamp = (key: string): number | null => {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

const isFresh = (key: string, ttl: number): boolean => {
  const ts = readTimestamp(key)
  if (ts === null) return false
  if (Date.now() - ts <= ttl) return true
  localStorage.removeItem(key)
  return false
}

const PUBLIC_ROUTES = ['privacy-policy', 'legal-notice']

const isDevEnv = (): boolean => {
  if (import.meta.env.DEV) return true
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return true
  }
  return false
}

router.beforeEach((to, from, next) => {
  const routeName = to.name as string
  if (PUBLIC_ROUTES.includes(routeName)) return next()
  if (isDevEnv()) return next()

  const bookedFresh = isFresh('os_booked_at', BOOKED_TTL_MS)
  const disqFresh   = isFresh('os_disq_at',   DISQ_TTL_MS)

  if (routeName === 'booked') {
    if (!bookedFresh) return next({ name: 'funnel' })
    return next()
  }

  if (bookedFresh) {
    return next({ name: 'booked' })
  }

  if (disqFresh && ['booking', 'booked'].includes(routeName)) {
    return next({ name: 'no-space' })
  }

  if (routeName === 'no-space' && !disqFresh) {
    return next({ name: 'funnel' })
  }

  next()
})

export default router
