<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ChevronDown } from "@lucide/vue";
import type { Peak } from "../../types";
import DifficultyMatrixPopover from "./DifficultyMatrixPopover.vue";

const props = defineProps<{
  peaks: Peak[];
  selected: { physical: number; risk: number } | null;
}>();

const emit = defineEmits<{
  select: [physical: number, risk: number];
  clear: [];
}>();

const isPopoverOpen = ref(false);
const filterRef = ref<HTMLElement | null>(null);

function handleSelect(physical: number, risk: number) {
  emit("select", physical, risk);
  isPopoverOpen.value = false;
}

function handleClear() {
  emit("clear");
  isPopoverOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (
    isPopoverOpen.value &&
    filterRef.value &&
    !filterRef.value.contains(event.target as Node)
  ) {
    isPopoverOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div ref="filterRef" class="relative">
    <button
      type="button"
      class="flex gap-1 items-center rounded-md border pl-3 pr-2 py-1 cursor-pointer hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
      :class="selected ? 'border-primary-500' : 'border-neutral-300'"
      :aria-expanded="isPopoverOpen"
      @click="isPopoverOpen = !isPopoverOpen"
    >
      <p class="text-neutral-700 text-sm">
        {{
          selected
            ? `體能 Lv.${selected.physical}・風險 Lv.${selected.risk}`
            : "難度"
        }}
      </p>
      <ChevronDown class="text-neutral-700" :size="16" />
    </button>

    <DifficultyMatrixPopover
      v-if="isPopoverOpen"
      class="absolute top-full mt-2 left-0 z-20"
      :peaks="props.peaks"
      :selected="props.selected"
      @select="handleSelect"
      @clear="handleClear"
    />
  </div>
</template>
