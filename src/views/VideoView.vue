<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CalendarModal from '@/components/CalendarModal.vue'
import { trackStage, generateEventId } from '@/utils/ghl'
import { useContactStore } from '@/stores/contact'

const contactStore = useContactStore()
const calendarOpen = ref(false)
const captureOpen = ref(false)
const captureForm = ref({ nombre: '', apellido: '', empresa: '', email: '', telefono: '' })
const captureErrors = ref<Record<string, string>>({})
const captureTouched = ref<Record<string, boolean>>({})
const captureSubmitting = ref(false)

const validateCapture = () => {
  const e: Record<string, string> = {}
  if (captureForm.value.nombre.trim().length < 2) e.nombre = 'Ingresa tu nombre'
  if (captureForm.value.apellido.trim().length < 2) e.apellido = 'Ingresa tu apellido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(captureForm.value.email.trim())) e.email = 'Email inválido'
  if (captureForm.value.telefono.trim().length < 7) e.telefono = 'Teléfono inválido'
  captureErrors.value = e
  return Object.keys(e).length === 0
}

const submitCapture = async () => {
  captureTouched.value = { nombre: true, apellido: true, email: true, telefono: true }
  if (!validateCapture()) return
  captureSubmitting.value = true

  contactStore.save({
    nombre: captureForm.value.nombre.trim(),
    apellido: captureForm.value.apellido.trim(),
    negocio: 'N/A',
    email: captureForm.value.email.trim().toLowerCase(),
    telefono: captureForm.value.telefono.trim(),
  })

  const c = contactStore.get()
  const leadEventId = generateEventId('lead_video')
  trackStage('lead_capturado', {
    nombre: c.nombre,
    apellido: c.apellido,
    email: c.email,
    telefono: c.telefono,
    phone: c.telefono,
    event_id: leadEventId,
  })
  ;(window as any).fbq?.('track', 'Lead', { content_name: 'video-gate' }, { eventID: leadEventId })
  
  await new Promise(r => setTimeout(r, 600))
  captureSubmitting.value = false
  captureOpen.value = false
  startTimer()
}

const isDev = ref(false)

const closeCaptureModal = () => {
  captureOpen.value = false
  startTimer()
}

const COUNTDOWN_SECONDS = 120
const secondsLeft = ref(COUNTDOWN_SECONDS)
const ctaUnlocked = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = () => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const startTimer = () => {
  if (timer) return // already started
  timer = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--
    } else {
      ctaUnlocked.value = true
      ;(window as any).fbq?.('track', 'CompleteRegistration', {
        content_name: 'video-completado',
        value: 1,
        currency: 'USD',
      })
      if (timer) clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  document.body.style.backgroundColor = '#0E110E'
  isDev.value =
    import.meta.env.DEV ||
    (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname))

  if (isDev.value) {
    ctaUnlocked.value = true
  }

  const c = contactStore.get()
  const hasContact = !!c.email && !!c.nombre
  if (!hasContact && !isDev.value) {
    captureOpen.value = true
  } else {
    ;(window as any).fbq?.('track', 'ViewContent', { content_name: 'video-vsl' })
    startTimer()
  }

  // Wistia scripts
  if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
    const script1 = document.createElement('script')
    script1.src = 'https://fast.wistia.com/player.js'
    script1.async = true
    document.head.appendChild(script1)
    
    const script2 = document.createElement('script')
    script2.src = 'https://fast.wistia.com/embed/bivr0yu5qp.js'
    script2.type = 'module'
    script2.async = true
    document.head.appendChild(script2)
  }
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="vv-page">

    <header class="vv-topbar">
      <span class="vv-topbar__logo-text">HAZ <span class="vv-topbar__logo-accent">EVENT PLANNER</span></span>
    </header>

    <main class="vv-main">

      <div class="vv-stepper" aria-label="Paso 1 de 2">
        <span class="vv-stepper__pill">
          <span class="vv-stepper__dot vv-stepper__dot--active" aria-current="step"></span>
          <span class="vv-stepper__dot"></span>
          <span class="vv-stepper__label">Paso 1 de 2</span>
        </span>
      </div>

      <section class="vv-headline">
        <h1 class="vv-h1">
          Transforma los nervios y la incertidumbre en la noche más elegante y
          <span class="vv-accent">perfectamente ejecutada de tu vida</span>
        </h1>
        <p class="vv-subtitle">
          Gabriel Gutiérrez te explica cómo el Método de Sincronización Operativa 360° elimina el caos logístico en Casa del Río o en tu locación ideal.
        </p>
      </section>

      <div class="vv-video-wrapper">
        <div class="vv-video-ratio">
          <wistia-player media-id="bivr0yu5qp" aspect="1.7777777777777777"></wistia-player>
        </div>
      </div>

      <div class="vv-cta-section">
        <div v-if="!ctaUnlocked" class="vv-cta-locked" aria-live="polite">
          <div class="vv-cta-locked__message">
            <i class="fa-solid fa-lock vv-cta-locked__icon" aria-hidden="true"></i>
            <p class="vv-cta-locked__text">
              El botón se habilita en <strong>{{ formattedTime() }}</strong> — el video tiene la clave para tu evento
            </p>
          </div>
          <button 
            class="vv-cta-btn vv-cta-btn--disabled" 
            disabled
            :style="{ '--fill': ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS * 100) + '%' }"
          >
            <i class="fa-solid fa-lock" aria-hidden="true"></i>
            QUIERO AGENDAR MI CITA
          </button>
        </div>

        <button
          v-else
          class="vv-cta-btn"
          @click="calendarOpen = true"
        >
          <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
          QUIERO AGENDAR MI CITA
        </button>

        <p class="vv-cta-sub">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          100% gratuito &nbsp;·&nbsp; Sin compromiso &nbsp;·&nbsp; Cupos limitados
        </p>
      </div>

    </main>

    <footer class="vv-footer">
      <nav class="vv-footer__links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="vv-footer__copy">© {{ new Date().getFullYear() }} Haz Event Planner. Todos los derechos reservados.</p>
      <p class="vv-footer__dev">Hecho por <a href="https://github.com/MrKanx" target="_blank" rel="noopener noreferrer">Kankox</a></p>
    </footer>

  </div>

  <!-- The Qualification Modal used before routing to Booking -->
  <CalendarModal :open="calendarOpen" @close="calendarOpen = false" />

  <Teleport to="body">
    <Transition name="capture-fade">
      <div v-if="captureOpen" class="capture-overlay" @click.self="closeCaptureModal" role="dialog" aria-modal="true" aria-labelledby="capture-title">
        <div class="capture-modal">
          <button class="capture-modal__close" @click="closeCaptureModal" aria-label="Cerrar modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div class="capture-modal__header">
            <h2 id="capture-title" class="capture-modal__title">
              Antes de ver el video, <span>confirma tus datos</span>
            </h2>
            <p class="capture-modal__sub">Para personalizar el análisis de tu proyecto</p>
          </div>
          <form class="capture-modal__form" @submit.prevent="submitCapture" novalidate>
            <div class="capture-row">
              <div class="capture-field" :class="{ error: captureTouched.nombre && captureErrors.nombre }">
                <label>Nombre</label>
                <input v-model="captureForm.nombre" type="text" placeholder="Ej: Juan" @blur="captureTouched.nombre = true" />
                <span v-if="captureTouched.nombre && captureErrors.nombre" class="capture-field__error">{{ captureErrors.nombre }}</span>
              </div>
              <div class="capture-field" :class="{ error: captureTouched.apellido && captureErrors.apellido }">
                <label>Apellido</label>
                <input v-model="captureForm.apellido" type="text" placeholder="Ej: Pérez" @blur="captureTouched.apellido = true" />
                <span v-if="captureTouched.apellido && captureErrors.apellido" class="capture-field__error">{{ captureErrors.apellido }}</span>
              </div>
            </div>
            <div class="capture-field" :class="{ error: captureTouched.email && captureErrors.email }">
              <label>Email</label>
              <input v-model="captureForm.email" type="email" placeholder="tu@correo.com" @blur="captureTouched.email = true" />
              <span v-if="captureTouched.email && captureErrors.email" class="capture-field__error">{{ captureErrors.email }}</span>
            </div>
            <div class="capture-field" :class="{ error: captureTouched.telefono && captureErrors.telefono }">
              <label>Teléfono</label>
              <input v-model="captureForm.telefono" type="tel" placeholder="+593 98 000 0000" @blur="captureTouched.telefono = true" />
              <span v-if="captureTouched.telefono && captureErrors.telefono" class="capture-field__error">{{ captureErrors.telefono }}</span>
            </div>
            <button type="submit" class="capture-submit" :disabled="captureSubmitting">
              <span v-if="!captureSubmitting">
                <i class="fa-solid fa-play" aria-hidden="true"></i>
                Ver el video
              </span>
              <span v-else>
                <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                Cargando...
              </span>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.vv-page {
  min-height: 100vh;
  background: colors.$QS-LIGHT;
  color: colors.$QS-DARK;
  display: flex;
  flex-direction: column;
}

.vv-topbar {
  background: colors.$QS-LIGHT;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 0.9rem 1.5rem;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);

  &__logo-text {
    font-family: fonts.$font-principal;
    font-weight: 900;
    font-size: 1.25rem;
    letter-spacing: -0.5px;
    color: colors.$QS-DARK;
    margin: 0;
  }

  &__logo-accent {
    color: colors.$S2M-GOLD;
  }
}

.vv-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  width: 100%;
}

.vv-stepper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  &__pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: colors.$QS-SURFACE;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 999px;
    padding: 0.4rem 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: colors.$S2M-GRAY-DARK;
    transition: background 0.2s;

    &--active {
      background: colors.$S2M-GOLD;
    }
  }

  &__label {
    font-family: fonts.$font-interface;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6B7280;
    letter-spacing: 0.03em;
  }
}

.vv-headline {
  margin-bottom: 2rem;
  text-align: center;
}

.vv-h1 {
  font-family: fonts.$font-principal;
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 3rem);
  color: colors.$QS-DARK;
  line-height: 1.2;
  margin: 0 0 1rem;
  letter-spacing: -0.025em;
}

.vv-accent {
  color: colors.$S2M-GOLD;
}

.vv-subtitle {
  font-size: 1.1rem;
  color: #4B5563;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 650px;
}

.vv-video-wrapper {
  margin-bottom: 2.5rem;
}

.vv-video-ratio {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0,0,0,0.05);
  background: colors.$QS-SURFACE;

  wistia-player {
    display: block;
    width: 100%;
    height: 100%;

    &:not(:defined) {
      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/qlg8athp0s/swatch');
      display: block;
      filter: blur(5px);
      padding-top: 56.25%;
    }
  }
}

.vv-cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.vv-cta-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  max-width: 500px;

  &__message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: colors.$QS-SURFACE;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  &__icon {
    font-size: 1rem;
    color: #9CA3AF;
  }

  &__text {
    font-size: 0.95rem;
    color: #4B5563;
    margin: 0;
    font-family: fonts.$font-secondary;

    strong {
      color: colors.$S2M-GOLD;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
  }
}

.vv-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: colors.$S2M-GOLD;
  color: colors.$QS-SURFACE;
  border: none;
  border-radius: 12px;
  padding: 1.25rem 2.5rem;
  font-family: fonts.$font-accent;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  width: 100%;
  max-width: 500px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(colors.$S2M-GOLD, 0.3);

  &:hover {
    background: #FFD25B;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(colors.$S2M-GOLD, 0.45);
  }

  &:active {
    transform: translateY(0);
  }

  &--disabled {
    background: linear-gradient(to right, rgba(194, 143, 89, 0.3) var(--fill, 0%), colors.$QS-SURFACE var(--fill, 0%)) !important;
    color: #9CA3AF !important;
    border: 1px solid rgba(0,0,0,0.05) !important;
    box-shadow: none !important;
    cursor: not-allowed !important;
    transform: none !important;
    position: relative;
    overflow: hidden;

    &:hover {
      background: linear-gradient(to right, rgba(194, 143, 89, 0.3) var(--fill, 0%), colors.$QS-SURFACE var(--fill, 0%)) !important;
      transform: none !important;
      box-shadow: none !important;
    }

    i {
      color: #9CA3AF;
    }
  }
}

.vv-cta-sub {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #6B7280;
  margin: 0;

  i {
    font-size: 0.75rem;
    color: colors.$S2M-GOLD;
  }
}

.vv-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  &__links {
    display: flex;
    gap: 1.5rem;

    a {
      font-size: 0.8rem;
      color: #6B7280;
      text-decoration: none;

      &:hover {
        color: colors.$S2M-GOLD;
      }
    }
  }

  &__copy {
    font-size: 0.75rem;
    color: #9CA3AF;
    margin: 0;
  }

  &__dev {
    font-size: 0.75rem;
    color: #9CA3AF;
    margin: 0;
    
    a {
      color: #6B7280;
      text-decoration: none;
      font-weight: bold;
      
      &:hover {
        color: colors.$S2M-GOLD;
      }
    }
  }
}

/* Capture Modal Overrides for S2M */
.capture-fade-enter-active,
.capture-fade-leave-active {
  transition: opacity 0.25s ease;
}

.capture-fade-enter-from,
.capture-fade-leave-to {
  opacity: 0;
}

.capture-overlay {
  position: fixed;
  inset: 0;
  z-index: 950;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.capture-modal {
  position: relative;
  background: colors.$QS-SURFACE;
  border-radius: 20px;
  width: 100%;
  max-width: 460px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(214, 194, 139, 0.25);

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    color: #9EAA8E;
    font-size: 1.25rem;
    cursor: pointer;
    z-index: 10;
    transition: color 0.2s, transform 0.2s;

    &:hover {
      color: colors.$S2M-GOLD;
      transform: scale(1.1);
    }
  }

  &__header {
    padding: 2rem 2rem 1.25rem;
    text-align: center;
    border-bottom: 1px solid rgba(214, 194, 139, 0.15);
  }

  &__title {
    font-family: fonts.$font-principal;
    font-size: 1.5rem;
    font-weight: 800;
    color: colors.$QS-DARK;
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;

    span {
      color: colors.$S2M-GOLD;
    }
  }

  &__sub {
    font-size: 0.9rem;
    color: #4B5563;
    margin: 0;
  }

  &__form {
    padding: 1.5rem 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.capture-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
}

.capture-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-family: fonts.$font-interface;
    font-size: 0.8rem;
    font-weight: 700;
    color: colors.$QS-DARK;
    letter-spacing: 0.02em;
  }

  input {
    border: 1.5px solid rgba(0,0,0,0.1);
    border-radius: 9px;
    padding: 0.8rem 1rem;
    font-family: fonts.$font-secondary;
    font-size: 0.9rem;
    color: colors.$QS-DARK;
    background: colors.$QS-LIGHT;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
      color: #9CA3AF;
    }

    &:focus {
      border-color: colors.$S2M-GOLD;
      background: colors.$QS-SURFACE;
    }
  }

  &.error input {
    border-color: colors.$OS-RED;
  }

  &__error {
    font-size: 0.75rem;
    color: colors.$OS-RED;
  }
}

.capture-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: colors.$S2M-GOLD;
  color: colors.$QS-SURFACE;
  border: none;
  border-radius: 11px;
  padding: 1.1rem 1.5rem;
  font-family: fonts.$font-accent;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.15s;
  box-shadow: 0 4px 16px rgba(colors.$S2M-GOLD, 0.3);

  &:hover:not(:disabled) {
    background: #FFD25B;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
