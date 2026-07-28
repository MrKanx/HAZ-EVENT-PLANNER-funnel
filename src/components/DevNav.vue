<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isDev = ref(false)
const isCollapsed = ref(false)

const routesList = [
  { path: '/', label: 'Landing (VSL)', icon: 'fa-solid fa-house' },
  { path: '/ver-video', label: 'Ver Video', icon: 'fa-solid fa-play' },
  { path: '/agendar', label: 'Agendar Cita', icon: 'fa-solid fa-calendar-days' },
  { path: '/cita-confirmada', label: 'Cita Confirmada', icon: 'fa-solid fa-circle-check' },
  { path: '/sin-espacio', label: 'Sin Espacio', icon: 'fa-solid fa-ban' },
  { path: '/politicas-privacidad', label: 'Privacidad', icon: 'fa-solid fa-shield-cat' },
  { path: '/aviso-legal', label: 'Aviso Legal', icon: 'fa-solid fa-scale-balanced' },
]

const resetStorage = () => {
  localStorage.removeItem('os_contact')
  localStorage.removeItem('os_booked_at')
  localStorage.removeItem('os_disq_at')
  sessionStorage.clear()
  alert('Storage de prueba reseteado correctamente.')
  router.push('/')
}

onMounted(() => {
  isDev.value =
    import.meta.env.DEV ||
    ['localhost', '127.0.0.1'].includes(window.location.hostname)
})
</script>

<template>
  <div v-if="isDev" class="dev-nav" :class="{ 'dev-nav--collapsed': isCollapsed }">
    <div class="dev-nav__header">
      <span class="dev-nav__badge">
        <i class="fa-solid fa-code"></i> LOCALHOST DEV NAV
      </span>
      <button class="dev-nav__reset-btn" @click="resetStorage" title="Limpiar localStorage y resetear estado">
        <i class="fa-solid fa-rotate-left"></i> Reset State
      </button>
      <button class="dev-nav__toggle-btn" @click="isCollapsed = !isCollapsed" :title="isCollapsed ? 'Expandir barra' : 'Colapsar barra'">
        <i :class="isCollapsed ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
      </button>
    </div>

    <nav v-if="!isCollapsed" class="dev-nav__tabs">
      <RouterLink
        v-for="item in routesList"
        :key="item.path"
        :to="item.path"
        class="dev-nav__tab"
        :class="{ 'dev-nav__tab--active': route.path === item.path }"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.dev-nav {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  background: rgba(23, 27, 23, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(214, 194, 139, 0.4);
  border-radius: 16px;
  padding: 8px 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 95vw;
  width: auto;
  transition: all 0.25s ease;

  &--collapsed {
    padding: 6px 12px;
  }
}

.dev-nav__header {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.dev-nav__badge {
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: colors.$S2M-GOLD;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 0.75rem;
  }
}

.dev-nav__reset-btn {
  background: rgba(214, 194, 139, 0.15);
  border: 1px solid rgba(214, 194, 139, 0.3);
  border-radius: 6px;
  color: colors.$S2M-GOLD;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: colors.$S2M-GOLD;
    color: #0E110E;
  }
}

.dev-nav__toggle-btn {
  background: transparent;
  border: none;
  color: colors.$S2M-GOLD;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 2px 4px;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
}

.dev-nav__tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(214, 194, 139, 0.3);
    border-radius: 4px;
  }
}

.dev-nav__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9EAA8E;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease;

  i {
    font-size: 0.75rem;
    color: colors.$S2M-GOLD;
  }

  &:hover {
    background: rgba(214, 194, 139, 0.12);
    color: colors.$QS-DARK;
    border-color: rgba(214, 194, 139, 0.3);
  }

  &--active {
    background: colors.$S2M-GOLD !important;
    color: #0E110E !important;
    border-color: colors.$S2M-GOLD !important;
    font-weight: 800;

    i {
      color: #0E110E !important;
    }
  }
}
</style>
