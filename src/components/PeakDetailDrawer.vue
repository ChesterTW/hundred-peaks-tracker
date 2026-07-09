<script setup lang="ts">
import PeakDetailView from "../views/PeakDetailView.vue";

const props = defineProps<{ peakId: number }>();
</script>

<template>
  <div
    class="absolute inset-y-0 left-0 w-96 z-1100 bg-white shadow-xl overflow-y-auto p-6 flex flex-col"
  >
    <PeakDetailView :peak-id="props.peakId" @close="$emit('close')" />
  </div>
</template>
