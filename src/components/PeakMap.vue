<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import L from "leaflet";
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { usePeakFilter } from "../composables/usePeakFilter";

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);
const {
  completion,
  difficulties,
  filteredPeaks,
  difficultyLevels,
  toggleDifficulty,
} = usePeakFilter();

const openCompletion = ref(false);

// 按鈕上要顯示目前選了什麼
const completionLabel = computed(() => {
  if (completion.value === "completed") return "已登頂";
  if (completion.value === "incomplete") return "未登頂";
  return "全部";
});

const openDifficulty = ref(false);
const difficultyLabel = computed(() =>
  difficulties.value.length === 0 ? "全部" : difficulties.value.join("、"),
);

const markerGroup = L.layerGroup();

const mapEl = ref<HTMLElement>();
let map: L.Map;

watch(filteredPeaks, () => {
  drawmarkers();
});

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

  map.zoomControl.setPosition("bottomright");

  // 加 OSM 圖磚當底圖
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap | © CARTO",
    },
  ).addTo(map);

  markerGroup.addTo(map);
  drawmarkers();
});

onUnmounted(() => {
  map?.remove();
});

function drawmarkers() {
  markerGroup.clearLayers();

  filteredPeaks.value.forEach((peak) => {
    const done = completedPeakIds.value.has(peak.id);

    L.circleMarker([peak.lat, peak.lng], {
      radius: done ? 7 : 5,
      fillColor: done ? "#16a34a" : "#9ca3af",
      fillOpacity: 1,
      color: done ? "#d0ecda" : "#fff",
      weight: done ? 5 : 1,
    })
      .bindTooltip(peak.name, { permanent: true, direction: "top" })
      .addTo(markerGroup);
  });
}
</script>

<template>
  <div class="relative">
    <div ref="mapEl" class="h-screen w-full"></div>
    <div class="absolute top-4 left-4 z-[1000] flex gap-2">
      <div class="relative">
        <button
          @click="openCompletion = !openCompletion"
          class="bg-white shadow rounded px-3 py-2 text-sm"
        >
          完成狀態：{{ completionLabel }}
        </button>

        <div
          v-if="openCompletion"
          class="absolute mt-1 bg-white shadow rounded p-1 text-sm"
        >
          <button
            class="block w-full text-left px-2 py-1"
            @click="((completion = 'all'), (openCompletion = !openCompletion))"
          >
            全部
          </button>
          <button
            class="block w-full text-left px-2 py-1"
            @click="
              ((completion = 'completed'), (openCompletion = !openCompletion))
            "
          >
            已登頂
          </button>
          <button
            class="block w-full text-left px-2 py-1"
            @click="
              ((completion = 'incomplete'), (openCompletion = !openCompletion))
            "
          >
            未登頂
          </button>
        </div>
      </div>

      <div class="relative">
        <button
          @click="openDifficulty = !openDifficulty"
          class="bg-white shadow rounded px-3 py-2 text-sm"
        >
          難度：{{ difficultyLabel }}
        </button>

        <div
          v-if="openDifficulty"
          class="absolute mt-1 bg-white shadow rounded p-1 text-sm"
        >
          <button
            class="block w-full text-left px-2 py-1"
            @click="difficulties = []"
          >
            全部
          </button>

          <button
            v-for="level in difficultyLevels"
            :key="level"
            class="block w-full text-left px-2 py-1"
            :class="{ 'bg-green-100': difficulties.includes(level) }"
            @click="toggleDifficulty(level)"
          >
            {{ difficulties.includes(level) ? "✓" : "　" }} 難度 {{ level }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
