<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/shared/components/AppButton.vue'
import { useSessionStore } from '../stores/session'

const session = useSessionStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
})

async function onSubmit() {
  await session.login(form)
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/tasks'
  await router.push(redirect)
}
</script>

<template>
  <article class="login-card">
    <section class="login-card__brand" aria-label="Presentación de ArqWeb Tareas">
      <div class="login-card__brand-mark" aria-hidden="true">AW</div>
      <p class="login-card__product">ArqWeb Tareas</p>
      <h1 class="login-card__slogan">Orden, seguimiento y claridad en cada entrega.</h1>
      <p class="login-card__lead">
        Coordiná el trabajo del equipo, asigná responsables y seguí el avance de
        cada tarea desde un mismo lugar.
      </p>
      <ul class="login-card__points">
        <li>Prioridades visibles para todo el equipo</li>
        <li>Acceso según el rol de cada integrante</li>
        <li>Seguimiento de entregas en un solo panel</li>
      </ul>
      <p class="login-card__brand-foot">Panel interno · Acceso autorizado</p>
    </section>

    <section class="login-card__panel">
      <p class="login-card__kicker">Acceso al panel</p>
      <h2 class="login-card__title">Iniciar sesión</h2>
      <p class="login-card__hint">Ingresá con tu correo institucional para continuar.</p>

      <form class="login-card__form" @submit.prevent="onSubmit">
        <label class="ui-field">
          <span class="ui-label">Correo electrónico</span>
          <input
            v-model="form.email"
            class="ui-input"
            type="email"
            required
            autocomplete="username"
            placeholder="nombre@organizacion.edu"
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
            placeholder="••••••••"
          />
        </label>

        <p v-if="session.error" class="ui-text-error">{{ session.error }}</p>

        <AppButton class="login-card__submit" type="submit" :disabled="session.loading">
          {{ session.loading ? 'Entrando…' : 'Entrar al panel' }}
        </AppButton>
      </form>
    </section>
  </article>
</template>

<style scoped>
.login-card {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(18rem, 0.95fr);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.18);
  border-radius: 1.25rem;
  box-shadow:
    0 24px 60px rgba(2, 8, 23, 0.38),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  background: #ffffff;
}

.login-card__brand {
  display: grid;
  align-content: start;
  gap: 0.85rem;
  padding: 2.1rem 1.85rem 1.9rem;
  color: #f8fafc;
  background:
    radial-gradient(120% 90% at 0% 0%, rgba(45, 212, 191, 0.32), transparent 52%),
    radial-gradient(90% 70% at 100% 100%, rgba(13, 148, 136, 0.28), transparent 46%),
    linear-gradient(165deg, #0b1f3a 0%, #0e3b4a 58%, #0f766e 100%);
}

.login-card__brand-mark {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border-radius: 0.75rem;
  background: linear-gradient(145deg, #5eead4, #14b8a6);
  color: #042f2e;
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 18px rgba(2, 44, 34, 0.28);
}

.login-card__product {
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #99f6e4;
}

.login-card__slogan {
  margin: 0;
  max-width: 18ch;
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: #f8fafc;
}

.login-card__lead {
  margin: 0;
  max-width: 34ch;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(226, 232, 240, 0.88);
}

.login-card__brand-foot {
  margin: 1.15rem 0 0;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: rgba(204, 251, 241, 0.72);
}

.login-card__points {
  margin: 0.55rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
  list-style: none;
}

.login-card__points li {
  position: relative;
  padding-left: 1.15rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #ccfbf1;
}

.login-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: #5eead4;
}

.login-card__panel {
  display: grid;
  align-content: center;
  gap: 0.45rem;
  padding: 2rem 1.75rem 1.85rem;
  background:
    linear-gradient(180deg, rgba(240, 253, 250, 0.9) 0%, #ffffff 38%),
    #ffffff;
}

.login-card__kicker {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--app-accent);
}

.login-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--app-text-title);
}

.login-card__hint {
  margin: 0 0 0.85rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--app-text-muted);
}

.login-card__form {
  display: grid;
  gap: 1rem;
}

.login-card__submit {
  width: 100%;
  margin-top: 0.15rem;
  padding-block: 0.7rem;
}

@media (max-width: 760px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-card__slogan {
    max-width: none;
    font-size: 1.45rem;
  }

  .login-card__brand {
    padding-bottom: 1.5rem;
  }

  .login-card__panel {
    padding-top: 1.5rem;
  }
}
</style>
