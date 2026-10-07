<template>
  <button type="button">
    <slot />
  </button>
</template>

<style scoped>
button {
  display: inline-block;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  border-radius: 0;
  box-sizing: border-box;
  color: inherit;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

button:focus {
  outline: none;
}
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
button:active {
  transform: scale(0.98);
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
