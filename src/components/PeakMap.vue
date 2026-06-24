<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import L from "leaflet";
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { usePeakFilter } from "../composables/usePeakFilter";
import { useMapFocus } from "../composables/useMapFocus";
import router from "../router";
import iconUrl from "../assets/location-pin.png";

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

const filterEl = ref<HTMLElement>();

const mapEl = ref<HTMLElement>();
let map: L.Map;

watch(filteredPeaks, () => {
  drawmarkers();
});

const { focusedPeakId, hoveredPeakId } = useMapFocus();

const pinIcon = L.icon({
  iconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32], // 釘尖對準座標
  tooltipAnchor: [0, -32], // y: -32，讓 tooltip 從圖釘頂端往上長，避免遮住圖釘
});

const HIDE_THRESHOLD_PX = 40; // 螢幕像素門檻，用於 decluttering，避免 marker 重疊。

watch(focusedPeakId, (newId) => {
  const peak = filteredPeaks.value.find((p) => p.id === Number(newId));

  if (peak) {
    map.flyTo([peak.lat, peak.lng]);
    drawmarkers();
  }
});

watch(hoveredPeakId, () => {
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
  }).setView([23.8, 121], 10); // 中心放台灣

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

  if (filterEl.value) {
    L.DomEvent.disableClickPropagation(filterEl.value);
    L.DomEvent.disableScrollPropagation(filterEl.value);
  }
});

onUnmounted(() => {
  map?.remove();
});

function drawmarkers() {
  markerGroup.clearLayers();

  const hoveredPeak = filteredPeaks.value.find(
    (p) => p.id === hoveredPeakId.value,
  );
  const hoveredPoint = hoveredPeak
    ? map.project([hoveredPeak.lat, hoveredPeak.lng])
    : null;

  const focusedPeak = filteredPeaks.value.find(
    (p) => p.id === focusedPeakId.value,
  );
  const focusedPoint = focusedPeak
    ? map.project([focusedPeak.lat, focusedPeak.lng])
    : null;

  filteredPeaks.value.forEach((peak) => {
    // 用戶所 hover 的山峰
    if (peak.id === hoveredPeakId.value || peak.id === focusedPeakId.value) {
      L.marker([peak.lat, peak.lng], { icon: pinIcon })
        .bindTooltip(peak.name, { permanent: true, direction: "top" })
        .on("click", () => {
          router.push({ name: "peak-detail", params: { id: peak.id } });
        })
        .addTo(markerGroup);
      return;
    }

    // 離 hover 山峰太近的 marker 就跳過不畫（decluttering）
    if (hoveredPoint) {
      const point = map.project([peak.lat, peak.lng]);
      if (hoveredPoint.distanceTo(point) < HIDE_THRESHOLD_PX) return;
    }

    if (focusedPoint) {
      const point = map.project([peak.lat, peak.lng]);
      if (focusedPoint.distanceTo(point) < HIDE_THRESHOLD_PX) return;
    }

    const done = completedPeakIds.value.has(peak.id);

    L.circleMarker([peak.lat, peak.lng], {
      radius: done ? 7 : 5,
      fillColor: done ? "#16a34a" : "#9ca3af",
      fillOpacity: 1,
      color: done ? "#d0ecda" : "#fff",
      weight: done ? 5 : 1,
    })
      .bindTooltip(peak.name, { permanent: true, direction: "top" })
      .on("click", () => {
        router.push({ name: "peak-detail", params: { id: peak.id } });
        focusedPeakId.value = peak.id;
      })
      .addTo(markerGroup);
  });
}

function handleCompletionClick(input: string) {
  openCompletion.value = !openCompletion.value;

  if (input === "all") {
    completion.value = "all";
  } else if (input === "completed") {
    completion.value = "completed";
  } else {
    completion.value = "incomplete";
  }
}
</script>

<template>
  <div class="relative">
    <div ref="mapEl" class="h-screen w-full"></div>
    <div ref="filterEl" class="absolute top-4 left-4 z-1000 flex gap-2">
      <div class="relative">
        <button
          @click="openCompletion = !openCompletion"
          class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded px-3 py-2 text-sm"
        >
          完成狀態：{{ completionLabel }}
        </button>

        <div
          v-if="openCompletion"
          class="absolute mt-1 bg-white shadow rounded p-1 text-sm"
        >
          <button
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            @click="handleCompletionClick('all')"
          >
            全部
          </button>
          <button
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            @click="handleCompletionClick('completed')"
          >
            已登頂
          </button>
          <button
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            @click="handleCompletionClick('incomplete')"
          >
            未登頂
          </button>
        </div>
      </div>

      <div class="relative">
        <button
          @click="openDifficulty = !openDifficulty"
          class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded px-3 py-2 text-sm"
        >
          難度：{{ difficultyLabel }}
        </button>

        <div
          v-if="openDifficulty"
          class="absolute mt-1 bg-white shadow rounded p-1 text-sm"
        >
          <button
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            @click="difficulties = []"
          >
            全部
          </button>

          <button
            v-for="level in difficultyLevels"
            :key="level"
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
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
