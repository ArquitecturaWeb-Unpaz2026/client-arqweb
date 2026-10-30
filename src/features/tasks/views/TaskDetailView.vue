<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/features/auth/stores/session'
import * as membersApi from '@/features/members/api'
import type { Member } from '@/features/members/types'
import { can, canMutateTask } from '@/shared/auth/permissions'
import AppButton from '@/shared/components/AppButton.vue'
import { formatDateTime, isOverdue } from '@/shared/datetime/formatDateTime'
import { TASK_STATUS_LABELS, taskStatusLabel } from '@/shared/tasks/statusLabels'
import * as tasksApi from '../api'
import type { Task, TaskStatus } from '../types'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()
const task = ref<Task | null>(null)
const members = ref<Member[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const saved = ref(false)
let queued = false

const form = reactive<{
  title: string
  description: string
  status: TaskStatus
  assigneeId: string
}>({
  title: '',
  description: '',
  status: 'pendiente',
  assigneeId: '',
})

const canAssign = computed(() => can(session.role, 'task.assign'))
const canEdit = computed(() =>
  task.value ? canMutateTask(session.role, session.user?.id, task.value, 'task.edit') : false,
)
const canChangeStatus = computed(() =>
  task.value
    ? canEdit.value || canMutateTask(session.role, session.user?.id, task.value, 'task.status')
    : false,
)
const canDelete = computed(() =>
  task.value ? canMutateTask(session.role, session.user?.id, task.value, 'task.delete') : false,
)
const overdue = computed(() => (task.value ? isOverdue(task.value.dueDate, task.value.status) : false))
const orphanAssignee = computed(
  () => Boolean(form.assigneeId) && !members.value.some((member) => member.id === form.assigneeId),
)
const orphanAssigneeName = computed(() => task.value?.assigneeName ?? 'Asignado actual')

function fillForm(current: Task) {
  form.title = current.title
  form.description = current.description
  form.status = current.status
  form.assigneeId = current.assigneeId ?? ''
}

async function load(id: string) {
  loading.value = true
  error.value = null
  saved.value = false
  task.value = null
  try {
    const [loaded, people] = await Promise.all([
      tasksApi.getTask(id),
      canAssign.value ? membersApi.listMembers().catch(() => [] as Member[]) : Promise.resolve([]),
    ])
    task.value = loaded
    members.value = people
    fillForm(loaded)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la tarea'
  } finally {
    loading.value = false
  }
}

watch(
  () => String(route.params.id),
  (id) => {
    if (id) void load(id)
  },
  { immediate: true },
)

async function persist() {
  if (!task.value || !canChangeStatus.value) return
  if (!form.title.trim()) {
    error.value = 'El título no puede quedar vacío'
    return
  }
  if (saving.value) {
    queued = true
    return
  }
  const current = task.value
  const next = {
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    assigneeId: form.assigneeId || null,
    dueDate: current.dueDate,
  }
  if (
    next.title === current.title &&
    next.description === current.description &&
    next.status === current.status &&
    next.assigneeId === current.assigneeId
  ) {
    return
  }
  saving.value = true
  saved.value = false
  error.value = null
  try {
    task.value = await tasksApi.updateTask(current.id, next)
    fillForm(task.value)
    saved.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo guardar la tarea'
  } finally {
    saving.value = false
    if (queued) {
      queued = false
      await persist()
    }
  }
}

async function onDelete() {
  if (!task.value) return
  saving.value = true
  error.value = null
  try {
    await tasksApi.deleteTask(task.value.id)
    await router.push({ name: 'tasks' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo eliminar la tarea'
    saving.value = false
  }
}
</script>

<template>
  <div class="ui-page detail">
    <div class="detail__toolbar">
      <AppButton variant="secondary" @click="router.push({ name: 'tasks' })">
        ← Volver al listado
      </AppButton>
      <p v-if="saving" class="ui-text-muted">Guardando…</p>
      <p v-else-if="saved && !error" class="detail__saved">Cambios guardados</p>
    </div>

    <p v-if="loading" class="ui-text-muted">Cargando…</p>
    <p v-else-if="error && !task" class="ui-text-error">{{ error }}</p>

    <article
      v-if="task"
      class="ui-card detail__card"
      :class="[`detail__card--${task.status}`, { 'detail__card--overdue': overdue }]"
    >
      <header class="detail__banner">
        <div class="detail__banner-top">
          <p class="ui-kicker">Detalle de entrega</p>
          <AppButton v-if="canDelete" size="sm" variant="danger" :disabled="saving" @click="onDelete">
            Eliminar
          </AppButton>
        </div>
        <div class="detail__head">
          <input
            v-if="canEdit"
            v-model="form.title"
            class="detail__title-input"
            maxlength="120"
            aria-label="Título"
            @change="persist"
          />
          <h2 v-else class="ui-title-page detail__title">{{ task.title }}</h2>
          <div class="detail__badges">
            <span v-if="overdue" class="ui-badge ui-badge--overdue">Vencida</span>
            <span class="ui-badge" :class="`ui-badge--${task.status}`">
              {{ taskStatusLabel(task.status) }}
            </span>
          </div>
        </div>
      </header>

      <div class="detail__layout">
        <section class="detail__main">
          <label class="ui-field">
            <span class="ui-label">Descripción</span>
            <textarea
              v-if="canEdit"
              v-model="form.description"
              class="ui-input"
              rows="6"
              @change="persist"
            />
            <p v-else class="ui-text-body">{{ task.description || 'Sin descripción' }}</p>
          </label>
          <p v-if="error" class="ui-text-error">{{ error }}</p>
        </section>

        <aside class="detail__side">
          <label class="ui-field">
            <span class="ui-label">Estado</span>
            <select v-if="canChangeStatus" v-model="form.status" class="ui-input" @change="persist">
              <option v-for="(label, status) in TASK_STATUS_LABELS" :key="status" :value="status">
                {{ label }}
              </option>
            </select>
            <p v-else class="detail__value">{{ taskStatusLabel(task.status) }}</p>
          </label>

          <label class="ui-field">
            <span class="ui-label">Asignado</span>
            <select v-if="canAssign" v-model="form.assigneeId" class="ui-input" @change="persist">
              <option value="">Sin asignar</option>
              <option v-if="orphanAssignee" :value="form.assigneeId">
                {{ orphanAssigneeName }}
              </option>
              <option v-for="member in members" :key="member.id" :value="member.id">
                {{ member.name }}
              </option>
            </select>
            <p v-else class="detail__value">{{ task.assigneeName ?? 'Sin asignar' }}</p>
          </label>

          <div class="detail__fact">
            <span class="ui-label">Vence</span>
            <p class="detail__value" :class="{ 'detail__due--overdue': overdue }">
              {{ formatDateTime(task.dueDate) }}
            </p>
          </div>
          <div class="detail__fact">
            <span class="ui-label">Creada</span>
            <p class="detail__value">{{ formatDateTime(task.createdAt) }}</p>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>

<style scoped>
.detail {
  display: grid;
  gap: 1rem;
}

.detail__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.detail__saved {
  margin: 0;
  color: var(--app-accent-text);
  font-size: 0.875rem;
  font-weight: 600;
}

.detail__card {
  display: grid;
  padding: 0;
  overflow: hidden;
  border-top: 3px solid var(--app-accent);
}

.detail__card--pendiente {
  border-top-color: #94a3b8;
}

.detail__card--asignada {
  border-top-color: #0369a1;
}

.detail__card--en_proceso {
  border-top-color: var(--app-accent);
}

.detail__card--resuelta {
  border-top-color: #0f766e;
}

.detail__card--cancelada {
  border-top-color: #64748b;
}

.detail__card--overdue {
  border-top: 4px solid var(--app-danger);
  background: linear-gradient(180deg, #fff1f2 0%, #ffffff 46%);
  box-shadow: 0 10px 24px rgba(185, 28, 28, 0.14);
}

.detail__banner {
  padding: 1.2rem 1.3rem 1.1rem;
  background: linear-gradient(135deg, #0b1f3a 0%, #0e3b4a 48%, #0f766e 100%);
}

.detail__card--overdue .detail__banner {
  background: linear-gradient(135deg, #450a0a 0%, #9f1239 55%, #b45309 100%);
}

.detail__banner .ui-kicker {
  color: #99f6e4;
}

.detail__card--overdue .detail__banner .ui-kicker {
  color: #fecdd3;
}

.detail__banner-top,
.detail__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.detail__head {
  margin-top: 0.55rem;
}

.detail__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
}

.detail__title,
.detail__title-input {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f8fafc;
}

.detail__title-input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  font: inherit;
  font-size: 1.35rem;
  font-weight: 700;
  padding: 0 0 0.15rem;
}

.detail__title-input:hover,
.detail__title-input:focus {
  border-bottom-color: rgba(248, 250, 252, 0.55);
  outline: none;
}

.detail__layout {
  display: grid;
  gap: 1.25rem;
  padding: 1.2rem 1.3rem 1.35rem;
}

.detail__main,
.detail__side {
  display: grid;
  align-content: start;
  gap: 0.9rem;
}

.detail__side {
  padding: 0.9rem 1rem;
  border: 1px solid rgba(13, 148, 136, 0.14);
  border-radius: var(--app-radius-md);
  background: rgba(240, 253, 250, 0.65);
}

.detail__card--overdue .detail__side {
  border-color: rgba(185, 28, 28, 0.18);
  background: rgba(255, 241, 242, 0.72);
}

.detail__fact {
  display: grid;
  gap: 0.25rem;
}

.detail__value {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--app-text-title);
}

.detail__due--overdue {
  color: var(--app-danger);
}

textarea.ui-input {
  resize: vertical;
  min-height: 8rem;
}

@media (min-width: 860px) {
  .detail__layout {
    grid-template-columns: minmax(0, 1fr) 16.5rem;
    align-items: start;
  }
}
</style>
