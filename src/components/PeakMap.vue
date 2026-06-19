<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import L from "leaflet";

const mapEl = ref<HTMLElement>();
let map: L.Map;

onMounted(() => {
  if (!mapEl.value) return;

  // 台灣的西南角與東北角經緯度座標
  const taiwanBounds = L.latLngBounds(
    [21.8, 119.3], // 西南
    [25.4, 122.1], // 東北
  );

  // 初始化地圖：中心放台灣、minZoom 7 看全島
  map = L.map(mapEl.value, {
    maxBounds: taiwanBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 7,
  }).setView([23.8, 121], 7);

  // 加 OSM 圖磚當底圖
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap",
    },
  ).addTo(map);
});

onUnmounted(() => {
  map?.remove(); // 離開頁面清理，避免記憶體洩漏
});
</script>

<template>
  <div ref="mapEl" class="h-[500px] w-full rounded-lg"></div>
</template>
