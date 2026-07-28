<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const COOLDOWN_MS = 48 * 60 * 60 * 1000

const hoursLeft = ref(0)

const contactName = computed(() => {
  try {
    const stored = localStorage.getItem('os_contact')
    if (!stored) return ''
    return JSON.parse(stored).nombre ?? ''
  } catch { return '' }
})

onMounted(() => {
  document.body.style.backgroundColor = '#0E110E'
  const osDisqAt = localStorage.getItem('os_disq_at')
  if (osDisqAt) {
    const elapsed = Date.now() - Number(osDisqAt)
    const remaining = COOLDOWN_MS - elapsed
    if (remaining > 0) {
      hoursLeft.value = Math.ceil(remaining / (60 * 60 * 1000))
    }
  }
})
</script>

<template>
  <div class="nospace">

    <header class="nospace__topbar">
      <span class="nospace__logo-text">HAZ <span class="nospace__logo-accent">EVENT PLANNER</span></span>
    </header>

    <main class="nospace__main">

      <div v-if="hoursLeft > 0" class="nospace__cooldown" role="alert">
        <i class="fa-solid fa-clock" aria-hidden="true"></i>
        <span>
          <template v-if="contactName">{{ contactName }}, podrás</template>
          <template v-else>Podrás</template>
          volver y solicitar una nueva Cita Estratégica en
          <strong>{{ hoursLeft }} hora{{ hoursLeft !== 1 ? 's' : '' }}</strong>
        </span>
      </div>

      <div class="nospace__card">
        <div class="nospace__icon-wrap" aria-hidden="true">
          <i class="fa-solid fa-calendar-xmark nospace__icon"></i>
        </div>

        <h1 class="nospace__title">
          Lo sentimos, nuestros cupos de eventos<br>
          en Casa del Río y exteriores están completos.
        </h1>

        <p class="nospace__body">
          Por cuestiones de calidad y exclusividad, aceptamos un número estrictamente limitado de celebraciones al mes. En cuanto se libere una fecha, podrás agendar tu Cita Estratégica sin costo.
        </p>

        <div class="nospace__divider" aria-hidden="true"></div>

        <h2 class="nospace__subtitle">Mientras tanto</h2>
        <p class="nospace__body">
          Te recomendamos preparar tus inquietudes sobre tu locación (Casa del Río o externa), número de invitados y requerimientos de producción para coordinarlos en cuanto haya disponibilidad.
        </p>
      </div>

      <p class="nospace__footer-note">
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        Haz Event Planner mantiene un cupo mensual limitado para garantizar la excelencia en catering, decoración, sistemas audiovisuales y banda en vivo. Te notificaremos en cuanto haya disponibilidad.
      </p>

    </main>

    <footer class="nospace__footer">
      <nav class="nospace__footer-links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="nospace__footer-copy">© {{ new Date().getFullYear() }} Haz Event Planner. Todos los derechos reservados.</p>
    </footer>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.nospace {
  min-height: 100vh;
  background: colors.$QS-LIGHT;
  color: colors.$QS-DARK;
  display: flex;
  flex-direction: column;
}

.nospace__topbar {
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

.nospace__logo-text {
  font-family: fonts.$font-principal;
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: colors.$QS-DARK;
  margin: 0;
}

.nospace__logo-accent {
  color: colors.$S2M-GOLD;
}

.nospace__main {
  flex: 1;
  max-width: 560px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.nospace__cooldown {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #F0F6FF;
  border: 1px solid rgba(colors.$OS-BLUE, 0.2);
  border-radius: 999px;
  padding: 0.6rem 1.25rem;
  font-family: fonts.$font-interface;
  font-size: 0.82rem;
  color: colors.$OS-NAVY;
  i { color: colors.$OS-BLUE; flex-shrink: 0; }
  strong { font-weight: 800; }
}

.nospace__card {
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.nospace__icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(colors.$OS-NAVY, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.nospace__icon {
  font-size: 1.8rem;
  color: colors.$OS-NAVY;
}

.nospace__title {
  @include fonts.heading-font(800);
  font-size: 1.6rem;
  color: colors.$OS-DARK;
  margin: 0 0 1rem;
  line-height: 1.2;
}

.nospace__body {
  font-size: 0.92rem;
  color: #4B5563;
  line-height: 1.65;
  margin: 0 0 1rem;

  &:last-of-type { margin-bottom: 0; }
  strong { color: colors.$QS-DARK; font-weight: 700; }
}

.nospace__subtitle {
  @include fonts.heading-font(800);
  font-size: 1.2rem;
  color: colors.$OS-DARK;
  margin: 0 0 0.75rem;
}

.nospace__divider {
  width: 48px;
  height: 3px;
  background: colors.$OS-BLUE;
  border-radius: 99px;
  margin: 1.5rem auto;
}

.nospace__footer-note {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.76rem;
  color: #6B7280;
  line-height: 1.55;
  margin: 0;
  max-width: 420px;
  text-align: left;
  i { font-size: 0.8rem; flex-shrink: 0; margin-top: 1px; color: #6B7280; }
}

.nospace__footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &-links { display: flex; gap: 1.5rem; a { font-size: 0.76rem; color: #6B7280; text-decoration: none; &:hover { color: colors.$S2M-GOLD; } } }
  &-copy { font-size: 0.72rem; color: #9CA3AF; margin: 0; }
}
</style>
