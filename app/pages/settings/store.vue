<script setup lang="ts">
const amounts = [320, 640, 1280, 12800];

const {
  data: balanceData,
  pending,
  error,
  refresh,
} = await useFetch<{ balance: number }>('/api/users/me/balance');

const balance = computed(() => balanceData.value?.balance ?? 0);

const loadingAmount = ref<number | null>(null);
const actionError = ref('');

const addBalance = async (amount: number) => {
  if (loadingAmount.value !== null) return;

  loadingAmount.value = amount;
  actionError.value = '';

  try {
    await $fetch('/api/users/me/balance/add', {
      method: 'POST',
      body: { amount },
    });

    await refresh();
  } catch {
    actionError.value = 'Failed to top up the balance.';
  } finally {
    loadingAmount.value = null;
  }
};
</script>

<template>
  <article>
    <h2>Store</h2>

    <p v-if="pending">Balance loading...</p>
    <p v-else-if="error">Failed to load the balance.</p>
    <p v-else>Your balance: {{ balance }} money</p>

    <section class="price--container">
      <AppButton
        v-for="amount in amounts"
        :key="amount"
        :disabled="loadingAmount !== null"
        @click="addBalance(amount)"
      >
        {{ loadingAmount === amount ? 'Loading...' : `${amount} money` }}
      </AppButton>
    </section>

    <p v-if="actionError" class="error">
      {{ actionError }}
    </p>
  </article>
</template>

<style scoped>
.price--container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>

