<script setup lang="ts">
  const user = reactive({
    name: '',
    password: '',
    status: '',
  });
  const fn = async () => {
    user.status = await authenticate('login', user.name, user.password);
  }
</script>

<template>
  <article class="center column">
    <h2>Log in</h2>
    <section class="column">
      <h3>Enter your username</h3>
      <AppInput v-model="user.name" placeholder="user name" />
      <AppInput v-model="user.password" placeholder="user password" />
      <AppButton @click="fn">Submit</AppButton>
    </section>
  </article>
</template>

<style scoped></style>
