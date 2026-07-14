<script setup lang="ts">
import PeakDetailContent from "../components/PeakDetailContent.vue";
import BottomSheet from "../components/BottomSheet.vue";

const emit = defineEmits<{ close: [] }>();
const props = defineProps<{
  peakId: number;
}>();
</script>

<template>
  <!-- 桌面版：左側抽屜 -->
  <div
    class="hidden md:flex absolute inset-y-0 left-0 w-96 z-1100 bg-white shadow-xl overflow-y-auto p-6 flex-col"
  >
    <PeakDetailContent :peakId="props.peakId" @close="emit('close')" />
  </div>

  <!-- 手機版：BottomSheet -->
  <BottomSheet :open="true" @close="emit('close')">
    <div class="p-6 max-h-[80vh] overflow-y-auto">
      <PeakDetailContent :peakId="props.peakId" @close="emit('close')" />
    </div>
  </BottomSheet>
</template>
