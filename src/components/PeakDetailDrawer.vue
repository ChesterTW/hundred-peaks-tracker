<script setup lang="ts">
import CloseButton from "./CloseButton.vue";
import PeakDetailView from "../views/PeakDetailView.vue";

const props = defineProps<{ peakId: number }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div
    class="absolute inset-y-0 left-0 w-96 z-1100 bg-white shadow-xl overflow-y-auto p-4"
  >
    <CloseButton @close="emit('close')" />

    <PeakDetailView :peak-id="props.peakId" />
  </div>
</template>
