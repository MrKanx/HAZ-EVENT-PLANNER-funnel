```
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useContactModal } from '@/composables/useContactModal'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import TheScrollOverlay from '@/components/TheScrollOverlay.vue' // Added this import
const heroVideo = 'https://res.cloudinary.com/dpimsaaa4/video/upload/v1772741967/IMG_8601_y5tgbu.mov'
const bgFoto1   = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1772741965/IMG_7973_fm7dfc.jpg'
const bgFoto2   = 'https://res.com/dpimsaaa4/image/upload/v1772741964/IMG_8099_h9zifs.jpg'

gsap.registerPlugin(ScrollTrigger)

const heroContainer = ref<HTMLElement | null>(null)
const revealShape = ref<HTMLElement | null>(null)
const revealContent = ref<HTMLElement | null>(null)
const horizontalTrack = ref<HTMLElement | null>(null)
const hiddenVideo = ref<HTMLElement | null>(null)
const bgSlide1 = ref<HTMLElement | null>(null)
const bgSlide2 = ref<HTMLElement | null>(null)

// Animaciones y estado reactivo
const currentStat = ref(0)

// ── Indicadores de scroll ───────────────────────────────────────────────────
const showScrollDown   = ref(true)   // flecha inicial "scroll"
const showHorizontal   = ref(false)  // barra + hint horizontal
const hProgress        = ref(0)      // 0–1 progreso del track horizontal

// Estadísticas que rotan
const stats = [
  { number: '120', label: 'Capacidad Casa del Río' },
  { number: '360°', label: 'Producción Integral' },
  { number: '100%', label: 'Blindaje Logístico' },
  { number: '24/7', label: 'Acompañamiento VIP' }
]

const benefits = [
  {
    icon: 'fa-solid fa-compass-drafting',
    title: '1. Planificación Timing 360°',
    description: 'Diseñamos e ingeniamos cada minuto del evento antes del gran día, asegurando cero imprprevistos.'
  },
  {
    icon: 'fa-solid fa-users-gear',
    title: '2. Sincronización Operativa',
    description: 'Un solo equipo profesional coordinando locación, gastronomía, música y logística bajo un mando único.'
  },
  {
    icon: 'fa-solid fa-handshake-angle',
    title: '3. Celebración Impecable',
    description: 'Hacemos tu evento realidad con respaldo total para que disfrutes tu gran día sin ningún estrés.'
  }
]

let ctx: gsap.Context

onMounted(() => {
  // Rotación de estadísticas
  setInterval(() => {
    currentStat.value = (currentStat.value + 1) % stats.length
  }, 3000)

  // GSAP Scroll Animations
  if (!heroContainer.value || !revealShape.value || !revealContent.value || !horizontalTrack.value) return

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainer.value,
        start: 'top top',
        end: '+=400%', // Scroll extendido
        scrub: 1.5, // Suavidad del scroll
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          // "SCROLL ↓" solo visible antes de empezar
          showScrollDown.value = p < 0.03
          // Indicador horizontal: aparece cuando el track empieza a moverse (~44%)
          showHorizontal.value  = p >= 0.44 && p < 0.99
          // Progreso dentro del rango horizontal (0 → 1)
          hProgress.value = Math.max(0, Math.min(1, (p - 0.44) / 0.52))
        }
      }
    })

    // Fase 1: Rotar y Escalar Masivamente el Cubo (Efecto Portal)
    tl.to(revealShape.value, {
      scale: 30, // Escalar masivamente para que cubra la pantalla y la sobrepase
      rotationY: 180, // Rotación 3D en el recorrido
      rotationZ: 90,
      duration: 2,
      ease: 'power2.inOut'
    }, 0)

    // Forzar la opacidad del video a 1 cuando empieza el scroll aunque no tengan hover
    tl.to(hiddenVideo.value, {
      opacity: 1,
      duration: 0.1
    }, 0)

    // Desvanecer el texto/logo interno rápidamente para evitar pixelación al hacer zoom masivo
    tl.to('.cube-logo', {
      opacity: 0,
      scale: 0.8,
      duration: 0.3, // Se desvanece de inmediato al empezar
      ease: 'power1.inOut'
    }, 0)

    // Fase 2: El fondo del héroe debe volverse oscuro gradualmente (o ya lo era)

    // Fase 3: Aparición del contenido desde dentro del portal
    tl.fromTo(revealContent.value, {
      opacity: 0,
      scale: 0.9
    }, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 1) // Inicia justo cuando el cubo es lo suficientemente grande

    // Fase 4: Scroll horizontal del track de beneficios
    const getTrackWidth = () => horizontalTrack.value!.scrollWidth - window.innerWidth + (window.innerWidth * 0.2); // Padding extra compesation

    tl.to(horizontalTrack.value, {
      x: () => -getTrackWidth(),
      ease: 'none',
      duration: 2.5
    }, 2)

    // Fase 5: Transición de Fondos Fotográficos
    // El primer fondo aparece justo cuando revelamos el contenido (después del portal)
    tl.fromTo(bgSlide1.value, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 1.5)

    // A la mitad del scroll horizontal, se cruzan las opacidades hacia la foto 2
    tl.to(bgSlide1.value, { opacity: 0, duration: 0.8 }, 3)
    tl.fromTo(bgSlide2.value, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 }, 3)

  }, heroContainer.value)
})

onUnmounted(() => {
  ctx?.revert()
})

const { open: openContactModal } = useContactModal()
</script>

<template>
  <section class="hero-huge" ref="heroContainer">
    <!-- Capa 1: Contenedor 3D del Portal -->
    <div class="hero-huge__cube-container">
      <div class="hero-huge__cube" ref="revealShape">
        
        <!-- Cara Frontal (Negra + Video) -->
        <div class="cube-face cube-front">
          <!-- Wistia Player -->
          <wistia-player media-id="5ql8l131me" aspect="1.7777777777777777" class="cube-abstract-video"></wistia-player>
          
          <!-- Logo Textual Sutil (Se oculta al hacer zoom) -->
          <div class="cube-logo">
            <svg viewBox="0 0 350 100" class="cube-logo__svg">
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="28" font-weight="900" letter-spacing="2">HAZ EVENT PLANNER</text>
            </svg>
          </div>
        </div>

        <!-- Cara Trasera (Rosa Estático) -->
        <div class="cube-face cube-back"></div>

      </div>
    </div>

    <!-- Capa 3: El contenido revelado (Horizontal Track) -->
    <div class="hero-huge__revealed" ref="revealContent">
      <!-- Sistema de Fondos Dinámicos Fotográficos -->
      <div class="hero-huge__bg-layer">
        <div class="bg-slide" ref="bgSlide1" :style="{ backgroundImage: `url(${bgFoto1})` }"></div>
        <div class="bg-slide" ref="bgSlide2" :style="{ backgroundImage: `url(${bgFoto2})` }"></div>
        <div class="bg-overlay"></div>
      </div>

      <div class="hero-huge__track" ref="horizontalTrack">
        
        <!-- Panel 1: Texto Masivo -->
        <div class="track-panel panel-intro">
          <div class="panel-intro__content">
            <h1 class="hero-huge__subtitle">
              Organizar tu evento debería ser una celebración inolvidable,<br/>
              <strong>No una pesadilla de 7 proveedores.</strong>
            </h1>
            <p class="hero-huge__desc">
              Con el Método de Sincronización Operativa 360° de Haz Event Planner, un solo equipo planifica, coordina y<br/>
              responde por todo tu evento desde la primera idea hasta la fiesta final.
            </p>

            <div class="hero-huge__cta">
              <button class="btn btn--primary" @click="openContactModal">
                <span>PLANIFICAR MI EVENTO</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Panel 2: Estadísticas -->
        <div class="track-panel panel-stats">
          <div class="huge-stat-card">
            <span class="stat-number">{{ stats[currentStat].number }}</span>
            <span class="stat-label">{{ stats[currentStat].label }}</span>
          </div>
        </div>

        <!-- Panels 3+: Beneficios (Scroll Horizontal) -->
        <div class="track-panel panel-benefit" v-for="(benefit, index) in benefits" :key="index">
          <div class="huge-benefit-card">
            <span class="benefit-icon"><i :class="benefit.icon"></i></span>
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-desc">{{ benefit.description }}</p>
          </div>
        </div>

      </div>
    </div>
    <!-- ══════════════════════════════════════════
         OVERLAY INICIAL — "Para empezar la experiencia"
         Se muestra solo cuando progress < 3 %
         ══════════════════════════════════════════ -->
    <Transition name="hint">
      <TheScrollOverlay v-if="showScrollDown" />
    </Transition>

    <!-- ══════════════════════════════════════════
         INDICADOR HORIZONTAL — barra de progreso
         + flechas mientras el track se mueve
         ══════════════════════════════════════════ -->
    <Transition name="hint">
      <div v-if="showHorizontal" class="scroll-hint scroll-hint--h" aria-hidden="true">
        <!-- Label + flecha -->
        <div class="scroll-hint__h-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span>DESLIZA</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
        <!-- Barra de progreso -->
        <div class="scroll-hint__bar">
          <div class="scroll-hint__fill" :style="{ width: `${hProgress * 100}%` }" />
        </div>
      </div>
    </Transition>

  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

.hero-huge {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000000; // Fondo absoluto estilo Huge Inc
  color: colors.$white;
}

// ---------------------------------
// Capa 1: Cubo 3D (Portal)
// ---------------------------------
.hero-huge__cube-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  perspective: 1000px;
  pointer-events: none; // Evitar bloquear clicks de otras capas
}

@keyframes spinOrbs {
  0% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(1.2);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
}

.hero-huge__cube {
  position: relative;
  width: 30vw;
  height: 30vw;
  min-width: 250px;
  min-height: 250px;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  // Efecto Hover
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);

    .cube-abstract-video {
      opacity: 0.7; // Reveal video on hover
    }
  }
}

.cube-face {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; // Video contenido
}

.cube-front {
  background-color: #000000;
  transform: rotateY(0deg);
}

.cube-back {
  background-color: colors.$BAKANO-PRIMARY; // Color estático post-transición
  transform: rotateY(180deg);
}

.cube-abstract-video {
  position: absolute;
  inset: -10%; // Sobredimensionado para que la rotación no muestre bordes negros
  width: 120%;
  height: 120%;
  object-fit: cover;
  z-index: 0;
  opacity: 0; // Oculto inicialmente
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.cube-logo {
  position: relative;
  z-index: 2;
  width: 80%;
  max-width: 250px;
  will-change: opacity, transform;

  &__svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  }
}

// ---------------------------------
// Capa 3: Contenido Revelado (Horizontal Scroll)
// ---------------------------------
.hero-huge__revealed {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  color: colors.$white;
  opacity: 0; // Oculto hasta que el scroll lo revela
  overflow: hidden; // Prevenir barras de scroll reales
  display: flex;
  align-items: center;
}

// ---------------------------------
// Fondos Dinámicos Fotográficos
// ---------------------------------
.hero-huge__bg-layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;

  .bg-slide {
    position: absolute;
    inset: -5%; // Sobredimensionado para el efecto de scale al aparecer
    background-size: cover;
    background-position: center;
    opacity: 0; // Animado por GSAP
    will-change: opacity, transform;
  }

  .bg-overlay {
    position: absolute;
    inset: 0;
    background: rgba(colors.$BAKANO-DARK, 0.75); // Dark overlay para contraste de texto
    mix-blend-mode: multiply; // Enriquece los colores del fondo
  }
}

.hero-huge__track {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  height: 100vh;
  align-items: center;
  padding: 0 10vw; // padding inicial y final para centrado
  gap: 8vw;
}

.track-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

// Panel 1: Texto Masivo
.panel-intro {
  width: 900px;
  flex-direction: row;
  align-items: center;

  &__content {
    flex: 1;
  }

  .hero-huge__subtitle {
    @include fonts.heading-font(800);
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    line-height: 1.1;
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
    color: colors.$white; // Contraste absoluto

    strong {
      color: colors.$BAKANO-PRIMARY; // Un toque de color de marca en el keyword principal
    }
  }

  .hero-huge__desc {
    @include fonts.body-font(400);
    font-size: clamp(1.2rem, 2vw, 1.6rem);
    line-height: 1.5;
    opacity: 0.95;
    margin-bottom: 3rem;
    color: rgba(colors.$white, 0.9);
  }

  .hero-huge__cta {
    margin-top: 2rem;
  }
}

.btn--primary {
  @include fonts.body-font(700);
  background: colors.$BAKANO-PRIMARY;
  color: colors.$white;
  padding: 1.5rem 3rem;
  border: none;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background: colors.$BAKANO-PURPLE;
    box-shadow: 0 20px 40px rgba(colors.$BAKANO-PRIMARY, 0.4);
  }
}

.hero-huge__note {
  @include fonts.body-font(500);
  font-size: 0.95rem;
  margin-top: 1.5rem;
  opacity: 0.7;
}

// Panel 2: Estadísticas enormes
.panel-stats {
  width: 500px;
  display: flex;
  justify-content: center;
}

.huge-stat-card {
  background: rgba(colors.$white, 0.05);
  border: 1px solid rgba(colors.$white, 0.1);
  border-radius: 30px;
  padding: 5rem 3rem;
  text-align: center;
  width: 100%;

  .stat-number {
    @include fonts.heading-font(800);
    font-size: clamp(4rem, 8vw, 7rem);
    color: colors.$white;
    line-height: 1;
    display: block;
    margin-bottom: 1rem;
  }

  .stat-label {
    @include fonts.body-font(600);
    font-size: 1.5rem;
    color: rgba(colors.$white, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

// Panel 3+: Beneficios masivos
.panel-benefit {
  width: 450px;

  .huge-benefit-card {
    background: transparent;
    border: 1px solid rgba(colors.$white, 0.2);
    border-radius: 30px;
    padding: 4rem 3rem;
    height: 550px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 0.4s ease, border-color 0.4s ease;

    &:hover {
      background: rgba(colors.$white, 0.05);
      border-color: colors.$white;
    }

    .benefit-icon {
      font-size: 5rem;
      color: colors.$white; // Contraste total
      margin-bottom: 2.5rem;
      transition: transform 0.3s ease;
    }

    &:hover .benefit-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .benefit-title {
      @include fonts.heading-font(800);
      font-size: 2.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: colors.$white; // Contraste total
    }

    .benefit-desc {
      @include fonts.body-font(400);
      font-size: 1.25rem;
      opacity: 0.8;
      line-height: 1.6;
      color: rgba(colors.$white, 0.8); // Contraste total
    }
  }
}

// ── INDICADORES DE SCROLL ──────────────────────────────────────────────────────
.scroll-hint {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  user-select: none;
}

// ── Indicador horizontal ──────────────────────────────────────────────────────
.scroll-hint--h {
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: min(400px, 80vw);
}

.scroll-hint__h-label {
  @include fonts.interface-font(600);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.62rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);

  svg {
    opacity: 0.5;
    animation: arrow-pulse 1.4s ease-in-out infinite;

    &:last-child { animation-delay: 0.2s; }
  }
}

.scroll-hint__bar {
  width: 100%;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  overflow: hidden;
}

.scroll-hint__fill {
  height: 100%;
  background: colors.$QS-NAVY;
  border-radius: 1px;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(colors.$BAKANO-PINK, 0.6);
}

@keyframes arrow-pulse {
  0%, 100% { opacity: 0.3; transform: translateX(0); }
  50%       { opacity: 0.8; transform: translateX(3px); }
}

// ── Transición de entrada/salida de los hints ─────────────────────────────────
.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.6s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: 1024px) {
  .hero-huge__track {
    gap: 6vw;
  }

  .panel-intro {
    width: 600px;
  }

  .panel-stats {
    width: 400px;
  }

  .panel-benefit {
    width: 400px;
  }
}

@media (max-width: 768px) {
  .hero-huge__track {
    gap: 15vw;
    padding: 0 5vw;
  }

  .panel-intro {
    width: 85vw;
    flex-direction: column;
    gap: 2rem;
  }

  .panel-stats {
    width: 85vw;
  }

  .panel-benefit {
    width: 85vw;
  }

  .btn--primary {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .hero-huge__cube {
    width: 60vw;
    height: 60vw;
  }
}
</style>