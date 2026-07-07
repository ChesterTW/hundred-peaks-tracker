<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useTripStore } from "../../stores/tripStore";
import { peaks } from "../../data/peaks";

const { completedCount, completedPeakIds } = storeToRefs(useTripStore());

const rangeStats = computed(() => {
  const map = new Map<string, { total: number; completed: number }>();

  for (const peak of peaks) {
    if (!map.has(peak.range)) map.set(peak.range, { total: 0, completed: 0 });

    const s = map.get(peak.range)!;
    s.total++;

    if (completedPeakIds.value.has(peak.id)) s.completed++;
  }

  return [...map.entries()].map(([name, s]) => ({ name, ...s }));
});
</script>

<template>
  <div
    class="backdrop-blur-md bg-white/75 border border-white/65 rounded-xl shadow-xl flex flex-col gap-4 w-80 px-5 py-4 overflow-hidden"
  >
    <p class="text-xs font-medium text-neutral-400">百岳完登進度</p>

    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-3">
        <div class="flex items-baseline gap-2">
          <span class="text-5xl font-bold text-neutral-900 leading-15">{{
            completedCount
          }}</span>
          <span class="text-base font-medium text-neutral-400">/ 100 座</span>
        </div>
        <div class="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-500 rounded-full transition-all duration-500"
            :style="{ width: completedCount + '%' }"
          />
        </div>
      </div>

      <div class="h-px bg-neutral-200" />

      <div class="flex flex-col gap-3">
        <div v-for="r in rangeStats" :key="r.name" class="flex flex-col gap-1">
          <p class="text-xs font-medium text-neutral-700">
            {{ r.name }}：{{ r.completed }} / {{ r.total }}
          </p>
          <div class="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-success rounded-full transition-all duration-500"
              :style="{
                width: r.total > 0 ? (r.completed / r.total) * 100 + '%' : '0%',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
