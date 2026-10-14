<script setup lang="ts">
interface Spin {
  id: string;
  reward_id: string;
  win_amount: number;
  created_at: string;
  bet: number;
}

interface HistoryResponse {
  items: Spin[];
  hasMore: boolean;
  nextOffset: number;
}

const limit = 20;

const { data, pending, error } = await useFetch<HistoryResponse>(
  '/api/users/me/history',
  {
    query: { limit, offset: 0 },
  },
);

const history = ref<Spin[]>(data.value?.items ?? []);
const hasMore = ref(data.value?.hasMore ?? false);
const nextOffset = ref(data.value?.nextOffset ?? 0);
const loadingMore = ref(false);
const loadMoreError = ref('');

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;

  loadingMore.value = true;
  loadMoreError.value = '';

  try {
    const result = await $fetch<HistoryResponse>(
      '/api/users/me/history',
      {
        query: {
          limit,
          offset: nextOffset.value,
        },
      },
    );

    history.value.push(...result.items);
    hasMore.value = result.hasMore;
    nextOffset.value = result.nextOffset;
  } catch {
    loadMoreError.value = 'Не удалось загрузить историю.';
  } finally {
    loadingMore.value = false;
  }
};
</script>

<template>
  <article class="history-container">
    <h3>Spins story</h3>
    <section>
      <p v-if="pending">Loading history...</p>
      <p v-else-if="error" class="error">Не удалось загрузить историю.</p>
      <table v-else-if="history && history.length" class="spins-table">
        <thead>
          <tr>
            <th>Prize</th>
            <th>Winnings</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="spin in history" :key="spin.id">
            <td>
              <span :class="['badge', spin.reward_id]">
                {{ spin.reward_id }}
              </span>
            </td>
            <td>{{ spin.win_amount }}</td>
            <td>{{ new Date(spin.created_at).toLocaleString() }}</td>
          </tr>
        </tbody>
        <AppButton
          v-if="hasMore"
          :disabled="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? 'Loading...' : 'Loading more...' }}
        </AppButton>

        <p v-if="loadMoreError" class="error">
          {{ loadMoreError }}
        </p>
      </table>
      <p v-else>Empty</p>
    </section>
  </article>
</template>
