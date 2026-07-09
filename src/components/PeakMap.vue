<script setup lang="ts">
// 1. imports
import { onMounted, onUnmounted, ref, watch } from "vue";
import L from "leaflet";
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { usePeakFilter } from "../composables/usePeakFilter";
import { useMapFocus } from "../composables/useMapFocus";
import router from "../router";
import trails from "../data/trails.json";
import type { BaseLayer, VisibilityState } from "../types";
import { baseLayers } from "../data/baseLayers";
import { peakIconHtml } from "../utils/peakIcon";
import { Layers, Filter } from "@lucide/vue";
import MapDisplayPanel from "./home/MapDisplayPanel.vue";
import MapVisibilityPanel from "./home/MapVisibilityPanel.vue";

// 2. 常數 / 靜態物件（不會變的：HIDE_THRESHOLD_PX、selectedIcon、trailLayer、markerGroup）
const HIDE_THRESHOLD_PX = 40; // 螢幕像素門檻，用於 decluttering，避免 marker 重疊。
const markerGroup = L.layerGroup();
const selectedIcon = L.divIcon({
  className: "custom-peak-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 21],
  tooltipAnchor: [12, -10], // tooltip 從三角形右側長出來
  html: peakIconHtml("var(--color-primary-500)"),
});
const trailLayer = L.geoJSON(trails as any, {
  style: {
    color: "#16a34a", // Taro Todo：綠線的綠色可以再調整，讓它更明顯一點。
    weight: 2,
    opacity: 0.6,
  },

  // 過濾掉資料裡夾帶的 Marker
  filter: (feature) => {
    return (
      feature.geometry.type === "LineString" ||
      feature.geometry.type === "MultiLineString"
    );
  },

  // 綁定步道名稱 tooltip
  onEachFeature: (feature: any, layer) => {
    const name = feature.properties?.name;
    if (!name) return;

    const network = feature.properties?.network;
    let tier = "minor"; // 預設重要性為「次要」

    if (network === "iwn" || network === "nwn") {
      // iwn / nwn 是「國家級」步道，重要性最高。
      tier = "major";
    } else if (network === "rwn") {
      // rwn 是「區域級」步道，重要性中等。
      tier = "mid";
    }

    // 綁定 tooltip
    layer.bindTooltip(name, {
      permanent: true,
      direction: "center",
      className: `trail-label trail-label--${tier}`,
    });

    // 綁定點擊事件
    layer.on("click", () => {
      focusedTrailId.value = feature.id;
      // todo: 記得刪 log
      console.log("Clicked trail:", feature.id, feature.properties?.name);
    });
  },
});

// 3. store / composable
const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);
const { filteredPeaks } = usePeakFilter();
const { focusedPeakId, hoveredPeakId, focusedTrailId } = useMapFocus();

// 4. 模板 ref + map 實例
let map: L.Map;
const mapEl = ref<HTMLElement>();
const bottomControlsEl = ref<HTMLElement>();
let currentTileLayer: L.TileLayer;

// 5. reactive 狀態（ref）
const zoomLevel = ref(0);
const currentLayer = ref<BaseLayer>(baseLayers[0]);
const visibility = ref<VisibilityState>({
  completedMarkers: true,
  incompleteMarkers: true,
  peakNames: false,
  trails: false,
  trailNames: false,
});
const activePanel = ref<"layer" | "visibility" | null>(null);

// 7. watch（副作用）
watch(
  () => visibility.value.trails,
  (newVal) => {
    if (newVal) {
      trailLayer.addTo(map);
    } else {
      map.removeLayer(trailLayer);
    }
  },
);

watch(
  () => visibility.value.trailNames,
  (newVal) => {
    map.getContainer().classList.toggle("hide-trail-labels", !newVal);
  },
);

watch(
  () => [
    visibility.value.completedMarkers,
    visibility.value.incompleteMarkers,
    visibility.value.peakNames,
  ],
  () => {
    drawmarkers();
  },
);

watch([filteredPeaks, completedPeakIds], () => {
  drawmarkers();
});

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

watch(focusedTrailId, (newId) => {
  trailLayer.eachLayer((layer: any) => {
    const id = layer.feature.id;
    if (id === newId) {
      layer.setStyle({ color: "#f97316", weight: 4, opacity: 1 });
    } else {
      trailLayer.resetStyle(layer);
    }
  });
});
watch(currentLayer, (newLayer) => {
  applyBaseLayer(newLayer);
});

// 8. 生命週期（onMounted / onUnmounted）
onMounted(() => {
  if (!mapEl.value) return;

  // 台灣的「西南角」與「東北角」經緯度座標，用於建立 Bound，避免用戶滑出台灣區域。
  const taiwanBounds = L.latLngBounds(
    [21.8, 119.3], // 西南
    [25.4, 125.1], // 東北
  );

  // 初始化地圖
  map = L.map(mapEl.value, {
    maxBounds: taiwanBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 7,
    zoomControl: false,
  }).setView([23.8, 121], 10); // 中心放台灣

  applyBaseLayer(currentLayer.value);

  if (visibility.value.trails) {
    trailLayer.addTo(map);
  }
  map.on("zoomend", updateTrailLabels);
  map.on("click", () => {
    activePanel.value = null;
  });

  markerGroup.addTo(map);
  drawmarkers();

  if (bottomControlsEl.value) {
    L.DomEvent.disableClickPropagation(bottomControlsEl.value);
    L.DomEvent.disableScrollPropagation(bottomControlsEl.value);
  }
});

onUnmounted(() => {
  map?.remove();
});

// 9. function
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
      L.marker([peak.lat, peak.lng], { icon: selectedIcon })
        .bindTooltip(peak.name, {
          permanent: true,
          direction: "right",
          className: "peak-label",
        })
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

    if (done && !visibility.value.completedMarkers) return;
    if (!done && !visibility.value.incompleteMarkers) return;

    L.marker([peak.lat, peak.lng], {
      icon: L.divIcon({
        className: "custom-peak-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 21],
        tooltipAnchor: [12, -10], // tooltip 從三角形右側長出來
        html: peakIconHtml(done ? "#16a34a" : "#9ca3af"),
      }),
    })
      .bindTooltip(peak.name, {
        permanent: visibility.value.peakNames,
        direction: "right",
        className: "peak-label",
      })
      .on("click", () => {
        focusedPeakId.value = peak.id;
      })
      .addTo(markerGroup);
  });
}

function updateTrailLabels() {
  zoomLevel.value = map.getZoom();

  const z = map.getZoom();
  const c = map.getContainer().classList;
  c.toggle("show-major", z >= 9); // 主線：較早出現
  c.toggle("show-mid", z >= 11); // 中線：放大一點
  c.toggle("show-minor", z >= 13); // 次線：放更大才出現
}

function applyBaseLayer(layer: BaseLayer) {
  if (currentTileLayer) {
    map.removeLayer(currentTileLayer);
  }

  currentTileLayer = L.tileLayer(layer.url, {
    attribution: layer.attribution,
    maxZoom: layer.maxZoom || 19,
  }).addTo(map);
}

function handleLayerChange(id: string) {
  const found = baseLayers.find((l) => l.id === id);
  if (found) currentLayer.value = found;
}
</script>

<template>
  <div class="relative">
    <div ref="mapEl" class="h-screen w-full"></div>

    <!-- 底圖切換 + 顯示控制 -->
    <div
      ref="bottomControlsEl"
      class="absolute flex flex-col gap-3 right-7 bottom-7 z-1000"
    >
      <div class="relative">
        <button
          @click="activePanel = activePanel === 'layer' ? null : 'layer'"
          class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded-lg text-sm"
        >
          <Layers class="m-3 text-neutral-700" :size="24" />
        </button>
        <MapDisplayPanel
          v-if="activePanel === 'layer'"
          :modelValue="currentLayer.id"
          @update:modelValue="handleLayerChange"
          class="absolute bottom-0 right-full mr-6"
        />
      </div>
      <div class="relative">
        <button
          @click="
            activePanel = activePanel === 'visibility' ? null : 'visibility'
          "
          class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded-lg text-sm"
        >
          <Filter class="m-3 text-neutral-700" :size="24" />
        </button>
        <MapVisibilityPanel
          v-if="activePanel === 'visibility'"
          :modelValue="visibility"
          @update:modelValue="visibility = $event"
          class="absolute bottom-0 right-full mr-6"
        />
      </div>
    </div>
  </div>
</template>

<style>
.leaflet-tooltip.trail-label {
  background: #fff;
  border: 1px solid #16a34a;
  border-radius: 4px;
  padding: 1px 6px;
  color: #15803d;
  font-size: 8px;
  font-weight: 600;
  box-shadow: none;
}

/* 拿掉預設的三角箭頭 */
.leaflet-tooltip.trail-label::before {
  display: none;
}

/* 預設全部藏起來 */
.leaflet-tooltip.trail-label {
  display: none;
}

/* 容器有對應 class 時，才放出該層級 */
.show-major .trail-label--major {
  display: block;
}
.show-mid .trail-label--mid {
  display: block;
}
.show-minor .trail-label--minor {
  display: block;
}

.hide-trail-labels .trail-label {
  display: none !important;
}

.custom-peak-icon {
  background: transparent;
  border: none;
}
.leaflet-tooltip.peak-label::before {
  display: none;
}
.leaflet-tooltip.peak-label {
  /* 框本身 */
  background: #fff;
  border-radius: 4px;
  padding: 1px 6px;

  /* 文字(會 cascade 給裡面的字) */
  font-size: 12px;
  font-weight: 600;
}
</style>
