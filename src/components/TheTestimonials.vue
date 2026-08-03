<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import TestimonialCard from './TestimonialCard.vue'

import imgMauro from '../assets/testimonios/mauro.webp'
import imgJohanna from '../assets/testimonios/johanna.png'
import imgMariaIsabel from '../assets/testimonios/mariaisabel.webp'
const bgVideo = 'https://res.cloudinary.com/dpimsaaa4/video/upload/v1772741965/IMG_9668_tmxlid.mp4'

gsap.registerPlugin(ScrollTrigger)

// ── Refs del DOM ────────────────────────────────────────────────────────────
const sectionRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)

// Refs individuales de cada wrapper de tarjeta (para stagger de GSAP)
const cardEls = ref<HTMLElement[]>([])
const setCardRef = (el: unknown, i: number) => {
  if (el instanceof HTMLElement) cardEls.value[i] = el
}

// ── Datos ───────────────────────────────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: 'Mauro Salgán',
    quote: 'Su estrategia rompió nuestro umbral de producción',
    image: imgMauro,
    videoUrl: 'https://www.instagram.com/p/DExquGpxwP_/',
  },
  {
    id: 2,
    name: 'Johanna Quezada',
    quote: 'Teníamos una desorganización total en nuestros eventos, al momento que llegó Haz Event Planner, todo cambió',
    image: imgJohanna,
    videoUrl: 'https://www.instagram.com/p/DMtdBuMup4k',
  },
  {
    id: 3,
    name: 'María Isabel Soriano',
    quote: 'Me hicieron dar cuenta de esquemas de mi negocio que nunca había considerado',
    image: imgMariaIsabel,
    videoUrl: 'https://drive.google.com/file/d/19QGvEoV9IbVBzMhprv61ER20XfjQMExk/view?usp=sharing',
  },
]

// ── GSAP context (limpia todo en onUnmounted) ───────────────────────────────
let ctx: gsap.Context | null = null

onMounted(() => {
  const video = videoRef.value
  const section = sectionRef.value
  if (!video || !section) return

  video.pause()
  video.currentTime = 0

  const setup = () => {
    video.pause()
    const header = headerRef.value
    if (!header) return

    ctx = gsap.context(() => {

      if (window.innerWidth <= 768) {
        // ── MOBILE: scroll vertical → tarjetas se deslizan horizontalmente ──
        // La sección tiene 350 vh. El sticky queda fijo mientras el usuario
        // scrollea; GSAP mueve el grid de tarjetas hacia la izquierda.
        // Las tarjetas son visibles desde el inicio (sin stagger de opacidad).
        const grid = section.querySelector<HTMLElement>('.testimonials__grid')
        if (!grid) return

        gsap.to(grid, {
          x: () => -(grid.scrollWidth - window.innerWidth + 24),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

      } else {
        // ── DESKTOP: comportamiento original ─────────────────────────────
        const videoProxy = { currentTime: 0 }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        })

        // 1 ─ Video scrub
        tl.fromTo(
          videoProxy,
          { currentTime: 0 },
          {
            currentTime: video.duration,
            ease: 'none',
            duration: 1,
            onUpdate() { video.currentTime = videoProxy.currentTime },
          },
          0,
        )

        // 2 ─ Título sube desde el centro al top
        tl.fromTo(
          header,
          { y: '20vh' },
          { y: 0, ease: 'power2.out', duration: 0.4 },
          0,
        )

        // 3 ─ Tarjetas con stagger
        tl.fromTo(
          cardEls.value,
          { opacity: 0, y: 70 },
          { opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out', duration: 0.25 },
          0.38,
        )
      }

    }, section)
  }

  // readyState >= 1 → HAVE_METADATA, video.duration ya disponible
  if (video.readyState >= 1) {
    setup()
  } else {
    video.addEventListener('loadedmetadata', setup, { once: true })
  }
})

onUnmounted(() => {
  // gsap.context.revert() limpia tweens + ScrollTriggers del contexto
  ctx?.revert()
})

const openVideo = (url: string) => window.open(url, '_blank')
</script>

<template>
  <!--
    La sección ocupa 500 vh para dar recorrido al scroll.
    El contenedor .testimonials__sticky queda "pegado" arriba durante
    todo ese scroll, creando el efecto de cámara/video controlada por scroll.
  -->
  <section class="testimonials" ref="sectionRef">
    <div class="testimonials__sticky">

      <!-- Video de fondo — currentTime controlado por GSAP + scroll -->
      <video ref="videoRef" class="testimonials__video" muted playsinline preload="auto">
        <source :src="bgVideo" type="video/mp4" />
      </video>

      <!-- Gradiente de legibilidad -->
      <div class="testimonials__gradient" aria-hidden="true" />

      <!-- Capa de contenido -->
      <div class="testimonials__ui">

        <!-- ── Título ──────────────────────────────────────────
             Empieza centrado en pantalla (y: 40vh vía GSAP)
             y sube al top durante el primer 40 % del scroll.    -->
        <header class="testimonials__header" ref="headerRef">
          <p class="testimonials__label">Testimonios</p>
          <h2 class="testimonials__title">
            Lo que dicen <br>nuestros clientes
          </h2>
        </header>

        <!-- ── Grid de tarjetas ───────────────────────────────
             Cada wrapper es animado individualmente por GSAP
             con stagger, separando la lógica visual del componente. -->
        <div class="testimonials__grid">
          <div
            v-for="(testimonial, i) in testimonials"
            :key="testimonial.id"
            :ref="(el) => setCardRef(el, i)"
            class="testimonials__card-wrapper"
          >
            <TestimonialCard :testimonial="testimonial" @open-video="openVideo" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/fonts.modules.scss' as fonts;
@use '../styles/colorVariables.module.scss' as colors;

// ─────────────────────────────────────────────────────────────────
// Sección principal — 500 vh de recorrido total de scroll
// ─────────────────────────────────────────────────────────────────
.testimonials {
  position: relative;
  height: 500vh;

  // ── Contenedor sticky ──────────────────────────────────────────
  // "overflow: clip" recorta el video sin crear un nuevo contexto
  // de scroll, lo que permite que el scroll de la página siga
  // funcionando normalmente para el ScrollTrigger.
  &__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: clip;
    background-color: #000000;
  }

  // ── Video ──────────────────────────────────────────────────────
  &__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.55;
  }

  // ── Gradiente oscuro para legibilidad ──────────────────────────
  &__gradient {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(175deg,
        rgba(colors.$BAKANO-DARK, 0.15) 0%,
        rgba(#000, 0.78) 100%);
  }

  // ── Capa de UI (título + cards) ────────────────────────────────
  &__ui {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content:center mantiene el bloque título+grid centrado
    // verticalmente, evitando el espacio vacío en la mitad inferior.
    justify-content: center;
    padding: 24px 24px;
    gap: 44px;

    @media (max-width: 768px) {
      padding: 20px 16px;
      gap: 32px;
    }
  }

  // ── Header / título ────────────────────────────────────────────
  // GSAP anima la propiedad `y` (inicia en 40vh, termina en 0)
  &__header {
    width: 100%;
    max-width: 820px;
    text-align: center;
    flex-shrink: 0;
  }

  &__label {
    @include fonts.accent-font(700);
    font-size: 0.78rem;
    color: colors.$BAKANO-PINK;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin-bottom: 14px;

    @media (max-width: 768px) {
      font-size: 0.72rem;
      letter-spacing: 4px;
    }
  }

  &__title {
    @include fonts.heading-font(800);
    font-size: clamp(2.6rem, 5.5vw, 5rem);
    color: colors.$white;
    text-transform: uppercase;
    line-height: 1.06;
    letter-spacing: -0.025em;
    margin: 0;

    @media (max-width: 768px) {
      font-size: clamp(2rem, 8vw, 3rem);

      br {
        display: none;
      }
    }
  }

  // ── Grid de tarjetas ──────────────────────────────────────────
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 1160px;

    // Tablet: 2 columnas
    @media (max-width: 1024px) and (min-width: 769px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__card-wrapper {
    // GSAP anima opacity y y de este wrapper (solo desktop)
    will-change: transform, opacity;
  }
}

// ─────────────────────────────────────────────────────────────────
// MOBILE (≤768 px) — scroll vertical mueve tarjetas horizontalmente
// La sección mantiene su sticky + GSAP (igual que desktop), pero:
//  • Altura reducida a 350 vh (3 tarjetas × ~100 vh + buffer)
//  • Grid en fila horizontal (una tarjeta de 84 vw a la vez)
//  • Header centrado y estático (sin animación y)
//  • Tarjetas visibles desde el inicio (sin stagger de opacidad)
// ─────────────────────────────────────────────────────────────────
@media (max-width: 768px) {
  .testimonials {
    height: 350vh; // Suficiente para 3 tarjetas con buen ritmo de scroll
  }

  // El sticky se mantiene: position:sticky + height:100vh siguen activos.
  // Solo ajustamos el overflow para que el clip no bloquee el translate del grid.
  .testimonials__sticky {
    overflow: hidden;
  }

  // UI: header arriba, tarjetas debajo (sin centering vertical del desktop)
  .testimonials__ui {
    justify-content: flex-start;
    padding: 72px 0 24px; // 72 px = espacio para la nav de la app
    gap: 28px;
  }

  // Grid: fila horizontal de tarjetas (GSAP las translateX con el scroll)
  .testimonials__grid {
    display: flex;
    flex-wrap: nowrap;
    width: max-content; // Se expande para contener las 3 tarjetas
    gap: 16px;
    padding: 0 24px;
    max-width: none;
    align-self: flex-start; // Sin centrado horizontal (el grid empieza en el borde)
    // Anular el display:grid del desktop
    grid-template-columns: unset;
    // Ocultar scroll nativo (GSAP controla el movimiento)
    overflow: visible;
  }

  // Cada tarjeta = casi pantalla completa
  .testimonials__card-wrapper {
    width: 84vw;
    flex-shrink: 0;
    // Visibles desde el inicio: anular posibles estilos inline de GSAP
    opacity: 1 !important;
    transform: translateY(0) !important;
    will-change: transform;
  }
}
</style>
