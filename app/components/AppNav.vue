<script setup lang="ts">
const { user } = useUser()

const isGuest = computed(() => user.value?.is_guest)
</script>

<template>
  <nav class="navigator">
    <NuxtLink to="/">Casino</NuxtLink>
      <div>
        <AppDropDown v-if="isGuest" buttonText="Guest">
          <NuxtLink to="/signup">signup</NuxtLink>
          <NuxtLink to="/login">login</NuxtLink>
        </AppDropDown>
        <AppDropDown v-else-if="user" @click="console.log('chlen')" :buttonText="user.username || 'options'">
          <NuxtLink to="/settings">Settings</NuxtLink>
        </AppDropDown>
    </div>
  </nav>
</template>

<style scoped>
.username {
  padding-right: 12px;
  color: wheat;
}
.navigator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  gap: 12px;
  color: white;
  background: #222;
  border-bottom: 2px solid #8bbaff;
}
a {
  text-decoration: none;
}
</style>
