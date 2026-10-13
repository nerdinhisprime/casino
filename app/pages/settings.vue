<script setup lang="ts"></script>

<template>
  <div>
    <h2>{{ user?.username }}</h2>
    <span>Your personal account</span>
  </div>
  <div class="settings-container">
    <aside class="settings-sedebar">
      <nav class="column">
        <NuxtLink to="/settings">Account</NuxtLink>
        <NuxtLink to="/settings/history">History</NuxtLink>
        <NuxtLink to="/settings/store">Store</NuxtLink>
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
  grid-template-columns: 240px 1fr;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}
.settings-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
