<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/features/auth/stores/session'
import { can } from '@/shared/auth/permissions'
import { roleLabel } from '@/shared/auth/roleLabels'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const showMembersLink = computed(() => can(session.role, 'member.view'))

const pageTitle = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i -= 1) {
    const title = route.matched[i]?.meta.pageTitle
    if (typeof title === 'string') return title
  }
  return 'Panel'
})

async function onLogout() {
  await session.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell">
    <aside class="app-shell__sidebar">
      <div class="brand">
        <span class="brand__mark">AW</span>
        <div>
          <p class="brand__title">ArqWeb Tareas</p>
          <p class="brand__subtitle">Orden en cada entrega</p>
        </div>
      </div>

      <nav class="nav" aria-label="Principal">
        <RouterLink :class="{ active: route.name === 'tasks' }" :to="{ name: 'tasks' }">
          Tareas
        </RouterLink>
        <RouterLink
          v-if="showMembersLink"
          :class="{ active: route.name === 'members' }"
          :to="{ name: 'members' }"
        >
          Miembros
        </RouterLink>
      </nav>

      <div class="session">
        <p class="session__name">{{ session.user?.name }}</p>
        <p class="session__meta">
          {{ session.user?.email }} · {{ roleLabel(session.role) }}
        </p>
        <button type="button" class="session__logout" @click="onLogout">Cerrar sesión</button>
      </div>
    </aside>

    <div class="app-shell__main">
      <header class="app-shell__header">
        <p class="ui-kicker">Panel de trabajo</p>
        <h1 class="ui-title-page">{{ pageTitle }}</h1>
      </header>
      <section class="app-shell__content">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 17.5rem 1fr;
  background:
    radial-gradient(80% 50% at 100% 0%, rgba(13, 148, 136, 0.1), transparent 58%),
    var(--app-bg);
}

.app-shell__sidebar {
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(45, 212, 191, 0.18), transparent 52%),
    linear-gradient(180deg, #0b1f3a 0%, #0e3b4a 100%);
  color: var(--app-sidebar-text);
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-right: 1px solid var(--app-sidebar-border);
}

.brand {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.25rem 0.35rem;
}

.brand__mark {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #5eead4, #14b8a6);
  color: #042f2e;
  font-weight: 800;
  font-size: 0.875rem;
  box-shadow: 0 8px 18px rgba(2, 44, 34, 0.28);
}

.brand__title {
  margin: 0;
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--app-sidebar-text);
  letter-spacing: -0.01em;
}

.brand__subtitle {
  margin: 0.12rem 0 0;
  font-size: 0.75rem;
  color: #99f6e4;
}

.nav {
  display: grid;
  gap: 0.3rem;
}

.nav a {
  padding: 0.55rem 0.75rem;
  border-radius: var(--app-radius-md);
  color: var(--app-sidebar-link);
  font-size: 0.9375rem;
  font-weight: 600;
}

.nav a:hover {
  background: rgba(148, 163, 184, 0.12);
  color: var(--app-sidebar-text);
}

.nav a.active,
.nav a.router-link-active {
  background: var(--app-sidebar-link-active-bg);
  color: var(--app-sidebar-link-active);
}

.session {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--app-sidebar-border);
}

.session__name {
  margin: 0;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--app-sidebar-text);
}

.session__meta {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--app-sidebar-muted);
}

.session__logout {
  width: 100%;
  border: 1px solid rgba(153, 246, 228, 0.28);
  border-radius: var(--app-radius-md);
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  background: transparent;
  color: var(--app-sidebar-link);
}

.session__logout:hover {
  background: rgba(45, 212, 191, 0.12);
  color: var(--app-sidebar-text);
}

.app-shell__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-shell__header {
  padding: 1.15rem 1.5rem 1.05rem;
  background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 72%);
  border-bottom: 1px solid rgba(13, 148, 136, 0.14);
  display: grid;
  gap: 0.2rem;
}

.app-shell__content {
  padding: 1.35rem 1.5rem 2rem;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .app-shell__sidebar {
    gap: 1rem;
  }

  .app-shell__content {
    padding-inline: 1rem;
  }
}
</style>
