<script setup lang="ts">
import { Check } from "@lucide/vue";
const props = defineProps<{
  isSelected: boolean;
}>();
</script>

<template>
  <div
    class="w-4.5 h-4.5 rounded-sm shrink-0 flex items-center justify-center"
    :class="
      props.isSelected ? 'bg-primary-500' : 'bg-white border border-neutral-300'
    "
  >
    <Check v-if="props.isSelected" class="text-white" :size="12" />
  </div>
</template>
