<script setup lang="ts">
import { X } from "@lucide/vue";

const props = defineProps<{
  peakName: string;
}>();
const emit = defineEmits(["remove"]);
</script>

<template>
  <div>
    <div
      class="bg-primary-50 hover:bg-primary-100 rounded-full w-fit h-fit px-3 py-1 flex items-center gap-1 cursor-pointer"
      @click="emit('remove')"
    >
      <p class="text-sm text-primary-500">{{ props.peakName }}</p>
      <X class="text-primary-500 shrink-0" :size="12" />
    </div>
  </div>
</template>
