<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    total?: number; // 可選,預設 100
  }>(),
  {
    total: 100,
  },
);

const percent = computed(() => {
  const total = props.total ?? 100;
  return total === 0 ? 0 : props.value / total;
});
</script>

<template>
  <div class="flex justify-between mb-1 text-sm">
    <span>百岳進度</span>
    <span>{{ value }} / {{ total }}</span>
  </div>

  <div class="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      class="h-full bg-green-600 rounded-full"
      :style="{ width: percent * 100 + '%' }"
    ></div>
  </div>
</template>
