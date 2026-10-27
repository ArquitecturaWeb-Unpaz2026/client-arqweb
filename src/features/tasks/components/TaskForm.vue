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
  <form class="ui-card ui-stack task-form" @submit.prevent="onSubmit">
    <h2 class="ui-title-section">Nueva tarea</h2>
    <label class="ui-field">
      <span class="ui-label">Título</span>
      <input v-model="form.title" class="ui-input" required maxlength="120" />
    </label>
    <label class="ui-field">
      <span class="ui-label">Descripción</span>
      <textarea v-model="form.description" class="ui-input" rows="3" />
    </label>
    <div>
      <AppButton type="submit">Crear</AppButton>
    </div>
  </form>
</template>

<style scoped>
textarea.ui-input {
  resize: vertical;
  min-height: 5.5rem;
  max-height: 12rem;
}
</style>
