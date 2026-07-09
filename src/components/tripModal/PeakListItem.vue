<script setup lang="ts">
import type { Peak } from "../../types.ts";
import CheckBox from "../CheckBox.vue";

const props = defineProps<{
  peak: Peak;
  isSelected: boolean;
}>();
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 w-full"
    :class="props.isSelected ? 'bg-primary-50' : 'bg-white'"
  >
    <CheckBox :isSelected="props.isSelected" />
    <div class="flex flex-col gap-1">
      <p class="text-sm font-medium text-neutral-700">
        {{ props.peak.name }}
      </p>
      <div class="flex items-center gap-2">
        <p class="text-xs text-neutral-400">{{ props.peak.range }}</p>
        <div class="w-px h-3 bg-neutral-400"></div>
        <p class="text-xs text-neutral-400">
          {{ props.peak.elevation.toLocaleString() }} m
        </p>
      </div>
    </div>
  </div>
</template>
