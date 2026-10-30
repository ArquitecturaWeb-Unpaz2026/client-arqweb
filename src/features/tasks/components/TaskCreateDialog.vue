<script setup lang="ts">
import { reactive, ref } from 'vue'
import AppButton from '@/shared/components/AppButton.vue'
import type { TaskInput } from '../types'

const props = defineProps<{
  create: (input: TaskInput) => Promise<void>
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const saving = ref(false)
const error = ref<string | null>(null)
const form = reactive({
  title: '',
  description: '',
})

function open() {
  error.value = null
  form.title = ''
  form.description = ''
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function onBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

async function onSubmit() {
  if (!form.title.trim() || saving.value) return
  saving.value = true
  error.value = null
  try {
    await props.create({
      title: form.title.trim(),
      description: form.description.trim(),
    })
    close()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo crear la tarea'
  } finally {
    saving.value = false
  }
}

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="task-dialog" aria-labelledby="task-dialog-title" @click="onBackdrop">
    <form class="task-dialog__form" @submit.prevent="onSubmit">
      <header class="task-dialog__head">
        <div>
          <p class="ui-kicker">Gestión</p>
          <h2 id="task-dialog-title" class="ui-title-section">Nueva tarea</h2>
          <p class="ui-text-muted">Definí el título y el alcance para sumarla al seguimiento del equipo.</p>
        </div>
        <button type="button" class="task-dialog__close" aria-label="Cerrar" @click="close">×</button>
      </header>

      <div class="task-dialog__fields">
        <p v-if="error" class="ui-text-error">{{ error }}</p>
        <label class="ui-field">
          <span class="ui-label">Título</span>
          <input
            v-model="form.title"
            class="ui-input"
            required
            maxlength="120"
            placeholder="Ej. Definir contrato de API"
          />
        </label>
        <label class="ui-field">
          <span class="ui-label">Descripción</span>
          <textarea
            v-model="form.description"
            class="ui-input"
            rows="4"
            placeholder="Qué hay que entregar y con qué criterio se considera lista."
          />
        </label>
      </div>

      <div class="task-dialog__actions">
        <AppButton variant="secondary" type="button" :disabled="saving" @click="close">Cancelar</AppButton>
        <AppButton type="submit" :disabled="saving">
          {{ saving ? 'Creando…' : 'Crear tarea' }}
        </AppButton>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.task-dialog {
  width: min(32rem, calc(100vw - 2rem));
  margin: auto;
  border: 0;
  border-radius: var(--app-radius-lg);
  padding: 0;
  background: #ffffff;
  box-shadow: var(--app-shadow-md);
}

.task-dialog::backdrop {
  background: rgba(11, 31, 58, 0.55);
}

.task-dialog__form {
  display: grid;
}

.task-dialog__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.3rem 1rem;
  background: linear-gradient(135deg, #0b1f3a 0%, #0e3b4a 48%, #0f766e 100%);
  color: #f8fafc;
}

.task-dialog__head .ui-kicker {
  color: #99f6e4;
}

.task-dialog__head .ui-title-section {
  margin-top: 0.2rem;
  color: #f8fafc;
  font-size: 1.05rem;
}

.task-dialog__head .ui-text-muted {
  margin-top: 0.3rem;
  color: rgba(226, 232, 240, 0.86);
}

.task-dialog__close {
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.12);
  color: #f8fafc;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.task-dialog__close:hover {
  background: rgba(248, 250, 252, 0.22);
}

.task-dialog__fields {
  display: grid;
  gap: 0.9rem;
  padding: 1.15rem 1.3rem 0;
}

.task-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 1rem 1.3rem 1.15rem;
}

textarea.ui-input {
  resize: vertical;
  min-height: 6rem;
}
</style>
