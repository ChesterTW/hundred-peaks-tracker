<script setup lang="ts">
import MapDisplayItem from "./MapDisplayItem.vue";
import type { VisibilityState } from "../../types";

const props = defineProps<{
  modelValue: VisibilityState;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: VisibilityState];
}>();

function update(key: keyof VisibilityState, value: boolean) {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
}

const items: {
  key: keyof VisibilityState;
  label: string;
  description: string;
}[] = [
  {
    key: "completedMarkers",
    label: "已登頂標記",
    description: "顯示已登頂山峰的標記",
  },
  {
    key: "incompleteMarkers",
    label: "未登頂標記",
    description: "顯示未登頂山峰的標記",
  },
  { key: "peakNames", label: "山峰名稱", description: "顯示山峰名稱標籤" },
  { key: "trails", label: "步道", description: "顯示步道路線" },
  { key: "trailNames", label: "步道名稱", description: "顯示步道名稱標籤" },
];
</script>

<template>
  <div
    class="w-52 py-4 bg-white/75 backdrop-blur-sm shadow-lg rounded-2xl flex flex-col gap-3"
  >
    <div class="px-5">
      <p class="text-xs font-medium text-neutral-400">圖層顯影</p>
    </div>
    <div class="flex flex-col">
      <div v-for="(item, index) in items" :key="item.key">
        <MapDisplayItem
          type="checkbox"
          :label="item.label"
          :description="item.description"
          :modelValue="modelValue[item.key]"
          @update:modelValue="update(item.key, $event)"
        />
        <div
          v-if="index !== items.length - 1"
          class="h-px bg-neutral-200 mx-5"
        />
      </div>
    </div>
  </div>
</template>
