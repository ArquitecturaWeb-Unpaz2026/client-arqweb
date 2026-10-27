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
  background:
    radial-gradient(circle at 15% 0%, rgba(45, 212, 191, 0.12), transparent 42%),
    radial-gradient(circle at 85% 100%, rgba(148, 163, 184, 0.18), transparent 40%),
    var(--app-bg-auth);
}

.auth-layout__panel {
  width: min(100%, 26rem);
}
</style>
