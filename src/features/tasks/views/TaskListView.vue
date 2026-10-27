<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '@/features/auth/stores/session'
import { can } from '@/shared/auth/permissions'
import AppButton from '@/shared/components/AppButton.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'
import { useTasks } from '../composables/useTasks'
import type { TaskInput } from '../types'

const session = useSessionStore()
const { tasks, loading, error, create, remove } = useTasks()

const canCreate = computed(() => can(session.role, 'task.create'))
const canDelete = computed(() => can(session.role, 'task.delete'))

async function onCreate(input: TaskInput) {
  await create(input)
}

async function onDelete(id: string) {
  await remove(id)
}
</script>

<template>
  <div class="ui-page ui-page--narrow ui-stack tasks-page">
    <TaskForm v-if="canCreate" @submit="onCreate" />

    <section class="ui-stack tasks-page__list">
      <h2 class="ui-title-section">Listado</h2>

      <p v-if="loading" class="ui-text-muted">Cargando tareas…</p>
      <p v-else-if="error" class="ui-text-error">{{ error }}</p>
      <p v-else-if="tasks.length === 0" class="ui-text-muted">No hay tareas todavía.</p>

      <ul v-else class="tasks-page__items">
        <li v-for="task in tasks" :key="task.id" class="tasks-page__item">
          <TaskCard :task="task" />
          <AppButton v-if="canDelete" variant="danger" @click="onDelete(task.id)">
            Eliminar
          </AppButton>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tasks-page__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.tasks-page__item {
  display: grid;
  gap: 0.5rem;
  justify-items: start;
}
</style>
