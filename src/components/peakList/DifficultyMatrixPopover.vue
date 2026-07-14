<script setup lang="ts">
import { computed } from "vue";
import type { Peak } from "../../types";

const props = defineProps<{
  peaks: Peak[];
  selected: { physical: number; risk: number } | null;
}>();

const emit = defineEmits<{
  select: [physical: number, risk: number];
  clear: [];
}>();

const physicalLevels = [1, 2, 3, 4, 5];
const riskLevels = [4, 3, 2, 1];

const counts = computed(() => {
  const map = new Map<string, number>();
  for (const peak of props.peaks) {
    const key = `${peak.rating.physical}-${peak.rating.risk}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
});

const maxCount = computed(() => {
  let max = 0;
  for (const count of counts.value.values()) {
    if (count > max) max = count;
  }
  return max;
});

function getCount(physical: number, risk: number) {
  return counts.value.get(`${physical}-${risk}`) ?? 0;
}

function isSelected(physical: number, risk: number) {
  return props.selected?.physical === physical && props.selected?.risk === risk;
}

function cellClass(physical: number, risk: number) {
  const count = getCount(physical, risk);

  if (count === 0) {
    return "bg-neutral-100 text-neutral-300 cursor-not-allowed";
  }

  const ratio = count / maxCount.value;
  const heatClass =
    ratio <= 1 / 3
      ? "bg-primary-50 hover:bg-primary-100"
      : ratio <= 2 / 3
        ? "bg-primary-100 hover:bg-primary-300"
        : "bg-primary-300 hover:bg-primary-300";

  const ring = isSelected(physical, risk) ? "ring-2 ring-primary-600" : "";

  return `${heatClass} text-neutral-700 cursor-pointer ${ring}`;
}

function handleSelect(physical: number, risk: number) {
  if (getCount(physical, risk) === 0) return;
  emit("select", physical, risk);
}
</script>

<template>
  <div
    class="w-auto md:w-80 bg-white rounded-lg border border-neutral-200 shadow-lg p-4 flex flex-col gap-3"
  >
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-neutral-700">難度篩選</p>
      <button
        type="button"
        class="text-xs transition-colors"
        :class="
          selected
            ? 'text-neutral-400 hover:text-neutral-700 cursor-pointer'
            : 'text-neutral-200 cursor-not-allowed'
        "
        :disabled="!selected"
        @click="emit('clear')"
      >
        清除
      </button>
    </div>

    <div class="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1">
      <template v-for="risk in riskLevels" :key="risk">
        <div
          class="flex items-center justify-end pr-1 text-xs text-neutral-400"
        >
          {{ risk }}
        </div>
        <button
          v-for="physical in physicalLevels"
          :key="`${physical}-${risk}`"
          type="button"
          :disabled="getCount(physical, risk) === 0"
          class="aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-colors"
          :class="cellClass(physical, risk)"
          :aria-label="`體能 Lv.${physical}、風險 Lv.${risk}，共 ${getCount(physical, risk)} 座`"
          :aria-pressed="isSelected(physical, risk)"
          @click="handleSelect(physical, risk)"
        >
          {{ getCount(physical, risk) }}
        </button>
      </template>

      <div></div>
      <div
        v-for="physical in physicalLevels"
        :key="`label-${physical}`"
        class="text-center text-xs text-neutral-400 pt-1"
      >
        {{ physical }}
      </div>
    </div>

    <p class="text-xs text-neutral-400">橫軸：體能等級；縱軸：風險等級</p>
  </div>
</template>
