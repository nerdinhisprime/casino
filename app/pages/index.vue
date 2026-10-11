<script setup lang="ts">
const { fetchUser } = useUser()

await fetchUser()
</script>

<template>
  <NuxtLink to="/slots" class="slots">Слоты</NuxtLink>
</template>
