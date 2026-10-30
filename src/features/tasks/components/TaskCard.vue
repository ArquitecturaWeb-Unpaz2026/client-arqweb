<script setup lang="ts">
import { taskStatusLabel } from '@/shared/tasks/statusLabels'
import type { Task } from '../types'

defineProps<{
  task: Task
}>()
</script>

<template>
  <article class="ui-card task-card" :class="`task-card--${task.status}`">
    <div class="task-card__head">
      <h3 class="task-card__title">{{ task.title }}</h3>
      <span class="ui-badge" :class="`ui-badge--${task.status}`">
        {{ taskStatusLabel(task.status) }}
      </span>
    </div>
    <p class="ui-text-body task-card__description">
      {{ task.description || 'Sin descripción' }}
    </p>
    <footer class="task-card__footer">
      <RouterLink class="ui-link" :to="{ name: 'task-detail', params: { id: task.id } }">
        Ver detalle
      </RouterLink>
      <div class="task-card__actions">
        <slot name="actions" />
      </div>
    </footer>
  </article>
</template>

<style scoped>
.task-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.7rem;
  height: 100%;
  min-height: 13.75rem;
  padding: 1.15rem 1.2rem 1rem;
  border-top: 3px solid var(--app-accent);
}

.task-card--todo {
  border-top-color: #94a3b8;
}

.task-card--in_progress {
  border-top-color: var(--app-accent);
}

.task-card--done {
  border-top-color: #0f766e;
}

.task-card__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.task-card__title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--app-text-title);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
}

.task-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 4.65em;
  color: var(--app-text-body);
}

.task-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.7rem;
  border-top: 1px solid rgba(13, 148, 136, 0.12);
  margin-top: auto;
}

.task-card__actions {
  display: flex;
  gap: 0.4rem;
}
</style>
