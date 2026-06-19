<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import L from "leaflet";
import { peaks } from "../data/peaks";

const mapEl = ref<HTMLElement>();
let map: L.Map;

onMounted(() => {
  if (!mapEl.value) return;

  // 台灣的「西南角」與「東北角」經緯度座標，用於建立 Bound，避免用戶滑出台灣區域。
  const taiwanBounds = L.latLngBounds(
    [21.8, 119.3], // 西南
    [25.4, 122.1], // 東北
  );

  // 初始化地圖
  map = L.map(mapEl.value, {
    maxBounds: taiwanBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 7,
  }).setView([23.8, 121], 7); // 中心放台灣

  // 加 OSM 圖磚當底圖
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap | © CARTO",
    },
  ).addTo(map);

  // 添加
  peaks.forEach((peak) => {
    L.circleMarker([peak.lat, peak.lng], {
      radius: 5,
    })
      .bindTooltip(peak.name, { permanent: true, direction: "top" })
      .addTo(map);
  });
});

onUnmounted(() => {
  map?.remove();
});
</script>

<template>
  <div ref="mapEl" class="h-[1000px] w-full rounded-lg"></div>
</template>
