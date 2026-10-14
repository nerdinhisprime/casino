<template>
  <div class="site-shell">
    <AppNav />

    <div class="site-content">
      <slot />
    </div>

    <footer class="site-footer"></footer>
  </div>
</template>

<style scoped>
.site-shell {
  width: min(900px, calc(100% - 32px));
  margin: 40px auto;
  border: 2px solid #a9c9f4;
  border-radius: 5px;
  background: var(--retro-panel);
  box-shadow:
    0 0 0 2px #183b78,
    0 12px 40px rgba(0, 0, 0, 0.65);
}

.site-content {
  padding: 20px;
  background-color: wheat;
}

.site-footer {
  padding: 12px;
  text-align: center;
  color: white;
  background: linear-gradient(#222);
  border-top: 2px solid #8bbaff;
  font-size: 12px;
}

@media (max-width: 600px) {
  .site-shell {
    width: calc(100% - 16px);
    margin: 8px auto;
  }

  .site-content {
    padding: 10px;
  }

  body {
    background-attachment: scroll;
  }
}

@media (max-width: 480px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

