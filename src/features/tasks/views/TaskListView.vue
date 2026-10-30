<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '@/features/auth/stores/session'
import { can, canMutateTask } from '@/shared/auth/permissions'
import AppButton from '@/shared/components/AppButton.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'
import { useTasks } from '../composables/useTasks'
import type { Task, TaskInput } from '../types'

const session = useSessionStore()
const { tasks, loading, error, create, remove } = useTasks()

const canCreate = computed(() => can(session.role, 'task.create'))
const isMember = computed(() => session.role === 'member')

const listSummary = computed(() => {
  if (isMember.value) {
    return tasks.value.length === 1 ? '1 tarea propia' : `${tasks.value.length} tareas propias`
  }
  if (tasks.value.length === 1) return '1 tarea en el panel'
  return `${tasks.value.length} tareas en el panel`
})

const emptyCopy = computed(() =>
  isMember.value
    ? 'Todavía no tenés tareas propias. Creá la primera para empezar el seguimiento.'
    : 'No hay tareas todavía. Creá la primera para empezar el seguimiento.',
)

function canDeleteTask(task: Task) {
  return canMutateTask(session.role, session.user?.id, task, 'task.delete')
}

async function onCreate(input: TaskInput) {
  await create(input)
}

async function onDelete(id: string) {
  await remove(id)
}
</script>

<template>
  <div class="ui-page ui-stack tasks-page">
    <TaskForm v-if="canCreate" @submit="onCreate" />

    <section class="ui-stack tasks-page__list">
      <header class="tasks-page__intro">
        <p class="ui-kicker">Seguimiento</p>
        <h2 class="ui-title-section">Listado</h2>
        <p v-if="!loading && !error" class="ui-text-muted">{{ listSummary }}</p>
      </header>

      <p v-if="loading" class="ui-text-muted">Cargando tareas…</p>
      <p v-else-if="error" class="ui-text-error">{{ error }}</p>
      <p v-else-if="tasks.length === 0" class="ui-card ui-text-muted tasks-page__empty">
        {{ emptyCopy }}
      </p>

      <ul v-else class="tasks-page__items">
        <li v-for="task in tasks" :key="task.id" class="tasks-page__item">
          <TaskCard :task="task">
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
.tasks-page__intro {
  display: grid;
  gap: 0.15rem;
}

.tasks-page__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 1rem;
  align-items: stretch;
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
