<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RegistrationModal from '@/components/RegistrationModal.vue'

const router = useRouter()
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

onMounted(() => {
  sessionStorage.setItem('alu_page_entry', String(Date.now()))
  
  // Luxury Dark Theme for Haz Event Planner
  document.body.style.backgroundColor = '#0E110E'
})
</script>

<template>
  <main class="funnel">
    <div class="funnel__container">
      
      <!-- HEADER -->
      <header class="funnel__header">
        <div class="funnel__logo-wrap">
          <span class="funnel__logo-text">HAZ <span class="funnel__logo-accent">EVENT PLANNER</span></span>
        </div>
      </header>

      <!-- HERO -->
      <section class="funnel__hero">
        <h1 class="funnel__headline">
          ¿El día de tu evento será la noche de tus sueños... <span class="funnel__headline-accent">o un caos logístico de 7 proveedores?</span>
        </h1>
        
        <p class="funnel__hero-sub">
          Descubre el Método de Sincronización Operativa 360° de Haz Event Planner y vive tu celebración en Casa del Río o en tu locación ideal sin levantar un solo dedo.
        </p>

        <div class="funnel__content-grid">
          <!-- Text/Bullets first -->
          <div class="funnel__bullets-column">
            <div class="funnel__bullets-box">
              <p class="funnel__bullets-title">El Ecosistema Operativo 360°:</p>
              <ul class="funnel__bullets">
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <div class="funnel__bullet-text"><strong>Experiencia Casa del Río:</strong> Exclusivo salón en Av. Narcisa de Jesús (hasta 120 personas) o traslado del blindaje logístico a la locación que elijas.</div>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <div class="funnel__bullet-text"><strong>Centralización Artística & Gastronómica:</strong> Alta cocina, decoración conceptual, iluminación/pantallas LED y La Clave Band con show de saxofonista bajo un solo mando.</div>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <div class="funnel__bullet-text"><strong>Ingeniería Invisible del Timing:</strong> Distribución acústica perfecta, control eléctrico de potencia y cronograma al minuto.</div>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <div class="funnel__bullet-text"><strong>Paz Mental Absoluta:</strong> Congelamos tu presupuesto y asumimos la responsabilidad total para que tú solo disfrutes.</div>
                </li>
              </ul>

            </div>
          </div>
          
          <!-- VSL Column second -->
          <div class="funnel__vsl-column">
            <div class="funnel__vsl-wrap" @click="openModal">
              <div class="funnel__vsl-overlay">
                <button class="funnel__play-btn" aria-label="Reproducir video">
                  <i class="fa-solid fa-play"></i>
                </button>
                <span class="funnel__vsl-msg">Haz clic para ver el video gratis</span>
              </div>
              <img src="https://fast.wistia.com/embed/medias/b6nlwwhjb9/swatch" class="funnel__vsl-thumb" alt="Video del Método de Sincronización Operativa 360" />

            </div>

            <button class="funnel__cta" @click="openModal">
              <i class="fa-solid fa-video"></i>
              VER VIDEO GRATIS
            </button>
            <p class="funnel__guarantee">
              <i class="fa-solid fa-lock"></i> 100% gratuito · Sin compromiso · Cupos limitados
            </p>
          </div>
        </div>

      </section>

      <!-- STATS SECTION -->
      <section class="funnel__stats">
        <p class="funnel__stats-eyebrow">UN ESTÁNDAR QUE VIVIMOS CADA FIN DE SEMANA</p>
        <div class="funnel__stats-grid">
          <div class="funnel__stats-card">
            <div class="funnel__stats-icon"><i class="fa-solid fa-house-chimney-window"></i></div>
            <h3 class="funnel__stats-number">120</h3>
            <p class="funnel__stats-text">invitados (capacidad perfecta en el salón Casa del Río)</p>
          </div>
          <div class="funnel__stats-card">
            <div class="funnel__stats-icon"><i class="fa-solid fa-layer-group"></i></div>
            <h3 class="funnel__stats-number">360°</h3>
            <p class="funnel__stats-text">de producción integral centralizada bajo un mismo equipo</p>
          </div>
          <div class="funnel__stats-card">
            <div class="funnel__stats-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <h3 class="funnel__stats-number">100%</h3>
            <p class="funnel__stats-text">tranquilidad y blindaje operativo sin recargos ni sorpresas</p>
          </div>
        </div>
      </section>

      <!-- AUTHORITY SECTION -->
      <section class="funnel__authority" aria-labelledby="authority-heading">
        <div class="funnel__authority-inner">
          <div class="funnel__authority-photo-wrap">
            <div class="funnel__authority-avatar" aria-hidden="true">
              <i class="fa-solid fa-user-tie"></i>
            </div>
          </div>
          <div class="funnel__authority-content">
            <p class="funnel__authority-eyebrow">Fundador de Haz Event Planner</p>
            <h2 id="authority-heading" class="funnel__authority-name">Gabriel Gutiérrez</h2>
            <p class="funnel__authority-role">Ingeniero Comercial & Especialista en Organización de Eventos</p>
            <p class="funnel__authority-bio">
              Entendí que el mercado estaba roto: los planners tradicionales no tenían la fuerza técnica para controlar la infraestructura y los técnicos no entendían de emociones. Por eso creamos un ecosistema de producción integral 360°. <strong>"No te vendemos las partes de un carro... te entregamos el carro funcionando con absoluta precisión técnica."</strong>
            </p>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="funnel__final-cta">
        <div class="funnel__logo-wrap funnel__logo-wrap--large">
          <span class="funnel__logo-text">HAZ <span class="funnel__logo-accent">EVENT PLANNER</span></span>
        </div>
        <h2 class="funnel__final-title">
          ¿Listo para transformar los nervios en<br>
          <span class="funnel__final-accent">la noche más inolvidable de tu vida?</span>
        </h2>
        <p class="funnel__final-sub">
          Accede al video gratuito y agenda tu sesión de Diagnóstico y Planificación de Timing Operativo sin ningún costo. Analizaremos tu fecha y visitaremos Casa del Río o evaluaremos tu locación ideal.<br><br>
        </p>
        <button class="funnel__cta funnel__cta--pulse" @click="openModal">
          <i class="fa-solid fa-video"></i>
          ¡QUIERO VER EL VIDEO!
        </button>
        <p class="funnel__guarantee">
          <i class="fa-solid fa-lock"></i> 100% gratuito · Sin compromiso
        </p>
      </section>

    </div>

    <!-- Registration Modal -->
    <RegistrationModal 
      :open="isModalOpen" 
      @close="closeModal" 
    />

    <footer class="funnel__footer">
      <nav class="funnel__footer-links" aria-label="Legal">
        <RouterLink to="/politicas-privacidad">Política de Privacidad</RouterLink>
        <RouterLink to="/aviso-legal">Aviso Legal</RouterLink>
      </nav>
      <p class="funnel__footer-copy">© {{ new Date().getFullYear() }} Haz Event Planner. Todos los derechos reservados.</p>
      <p class="funnel__footer-dev">Hecho por <a href="https://github.com/MrKanx" target="_blank" rel="noopener noreferrer">Kankox</a></p>
    </footer>

  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use '@/styles/fonts.modules.scss' as fonts;

.funnel {
  min-height: 100vh;
  background-color: colors.$QS-LIGHT;
  color: colors.$QS-DARK;
  font-family: fonts.$font-secondary;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  width: 100%;
}

.funnel__container {
  width: 100%;
  max-width: 1000px;
  padding: 0 16px;
  box-sizing: border-box;
  flex: 1;
  overflow-x: hidden;

  @media (max-width: 480px) {
    padding: 0 12px;
  }
}

.funnel__header {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0 0.75rem;
}

.funnel__logo-text {
  font-family: fonts.$font-principal;
  font-size: clamp(1.4rem, 5vw, 1.8rem);
  font-weight: 900;
  color: colors.$QS-DARK;
  letter-spacing: -0.5px;
  text-align: center;
}

.funnel__logo-accent {
  color: colors.$S2M-GOLD;
}

.funnel__hero {
  text-align: center;
  margin-top: 0.5rem;
}

.funnel__headline {
  font-family: fonts.$font-principal;
  font-size: clamp(1.4rem, 4.5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.2;
  color: colors.$QS-DARK;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  overflow-wrap: break-word;
  word-break: break-word;

  @media (max-width: 480px) {
    font-size: 1.35rem;
    line-height: 1.25;
    margin-bottom: 0.75rem;
  }
}

.funnel__headline-accent {
  color: colors.$S2M-GOLD;
}

.funnel__hero-sub {
  font-size: clamp(0.92rem, 2.5vw, 1.1rem);
  color: #9EAA8E;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.5;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
}

.funnel__bullets-box {
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(214, 194, 139, 0.2);
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
  }
}

.funnel__bullets-title {
  font-family: fonts.$font-interface;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9EAA8E;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1.2rem;
}

.funnel__bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;

  li {
    font-size: 1rem;
    line-height: 1.45;
    color: colors.$QS-DARK;
    display: flex;
    align-items: flex-start;
    gap: 10px;

    @media (max-width: 480px) {
      font-size: 0.88rem;
      gap: 8px;
    }

    i {
      color: colors.$S2M-GOLD;
      font-size: 1.1rem;
      margin-top: 3px;
      flex-shrink: 0;
    }
  }
}

.funnel__bullet-text {
  flex: 1;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;
}


.funnel__content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2rem;
  align-items: start;
  text-align: left;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
}

.funnel__vsl-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.funnel__vsl-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: colors.$QS-SURFACE;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
  border: 1px solid rgba(214, 194, 139, 0.2);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(colors.$S2M-GOLD, 0.2);
    border-color: colors.$S2M-GOLD;

    .funnel__play-btn {
      transform: scale(1.1);
      background: colors.$S2M-GOLD;
      color: #0E110E;
    }
  }
}

.funnel__vsl-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.funnel__vsl-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.funnel__play-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(23, 27, 23, 0.85);
  backdrop-filter: blur(4px);
  border: 2px solid colors.$S2M-GOLD;
  color: colors.$S2M-GOLD;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.funnel__vsl-msg {
  font-family: fonts.$font-interface;
  font-size: 0.85rem;
  font-weight: 600;
  color: colors.$QS-DARK;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(14, 17, 14, 0.8);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(214, 194, 139, 0.3);
}

.funnel__cta {
  margin-top: 2rem;
  width: 100%;
  background: colors.$S2M-GOLD;
  color: #0E110E;
  font-family: fonts.$font-accent;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 18px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 10px 20px rgba(colors.$S2M-GOLD, 0.25);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(colors.$S2M-GOLD, 0.45);
    background: #E8D7A7;
  }
}

.funnel__cta--pulse {
  background: linear-gradient(90deg, #B8A26A 0%, #E8D7A7 100%);
  color: #0E110E;
  margin-top: 2.5rem;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 25px rgba(colors.$S2M-GOLD, 0.4);
  animation: pulse 2s infinite;

  &:hover {
    animation: none;
    box-shadow: 0 0 35px rgba(colors.$S2M-GOLD, 0.6);
  }
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 15px rgba(colors.$S2M-GOLD, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 0 35px rgba(colors.$S2M-GOLD, 0.5); }
  100% { transform: scale(1); box-shadow: 0 0 15px rgba(colors.$S2M-GOLD, 0.3); }
}

.funnel__guarantee {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #9EAA8E;
  font-family: fonts.$font-interface;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  i {
    color: colors.$S2M-GOLD;
  }
}

.funnel__bullets-box {
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(214, 194, 139, 0.2);
  border-radius: 12px;
  padding: 2rem;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.funnel__bullets-title {
  font-family: fonts.$font-interface;
  font-size: 0.9rem;
  font-weight: 600;
  color: #9EAA8E;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 1.5rem;
}

.funnel__bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  li {
    font-size: 1.05rem;
    line-height: 1.4;
    color: colors.$QS-DARK;
    display: flex;
    align-items: flex-start;
    gap: 12px;

    i {
      color: colors.$S2M-GOLD;
      font-size: 1.2rem;
      margin-top: 3px;
      flex-shrink: 0;
    }
  }
}

.funnel__stats {
  margin-top: 6rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(214, 194, 139, 0.15);
  border-bottom: 1px solid rgba(214, 194, 139, 0.15);
}

.funnel__stats-eyebrow {
  text-align: center;
  font-family: fonts.$font-interface;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: colors.$S2M-GOLD;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.funnel__stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.funnel__stats-card {
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(214, 194, 139, 0.15);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.3s, border-color 0.3s;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(colors.$S2M-GOLD, 0.5);
  }
}

.funnel__stats-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  background: rgba(90, 103, 70, 0.3);
  border: 1px solid rgba(214, 194, 139, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.5rem;
    color: colors.$S2M-GOLD;
  }
}

.funnel__stats-number {
  font-family: fonts.$font-principal;
  font-size: 2.5rem;
  font-weight: 900;
  color: colors.$QS-DARK;
  margin: 0 0 0.5rem;
}

.funnel__stats-text {
  font-size: 0.95rem;
  color: #9EAA8E;
  margin: 0;
  line-height: 1.5;
}

/* AUTHORITY */
.funnel__authority {
  margin-top: 5rem;
  padding: 2.5rem;
  background: colors.$QS-SURFACE;
  border: 1px solid rgba(214, 194, 139, 0.2);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.4);
}

.funnel__authority-inner {
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 650px) {
    flex-direction: column;
    text-align: center;
  }
}

.funnel__authority-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(214, 194, 139, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  background: #5A6746;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    color: colors.$S2M-GOLD;
    font-size: 2.5rem;
  }
}

.funnel__authority-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: colors.$S2M-GOLD;
  letter-spacing: 0.05em;
  margin: 0 0 0.4rem;
}

.funnel__authority-name {
  @include fonts.heading-font(800);
  font-size: 1.8rem;
  color: colors.$QS-DARK;
  margin: 0 0 0.25rem;
}

.funnel__authority-role {
  font-size: 0.9rem;
  color: #9EAA8E;
  margin: 0 0 1rem;
}

.funnel__authority-bio {
  font-size: 0.95rem;
  color: #D0D7C5;
  line-height: 1.6;
  margin: 0;

  strong {
    color: colors.$S2M-GOLD;
  }
}

/* FINAL CTA */
.funnel__final-cta {
  margin-top: 6rem;
  margin-bottom: 4rem;
  text-align: center;
  padding: 4rem 2rem;
  background: radial-gradient(circle at center, rgba(214, 194, 139, 0.08) 0%, transparent 70%);
}

.funnel__logo-wrap--large {
  margin-bottom: 1.5rem;

  .funnel__logo-text {
    font-size: 3.5rem;
    letter-spacing: -1.5px;
  }
}

.funnel__final-title {
  font-family: fonts.$font-principal;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: colors.$QS-DARK;
  margin: 0 0 1.5rem;
  line-height: 1.1;
}

.funnel__final-accent {
  color: colors.$S2M-GOLD;
}

.funnel__final-sub {
  font-size: 1.1rem;
  color: #9EAA8E;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* FOOTER */
.funnel__footer {
  width: 100%;
  padding: 2rem;
  border-top: 1px solid rgba(214, 194, 139, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: colors.$QS-SURFACE;
}

.funnel__footer-links {
  display: flex;
  gap: 1.5rem;

  a {
    font-size: 0.8rem;
    color: #9EAA8E;
    text-decoration: none;

    &:hover {
      color: colors.$S2M-GOLD;
    }
  }
}

.funnel__footer-copy {
  font-size: 0.75rem;
  color: #6E7E56;
  margin: 0;
}

.funnel__footer-dev {
  font-size: 0.75rem;
  color: #6E7E56;
  margin: 0;
  
  a {
    color: #9EAA8E;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      color: colors.$S2M-GOLD;
    }
  }
}
</style>
