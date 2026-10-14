<script setup lang="ts">
  const { user } = useUser()
</script>

<template>
  <div>
    <h2>{{ user?.username }}</h2>
    <span>Your personal account</span>
  </div>
  <div class="settings-container">
    <aside class="settings-sidebar">
      <nav class="column">
        <NuxtLink to="/settings" class="button--default">Account</NuxtLink>
        <NuxtLink to="/settings/history" class="button--default">History</NuxtLink>
        <NuxtLink to="/settings/store" class="button--default">Store</NuxtLink>
      </nav>
    </aside>
    <article class="settings-content">
      <section>
        <NuxtPage />
      </section>
    </article>
  </div>
</template>

<style scoped>
.settings-container {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}
.settings-sidebar {
}
.settings-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
