<script setup lang="ts">
import { ref } from 'vue';

const dialogRef = ref<HTMLDialogElement | null>(null);
const removeFocus = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

defineExpose({
  open: () => dialogRef.value?.showModal(),
  close: () => dialogRef.value?.close(),
});
</script>

<template>
  <dialog
    ref="dialogRef"
    @click="
      dialogRef?.close();
      removeFocus();
    "
  >
    <div @click.stop>
      <slot />
    </div>
  </dialog>
</template>
