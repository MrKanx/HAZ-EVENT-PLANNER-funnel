<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
})
</script>

<template>
  <div class="legal-page">
    <div class="legal-card">
      <header class="legal-card__header">
        <h1 class="legal-card__title">Aviso Legal</h1>
      </header>

      <main class="legal-card__content">
        <p class="legal-card__text">
          Este sitio web es operado por <strong>Haz Event Planner</strong>. Toda la información, contenidos y servicios disponibles en esta plataforma tienen un carácter estricta y exclusivamente informativo y comercial.
        </p>
        <p class="legal-card__text">
          El agendamiento o solicitud de una sesión inicial o evaluación de proyecto no constituye ni garantiza el inicio de una relación de contratación de obra o servicios formal, la cual requerirá en todo caso la firma de un contrato físico o de un acuerdo de servicios explícito por ambas partes.
        </p>
      </main>

      <footer class="legal-card__footer">
        <button class="legal-card__btn" @click="router.push('/')">
          <i class="fa-solid fa-arrow-left"></i> Volver al Inicio
        </button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.legal-page {
  min-height: 100vh;
  background: colors.$QS-LIGHT;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.legal-card {
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
