<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSessionStore } from '@/features/auth/stores/session'
import AppButton from '@/shared/components/AppButton.vue'
import { roleLabel } from '@/shared/auth/roleLabels'
import * as membersApi from '../api'
import MemberDialog from '../components/MemberDialog.vue'
import type { Member, MemberInput } from '../types'

const session = useSessionStore()
const members = ref<Member[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const editor = ref<{ open: (member?: Member | null) => void } | null>(null)

const listSummary = computed(() => {
  if (members.value.length === 1) return '1 integrante con acceso al panel'
  return `${members.value.length} integrantes con acceso al panel`
})

async function load() {
  loading.value = true
  error.value = null
  try {
    members.value = await membersApi.listMembers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudieron cargar los miembros'
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function onSave(input: MemberInput, id: string | null) {
  if (id) {
    const updated = await membersApi.updateMember(id, input)
    members.value = members.value.map((member) => (member.id === updated.id ? updated : member))
    return
  }
  const created = await membersApi.createMember(input)
  members.value = [...members.value, created]
}

async function onDelete(member: Member) {
  if (member.id === session.user?.id) return
  const confirmed = window.confirm(
    `¿Dar de baja a ${member.name}? Deja de aparecer en el equipo, pero los datos se conservan.`,
  )
  if (!confirmed) return
  saving.value = true
  error.value = null
  try {
    await membersApi.deleteMember(member.id)
    members.value = members.value.filter((entry) => entry.id !== member.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo dar de baja al integrante'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="ui-page members">
    <MemberDialog ref="editor" :save="onSave" />

    <section class="members__list">
      <header class="members__intro">
        <div>
          <p class="ui-kicker">Equipo</p>
          <h2 class="ui-title-section">Integrantes</h2>
          <p v-if="!loading" class="ui-text-muted">{{ listSummary }}</p>
        </div>
        <AppButton @click="editor?.open()">Nuevo integrante</AppButton>
      </header>

      <p v-if="error" class="ui-text-error">{{ error }}</p>
      <p v-if="loading" class="ui-text-muted">Cargando miembros…</p>

      <div v-else class="ui-table-wrap">
        <table class="ui-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="members.length === 0">
              <td colspan="4">No hay integrantes vigentes.</td>
            </tr>
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
                <span class="ui-badge" :class="member.role === 'admin' ? 'ui-badge--resuelta' : 'ui-badge--pendiente'">
                  {{ roleLabel(member.role) }}
                </span>
              </td>
              <td>
                <div class="members__row-actions">
                  <AppButton size="sm" variant="secondary" :disabled="saving" @click="editor?.open(member)">
                    Editar
                  </AppButton>
                  <AppButton
                    size="sm"
                    variant="danger"
                    :disabled="saving || member.id === session.user?.id"
                    @click="onDelete(member)"
                  >
                    Dar de baja
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.members__list {
  display: grid;
  gap: 1rem;
  min-width: 0;
  padding: 1.15rem 1.2rem 1.3rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(11, 31, 58, 0.08);
  border-radius: var(--app-radius-lg);
}

.members__intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.85rem 1.25rem;
  align-items: flex-end;
}

.members__intro > div:first-child {
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

.members__row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
