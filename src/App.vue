<script setup>
import { onMounted } from "vue";
import { initCity } from "./enter";
onMounted(() => {
  initCity();
});
</script>

<template>
  <canvas id="webgl">浏览器不支持canvas</canvas>
</template>

<style scoped>
</style>
