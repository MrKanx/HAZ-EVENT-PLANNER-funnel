<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

const scrollToContact = () => {
  const el = document.getElementById('contacto')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    gsap.fromTo('.strategies__header',
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      }
    )

    // Animación del botón volando y dando vueltas
    gsap.fromTo('.btn-header-contact',
      { x: window.innerWidth, rotation: 720, opacity: 0 },
      {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        x: 0,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'back.out(1.2)'
      }
    )

    gsap.fromTo('.step-card',
      { y: 80, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.strategies__grid',
          start: 'top 85%', // Iniciar cuando el grid aparece en pantalla
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      }
    )

    gsap.fromTo('.cta-banner',
      { y: 50, opacity: 0, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '.strategies__footer',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      }
    )
  }, sectionRef.value)

  // Forzar actualización de ScrollTrigger después del render por el posible Hero pinning
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 500)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section class="strategies" ref="sectionRef">
    <div class="strategies__container">
      
      <!-- Header Section -->
      <div class="strategies__header">
        <p class="strategies__subtitle">MÉTODO DE SINCRONIZACIÓN OPERATIVA 360°</p>
        <h2 class="strategies__title">
          Un solo equipo,<br>
          <span>Responsable de todo</span>
        </h2>
        <p class="strategies__header-desc">
          El verdadero problema no es celebrar. El problema es hacerlo con un proceso fragmentado donde el decorador trabaja por un lado, el catering por otro y la música por su cuenta. Con <strong>Haz Event Planner 360°</strong>, te devolvemos la tranquilidad.
        </p>
        
        <div class="strategies__header-cta">
          <button class="btn-header-contact" @click="scrollToContact">
            <span>AGENDAR MI SESIÓN</span>
            <i class="fa-solid fa-calendar-check"></i>
          </button>
        </div>
      </div>

      <!-- Grid de Metodología (3 Pasos) -->
      <div class="strategies__grid">
        
        <!-- Fase 1 -->
        <div class="step-card">
          <div class="step-card__number">01</div>
          <h3 class="step-card__title">Planificación<br>Integral</h3>
          <p class="step-card__desc">
            Antes del gran día, planificamos cada detalle técnico, timing de cocina y acústica con milimétrica precisión, evitando improvisaciones o retrasos.
          </p>
          <ul class="step-card__features">
            <li><i class="fa-solid fa-check"></i> Timing Coordinado</li>
            <li><i class="fa-solid fa-check"></i> Cero Improvisaciones</li>
            <li><i class="fa-solid fa-check"></i> Presupuesto Congelado</li>
          </ul>
        </div>

        <!-- Fase 2 -->
        <div class="step-card">
          <div class="step-card__number">02</div>
          <h3 class="step-card__title">Sincronización<br>y Control</h3>
          <p class="step-card__desc">
            Un solo equipo se encarga de coordinar la locación (Casa del Río o externa), alta cocina, pantallas LED y producción musical para que disfrutes sin preocupaciones.
          </p>
          <ul class="step-card__features">
            <li><i class="fa-solid fa-check"></i> Un Solo Interlocutor</li>
            <li><i class="fa-solid fa-check"></i> Cronograma Perfecto</li>
            <li><i class="fa-solid fa-check"></i> Paz Mental Total</li>
          </ul>
        </div>

        <!-- Fase 3 -->
        <div class="step-card">
          <div class="step-card__number">03</div>
          <h3 class="step-card__title">Ejecución y<br>Garantía</h3>
          <p class="step-card__desc">
            Llevamos tu celebración a la realidad cuidando cada detalle de la experiencia de tus invitados. Entregamos un evento perfecto y con blindaje absoluto.
          </p>
          <ul class="step-card__features">
            <li><i class="fa-solid fa-check"></i> Ejecución Impecable</li>
            <li><i class="fa-solid fa-check"></i> Servicio de Alto Nivel</li>
            <li><i class="fa-solid fa-check"></i> Respaldo 360°</li>
          </ul>
        </div>

      </div>

      <!-- CTA Section -->
      <div class="strategies__footer">
        <div class="cta-banner">
          <div class="cta-banner__content">
            <h3 class="cta-banner__title">¿Listo para vivir tu evento sin preocupaciones?</h3>
            <p class="cta-banner__desc">Agenda tu sesión y descubre cómo Haz Event Planner 360° hace tu celebración realidad.</p>
          </div>
          <button class="btn-primary-massive" @click="scrollToContact">
            <span>EMPEZAR MI PLANIFICACIÓN</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/fonts.modules.scss' as fonts;
@use '../styles/colorVariables.module.scss' as colors;

.strategies {
  background-color: #000000;
  padding: 15vw 0;
  position: relative;
  overflow: hidden;

  // Decoración abstracta de fondo para sofisticación "Tech/Silicon Valley"
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 30%, rgba(colors.$BAKANO-PINK, 0.05) 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, rgba(colors.$BAKANO-PURPLE, 0.05) 0%, transparent 30%);
    pointer-events: none;
    z-index: 0;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 4vw;
    position: relative;
    z-index: 2;
  }

  // -------------------------
  // Header
  // -------------------------
  &__header {
    max-width: 900px;
    margin-bottom: 8vw;
  }

  &__subtitle {
    @include fonts.body-font(600);
    color: colors.$BAKANO-PINK;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  &__title {
    @include fonts.heading-font(800);
    font-size: clamp(3rem, 6vw, 6.5rem);
    color: colors.$white;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 2rem;

    span {
      color: transparent;
      -webkit-text-stroke: 2px rgba(colors.$white, 0.9);
      // Otra opción: usar un gradiente de texto
      // background: colors.$QS-NAVY;
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
  }

  &__header-desc {
    @include fonts.body-font(400);
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    color: rgba(colors.$white, 0.7);
    line-height: 1.6;
    max-width: 700px;
    margin-bottom: 3vw;

    strong {
      color: colors.$white;
    }
  }

  &__header-cta {
    display: flex;
    justify-content: flex-start;
  }

  .btn-header-contact {
    @include fonts.body-font(700);
    background: transparent;
    border: 2px solid colors.$BAKANO-PINK;
    color: colors.$white;
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    box-shadow: 0 10px 30px rgba(colors.$BAKANO-PINK, 0.2);

    i {
      font-size: 1.2rem;
      color: colors.$BAKANO-PINK;
      transition: all 0.4s ease;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: colors.$BAKANO-PINK;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.4s ease;
      z-index: 0;
    }

    span,
    i {
      position: relative;
      z-index: 1;
    }

    &:hover {
      box-shadow: 0 15px 40px rgba(colors.$BAKANO-PINK, 0.4);
      transform: translateY(-5px);

      &::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      i {
        color: colors.$white;
        transform: translateX(5px) rotate(45deg);
      }
    }
  }

  // -------------------------
  // Grid de Cartas (Metodología)
  // -------------------------
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3vw;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 6vw;
    }
  }

  // -------------------------
  // Carta Individual
  // -------------------------
  .step-card {
    background: rgba(colors.$white, 0.02);
    border-top: 2px solid rgba(colors.$white, 0.1);
    padding: 4vw 3vw;
    position: relative;
    transition: all 0.4s ease;

    &:hover {
      background: rgba(colors.$white, 0.05);
      border-color: colors.$BAKANO-PRIMARY;
      transform: translateY(-10px);

      .step-card__number {
        color: colors.$BAKANO-PRIMARY;
      }
    }

    &__number {
      @include fonts.heading-font(800);
      font-size: clamp(4rem, 6vw, 6rem);
      line-height: 1;
      color: rgba(colors.$white, 0.1);
      margin-bottom: 2rem;
      transition: color 0.4s ease;
    }

    &__title {
      @include fonts.heading-font(700);
      font-size: clamp(1.8rem, 2.5vw, 2.5rem);
      color: colors.$white;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    &__desc {
      @include fonts.body-font(400);
      font-size: 1.1rem;
      color: rgba(colors.$white, 0.7);
      line-height: 1.6;
      margin-bottom: 2.5rem;
      min-height: 120px; // Alinear las descripciones más o menos
    }

    &__features {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      li {
        @include fonts.body-font(500);
        font-size: 1rem;
        color: rgba(colors.$white, 0.9);
        display: flex;
        align-items: flex-start;
        gap: 1rem;

        i {
          color: colors.$BAKANO-PINK;
          margin-top: 4px;
          font-size: 0.9rem;
        }
      }
    }
  }

  // -------------------------
  // Footer CTA Banner
  // -------------------------
  &__footer {
    margin-top: 6vw;
    display: flex;
    justify-content: center;
    padding-bottom: 4vw; // Espacio extra al final de la sección
  }

  .cta-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(colors.$BAKANO-DARK, 0.9) 0%, rgba(#111, 0.9) 100%);
    border: 1px solid rgba(colors.$BAKANO-PINK, 0.3);
    border-radius: 20px;
    padding: 3rem 4rem;
    width: 100%;
    max-width: 1000px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(colors.$BAKANO-PINK, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 50% 10%, rgba(colors.$BAKANO-PINK, 0.15) 0%, transparent 60%);
      pointer-events: none;
    }

    &__content {
      position: relative;
      z-index: 1;
      max-width: 500px;
    }

    &__title {
      @include fonts.heading-font(700);
      font-size: clamp(1.8rem, 2.5vw, 2.5rem);
      color: colors.$white;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    &__desc {
      @include fonts.body-font(400);
      font-size: 1.1rem;
      color: rgba(colors.$white, 0.7);
      margin: 0;
    }

    @media (max-width: 900px) {
      flex-direction: column;
      text-align: center;
      gap: 2rem;
      padding: 3rem 2rem;

      &__content {
        max-width: 100%;
      }
    }
  }

  .btn-primary-massive {
    @include fonts.body-font(700);
    background: colors.$BAKANO-PRIMARY;
    color: colors.$white;
    border: none;
    padding: 1.5rem 3rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 1.2rem;
    transition: all 0.3s ease;
    border-radius: 50px; // Botón más moderno y redondeado
    position: relative;
    z-index: 1;

    i {
      transition: transform 0.3s ease;
    }

    &:hover {
      background: colors.$BAKANO-PINK;
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(colors.$BAKANO-PRIMARY, 0.4);

      i {
        transform: translateX(8px);
      }
    }

    @media (max-width: 768px) {
      padding: 1.2rem 2rem;
      width: 100%;
      justify-content: center;
    }
  }
}
</style>