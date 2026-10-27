<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/AppButton.vue'
import * as tasksApi from '../api'
import { taskStatusLabel } from '@/shared/tasks/statusLabels'
import type { Task } from '../types'

const route = useRoute()
const router = useRouter()
const task = ref<Task | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    task.value = await tasksApi.getTask(String(route.params.id))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo cargar la tarea'
  } finally {
    loading.value = false
  }
})
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

    <article v-else-if="task" class="ui-card detail__card">
      <header class="detail__head">
        <h2 class="ui-title-page detail__title">{{ task.title }}</h2>
        <span class="ui-badge">{{ taskStatusLabel(task.status) }}</span>
      </header>
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
    </article>
  </div>
</template>

<style scoped>
.detail__head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.detail__title {
  font-size: 1.2rem;
}

.detail__card {
  display: grid;
  gap: 0.75rem;
}
</style>
