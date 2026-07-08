<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useTripStore } from "../../stores/tripStore";
import { peaks } from "../../data/peaks";

const emit = defineEmits(["openAddTripModal"]);
const { activeTrips } = storeToRefs(useTripStore());

const recentTrips = computed(() =>
  [...activeTrips.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3),
);

function peakNames(peakIds: number[]): string {
  return peakIds
    .map((id) => peaks.find((p) => p.id === id)?.name ?? "")
    .filter(Boolean)
    .join("、");
}

function formatDate(date: string): string {
  return date.replace(/-/g, "・");
}
</script>

<template>
  <div
    class="backdrop-blur-md bg-white/75 border border-white/65 rounded-xl shadow-xl flex flex-col gap-3 w-80 px-5 py-4 overflow-hidden"
  >
    <p class="text-base font-medium text-neutral-900">最近行程</p>

    <div class="flex flex-col gap-1">
      <template v-if="recentTrips.length > 0">
        <div v-for="trip in recentTrips" :key="trip.id" class="flex flex-col">
          <span class="text-xs text-neutral-400">{{
            formatDate(trip.date)
          }}</span>
          <span class="text-sm font-medium text-neutral-700">{{
            peakNames(trip.peakIds)
          }}</span>
        </div>
      </template>
      <p v-else class="text-sm text-neutral-400">尚無行程紀錄</p>
    </div>

    <div class="h-px bg-neutral-200" />

    <button
      class="w-full h-10 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
      @click="emit('openAddTripModal')"
    >
      新增行程
    </button>
  </div>
</template>
