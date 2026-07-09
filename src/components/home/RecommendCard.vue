<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ChevronRight, PanelRightClose } from "@lucide/vue";
import { useTripStore } from "../../stores/tripStore";
import { peaks } from "../../data/peaks";
import { useRouter } from "vue-router";
import { useMapFocus } from "../../composables/useMapFocus";

const router = useRouter();
const emit = defineEmits<{ close: [] }>();

const { completedPeakIds } = storeToRefs(useTripStore());
const { focusedPeakId } = useMapFocus();

// 推薦順序：同風險等級先提升體能，再提升風險
const GROUP_ORDER: [number, number][] = [
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [2, 3],
  [3, 3],
  [4, 3],
  [4, 4],
  [5, 4],
];

const groups = computed(() =>
  GROUP_ORDER.map(([physical, risk]) => ({
    physical,
    risk,
    peaks: peaks.filter(
      (p) => p.rating.physical === physical && p.rating.risk === risk,
    ),
  })).filter((g) => g.peaks.length > 0),
);

const currentGroup = computed(
  () =>
    groups.value.find((g) =>
      g.peaks.some((p) => !completedPeakIds.value.has(p.id)),
    ) ?? groups.value[groups.value.length - 1],
);

const nextGroup = computed(() => {
  const idx = groups.value.indexOf(currentGroup.value);
  return groups.value[idx + 1] ?? null;
});

const unfinishedPeaks = computed(() =>
  currentGroup.value.peaks.filter((p) => !completedPeakIds.value.has(p.id)),
);

const completedInGroup = computed(
  () => currentGroup.value.peaks.length - unfinishedPeaks.value.length,
);
</script>

<template>
  <div
    class="backdrop-blur-md bg-white/75 border border-white/65 rounded-xl shadow-xl flex flex-col gap-3 w-75 px-5 py-4 overflow-hidden"
  >
    <!-- Header -->
    <div class="flex items-end justify-between">
      <p class="text-base font-medium text-neutral-900">下一座百岳</p>

      <!-- 收合 -->
      <div class="flex justify-end -mt-1 -mr-1">
        <button
          class="flex items-center justify-center rounded-full hover:bg-neutral-200 active:bg-neutral-300 transition-colors cursor-pointer"
          @click="emit('close')"
        >
          <PanelRightClose :size="16" class="m-2 text-neutral-400" />
        </button>
      </div>
    </div>

    <!-- 目前組別 -->
    <div
      class="bg-white flex items-center justify-between px-3 py-2 rounded-md"
    >
      <div class="flex flex-col">
        <span class="text-xs text-neutral-400">目前組別</span>
        <span class="text-base font-medium text-primary-500">
          體能 LV.{{ currentGroup.physical }} · 風險 LV.{{ currentGroup.risk }}
        </span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-xs text-neutral-400">已完成</span>
        <span class="text-base font-bold text-primary-500">
          {{ completedInGroup }} / {{ currentGroup.peaks.length }}
        </span>
      </div>
    </div>

    <!-- 推薦山峰列表 -->
    <div class="flex flex-col gap-1">
      <div
        v-for="peak in unfinishedPeaks.slice(0, 3)"
        :key="peak.id"
        class="flex items-center justify-between px-3 py-1 rounded-lg hover:bg-neutral-200 active:bg-neutral-300 transition-colors cursor-pointer"
        @click="focusedPeakId = peak.id"
      >
        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium text-neutral-900">{{ peak.name }}</p>
          <div class="flex items-center gap-2">
            <span class="text-xs text-neutral-400">{{ peak.range }}</span>
            <div class="w-px h-3 bg-neutral-400" />
            <span class="text-xs text-neutral-400"
              >{{ peak.elevation.toLocaleString() }} m</span
            >
          </div>
        </div>
        <button class="flex items-center justify-center rounded-full">
          <ChevronRight :size="16" class="m-2 text-neutral-400" />
        </button>
      </div>
    </div>

    <button
      class="px-3 self-start text-xs text-neutral-400 underline hover:text-neutral-700 transition-colors cursor-pointer"
      @click="router.push('/peaks')"
    >
      查看全部
    </button>
  </div>
</template>
