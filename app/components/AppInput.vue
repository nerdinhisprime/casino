<script setup lang="ts">
const model = defineModel();
defineProps<{
  placeholder?: string;
  type?: string;
  subtype?: 'file-button' | 'file-card';
}>();
</script>

<template>
  <div
    class="input-wrapper"
    :class="{ 'file-mode': subtype === 'file-card' }"
  >
    <input
      v-model="model"
      :type="type || 'text'"
      :placeholder="placeholder"
      :class="type === 'file' ? 'file-input' : 'text-input'"
    />

    <div v-if="subtype === 'file-card'" class="file-card">
      <span class="plus">+</span>
      <span class="label-text">
        {{ placeholder ? placeholder : 'add a file' }}
      </span>
    </div>
    <p v-else-if="subtype === 'file-button'" class="file-button">
      {{ placeholder ? placeholder : 'add a file' }}
    </p>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: inline-block;
  position: relative;
}

.text-input {
  height: 36px;
  padding: 0 12px;
  background: #1e1e24;
  border: 1px solid #333;
  border-radius: 6px;
  color: #fff;
}

.input-wrapper.file-mode {
  width: 110px;
  height: 110px;
}

.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.file-card {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: #1a1a1e;
  color: #e1e1e6;

  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
  transition: all 0.2s ease;
}

.file-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  --background-color: #2a2a32;
  border-bottom-left-radius: 4px;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.file-card::after {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px dashed #3a3a44;
  pointer-events: none;
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
}

.file-button {
  background-color: #1e1e24;
  color: #fff;
}

.plus {
  font-size: 28px;
  line-height: 1;
  font-weight: 300;
}

.label-text {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
