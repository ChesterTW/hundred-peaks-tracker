<script setup lang="ts">
import { computed } from "vue";
import trails from "../data/trails.json";

const props = defineProps<{
  trailId: string;
}>();

const trail = computed(() => {
  return JSON.parse(JSON.stringify(trails)).features.find(
    (feature: any) => feature.id === props.trailId,
  );
});
</script>

<template>
  <div v-if="trail" class="space-y-4">
    <!-- 路線標題卡 -->
    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ trail.properties?.name }}
      </h1>
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
