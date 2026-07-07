<script setup lang="ts">
import { baseLayers } from "../../data/baseLayers.ts";
import MapDisplayItem from "./MapDisplayItem.vue";

defineProps<{
  modelValue: string;
}>();
defineEmits<{ "update:modelValue": [id: string] }>();
</script>

<template>
  <div
    class="w-72 py-4 bg-white/75 backdrop-blur-sm shadow-lg rounded-2xl flex flex-col gap-3"
  >
    <div class="px-5">
      <p class="text-xs font-medium text-neutral-400">圖層切換</p>
    </div>
    <div class="flex flex-col">
      <div v-for="(layer, index) in baseLayers" :key="layer.id">
        <MapDisplayItem
          type="radio"
          :label="layer.name"
          :description="layer.attribution"
          :modelValue="modelValue === layer.id"
          @update:modelValue="$emit('update:modelValue', layer.id)"
        />
        <div
          v-if="index !== baseLayers.length - 1"
          class="h-px bg-neutral-200 mx-5"
        />
      </div>
    </div>
  </div>
</template>
