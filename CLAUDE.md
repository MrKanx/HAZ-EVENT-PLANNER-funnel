# Quick Solutions — VSL Funnel Landing

## Proyecto
Este repositorio es la landing page / funnel de **Quick Solutions** (quicksolutions.ec).
Arquitectos de la cadena de suministro — IFAC methodology. Líder: Jefferson Bazán.

## Stack
- **Vue 3** + Vite 7 + TypeScript
- **SCSS** con variables en `src/styles/colorVariables.module.scss`
- **GSAP** instalado (en uso en ToolsView.vue)
- **pnpm** como package manager
- **vue-router** (rutas del funnel + legales)
- **FontAwesome 6** (CDN en index.html) — usar `<i class="fa-solid fa-...">`, NO emojis

## Flujo del Funnel (multi-paso)
```
/ (FunnelView)
  ↓ [form submit → router.push('/ver-video')]
/ver-video (VideoView)            ← VSL Wistia; CTA bloqueado 2 min; guard de contacto
  ↓ [popup CalendarModal → cualifica]
/agendar (BookingView)            ← GHL calendar iframe (pre-llenado con datos del contacto)
  ↓ [msgsndr-booking-complete]
/cita-confirmada (BookedView)     ← Confirmación final con nombre personalizado
  ↓ [no cualifica en CalendarModal]
/sin-espacio (NoSpaceView)        ← Rechazo empático + cooldown 48h
```

## LocalStorage — claves en uso
| Clave | Contenido | Quién lo escribe |
|---|---|---|
| `os_contact` | `{ nombre, apellido, negocio, email, telefono, timestamp }` | RegistrationModal + VideoView guard |
| `os_disq_at` | timestamp (ms) | CalendarModal al disqualificar (presupuesto < $3K) |
| `os_booked_at` | timestamp (ms) | BookingView al confirmar cita |

## Guards de seguridad
- **Router global** (src/router/index.ts): 3-day TTL para booking, 48h para disqualificación.
- **FunnelView**: si `os_disq_at` < 48h → redirige a `/sin-espacio` (desactivado en `localhost`)
- **CalendarModal**: `presupuesto < $3,000 USD/mes` → `/sin-espacio` + guarda `os_disq_at`

## GHL Calendar
- URL: `https://api.leadconnectorhq.com/widget/booking/lKUymQr6CmOu5x6WbT4I`

- Pre-fill params: `?firstName=...&email=...&phone=` (leídos de `os_contact`)
- Evento de confirmación: `postMessage(['msgsndr-booking-complete', {...}])`
- Altura dinámica: `postMessage({ type: 'booking-app', height: N })`

## Estructura clave
```
src/
  views/
    FunnelView.vue          ← / — PÁGINA PRINCIPAL (funnel VSL + RegistrationModal)
    VideoView.vue           ← /ver-video — VSL Wistia + timer 2 min + contact guard
    BookingView.vue         ← /agendar — GHL calendar iframe pre-llenado
    BookedView.vue          ← /cita-confirmada — orquestador de subcomponentes
    NoSpaceView.vue         ← /sin-espacio — rechazo + cooldown 48h
    PrivacyPolicyView.vue   ← /politicas-privacidad
    LegalNoticeView.vue     ← /aviso-legal
  components/
    RegistrationModal.vue   ← Modal de captura (nombre, apellido, email, teléfono, empresa)
    CalendarModal.vue       ← Modal de calificación 4 preguntas → routing
    booked/                 ← Subcomponentes de BookedView
  assets/
    logos/                  ← (pendiente: logo Quick Solutions)
  utils/
    ghl.ts                  ← Tracking webhook
    fbclid.ts               ← Atribución Meta Ads
```

## Videos
- **Wistia media-id `b6nlwwhjb9`** — VSL Quick Solutions


## Funnel — Contenido Quick Solutions
- **Headline**: "Profesionaliza tu cadena de suministro y elimina las paradas no programadas con ingeniería de datos"
- **Especialista**: Jefferson Bazán
- **Marca**: Quick Solutions
- **Metodología**: IFAC (Ingeniería de Flujo Aduanero Continuo)
- **Segmentos**: Grandes corporaciones con comercio exterior de alto volumen
- **CTA principal**: "AGENDAR DIAGNÓSTICO DE AUDITORÍA LOGÍSTICA GRATIS" → abre `RegistrationModal`

## Colores de marca (Quick Solutions)
```scss
$QS-NAVY:    #0A1628   // Deep navy — brand principal
$QS-BLUE:    #0052A5   // Trust blue — secundario
$QS-GOLD:    #C99700   // Amber/gold — acento premium
$QS-RED:     #CC0000   // CTAs
$QS-DARK:    #0A1628   // Texto oscuro
$QS-LIGHT:   #F4F7FC   // Fondo claro
$QS-SURFACE: #F8FAFE   // Superficies/cards
```

## Fuentes
- Headings: **Outfit** (800)
- Body: **Plus Jakarta Sans**
- Accent/CTAs: **Space Grotesk**
- UI: **Manrope**

## Comandos
```bash
pnpm dev        # desarrollo local
pnpm build      # build de producción (type-check primero)
pnpm type-check # TypeScript check
pnpm format     # prettier --write src/
```

## No hacer
- No agregar Header/Footer de navegación al funnel (la app ya no los monta)
- No usar emojis — usar íconos FontAwesome (`<i class="fa-solid fa-...">`)
- HomeView y ThankYouView no existen (reemplazados por FunnelView/VideoView/BookingView)
