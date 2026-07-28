<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
})
</script>

<template>
  <div class="privacy-page">
    <div class="privacy-card">
      <header class="privacy-card__header">
        <h1 class="privacy-card__title">Política de Privacidad</h1>
      </header>

      <main class="privacy-card__content">
        <p class="privacy-card__text">
          En <strong>Haz Event Planner</strong>, valoramos su privacidad. Los datos personales que nos proporciona (como nombre, correo electrónico y número de teléfono) se recopilan con la única finalidad de gestionar sus solicitudes de contacto, programar su sesión de evaluación de proyecto y enviarle comunicaciones relacionadas con nuestros servicios.
        </p>
        <p class="privacy-card__text">
          Nos comprometemos a no vender, compartir ni transferir su información personal a terceros, excepto en los casos en que la ley así lo exija.
        </p>
      </main>

      <footer class="privacy-card__footer">
        <button class="privacy-card__btn" @click="router.push('/')">
          <i class="fa-solid fa-arrow-left"></i> Volver al Inicio
        </button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.privacy-page {
  min-height: 100vh;
  background: colors.$QS-LIGHT;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.privacy-card {
  width: 100%;
  max-width: 580px;
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 1.75rem;
  }

  &__title {
    @include fonts.heading-font(800);
    font-size: 1.8rem;
    color: colors.$QS-DARK;
    text-align: center;
    margin: 0 0 1.5rem;
    letter-spacing: -0.02em;

    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 2rem;
  }

  &__text {
    font-size: 0.92rem;
    line-height: 1.6;
    color: #4B5563;
    margin: 0;

    strong {
      color: colors.$QS-DARK;
    }
  }

  &__link {
    color: colors.$OS-BLUE;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;

    &:hover {
      color: #F0B429;
      text-decoration: underline;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    border-top: 1px solid rgba(0,0,0,0.05);
    padding-top: 1.5rem;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.1);
    color: colors.$QS-DARK;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-family: fonts.$font-interface;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;

    &:hover {
      background: rgba(0,0,0,0.05);
      border-color: rgba(0,0,0,0.15);
    }

    i {
      font-size: 0.8rem;
    }
  }
}
</style>
