<script setup lang="ts">
import TrailDetailView from "../views/TrailDetailView.vue";
import CloseButton from "./CloseButton.vue";

const props = defineProps<{ trailId: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div
    class="absolute inset-y-0 left-0 w-96 z-1100 bg-white shadow-xl overflow-y-auto p-4"
  >
    <CloseButton @close="emit('close')" />

    <TrailDetailView :trail-id="props.trailId" />
  </div>
</template>
