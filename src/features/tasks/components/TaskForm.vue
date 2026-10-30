<script setup lang="ts">
import { reactive } from 'vue'
import AppButton from '@/shared/components/AppButton.vue'
import type { TaskInput } from '../types'

const emit = defineEmits<{
  submit: [payload: TaskInput]
}>()

const form = reactive<TaskInput>({
  title: '',
  description: '',
})

function onSubmit() {
  if (!form.title.trim()) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description?.trim() ?? '',
  })
  form.title = ''
  form.description = ''
}
</script>

<template>
  <form class="ui-card task-form" @submit.prevent="onSubmit">
    <header class="task-form__head">
      <p class="ui-kicker">Gestión</p>
      <h2 class="ui-title-section">Nueva tarea</h2>
      <p class="ui-text-muted">Definí el título y el alcance para sumarla al seguimiento del equipo.</p>
    </header>

    <div class="task-form__fields">
      <label class="ui-field">
        <span class="ui-label">Título</span>
        <input v-model="form.title" class="ui-input" required maxlength="120" placeholder="Ej. Definir contrato de API" />
      </label>
      <label class="ui-field">
        <span class="ui-label">Descripción</span>
        <textarea
          v-model="form.description"
          class="ui-input"
          rows="3"
          placeholder="Qué hay que entregar y con qué criterio se considera lista."
        />
      </label>
    </div>

    <div class="task-form__actions">
      <AppButton type="submit">Crear tarea</AppButton>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  display: grid;
  gap: 1rem;
  padding: 0;
  overflow: hidden;
}

.task-form__head {
  padding: 1.15rem 1.3rem 1rem;
  background: linear-gradient(135deg, #0b1f3a 0%, #0e3b4a 48%, #0f766e 100%);
  color: #f8fafc;
}

.task-form__head .ui-kicker {
  color: #99f6e4;
}

.task-form__head .ui-title-section {
  margin-top: 0.2rem;
  color: #f8fafc;
  font-size: 1.05rem;
}

.task-form__head .ui-text-muted {
  margin-top: 0.3rem;
  color: rgba(226, 232, 240, 0.86);
}

.task-form__fields,
.task-form__actions {
  padding-inline: 1.3rem;
}

.task-form__fields {
  display: grid;
  gap: 0.9rem;
}

.task-form__actions {
  padding-bottom: 1.15rem;
}

textarea.ui-input {
  resize: vertical;
  min-height: 5.5rem;
  max-height: 12rem;
}
</style>
