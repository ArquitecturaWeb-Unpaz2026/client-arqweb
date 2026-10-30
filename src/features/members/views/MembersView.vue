<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import * as membersApi from '../api'
import { roleLabel } from '@/shared/auth/roleLabels'
import type { Member } from '../types'

const members = ref<Member[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const listSummary = computed(() => {
  if (members.value.length === 1) return '1 integrante con acceso al panel'
  return `${members.value.length} integrantes con acceso al panel`
})

onMounted(async () => {
  try {
    members.value = await membersApi.listMembers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudieron cargar los miembros'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="ui-page ui-page--wide ui-stack members">
    <header class="members__intro">
      <p class="ui-kicker">Equipo</p>
      <h2 class="ui-title-section">Integrantes</h2>
      <p v-if="!loading && !error" class="ui-text-muted">{{ listSummary }}</p>
    </header>

    <p v-if="loading" class="ui-text-muted">Cargando miembros…</p>
    <p v-else-if="error" class="ui-text-error">{{ error }}</p>

    <div v-else class="ui-table-wrap">
      <table class="ui-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id">
            <td>
              <span class="members__identity">
                <span class="members__avatar" aria-hidden="true">
                  {{ (member.name || member.email || '?').slice(0, 1).toUpperCase() }}
                </span>
                {{ member.name }}
              </span>
            </td>
            <td>{{ member.email }}</td>
            <td>
              <span class="ui-badge" :class="member.role === 'admin' ? 'ui-badge--done' : 'ui-badge--todo'">
                {{ roleLabel(member.role) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.members__intro {
  display: grid;
  gap: 0.15rem;
}

.members__identity {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
}

.members__avatar {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #5eead4, #14b8a6);
  color: #042f2e;
  font-size: 0.75rem;
  font-weight: 800;
}
</style>
