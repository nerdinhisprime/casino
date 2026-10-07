<script setup lang="ts">
defineProps<{ buttonText?: string }>();
</script>

<template>
  <div class="dropdown">
    <AppButton>{{ buttonText || 'undefined' }}</AppButton>
    <article>
      <section class="dropdown-menu">
        <slot />
      </section>
    </article>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  display: none; /* Было: visibility: hidden */
  flex-direction: column;
  row-gap: 4px;
  position: absolute;
  margin-top: 10px;
  min-width: 100px;
  background-color: #111;
  padding: 4px;
  z-index: 50;
  right: 0;
}

.dropdown:hover .dropdown-menu {
  display: flex; /* Было: visibility: visible */
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -10px;
  width: 100%;
  height: 10px;
}
</style>
