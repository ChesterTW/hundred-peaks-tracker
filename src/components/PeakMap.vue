<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import L from "leaflet";

const mapEl = ref<HTMLElement>();
let map: L.Map;

onMounted(() => {
  if (!mapEl.value) return;

  // 初始化地圖：中心放台灣、zoom 7 看全島
  map = L.map(mapEl.value).setView([23.8, 121], 7);

  // 加 OSM 圖磚當底圖
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);
});

onUnmounted(() => {
  map?.remove(); // 離開頁面清理，避免記憶體洩漏
});
</script>

<template>
  <div ref="mapEl" class="h-[500px] w-full rounded-lg"></div>
</template>
