<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/features/auth/stores/session'
import { canMutateTask } from '@/shared/auth/permissions'
import AppButton from '@/shared/components/AppButton.vue'
import { TASK_STATUS_LABELS, taskStatusLabel } from '@/shared/tasks/statusLabels'
import * as tasksApi from '../api'
import type { Task, TaskInput, TaskStatus } from '../types'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()
const task = ref<Task | null>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const form = reactive<TaskInput & { status: TaskStatus }>({
  title: '',
  description: '',
  status: 'todo',
})

const canEdit = computed(() =>
  task.value ? canMutateTask(session.role, session.user?.id, task.value, 'task.edit') : false,
)
const canDelete = computed(() =>
  task.value ? canMutateTask(session.role, session.user?.id, task.value, 'task.delete') : false,
)

function fillForm(current: Task) {
  form.title = current.title
  form.description = current.description
  form.status = current.status
}

onMounted(async () => {
  try {
    task.value = await tasksApi.getTask(String(route.params.id))
    fillForm(task.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la tarea'
  } finally {
    loading.value = false
  }
})

async function onSave() {
  if (!task.value || !form.title.trim()) return
  saving.value = true
  error.value = null
  try {
    task.value = await tasksApi.updateTask(task.value.id, {
      title: form.title.trim(),
      description: form.description?.trim() ?? '',
      status: form.status,
      assigneeId: task.value.assigneeId,
      dueDate: task.value.dueDate,
    })
    fillForm(task.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo guardar la tarea'
  } finally {
    saving.value = false
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
  <div class="ui-page ui-page--narrow ui-stack detail">
    <div>
      <AppButton variant="secondary" @click="router.push({ name: 'tasks' })">
        ← Volver al listado
      </AppButton>
    </div>

    <p v-if="loading" class="ui-text-muted">Cargando…</p>
    <p v-else-if="error" class="ui-text-error">{{ error }}</p>

    <article v-else-if="task" class="ui-card detail__card" :class="`detail__card--${task.status}`">
      <header class="detail__banner">
        <p class="ui-kicker">Detalle de entrega</p>
        <div class="detail__head">
          <h2 class="ui-title-page detail__title">{{ task.title }}</h2>
          <span class="ui-badge" :class="`ui-badge--${task.status}`">
            {{ taskStatusLabel(task.status) }}
          </span>
        </div>
      </header>

      <div class="detail__body">
        <p class="ui-text-body">{{ task.description || 'Sin descripción' }}</p>
        <dl class="ui-meta-list">
          <div>
            <dt>Asignado</dt>
            <dd>{{ task.assigneeId ?? 'Sin asignar' }}</dd>
          </div>
          <div>
            <dt>Vence</dt>
            <dd>{{ task.dueDate ?? '—' }}</dd>
          </div>
          <div>
            <dt>Creada</dt>
            <dd>{{ new Date(task.createdAt).toLocaleString('es') }}</dd>
          </div>
        </dl>
      </div>
    </article>

    <form v-if="task && canEdit" class="ui-card detail__edit" @submit.prevent="onSave">
      <header class="detail__edit-head">
        <p class="ui-kicker">Gestión</p>
        <h3 class="ui-title-section">Editar tarea</h3>
      </header>
      <label class="ui-field">
        <span class="ui-label">Título</span>
        <input v-model="form.title" class="ui-input" required maxlength="120" />
      </label>
      <label class="ui-field">
        <span class="ui-label">Descripción</span>
        <textarea v-model="form.description" class="ui-input" rows="3" />
      </label>
      <label class="ui-field">
        <span class="ui-label">Estado</span>
        <select v-model="form.status" class="ui-input">
          <option v-for="(label, status) in TASK_STATUS_LABELS" :key="status" :value="status">
            {{ label }}
          </option>
        </select>
      </label>
      <div class="detail__edit-actions">
        <AppButton type="submit" :disabled="saving">
          {{ saving ? 'Guardando…' : 'Guardar cambios' }}
        </AppButton>
        <AppButton v-if="canDelete" variant="danger" :disabled="saving" @click="onDelete">
          Eliminar
        </AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.detail__card {
  display: grid;
  padding: 0;
  overflow: hidden;
  border-top: 3px solid var(--app-accent);
}

.detail__card--todo {
  border-top-color: #94a3b8;
}

.detail__card--in_progress {
  border-top-color: var(--app-accent);
}

.detail__card--done {
  border-top-color: #0f766e;
}

.detail__banner {
  padding: 1.2rem 1.3rem 1.1rem;
  background: linear-gradient(135deg, #0b1f3a 0%, #0e3b4a 48%, #0f766e 100%);
}

.detail__banner .ui-kicker {
  color: #99f6e4;
}

.detail__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
  margin-top: 0.35rem;
}

.detail__title {
  font-size: 1.25rem;
  color: #f8fafc;
}

.detail__body {
  display: grid;
  gap: 0.75rem;
  padding: 1.2rem 1.3rem 1.3rem;
}

.detail__edit {
  display: grid;
  gap: 0.9rem;
}

.detail__edit-head {
  display: grid;
  gap: 0.15rem;
}

.detail__edit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

textarea.ui-input {
  resize: vertical;
  min-height: 5.5rem;
}
</style>
