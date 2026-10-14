<script setup lang="ts">
const { user } = useUser()
const { logout } = useAuth()

const isGuest = computed(() => user.value?.is_guest)

const balance = ref<number | null>(null)
let es: EventSource | null = null

onMounted(() => {
  es = new EventSource('/api/events')
  es.onmessage = (e) => {
    balance.value = JSON.parse(e.data).balance
  }
})

onBeforeUnmount(() => es?.close())
</script>

<template>
  <nav class="navigator">
    <NuxtLink to="/">Casino</NuxtLink>
      <div>
        <AppDropDown v-if="isGuest" buttonText="Guest">
          <NuxtLink to="/signup">signup</NuxtLink>
          <NuxtLink to="/login">login</NuxtLink>
        </AppDropDown>
        <div v-else-if="user" class="user-data">
          <AppDropDown :buttonText="`${user.username} ${balance ?? ''}` || 'options'">
            <NuxtLink to="/settings">Settings</NuxtLink>
            <AppButton @click="logout">Log out</AppButton>
          </AppDropDown>
        </div>
    </div>
  </nav>
</template>

<style scoped>
.user-data {
  display: flex;
  column-gap: 8px;
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
