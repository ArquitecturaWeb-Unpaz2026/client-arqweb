<template>
  <div class="auth-layout">
    <main class="auth-layout__panel">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background-color: #0b1f3a;
  background-image:
    radial-gradient(80% 60% at 50% 100%, rgba(13, 148, 136, 0.22), transparent 62%),
    linear-gradient(180deg, rgba(8, 24, 48, 0.52) 0%, rgba(12, 32, 64, 0.78) 100%),
    url('../assets/login-bg-institucional.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.auth-layout__panel {
  width: min(100%, 54rem);
}
</style>
