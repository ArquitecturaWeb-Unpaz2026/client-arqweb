<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSessionStore } from '@/features/auth/stores/session'
import * as membersApi from '@/features/members/api'
import type { Member } from '@/features/members/types'
import { can, canMutateTask } from '@/shared/auth/permissions'
import AppButton from '@/shared/components/AppButton.vue'
import { TASK_STATUS_CATALOG } from '@/shared/tasks/statusLabels'
import TaskCard from '../components/TaskCard.vue'
import TaskCreateDialog from '../components/TaskCreateDialog.vue'
import { useTasks } from '../composables/useTasks'
import type { Task, TaskInput, TaskStatus } from '../types'

const VIEW_KEY = 'arqweb.tasks.view'

const session = useSessionStore()
const { tasks, loading, error, create, update, remove } = useTasks()
const statusFilter = ref<'all' | TaskStatus>('all')
const view = ref<'list' | 'grid'>(localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'list')
const creator = ref<{ open: () => void } | null>(null)
const members = ref<Member[]>([])
const savingId = ref<string | null>(null)
const actionError = ref<string | null>(null)

watch(view, (value) => localStorage.setItem(VIEW_KEY, value))

const canCreate = computed(() => can(session.role, 'task.create'))
const canAssign = computed(() => can(session.role, 'task.assign'))
const isMember = computed(() => session.role === 'member')

onMounted(async () => {
  if (!canAssign.value) return
  try {
    members.value = await membersApi.listMembers()
  } catch (err) {
    actionError.value = err instanceof Error ? err.message : 'No se pudo cargar el equipo'
  }
})

const visibleTasks = computed(() => {
  if (statusFilter.value === 'all') return tasks.value
  return tasks.value.filter((task) => task.status === statusFilter.value)
})

const listSummary = computed(() => {
  const total = tasks.value.length
  const shown = visibleTasks.value.length
  const own = isMember.value ? ' propias' : ''
  if (statusFilter.value === 'all') {
    if (total === 1) return `1 tarea${own} en el panel`
    return `${total} tareas${own} en el panel`
  }
  if (shown === 1) return `1 de ${total} tareas${own}`
  return `${shown} de ${total} tareas${own}`
})

const emptyCopy = computed(() => {
  if (tasks.value.length > 0) return 'No hay tareas en este estado.'
  return isMember.value
    ? 'Todavía no tenés tareas propias. Creá la primera para empezar el seguimiento.'
    : 'No hay tareas todavía. Creá la primera para empezar el seguimiento.'
})

function canDeleteTask(task: Task) {
  return canMutateTask(session.role, session.user?.id, task, 'task.delete')
}

async function onCreate(input: TaskInput) {
  await create(input)
}

async function onDelete(id: string) {
  await remove(id)
}

async function onAssign(task: Task, assigneeId: string) {
  savingId.value = task.id
  actionError.value = null
  try {
    await update(task.id, {
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeId: assigneeId || null,
      dueDate: task.dueDate,
    })
  } catch (err) {
    actionError.value = err instanceof Error ? err.message : 'No se pudo asignar la tarea'
  } finally {
    savingId.value = null
  }
}
</script>

<template>
  <div class="ui-page tasks-page">
    <TaskCreateDialog v-if="canCreate" ref="creator" :create="onCreate" />

    <section class="tasks-page__list">
      <header class="tasks-page__intro">
        <div>
          <p class="ui-kicker">Seguimiento</p>
          <h2 class="ui-title-section">Listado</h2>
          <p v-if="!loading && !error" class="ui-text-muted">{{ listSummary }}</p>
        </div>
        <div class="tasks-page__tools">
          <div class="tasks-page__switch" role="group" aria-label="Tipo de vista">
            <button
              type="button"
              :class="{ 'tasks-page__switch-btn--active': view === 'list' }"
              :aria-pressed="view === 'list'"
              @click="view = 'list'"
            >
              Lista
            </button>
            <button
              type="button"
              :class="{ 'tasks-page__switch-btn--active': view === 'grid' }"
              :aria-pressed="view === 'grid'"
              @click="view = 'grid'"
            >
              Grilla
            </button>
          </div>
          <AppButton v-if="canCreate" @click="creator?.open()">Nueva tarea</AppButton>
        </div>
      </header>

      <div class="tasks-page__filters" role="group" aria-label="Filtrar por estado">
        <button
          type="button"
          class="tasks-page__filter"
          :class="{ 'tasks-page__filter--active': statusFilter === 'all' }"
          :aria-pressed="statusFilter === 'all'"
          @click="statusFilter = 'all'"
        >
          Todas
        </button>
        <button
          v-for="entry in TASK_STATUS_CATALOG"
          :key="entry.status"
          type="button"
          class="tasks-page__filter"
          :class="{ 'tasks-page__filter--active': statusFilter === entry.status }"
          :aria-pressed="statusFilter === entry.status"
          @click="statusFilter = entry.status"
        >
          {{ entry.label }}
        </button>
      </div>

      <p v-if="actionError" class="ui-text-error">{{ actionError }}</p>
      <p v-if="loading" class="ui-text-muted">Cargando tareas…</p>
      <p v-else-if="error" class="ui-text-error">{{ error }}</p>
      <p v-else-if="visibleTasks.length === 0" class="ui-card ui-text-muted tasks-page__empty">
        {{ emptyCopy }}
      </p>

      <ul v-else class="tasks-page__items" :class="`tasks-page__items--${view}`">
        <li v-for="task in visibleTasks" :key="task.id" class="tasks-page__item">
          <TaskCard
            :task="task"
            :layout="view"
            :members="members"
            :can-assign="canAssign"
            :assigning="savingId === task.id"
            @assign="onAssign(task, $event)"
          >
            <template v-if="canDeleteTask(task)" #actions>
              <AppButton size="sm" variant="danger" @click="onDelete(task.id)">
                Eliminar
              </AppButton>
            </template>
          </TaskCard>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tasks-page__list {
  display: grid;
  gap: 1rem;
  min-width: 0;
  padding: 1.15rem 1.2rem 1.3rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(11, 31, 58, 0.08);
  border-radius: var(--app-radius-lg);
}

.tasks-page__intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.85rem 1.25rem;
  align-items: flex-end;
}

.tasks-page__intro > div:first-child {
  display: grid;
  gap: 0.15rem;
}

.tasks-page__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.tasks-page__switch {
  display: inline-flex;
  padding: 0.15rem;
  border: 1px solid var(--app-border-strong);
  border-radius: 999px;
  background: #ffffff;
}

.tasks-page__switch button {
  border: 0;
  background: transparent;
  color: #64748b;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.tasks-page__switch button.tasks-page__switch-btn--active {
  background: #0f766e;
  color: #f8fafc;
  box-shadow: 0 1px 2px rgba(15, 118, 110, 0.35);
}

.tasks-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tasks-page__filter {
  border: 1px solid var(--app-border-strong);
  background: #ffffff;
  color: var(--app-text-body);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.tasks-page__filter:hover {
  border-color: var(--app-accent);
  color: var(--app-accent-text);
}

.tasks-page__filter--active {
  background: #0f766e;
  border-color: #0f766e;
  color: #f8fafc;
}

.tasks-page__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  align-items: stretch;
}

.tasks-page__items--grid {
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 1rem;
}

.tasks-page__item {
  display: flex;
  min-height: 0;
}

.tasks-page__item :deep(.task-card) {
  flex: 1;
}

.tasks-page__empty {
  padding: 1.25rem 1.3rem;
}
</style>
