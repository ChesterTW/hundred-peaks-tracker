<script setup lang="ts">
// 1. imports
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import L from "leaflet";
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { usePeakFilter } from "../composables/usePeakFilter";
import { useMapFocus } from "../composables/useMapFocus";
import router from "../router";
import iconUrl from "../assets/location-pin.png";
import trails from "../data/trails.json";
import type { BaseLayer } from "../types";
import { baseLayers } from "../data/baseLayers";

// 2. 常數 / 靜態物件（不會變的：HIDE_THRESHOLD_PX、pinIcon、trailLayer、markerGroup）
const HIDE_THRESHOLD_PX = 40; // 螢幕像素門檻，用於 decluttering，避免 marker 重疊。
const markerGroup = L.layerGroup();
const pinIcon = L.icon({
  iconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32], // 釘尖對準座標
  tooltipAnchor: [0, -32], // y: -32，讓 tooltip 從圖釘頂端往上長，避免遮住圖釘
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
const {
  completion,
  difficulties,
  filteredPeaks,
  difficultyLevels,
  toggleDifficulty,
} = usePeakFilter();
const { focusedPeakId, hoveredPeakId, focusedTrailId } = useMapFocus();

// 4. 模板 ref（mapEl、filterEl）+ map 實例
let map: L.Map;
const filterEl = ref<HTMLElement>();
const mapEl = ref<HTMLElement>();
let currentTileLayer: L.TileLayer;

// 5. reactive 狀態（ref）
const openCompletion = ref(false);
const showTrails = ref(true);
const showPeakName = ref(true);
const openDifficulty = ref(false);
const openLayer = ref(false);
const zoomLevel = ref(0);
const currentLayer = ref<BaseLayer>(baseLayers[0]); // 預設圖層為 CARTO Light Map

// 6. computed（衍生狀態）
const completionLabel = computed(() => {
  if (completion.value === "completed") return "已登頂";
  if (completion.value === "incomplete") return "未登頂";
  return "全部";
});
const difficultyLabel = computed(() =>
  difficulties.value.length === 0 ? "全部" : difficulties.value.join("、"),
);

// 7. watch（副作用）
watch(showTrails, (newVal) => {
  if (newVal) {
    trailLayer.addTo(map);
  } else {
    map.removeLayer(trailLayer);
  }
});

watch(showPeakName, (newVal) => {
  if (newVal) {
    markerGroup.eachLayer((layer: any) => {
      layer.openTooltip();
    });
  } else {
    markerGroup.eachLayer((layer: any) => {
      layer.closeTooltip();
    });
  }
});

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
  }).setView([23.8, 121], 10); // 中心放台灣

  map.zoomControl.setPosition("bottomright");

  applyBaseLayer(currentLayer.value);

  // // 加 OSM 圖磚當底圖
  // L.tileLayer(
  //   // "https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}", // 衛星圖（台灣官方國土測繪中心所拍攝的航照，山區解析度比 Esri 更高）
  //   // "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", // 衛星圖（Esri World Imagery）
  //   // "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // OSM Standard Map
  //   "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", // CARTO Light Map
  //   {
  //     attribution: "© OpenStreetMap | © CARTO",
  //   },
  // ).addTo(map);

  L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);

  trailLayer.addTo(map);
  map.on("zoomend", updateTrailLabels);

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

    L.marker([peak.lat, peak.lng], {
      icon: L.divIcon({
        className: "custom-peak-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 21],
        tooltipAnchor: [12, -10], // tooltip 從三角形右側長出來
        html: `<svg width="24" height="24" viewBox="0 0 24 24">
                  <polygon
                    points="12,3 22,21 2,21"
                    fill="${done ? "#16a34a" : "#9ca3af"}"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>`,
      }),
    })
      .bindTooltip(peak.name, {
        permanent: true,
        direction: "right",
        className: "peak-label",
      })
      .on("click", () => {
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
            :class="{ 'bg-green-100': completion === 'all' }"
            @click="handleCompletionClick('all')"
          >
            全部
          </button>
          <button
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            :class="{ 'bg-green-100': completion === 'completed' }"
            @click="handleCompletionClick('completed')"
          >
            已登頂
          </button>
          <button
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            :class="{ 'bg-green-100': completion === 'incomplete' }"
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
            :class="{ 'bg-green-100': difficulties.length === 0 }"
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

      <button
        @click="showTrails = !showTrails"
        class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded px-3 py-2 text-sm"
      >
        步道：{{ showTrails ? "顯示中" : "隱藏" }}
      </button>

      <button
        @click="showPeakName = !showPeakName"
        class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded px-3 py-2 text-sm"
      >
        山峰名稱：{{ showPeakName ? "顯示中" : "隱藏" }}
      </button>

      <p class="bg-white shadow rounded px-3 py-2 text-sm">
        縮放等級：{{ zoomLevel }}
      </p>

      <div class="relative">
        <!-- 按鈕：顯示目前圖層名稱 -->
        <button
          @click="openLayer = !openLayer"
          class="hover:bg-gray-100 active:bg-gray-200 transition-colors bg-white shadow rounded px-3 py-2 text-sm"
        >
          圖層：{{ currentLayer.name }}
        </button>

        <div
          v-if="openLayer"
          class="absolute mt-1 bg-white shadow rounded p-1 text-sm"
        >
          <button
            v-for="layer in baseLayers"
            :key="layer.id"
            class="hover:bg-gray-100 active:bg-gray-100 block w-full text-left px-2 py-1"
            :class="{ 'bg-green-100': currentLayer.id === layer.id }"
            @click="
              applyBaseLayer(layer);
              openLayer = false;
              currentLayer = layer;
            "
          >
            {{ layer.name }}
          </button>
        </div>
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
