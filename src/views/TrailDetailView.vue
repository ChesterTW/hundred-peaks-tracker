<script setup lang="ts">
import { computed } from "vue";
import trails from "../data/trails.json";
import { cumulativeDistances, geometryToCoords } from "../utils/geo";

const props = defineProps<{
  trailId: string;
}>();

const trail = computed(() => {
  return JSON.parse(JSON.stringify(trails)).features.find(
    (feature: any) => feature.id === props.trailId,
  );
});

const distance = computed(() => {
  if (!trail.value) return null;
  const coords = geometryToCoords(trail.value.geometry);
  return cumulativeDistances(coords);
});
</script>

<template>
  <div v-if="trail" class="space-y-4">
    <!-- 路線標題卡 -->
    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ trail.properties?.name }}
      </h1>
      <div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
        <span>總距離: {{ distance?.totalKm.toFixed(2) }} 公里</span>
      </div>
    </div>

    <!-- More Info -->
    <section class="space-y-2">
      <!-- <h2 class="px-1 text-sm font-semibold text-gray-700"></h2> -->
    </section>
  </div>

  <div
    v-else
    class="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm ring-1 ring-gray-100"
  >
    查無此路線
  </div>
</template>
