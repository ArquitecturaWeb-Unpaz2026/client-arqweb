<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Role } from '@/features/auth/types'
import AppButton from '@/shared/components/AppButton.vue'
import type { Member, MemberInput } from '../types'

const props = defineProps<{
  save: (input: MemberInput, id: string | null) => Promise<void>
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const editingId = ref<string | null>(null)
const saving = ref(false)
const error = ref<string | null>(null)
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'member' as Role,
})

const editing = computed(() => editingId.value != null)

function open(member?: Member | null) {
  error.value = null
  editingId.value = member?.id ?? null
  form.name = member?.name ?? ''
  form.email = member?.email ?? ''
  form.password = ''
  form.role = member?.role ?? 'member'
  dialog.value?.showModal()
}

function close() {
  if (saving.value) return
  dialog.value?.close()
}

function onBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

async function onSubmit() {
  if (!form.name.trim() || !form.email.trim() || saving.value) return
  const password = form.password.trim()
  if (!editing.value && password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }
  if (editing.value && password && password.length < 8) {
    error.value = 'La contraseña nueva debe tener al menos 8 caracteres'
    return
  }
  saving.value = true
  error.value = null
  try {
    await props.save(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        password,
      },
      editingId.value,
    )
    saving.value = false
    close()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'No se pudo guardar el integrante'
    saving.value = false
  }
}

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="member-dialog" aria-labelledby="member-dialog-title" @click="onBackdrop">
    <form class="member-dialog__form" @submit.prevent="onSubmit">
      <header class="member-dialog__head">
        <div>
          <p class="ui-kicker">Gestión</p>
          <h2 id="member-dialog-title" class="ui-title-section">
            {{ editing ? 'Editar integrante' : 'Nuevo integrante' }}
          </h2>
          <p class="ui-text-muted">
            {{
              editing
                ? 'Actualizá nombre, correo o rol. La contraseña solo cambia si escribís una nueva.'
                : 'El alta queda en el equipo. La contraseña se guarda cifrada.'
            }}
          </p>
        </div>
        <button type="button" class="member-dialog__close" aria-label="Cerrar" @click="close">×</button>
      </header>

      <div class="member-dialog__fields">
        <p v-if="error" class="ui-text-error">{{ error }}</p>
        <label class="ui-field">
          <span class="ui-label">Nombre</span>
          <input v-model="form.name" class="ui-input" required maxlength="100" />
        </label>
        <label class="ui-field">
          <span class="ui-label">Correo electrónico</span>
          <input v-model="form.email" class="ui-input" type="email" required maxlength="120" />
        </label>
        <label class="ui-field">
          <span class="ui-label">{{ editing ? 'Contraseña nueva' : 'Contraseña' }}</span>
          <input
            v-model="form.password"
            class="ui-input"
            type="password"
            autocomplete="new-password"
            :required="!editing"
            minlength="8"
            maxlength="72"
            :placeholder="editing ? 'En blanco conserva la actual' : 'Mínimo 8 caracteres'"
          />
        </label>
        <label class="ui-field">
          <span class="ui-label">Rol</span>
          <select v-model="form.role" class="ui-input">
            <option value="member">Miembro</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
      </div>

      <div class="member-dialog__actions">
        <AppButton variant="secondary" type="button" :disabled="saving" @click="close">Cancelar</AppButton>
        <AppButton type="submit" :disabled="saving">
          {{ saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear integrante' }}
        </AppButton>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.member-dialog {
  width: min(32rem, calc(100vw - 2rem));
  margin: auto;
  border: 0;
  border-radius: var(--app-radius-lg);
  padding: 0;
  background: #ffffff;
  box-shadow: var(--app-shadow-md);
}

.member-dialog::backdrop {
  background: rgba(11, 31, 58, 0.55);
}

.member-dialog__form {
  display: grid;
}

.member-dialog__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.3rem 1rem;
  background: linear-gradient(135deg, #0b1f3a 0%, #0e3b4a 48%, #0f766e 100%);
  color: #f8fafc;
}

.member-dialog__head .ui-kicker {
  color: #99f6e4;
}

.member-dialog__head .ui-title-section {
  margin-top: 0.2rem;
  color: #f8fafc;
  font-size: 1.05rem;
}

.member-dialog__head .ui-text-muted {
  margin-top: 0.3rem;
  color: rgba(226, 232, 240, 0.86);
}

.member-dialog__close {
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

.member-dialog__close:hover {
  background: rgba(248, 250, 252, 0.22);
}

.member-dialog__fields {
  display: grid;
  gap: 0.9rem;
  padding: 1.15rem 1.3rem 0;
}

.member-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 1rem 1.3rem 1.15rem;
}
</style>
