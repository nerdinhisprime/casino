<script setup lang="ts">
  const user = reactive({
    name: '',
    password: ''
  });
  const fn = async () => {
    await authenticate('signup', user.name, user.password)
  }
</script>

<template>
  <article class="center column">
    <h2>Create account</h2>
    <section style="display: grid; row-gap: 10px">
      <h3>Enter your username</h3>
      <AppInput v-model="user.name" placeholder="user name" />
      <AppInput v-model="user.password" placeholder="user password" />
      <AppButton @click="fn">Submit</AppButton>
    </section>
  </article>
</template>
