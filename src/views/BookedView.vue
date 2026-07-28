<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const contactName = computed(() => {
  try {
    const stored = localStorage.getItem('os_contact')
    if (!stored) return ''
    const rawName = JSON.parse(stored).nombre ?? ''
    if (!rawName) return ''
    return rawName
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } catch { return '' }
})

const RETURNING_THRESHOLD_MS = 10 * 60 * 1000
const isReturningVisitor = computed(() => {
  const ts = Number(localStorage.getItem('os_booked_at') ?? 0)
  if (!ts) return false
  return Date.now() - ts > RETURNING_THRESHOLD_MS
})

onMounted(() => {
  document.body.style.backgroundColor = '#0E110E'
  const alreadyFired = sessionStorage.getItem('os_complete_fired')
  if (!alreadyFired) {
    ; (window as any).fbq?.('track', 'CompleteRegistration', {
      content_name: 'diagnostico-agendado',
      value: 1,
      currency: 'USD',
    })
    sessionStorage.setItem('os_complete_fired', '1')
  }
})

const nextSteps = [
  {
    icon: 'fa-solid fa-envelope',
    title: 'Revisa tu email',
    body: 'Te enviamos la confirmación con todos los detalles de tu Cita Estratégica.',
  },
  {
    icon: 'fa-brands fa-whatsapp',
    title: 'Tu Cita Estratégica está agendada',
    body: 'El equipo de Haz Event Planner te escribirá por WhatsApp para coordinar la visita a Casa del Río o la sesión de planificación.',
  },
  {
    icon: 'fa-solid fa-file-invoice',
    title: 'Prepara tus ideas e inquietudes',
    body: 'Anota todas las preguntas sobre tu fecha, invitados o visión del evento para aprovecharlas al máximo en la sesión.',
  },
]
</script>

<template>
  <div class="booked">

    <header class="booked__topbar">
      <span class="booked__logo-text">HAZ <span class="booked__logo-accent">EVENT PLANNER</span></span>
    </header>

    <main class="booked__main">

      <section class="booked__hero">
        <div class="booked__hero-icon" aria-hidden="true">
          <i class="fa-solid fa-circle-check"></i>
        </div>

        <template v-if="isReturningVisitor">
          <p class="booked__hero-eyebrow">
            <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
            Ya tienes una cita agendada
          </p>
          <h1 class="booked__hero-title">
            <template v-if="contactName">
              {{ contactName }}, ya tenemos tu Cita Estratégica agendada
            </template>
            <template v-else>
              Ya tenemos tu Cita Estratégica agendada
            </template>
          </h1>
          <p class="booked__hero-subtitle">
            Tu sesión de Diagnóstico y Planificación de Timing Operativo con Haz Event Planner está confirmada.
            Revisa tu correo para los detalles y te contactaremos pronto por WhatsApp.
          </p>
        </template>

        <template v-else>
          <h1 class="booked__hero-title">
            <template v-if="contactName">
              ¡Listo, {{ contactName }}!
            </template>
            <template v-else>
              ¡Tu Cita Estratégica está confirmada!
            </template>
          </h1>
          <p class="booked__hero-subtitle">
            Tu sesión con Gabriel Gutiérrez y el equipo de Haz Event Planner ha sido agendada correctamente.
            Revisa tu correo para más información y coordinar el Timing de tu evento.
          </p>
        </template>
      </section>

      <section class="booked__steps" aria-labelledby="steps-heading">
        <p id="steps-heading" class="booked__steps-label">Próximos pasos</p>
        <div class="booked__steps-grid">
          <div v-for="(step, i) in nextSteps" :key="i" class="booked__step">
            <div class="booked__step-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="booked__step-icon" aria-hidden="true">
              <i :class="step.icon"></i>
            </div>
            <h3 class="booked__step-title">{{ step.title }}</h3>
            <p class="booked__step-body">{{ step.body }}</p>
          </div>
        </div>
      </section>

    </main>

    <footer class="booked__footer">
      <nav class="booked__footer-links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="booked__footer-copy">© {{ new Date().getFullYear() }} Haz Event Planner. Todos los derechos reservados.</p>
      <p class="booked__footer-dev">Hecho por <a href="https://github.com/MrKanx" target="_blank" rel="noopener noreferrer">Kankox</a></p>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.booked {
  min-height: 100vh;
  background: colors.$QS-LIGHT;
  color: colors.$QS-DARK;
  display: flex;
  flex-direction: column;
}

.booked__topbar {
  background: colors.$QS-LIGHT;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 0.9rem 1.5rem;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
}

.booked__logo-text {
  font-family: fonts.$font-principal;
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: colors.$QS-DARK;
  margin: 0;
}

.booked__logo-accent {
  color: colors.$S2M-GOLD;
}

.booked__main {
  flex: 1;
  max-width: 680px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.booked__hero {
  text-align: center;
  padding: 2.5rem 2rem;
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.booked__hero-icon {
  font-size: 3.5rem;
  color: colors.$S2M-GOLD;
  margin-bottom: 1rem;
  line-height: 1;
}

.booked__hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(colors.$S2M-GOLD, 0.1);
  color: colors.$S2M-DARK-BLUE;
  border: 1px solid rgba(colors.$S2M-GOLD, 0.2);
  border-radius: 999px;
  padding: 0.4rem 0.95rem;
  margin: 0 0 0.85rem;
  font-family: fonts.$font-interface;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  i {
    font-size: 0.78rem;
  }
}

.booked__hero-title {
  @include fonts.heading-font(800);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: colors.$QS-DARK;
  margin: 0 0 0.75rem;
  letter-spacing: -0.025em;
}

.booked__hero-subtitle {
  font-size: 1rem;
  color: #4B5563;
  line-height: 1.65;
  margin: 0 auto;
  max-width: 460px;
}

.booked__steps-label {
  font-family: fonts.$font-interface;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: colors.$S2M-GOLD;
  margin: 0 0 1.25rem;
  text-align: center;
}

.booked__steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
}

.booked__step {
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 14px;
  padding: 1.5rem 1.25rem;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.booked__step-num {
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  @include fonts.heading-font(800);
  font-size: 2rem;
  color: rgba(0, 0, 0, 0.04);
  line-height: 1;
  user-select: none;
}

.booked__step-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: colors.$QS-LIGHT;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;

  i {
    color: colors.$S2M-GOLD;
    font-size: 1.2rem;
  }
}

.booked__step-title {
  @include fonts.heading-font(700);
  font-size: 0.93rem;
  color: colors.$QS-DARK;
  margin: 0 0 0.4rem;
}

.booked__step-body {
  font-size: 0.85rem;
  color: #4B5563;
  line-height: 1.5;
  margin: 0;
}

.booked__footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &-links {
    display: flex;
    gap: 1.5rem;

    a {
      font-size: 0.76rem;
      color: #6B7280;
      text-decoration: none;

      &:hover {
        color: colors.$S2M-GOLD;
      }
    }
  }

  &-copy {
    font-size: 0.72rem;
    color: #9CA3AF;
    margin: 0;
  }
  
  &-dev {
    font-size: 0.72rem;
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
</style>
