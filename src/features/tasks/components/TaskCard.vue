<script setup lang="ts">
import { taskStatusLabel } from '@/shared/tasks/statusLabels'
import type { Task } from '../types'

defineProps<{
  task: Task
}>()
</script>

<template>
  <article class="ui-card task-card">
    <div class="task-card__head">
      <h3 class="ui-title-section">{{ task.title }}</h3>
      <span class="ui-badge">{{ taskStatusLabel(task.status) }}</span>
    </div>
    <p class="ui-text-body task-card__description">
      {{ task.description || 'Sin descripción' }}
    </p>
    <RouterLink class="ui-link" :to="{ name: 'task-detail', params: { id: task.id } }">
      Ver detalle
    </RouterLink>
  </article>
</template>

<style scoped>
.task-card {
  display: grid;
  gap: 0.5rem;
}

.task-card__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.task-card__description {
  margin-top: 0.15rem;
}
</style>
