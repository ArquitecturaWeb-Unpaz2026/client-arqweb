<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/AppButton.vue'
import { useSessionStore } from '../stores/session'

const session = useSessionStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: 'admin@demo.com',
  password: 'demo123',
})

async function onSubmit() {
  await session.login(form)
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/tasks'
  await router.push(redirect)
}
</script>

<template>
  <div class="ui-card ui-card--auth login-card">
    <h1 class="ui-title-page">Iniciar sesión</h1>
    <p class="ui-text-muted login-card__hint">
      Modo demostración con datos simulados en el navegador. Cuando conectes la API del
      servidor, establece <code>VITE_USE_MOCK_API=false</code> en el archivo de entorno.
    </p>

    <form class="ui-stack login-card__form" @submit.prevent="onSubmit">
      <label class="ui-field">
        <span class="ui-label">Correo electrónico</span>
        <input
          v-model="form.email"
          class="ui-input"
          type="email"
          required
          autocomplete="username"
        />
      </label>
      <label class="ui-field">
        <span class="ui-label">Contraseña</span>
        <input
          v-model="form.password"
          class="ui-input"
          type="password"
          required
          autocomplete="current-password"
        />
      </label>

      <p v-if="session.error" class="ui-text-error">{{ session.error }}</p>

      <AppButton type="submit" :disabled="session.loading">
        {{ session.loading ? 'Entrando…' : 'Entrar' }}
      </AppButton>
    </form>

    <div class="login-card__demo">
      <p class="ui-label">Usuarios de prueba</p>
      <ul class="login-card__demo-list">
        <li><strong>admin@demo.com</strong> / demo123 (administrador)</li>
        <li><strong>member@demo.com</strong> / demo123 (miembro)</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  display: grid;
  gap: 1rem;
}

.login-card__hint {
  margin-top: -0.25rem;
}

.login-card__form {
  margin-top: 0.25rem;
}

.login-card__demo {
  padding-top: 0.75rem;
  border-top: 1px solid var(--app-border);
}

.login-card__demo-list {
  margin: 0.45rem 0 0;
  padding-left: 1.1rem;
  color: var(--app-text-muted);
  font-size: 0.8125rem;
  line-height: 1.55;
}

.login-card__demo-list strong {
  color: var(--app-text-body);
  font-weight: 600;
}
</style>
