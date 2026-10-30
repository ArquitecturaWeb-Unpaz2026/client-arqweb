<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from '@/features/members/types'
import { formatDateTime, isOverdue } from '@/shared/datetime/formatDateTime'
import { taskStatusLabel } from '@/shared/tasks/statusLabels'
import type { Task } from '../types'

const props = defineProps<{
  task: Task
  layout?: 'grid' | 'list'
  members?: Member[]
  canAssign?: boolean
  assigning?: boolean
}>()

const emit = defineEmits<{
  assign: [assigneeId: string]
}>()

const overdue = computed(() => isOverdue(props.task.dueDate, props.task.status))
const people = computed(() => props.members ?? [])
const orphanAssignee = computed(
  () =>
    Boolean(props.task.assigneeId) &&
    !people.value.some((member) => member.id === props.task.assigneeId),
)

function onAssign(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === (props.task.assigneeId ?? '')) return
  emit('assign', value)
}
</script>

<template>
  <article
    class="ui-card task-card"
    :class="[
      `task-card--${task.status}`,
      { 'task-card--overdue': overdue, 'task-card--row': layout === 'list' },
    ]"
  >
    <div class="task-card__head">
      <h3 class="task-card__title">{{ task.title }}</h3>
      <div class="task-card__badges">
        <span v-if="overdue" class="ui-badge ui-badge--overdue">Vencida</span>
        <span class="ui-badge" :class="`ui-badge--${task.status}`">
          {{ taskStatusLabel(task.status) }}
        </span>
      </div>
    </div>
    <p class="ui-text-body task-card__description">
      {{ task.description || 'Sin descripción' }}
    </p>
    <p class="task-card__meta">
      <select
        v-if="canAssign"
        class="task-card__assign"
        :value="task.assigneeId ?? ''"
        :disabled="assigning"
        aria-label="Asignado"
        @change="onAssign"
      >
        <option value="">Sin asignar</option>
        <option v-if="orphanAssignee" :value="task.assigneeId ?? ''">
          {{ task.assigneeName }}
        </option>
        <option v-for="member in people" :key="member.id" :value="member.id">
          {{ member.name }}
        </option>
      </select>
      <span v-else>{{ task.assigneeName ?? 'Sin asignar' }}</span>
      <span :class="{ 'task-card__due--overdue': overdue }">{{ formatDateTime(task.dueDate) }}</span>
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
  grid-template-rows: auto 1fr auto auto;
  gap: 0.7rem;
  height: 100%;
  min-height: 13.75rem;
  padding: 1.15rem 1.2rem 1rem;
  border-top: 3px solid var(--app-accent);
}

.task-card--pendiente {
  border-top-color: #94a3b8;
}

.task-card--asignada {
  border-top-color: #0369a1;
}

.task-card--en_proceso {
  border-top-color: var(--app-accent);
}

.task-card--resuelta {
  border-top-color: #0f766e;
}

.task-card--cancelada {
  border-top-color: #64748b;
}

.task-card--overdue {
  border-top: 4px solid var(--app-danger);
  background:
    linear-gradient(180deg, #fff1f2 0%, #ffffff 48%),
    var(--app-surface);
  box-shadow: 0 10px 24px rgba(185, 28, 28, 0.14);
}

.task-card__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.task-card__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
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

.task-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--app-text-muted);
}

.task-card__assign {
  max-width: 11.5rem;
  min-width: 8.5rem;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: var(--app-text-title);
  border-radius: 0.4rem;
  padding: 0.28rem 0.45rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.task-card__assign:hover,
.task-card__assign:focus {
  border-color: #0f766e;
  outline: none;
}

.task-card__assign:disabled {
  cursor: progress;
  opacity: 0.7;
}

.task-card__due--overdue {
  color: var(--app-danger);
  font-weight: 700;
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

.task-card--overdue .task-card__footer {
  border-top-color: rgba(185, 28, 28, 0.18);
}

.task-card__actions {
  display: flex;
  gap: 0.4rem;
}

.task-card--row {
  min-height: 0;
  grid-template-rows: auto auto;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 1rem;
}

.task-card--row .task-card__head {
  flex-direction: column;
  align-items: flex-start;
}

.task-card--row .task-card__title,
.task-card--row .task-card__description {
  min-height: 0;
  -webkit-line-clamp: 2;
}

.task-card--row .task-card__description {
  grid-column: 1 / -1;
}

.task-card--row .task-card__meta {
  grid-column: 1 / -1;
}

.task-card--row .task-card__footer {
  grid-column: 1 / -1;
  margin-top: 0;
}

@media (min-width: 800px) {
  .task-card--row {
    grid-template-rows: auto;
    grid-template-columns: minmax(16rem, 1.3fr) minmax(0, 1.5fr) auto auto;
  }

  .task-card--row .task-card__description,
  .task-card--row .task-card__meta,
  .task-card--row .task-card__footer {
    grid-column: auto;
  }

  .task-card--row .task-card__footer {
    border-top: 0;
    padding-top: 0;
    justify-content: flex-end;
  }
}
</style>
