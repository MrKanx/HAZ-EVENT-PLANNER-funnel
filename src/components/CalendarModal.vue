<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { trackStage, generateEventId } from '@/utils/ghl'
import { useContactStore } from '@/stores/contact'
import { getLeadAttributionPayload, trackMetaPixelEvent } from '@/utils/fbclid'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const contactStore = useContactStore()
const IS_DEV = window.location.hostname === 'localhost'

const submitting = ref(false)
const touched = ref(false)

const form = ref({
  nivel: '',
  viaje: '',
  presupuesto: '',
  reto: '',
  consent: false,
})

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

const isValid = () =>
  !!form.value.nivel &&
  !!form.value.viaje &&
  !!form.value.presupuesto &&
  wordCount(form.value.reto) >= 5 &&
  form.value.consent

const qualifies = () => {
  if (form.value.presupuesto === 'opcion-barata') return false
  return true
}

const handleSubmit = async () => {
  touched.value = true
  if (!isValid()) return

  submitting.value = true
  const contact = contactStore.get()
  const califica = qualifies()
  const scheduleEventId = generateEventId('schedule')

  const etiquetas = [
    'funnel-haz-event-planner',
    'step-2-cualificacion',
    califica ? 'califica-haz' : 'no-califica-haz',
    `evento-${form.value.nivel}`,
    `locacion-${form.value.viaje}`,
    `perfil-${form.value.presupuesto}`,
  ]

  const notas = `
━━━━━━━━━━━━━━━━━━━━━━━━
Haz Event Planner — Cualificación
━━━━━━━━━━━━━━━━━━━━━━━━
👤 ${contact.nombre} ${contact.apellido}
📧 ${contact.email}
📱 ${contact.telefono}
━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Tipo de Evento: ${form.value.nivel}
🏰 Locación: ${form.value.viaje}
💎 Enfoque/Servicio: ${form.value.presupuesto}
💡 Detalles/Reto: ${form.value.reto}
━━━━━━━━━━━━━━━━━━━━━━━━
${califica ? '✅ CALIFICA — Busca evento blindado 360°' : '❌ NO CALIFICA — Busca opción más barata/informal'}
  `.trim()

  const pageEntry = Number(sessionStorage.getItem('alu_page_entry')) || Date.now()
  const pageDuration = Math.floor((Date.now() - pageEntry) / 1000)
  const notasConTiempo = `${notas}\n⏳ Tiempo total en página: ${Math.floor(pageDuration / 60)}m ${pageDuration % 60}s`

  const etiquetasStr = etiquetas.join(', ')
  const payload: Record<string, string> = {
    nombre: contact.nombre,
    apellido: contact.apellido,
    firstName: contact.nombre,
    lastName: contact.apellido,
    email: contact.email,
    telefono: contact.telefono,
    phone: contact.telefono,
    empresa: contact.negocio || '',
    companyName: contact.negocio || '',
    pais: (contact as any).pais || '',
    country: (contact as any).pais || '',
    paso: '2-cualificacion',
    tipoEvento: form.value.nivel,
    locacion: form.value.viaje,
    perfil: form.value.presupuesto,
    detalles: form.value.reto,
    cualifica: califica ? 'true' : 'false',
    etiquetas: etiquetasStr,
    tags: etiquetasStr,
    notas: notasConTiempo,
    nota: notasConTiempo,
    notes: notasConTiempo,
    pageDuration: String(pageDuration),
    event_id: scheduleEventId,
    ...getLeadAttributionPayload(),
  }

  trackStage('cualificacion_completada', payload)

  const webhookUrl =
    import.meta.env.VITE_WEBHOOK_CALIFICACION ??
    'https://services.leadconnectorhq.com/hooks/dZiSZokzwuadJfuzW9EK/webhook-trigger/jb4sfXunuAlYJ2wy4Cqo'

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})

  trackMetaPixelEvent('CompleteRegistration', {
    content_name: 'cualificacion-step2',
    status: califica ? 'califica' : 'no-califica',
    value: 1,
    currency: 'USD',
  }, scheduleEventId, {
    email: (contact as any).email || '',
    phone: (contact as any).telefono || '',
    firstName: (contact as any).nombre || '',
    lastName: (contact as any).apellido || '',
  })

  submitting.value = false
  emit('close')

  if (califica) {
    trackMetaPixelEvent('Lead', {
      content_name: 'lead-calificado',
      value: 1,
      currency: 'USD',
    }, undefined, {
      email: (contact as any).email || '',
      phone: (contact as any).telefono || '',
      firstName: (contact as any).nombre || '',
      lastName: (contact as any).apellido || '',
    })
    router.push('/agendar')
  } else {
    if (!IS_DEV) localStorage.setItem('os_disq_at', String(Date.now()))
    router.push('/sin-espacio')
  }
}

const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close') }

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

watch(() => props.open, (v) => {
  if (v) {
    touched.value = false
    form.value = { nivel: '', viaje: '', presupuesto: '', reto: '', consent: false }
  }
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cal-fade">
      <div v-if="open" class="cal-backdrop" @click.self="emit('close')" role="dialog" aria-modal="true" aria-labelledby="cal-title">

        <div class="cal-modal">

          <button class="cal-close" @click="emit('close')" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="cal-header">
            <div class="cal-header-icon" aria-hidden="true">
              <i class="fa-solid fa-champagne-glasses"></i>
            </div>
            <h2 id="cal-title" class="cal-title">
              Antes de agendar, cuéntanos sobre
              <span class="cal-accent">tu evento</span>
            </h2>
            <p class="cal-subtitle">4 preguntas clave para preparar tu Diagnóstico y Planificación de Timing.</p>
          </div>

          <form class="cal-form" @submit.prevent="handleSubmit" novalidate>

            <!-- Q1 — Tipo de evento -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.nivel }">
              <legend class="cal-legend">
                <span class="cal-q-num">01</span>
                ¿Qué tipo de celebración estás planificando?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'boda', label: 'Boda / Matrimonio' },
                  { value: 'quince', label: 'Fiesta de Quinceaños' },
                  { value: 'corporativo', label: 'Evento Corporativo / Graduación' },
                  { value: 'otro', label: 'Otro Evento Social' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.nivel === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.nivel" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.nivel" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q2 — Locación -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && !form.viaje }">
              <legend class="cal-legend">
                <span class="cal-q-num">02</span>
                ¿Dónde te gustaría realizar tu evento?
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'casa-del-rio', label: 'En el salón Casa del Río (Av. Narcisa de Jesús)' },
                  { value: 'externa', label: 'En otra locación externa en Guayaquil' },
                  { value: 'buscando', label: 'Aún estoy evaluando locaciones' },
                ]" :key="opt.value" class="cal-option" :class="{ selected: form.viaje === opt.value }">
                  <input type="radio" :value="opt.value" v-model="form.viaje" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.viaje" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q3 — Perfil de servicio -->
            <fieldset class="cal-fieldset cal-fieldset--budget" :class="{ 'has-error': touched && !form.presupuesto, 'has-investment': form.presupuesto && form.presupuesto === 'integral-360' }">
              <legend class="cal-legend cal-legend--budget">
                <span class="cal-q-num cal-q-num--budget">03</span>
                <span>¿Qué buscas para el día de tu evento?</span>
                <i class="fa-solid fa-gem cal-legend-chart" aria-hidden="true"></i>
              </legend>
              <div class="cal-options">
                <label v-for="opt in [
                  { value: 'integral-360', label: 'Producción Integral 360°, prestigio y paz mental total', premium: true },
                  { value: 'opcion-barata', label: 'La opción más barata del mercado sacrificando calidad', premium: false },
                ]" :key="opt.value" class="cal-option" :class="{
                  selected: form.presupuesto === opt.value,
                  'cal-option--premium': opt.premium && form.presupuesto === opt.value,
                  'cal-option--low': opt.value === 'opcion-barata' && form.presupuesto === 'opcion-barata',
                  'cal-option--premium-hover': opt.premium && form.presupuesto !== opt.value,
                }">
                  <input type="radio" :value="opt.value" v-model="form.presupuesto" hidden />
                  <span class="cal-option__radio" aria-hidden="true" />
                  <i v-if="opt.premium" class="fa-solid fa-shield-halved cal-option__gem" aria-hidden="true"></i>
                  <span class="cal-option__label">{{ opt.label }}</span>
                </label>
              </div>
              <span v-if="touched && !form.presupuesto" class="cal-error">Selecciona una opción</span>
            </fieldset>

            <!-- Q4 — Detalles -->
            <fieldset class="cal-fieldset" :class="{ 'has-error': touched && wordCount(form.reto) < 5 }">
              <legend class="cal-legend">
                <span class="cal-q-num">04</span>
                Cuéntanos sobre tu evento (invitados estimados, fecha o prioridades)
              </legend>
              <textarea
                v-model="form.reto"
                class="cal-textarea"
                placeholder="Ej: Buscamos una boda para 100 personas en Casa del Río a finales de este año, con música en vivo..."
                rows="4"
                aria-describedby="q4-hint"
              ></textarea>
              <span id="q4-hint" class="cal-hint">
                {{ wordCount(form.reto) }}/5 palabras mínimo
              </span>
              <span v-if="touched && wordCount(form.reto) < 5" class="cal-error">
                Describe tus expectativas con al menos 5 palabras
              </span>
            </fieldset>

            <!-- Consent -->
            <label class="cal-consent" :class="{ 'has-error': touched && !form.consent }">
              <input type="checkbox" v-model="form.consent" />
              <span class="cal-consent__box" aria-hidden="true" />
              <span class="cal-consent__text">
                Acepto que Haz Event Planner me contacte para agendar mi Cita Estratégica.
              </span>
            </label>
            <span v-if="touched && !form.consent" class="cal-error">Debes aceptar para continuar</span>

            <button type="submit" class="cal-submit" :disabled="submitting">
              <span v-if="!submitting">
                <i class="fa-solid fa-calendar-check" aria-hidden="true"></i>
                Ver disponibilidad
              </span>
              <span v-else>
                <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
                Procesando...
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

.cal-fade-enter-active,
.cal-fade-leave-active { transition: opacity 0.25s ease; }
.cal-fade-enter-from,
.cal-fade-leave-to { opacity: 0; }

.cal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  overflow-y: auto;
}

.cal-modal {
  background: colors.$QS-SURFACE;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0,0,0,0.05);

  @media (max-width: 500px) {
    border-radius: 16px;
    max-height: 95vh;
  }
}

.cal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: colors.$QS-LIGHT;
  color: #9CA3AF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background 0.2s, color 0.2s;
  z-index: 1;
  &:hover { background: rgba(0,0,0,0.05); color: colors.$S2M-GOLD; }
}

.cal-header {
  padding: 2rem 2rem 1.25rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  text-align: center;

  @media (max-width: 500px) {
    padding: 1.25rem 1rem 1rem;
  }
}


.cal-header-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: colors.$S2M-DARK-BLUE;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  i { color: colors.$S2M-GOLD; font-size: 1.4rem; }
}

.cal-title {
  @include fonts.heading-font(800);
  font-size: 1.45rem;
  color: colors.$QS-DARK;
  margin: 0 0 0.5rem;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.cal-accent { color: colors.$S2M-GOLD; }

.cal-subtitle {
  font-size: 0.9rem;
  color: #9EAA8E;
  margin: 0;
}

.cal-form {
  padding: 1.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cal-fieldset {
  border: none;
  padding: 0;
  margin: 0;

  &.has-error .cal-options { border-color: colors.$S2M-GOLD; border-radius: 10px; }

  &--budget {
    border: 1.5px solid transparent;
    border-radius: 12px;
    padding: 1rem 0.85rem;
    margin: 0 -0.85rem;
    transition: all 0.25s ease;

    &.has-investment {
      border-color: rgba(colors.$S2M-GOLD, 0.4);
      background: rgba(colors.$S2M-GOLD, 0.08);
    }
  }
}

.cal-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: fonts.$font-interface;
  font-size: 0.92rem;
  font-weight: 700;
  color: #F4F5F0;
  margin-bottom: 0.75rem;
  background: transparent;
  padding: 0;
  border-radius: 8px;

  &--budget {
    gap: 0.4rem;
  }
}

.cal-legend-chart {
  color: colors.$S2M-GOLD;
  font-size: 0.8rem;
  margin-left: auto;
  animation: chart-pulse 2s ease-in-out infinite;

  .cal-fieldset--budget.has-investment & {
    animation: chart-pulse 1s ease-in-out infinite;
  }
}

@keyframes chart-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.cal-q-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: colors.$S2M-GOLD;
  color: #0E110E;
  font-size: 0.75rem;
  font-weight: 900;
  flex-shrink: 0;

  &--budget {
    background: colors.$S2M-GOLD;
    color: #000;
  }
}

.cal-options {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.cal-option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1.15rem;
  border: 1.5px solid rgba(229, 193, 88, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: colors.$HAZ-SURFACE-LIGHT;

  &:hover { 
    border-color: colors.$S2M-GOLD; 
    background: rgba(229, 193, 88, 0.08); 
    transform: translateY(-1px);
  }

  &.selected {
    border-color: colors.$S2M-GOLD;
    background: rgba(229, 193, 88, 0.16);
    box-shadow: 0 0 20px rgba(229, 193, 88, 0.25);
  }

  &__radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(229, 193, 88, 0.4);
    flex-shrink: 0;
    position: relative;
    transition: all 0.2s ease;

    .cal-option.selected & {
      border-color: colors.$S2M-GOLD;
      background: rgba(colors.$S2M-GOLD, 0.2);
      &::after {
        content: '';
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        background: colors.$S2M-GOLD;
        box-shadow: 0 0 8px colors.$S2M-GOLD;
      }
    }
  }

  &__label {
    font-size: 0.94rem;
    color: #E2E8DA;
    font-weight: 600;
    transition: color 0.2s ease;
    .cal-option.selected & { color: #FFFFFF; font-weight: 700; text-shadow: 0 0 4px rgba(214, 194, 139, 0.4); }
  }
}

.cal-textarea {
  width: 100%;
  border: 1.5px solid rgba(214, 194, 139, 0.25);
  border-radius: 12px;
  padding: 1rem 1.15rem;
  font-family: fonts.$font-secondary;
  font-size: 0.92rem;
  color: #F4F5F0;
  background: #212621;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;
  line-height: 1.55;
  box-sizing: border-box;
  &::placeholder { color: #7A887A; }
  &:focus { 
    border-color: colors.$S2M-GOLD; 
    background: #2A312A; 
  }
}


.cal-hint {
  display: block;
  font-size: 0.76rem;
  color: #6B7280;
  margin-top: 0.35rem;
}

.cal-error {
  display: block;
  font-size: 0.78rem;
  color: colors.$OS-RED; /* Maybe S2M-RED later */
  margin-top: 0.35rem;
}

.cal-consent {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  cursor: pointer;
  padding: 0.5rem 0;

  input { display: none; }

  &__box {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0,0,0,0.15);
    border-radius: 6px;
    flex-shrink: 0;
    margin-top: 2px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    input:checked ~ & {
      background: colors.$S2M-GOLD;
      border-color: colors.$S2M-GOLD;
      &::after { content: '✓'; color: colors.$QS-SURFACE; font-size: 0.8rem; font-weight: 900; }
    }
  }

  &__text {
    font-size: 0.82rem;
    color: #4B5563;
    line-height: 1.5;
  }
}

.cal-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: colors.$S2M-GOLD;
  color: colors.$QS-SURFACE;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-family: fonts.$font-accent;
  font-size: 0.97rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease, transform 0.15s ease;
  box-shadow: 0 4px 16px rgba(colors.$S2M-GOLD, 0.3);
  &:hover:not(:disabled) { background: #FFD25B; transform: translateY(-1px); }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
}
</style>
