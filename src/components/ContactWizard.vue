<script setup lang="ts">
import { ref, computed } from 'vue'
import { getStoredFbParams } from '@/utils/fbclid'

// ── Webhooks ─────────────────────────────────────────────────────────────────
const WH_CONTACT = import.meta.env.VITE_WEBHOOK_REGISTRO ?? 'https://services.leadconnectorhq.com/hooks/kU4URJgWDNYci1iLXzD8/webhook-trigger/u8Vy6B5d6kw7lZqNjJ9Z'
const WH_QUALIFY = import.meta.env.VITE_WEBHOOK_CALIFICACION ?? 'https://services.leadconnectorhq.com/hooks/kU4URJgWDNYci1iLXzD8/webhook-trigger/yWmEJHsLZ2oDn7PyuT9Y'

defineEmits<{ close: [] }>()

// ── Países ───────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { dial: '+593', label: '🇪🇨 +593 Ecuador' },
  { dial: '+57', label: '🇨🇴 +57  Colombia' },
  { dial: '+51', label: '🇵🇪 +51  Perú' },
  { dial: '+52', label: '🇲🇽 +52  México' },
  { dial: '+1', label: '🇺🇸 +1   EE. UU.' },
  { dial: '+34', label: '🇪🇸 +34  España' },
  { dial: '+54', label: '🇦🇷 +54  Argentina' },
  { dial: '+56', label: '🇨🇱 +56  Chile' },
  { dial: '+58', label: '🇻🇪 +58  Venezuela' },
  { dial: '+507', label: '🇵🇦 +507 Panamá' },
  { dial: '+502', label: '🇬🇹 +502 Guatemala' },
  { dial: '+506', label: '🇨🇷 +506 Costa Rica' },
  { dial: '+598', label: '🇺🇾 +598 Uruguay' },
  { dial: '+591', label: '🇧🇴 +591 Bolivia' },
  { dial: '+595', label: '🇵🇾 +595 Paraguay' },
  { dial: '+503', label: '🇸🇻 +503 El Salvador' },
  { dial: '+504', label: '🇭🇳 +504 Honduras' },
]

function detectDial(): string {
  const lang = navigator.language || ''
  const map: Record<string, string> = {
    'es-EC': '+593', 'es-CO': '+57', 'es-PE': '+51',
    'es-MX': '+52', 'es-AR': '+54', 'es-CL': '+56',
    'es-ES': '+34', 'en-US': '+1', 'es-VE': '+58',
    'es-PA': '+507',
  }
  return map[lang] ?? '+593'
}

// ── Estado ───────────────────────────────────────────────────────────────────
const step = ref<1 | 2 | 'ok'>(1)
const loading = ref(false)
const errMsg = ref('')
const dir = ref<'fwd' | 'back'>('fwd')

// Step 1
const s1 = ref({
  firstName: '',
  lastName: '',
  email: '',
  dial: detectDial(),
  phone: '',
  company: '',
})

// Step 2
const s2 = ref({
  projectType: '', // Casa, Oficina, Local, etc.
  budget: '' as '' | 'yes' | 'no', // ¿Más de $1200?
  objective: '',
  urgency: '' as '' | 'immediate' | 'next-month' | 'just-looking',
  message: '',
})

// ── Validación ───────────────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const s1Valid = computed(() =>
  s1.value.firstName.trim().length >= 2 &&
  s1.value.lastName.trim().length >= 2 &&
  emailRegex.test(s1.value.email.trim()) &&
  s1.value.phone.replace(/\D/g, '').length >= 7 &&
  s1.value.company.trim().length >= 2
)

const s2Valid = computed(() =>
  !!s2.value.projectType && !!s2.value.budget &&
  !!s2.value.objective && !!s2.value.urgency
)

// ── Mapas legibles para notas ─────────────────────────────────────────────────
const URGENCY_LABEL: Record<string, string> = {
  'immediate': 'Necesita ayuda inmediata (menos de 24 h)',
  'next-month': 'Lo necesita en el próximo mes',
  'just-looking': 'Solo explorando, sin urgencia',
}

function buildNotes(): string {
  return [
    `Tipo de Evento: ${s2.value.projectType}`,
    `Locación: ${s2.value.budget}`,
    `Perfil/Enfoque: ${s2.value.objective}`,
    `Urgencia: ${URGENCY_LABEL[s2.value.urgency] ?? s2.value.urgency}`,
    s2.value.message.trim() ? `Mensaje del lead: ${s2.value.message.trim()}` : null,
    `Fuente: Formulario Haz Event Planner`,
  ].filter(Boolean).join('\n')
}

// ── Lógica de tags ────────────────────────────────────────────────────────────
function calcTags(): string[] {
  if (s2.value.objective === 'opcion-barata' || s2.value.urgency === 'just-looking') {
    return ['no-cualificado-haz', 'no-urgente']
  }
  return ['cualificado-haz', s2.value.urgency === 'immediate' ? 'urgente' : 'no-urgente']
}

// ── Envíos ────────────────────────────────────────────────────────────────────
async function submitS1() {
  if (!s1Valid.value || loading.value) return
  loading.value = true
  errMsg.value = ''
  try {
    const phone = `${s1.value.dial}${s1.value.phone.replace(/\D/g, '')}`
    const regEventId = `reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    await fetch(WH_CONTACT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: s1.value.firstName.trim(),
        lastName: s1.value.lastName.trim(),
        email: s1.value.email.trim(),
        phone,
        companyName: s1.value.company.trim(),
        source: 'haz-event-planner-web',
        tags: ['web-lead-haz'],
        event_id: regEventId,
        ...getStoredFbParams(),
      }),
    })
    ;(window as any).fbq?.('track', 'CompleteRegistration',
      { content_name: 'contacto-web-haz', value: 1, currency: 'USD' },
      { eventID: regEventId },
    )
    dir.value = 'fwd'
    step.value = 2
  } catch {
    errMsg.value = 'Algo salió mal. Por favor intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

async function submitS2() {
  if (!s2Valid.value || loading.value) return
  loading.value = true
  errMsg.value = ''
  try {
    const tags = calcTags()
    const phone = `${s1.value.dial}${s1.value.phone.replace(/\D/g, '')}`
    const notes = buildNotes()
    if (WH_QUALIFY) {
      await fetch(WH_QUALIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: s1.value.firstName.trim(),
          lastName: s1.value.lastName.trim(),
          email: s1.value.email.trim(),
          phone,
          companyName: s1.value.company.trim(),
          source: 'haz-event-planner-web',
          '1. ¿Tipo de Evento?': s2.value.projectType,
          '2. ¿Locación?': s2.value.budget,
          '3. ¿Perfil/Enfoque?': s2.value.objective,
          urgency: s2.value.urgency,
          message: s2.value.message.trim(),
          tags,
          notes,
        }),
      })
    }
    step.value = 'ok'
  } catch {
    errMsg.value = 'Algo salió mal. Por favor intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  dir.value = 'back'
  step.value = 1
  errMsg.value = ''
}

// ── Opciones step 2 ───────────────────────────────────────────────────────────
const projectOpts = [
  { value: 'boda', label: 'Boda / Matrimonio' },
  { value: 'quince', label: 'Fiesta de Quinceaños' },
  { value: 'corporativo', label: 'Evento Corporativo / Graduación' },
  { value: 'otro', label: 'Otro Evento Social' },
]

const budgetOpts = [
  { value: 'casa-del-rio', label: 'En el salón Casa del Río (Av. Narcisa de Jesús)' },
  { value: 'externa', label: 'En otra locación externa en Guayaquil' },
  { value: 'buscando', label: 'Aún estoy evaluando locaciones' },
]

const objectiveOpts = [
  { value: 'integral-360', label: 'Producción 360° y evento blindado sin preocupaciones' },
  { value: 'opcion-barata', label: 'La opción más barata sacrificando calidad o seguridad' },
]

const urgencyOpts = [
  { value: 'immediate', label: 'Próximos meses', sub: 'Urgencia alta' },
  { value: 'next-month', label: 'Este año', sub: 'Planificando con tiempo' },
  { value: 'just-looking', label: 'Solo estoy explorando por ahora', sub: 'Sin fecha definida' },
]
</script>

<template>
  <div class="wiz">

    <!-- ── Indicador de paso ───────────────────────────────────────────────── -->
    <div class="wiz__stepper" v-if="step !== 'ok'">
      <div class="wiz__stepper-track">
        <div class="wiz__dot" :class="{ 'is-active': true, 'is-done': step === 2 }">
          <svg v-if="step === 2" width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span v-else>1</span>
        </div>
        <div class="wiz__line" :class="{ 'is-active': step === 2 }" />
        <div class="wiz__dot" :class="{ 'is-active': step === 2 }">
          <span>2</span>
        </div>
      </div>
      <p class="wiz__step-hint">
        Paso {{ step === 1 ? '1' : '2' }} de 2 —
        {{ step === 1 ? 'Tu información de contacto' : 'Cuéntanos sobre tu negocio' }}
      </p>
    </div>

    <!-- ══════════════════════════════════════
         STEP 1 — Datos de contacto
         ══════════════════════════════════════ -->
    <Transition :name="`wiz-${dir}`" mode="out-in">
      <div class="wiz__body" v-if="step === 1" key="s1">

        <div class="wf-row">
          <div class="wf-field">
            <label class="wf-label">Nombre *</label>
            <input
              v-model="s1.firstName"
              type="text"
              class="wf-input"
              placeholder="Diego"
              autocomplete="given-name"
            />
          </div>
          <div class="wf-field">
            <label class="wf-label">Apellido *</label>
            <input
              v-model="s1.lastName"
              type="text"
              class="wf-input"
              placeholder="Reyes"
              autocomplete="family-name"
            />
          </div>
        </div>

        <div class="wf-field">
          <label class="wf-label">Correo electrónico *</label>
          <input
            v-model="s1.email"
            type="email"
            class="wf-input"
            placeholder="nombre@empresa.com"
            autocomplete="email"
          />
        </div>

        <div class="wf-field">
          <label class="wf-label">Celular *</label>
          <div class="wf-phone">
            <select v-model="s1.dial" class="wf-phone__code" aria-label="Código de país">
              <option v-for="c in COUNTRIES" :key="c.dial" :value="c.dial">
                {{ c.label }}
              </option>
            </select>
            <input
              v-model="s1.phone"
              type="tel"
              class="wf-phone__num"
              placeholder="987 654 321"
              autocomplete="tel-national"
            />
          </div>
        </div>

        <div class="wf-field">
          <label class="wf-label">Nombre de tu empresa *</label>
          <input
            v-model="s1.company"
            type="text"
            class="wf-input"
            placeholder="Mi Empresa S.A."
            autocomplete="organization"
          />
        </div>

        <p v-if="errMsg" class="wf-error" role="alert">{{ errMsg }}</p>

        <button
          class="wf-btn"
          :disabled="!s1Valid || loading"
          @click="submitS1"
        >
          <span v-if="!loading">Continuar al paso 2</span>
          <span v-else class="wf-spinner" aria-label="Enviando…" />
          <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <p class="wf-privacy">
          Tu información es confidencial y nunca será compartida con terceros.
        </p>

      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         STEP 2 — Cualificación
         ══════════════════════════════════════ -->
    <Transition :name="`wiz-${dir}`" mode="out-in">
      <div class="wiz__body" v-if="step === 2" key="s2">

        <!-- Q1: Proyecto -->
        <div class="wf-question">
          <p class="wf-q-num">01</p>
          <p class="wf-q-title">¿Qué tipo de celebración estás planificando?</p>
          <label
            v-for="opt in projectOpts"
            :key="opt.value"
            class="wf-opt"
            :class="{ 'wf-opt--sel': s2.projectType === opt.value }"
          >
            <input type="radio" v-model="s2.projectType" :value="opt.value" class="sr-only" />
            <span class="wf-opt__radio" />
            <span class="wf-opt__text">{{ opt.label }}</span>
          </label>
        </div>

        <!-- Q2: Locación -->
        <div class="wf-question">
          <p class="wf-q-num">02</p>
          <p class="wf-q-title">¿Dónde te gustaría realizar tu evento?</p>
          <label
            v-for="opt in budgetOpts"
            :key="opt.value"
            class="wf-opt"
            :class="{ 'wf-opt--sel': s2.budget === opt.value }"
          >
            <input type="radio" v-model="s2.budget" :value="opt.value" class="sr-only" />
            <span class="wf-opt__radio" />
            <span class="wf-opt__text">{{ opt.label }}</span>
          </label>
        </div>

        <!-- Q3: Enfoque / Perfil -->
        <div class="wf-question">
          <p class="wf-q-num">03</p>
          <p class="wf-q-title">¿Qué buscas para el día de tu evento?</p>
          <label
            v-for="opt in objectiveOpts"
            :key="opt.value"
            class="wf-opt"
            :class="{ 'wf-opt--sel': s2.objective === opt.value }"
          >
            <input type="radio" v-model="s2.objective" :value="opt.value" class="sr-only" />
            <span class="wf-opt__radio" />
            <span class="wf-opt__text">{{ opt.label }}</span>
          </label>
        </div>

        <!-- Q4: Urgencia -->
        <div class="wf-question">
          <p class="wf-q-num">04</p>
          <p class="wf-q-title">¿Con qué anticipación o urgencia buscas realizar tu evento?</p>
          <label
            v-for="opt in urgencyOpts"
            :key="opt.value"
            class="wf-opt"
            :class="{ 'wf-opt--sel': s2.urgency === opt.value }"
          >
            <input type="radio" v-model="s2.urgency" :value="opt.value" class="sr-only" />
            <span class="wf-opt__radio" />
            <div class="wf-opt__content">
              <span class="wf-opt__text">{{ opt.label }}</span>
              <span class="wf-opt__sub">{{ opt.sub }}</span>
            </div>
          </label>
        </div>

        <!-- Mensaje libre -->
        <div class="wf-field">
          <label class="wf-label">Cuéntanos sobre tu evento <span class="wf-label--opt">(opcional)</span></label>
          <textarea
            v-model="s2.message"
            class="wf-textarea"
            placeholder="Describe brevemente tus invitados estimados, fecha tentativa o cualquier requerimiento especial…"
            rows="4"
          />
        </div>

        <p v-if="errMsg" class="wf-error" role="alert">{{ errMsg }}</p>

        <div class="wf-actions">
          <button class="wf-btn wf-btn--ghost" type="button" @click="goBack">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver
          </button>
          <button
            class="wf-btn"
            :disabled="!s2Valid || loading"
            @click="submitS2"
          >
            <span v-if="!loading">Enviar consulta</span>
            <span v-else class="wf-spinner" aria-label="Enviando…" />
            <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

      </div>
    </Transition>

    <!-- ══════════════════════════════════════
         SUCCESS
         ══════════════════════════════════════ -->
    <Transition name="wiz-fwd" mode="out-in">
      <div class="wiz__ok" v-if="step === 'ok'" key="ok">
        <div class="wiz__ok-circle">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="wiz__ok-title">¡Recibimos tu consulta!</h3>
        <p class="wiz__ok-body">
          Nuestro equipo revisará tu información y se pondrá en contacto contigo
          muy pronto. Revisa tu WhatsApp o correo.
        </p>
      </div>
    </Transition>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/fonts.modules.scss' as fonts;
@use '@/styles/colorVariables.module.scss' as colors;

// ── Accesibilidad ──────────────────────────────────────────────────────────────
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// ── Contenedor raíz ──────────────────────────────────────────────────────────
.wiz {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

// ── Stepper ──────────────────────────────────────────────────────────────────
.wiz__stepper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wiz__stepper-track {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.wiz__dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @include fonts.interface-font(700);
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.35);
  transition: all 0.4s ease;

  &.is-active {
    border-color: colors.$BAKANO-PINK;
    background: colors.$QS-NAVY;
    color: colors.$white;
    box-shadow: 0 0 16px rgba(colors.$BAKANO-PINK, 0.35);
  }

  &.is-done {
    border-color: colors.$BAKANO-PINK;
    background: colors.$QS-NAVY;
    color: colors.$white;
  }
}

.wiz__line {
  flex: 1;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  transition: background 0.4s ease;
  min-width: 32px;

  &.is-active {
    background: colors.$QS-NAVY;
  }
}

.wiz__step-hint {
  @include fonts.interface-font(500);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
  line-height: 1.4;
}

// ── Cuerpo del paso ──────────────────────────────────────────────────────────
.wiz__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// ── Campos ───────────────────────────────────────────────────────────────────
.wf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.wf-field {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 8px;
  width: 80%;
}

.wf-label {
  @include fonts.interface-font(600);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.45);
}

.wf-input {
  @include fonts.body-font(400);
  font-size: 0.95rem;
  color: colors.$white;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 13px 16px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }

  &:focus {
    border-color: rgba(colors.$BAKANO-PINK, 0.55);
    background: rgba(colors.$BAKANO-PINK, 0.04);
    box-shadow: 0 0 0 3px rgba(colors.$BAKANO-PINK, 0.08);
  }
}

// ── Campo teléfono ────────────────────────────────────────────────────────────
.wf-phone {
  display: flex;
  gap: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:focus-within {
    border-color: rgba(colors.$BAKANO-PINK, 0.55);
    box-shadow: 0 0 0 3px rgba(colors.$BAKANO-PINK, 0.08);
  }
}

.wf-phone__code {
  @include fonts.interface-font(500);
  font-size: 0.82rem;
  color: rgba(colors.$white, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 13px 10px 13px 14px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  min-width: 130px;
  flex-shrink: 0;

  option {
    background: #1a1027;
    color: colors.$white;
    font-size: 0.85rem;
  }
}

.wf-phone__num {
  @include fonts.body-font(400);
  font-size: 0.95rem;
  color: colors.$white;
  background: transparent;
  border: none;
  padding: 13px 16px;
  outline: none;
  flex: 1;
  min-width: 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }
}

// ── Preguntas step 2 ─────────────────────────────────────────────────────────
.wf-question {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wf-q-num {
  @include fonts.accent-font(700);
  font-size: 0.65rem;
  letter-spacing: 3px;
  color: colors.$BAKANO-PINK;
  margin: 0;
  text-transform: uppercase;
}

.wf-q-title {
  @include fonts.heading-font(600);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 4px;
  line-height: 1.45;
}

// ── Opciones de radio ─────────────────────────────────────────────────────────
.wf-opt {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
  cursor: pointer;
  transition:
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;

  &:hover:not(.wf-opt--sel) {
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.05);
  }

  &--sel {
    border-color: rgba(colors.$BAKANO-PINK, 0.45);
    background: rgba(colors.$BAKANO-PINK, 0.07);
    box-shadow: 0 0 0 1px rgba(colors.$BAKANO-PINK, 0.12);

    .wf-opt__radio {
      border-color: colors.$BAKANO-PINK;
      background: colors.$BAKANO-PINK;
      box-shadow: 0 0 8px rgba(colors.$BAKANO-PINK, 0.45);

      &::after {
        opacity: 1;
      }
    }

    .wf-opt__text {
      color: colors.$white;
    }
  }

  &__radio {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    margin-top: 1px;
    transition: all 0.22s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: colors.$white;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__text {
    @include fonts.body-font(400);
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.62);
    line-height: 1.45;
    transition: color 0.22s ease;
  }

  &__sub {
    @include fonts.interface-font(400);
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.32);
    letter-spacing: 0.5px;
  }
}

// ── Textarea ──────────────────────────────────────────────────────────────────
.wf-textarea {
  @include fonts.body-font(400);
  font-size: 0.95rem;
  color: colors.$white;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 13px 16px;
  outline: none;
  resize: vertical;
  min-height: 100px;
  width: 100%;
  font-family: inherit;
  line-height: 1.6;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }

  &:focus {
    border-color: rgba(colors.$BAKANO-PINK, 0.55);
    background: rgba(colors.$BAKANO-PINK, 0.04);
    box-shadow: 0 0 0 3px rgba(colors.$BAKANO-PINK, 0.08);
  }
}

.wf-label--opt {
  @include fonts.interface-font(400);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.25);
  text-transform: none;
  letter-spacing: 0;
  margin-left: 4px;
}

// ── Error ─────────────────────────────────────────────────────────────────────
.wf-error {
  @include fonts.body-font(400);
  font-size: 0.82rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 8px;
  padding: 10px 14px;
  margin: 0;
}

// ── Botones ───────────────────────────────────────────────────────────────────
.wf-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.wf-btn {
  @include fonts.accent-font(600);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  background: colors.$QS-NAVY;
  color: colors.$white;
  transition: opacity 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
  flex: 1;

  &:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(colors.$BAKANO-PINK, 0.35);
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  &--ghost {
    background: transparent;
    border: 1.5px solid rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.55);
    flex: 0 0 auto;
    padding: 14px 20px;

    &:hover:not(:disabled) {
      border-color: rgba(255, 255, 255, 0.28);
      color: colors.$white;
      box-shadow: none;
      transform: translateY(-1px);
    }
  }
}

// ── Spinner ───────────────────────────────────────────────────────────────────
.wf-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: colors.$white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// ── Privacidad ────────────────────────────────────────────────────────────────
.wf-privacy {
  @include fonts.interface-font(400);
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
  margin: 0;
  letter-spacing: 0.3px;
}

// ── Success ───────────────────────────────────────────────────────────────────
.wiz__ok {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 16px 16px;
  gap: 16px;
}

.wiz__ok-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: colors.$QS-NAVY;
  display: flex;
  align-items: center;
  justify-content: center;
  color: colors.$white;
  box-shadow: 0 0 40px rgba(colors.$BAKANO-PINK, 0.4);
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop {
  from {
    transform: scale(0.5);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.wiz__ok-title {
  @include fonts.heading-font(800);
  font-size: 1.6rem;
  color: colors.$white;
  margin: 0;
  text-transform: uppercase;
}

.wiz__ok-body {
  @include fonts.body-font(400);
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  max-width: 320px;
  line-height: 1.6;
}

// ── Transiciones de paso ──────────────────────────────────────────────────────
.wiz-fwd-enter-active,
.wiz-fwd-leave-active,
.wiz-back-enter-active,
.wiz-back-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.wiz-fwd-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.wiz-fwd-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.wiz-back-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.wiz-back-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
