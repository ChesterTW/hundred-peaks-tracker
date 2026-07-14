<script setup lang="ts">
import type { Trip } from "../../types";

defineProps<{
  trip: Trip;
  peakNames: string;
  isLast: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();
</script>

<template>
  <!-- 手機版卡片 -->
  <div
    class="md:hidden flex flex-col gap-2 rounded-lg border border-neutral-200 p-4"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-col gap-1">
        <p class="text-neutral-700 font-medium text-sm">{{ trip.date }}</p>
        <p class="text-neutral-700 text-sm">{{ peakNames }}</p>
      </div>
      <div class="flex gap-3 text-sm shrink-0">
        <p
          class="text-primary-500 hover:text-primary-600 active:text-primary-700 cursor-pointer"
          @click="emit('edit')"
        >
          編輯
        </p>
        <p
          class="text-primary-500 hover:text-primary-600 active:text-primary-700 cursor-pointer"
          @click="emit('delete')"
        >
          刪除
        </p>
      </div>
    </div>
    <p v-if="trip.note" class="text-neutral-400 text-xs">{{ trip.note }}</p>
  </div>

  <!-- 桌面版：表格儲存格 -->
  <div class="hidden md:contents">
    <p
      class="py-4 text-neutral-700 font-medium text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ trip.date }}
    </p>
    <p
      class="py-4 text-neutral-700 font-medium text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ peakNames }}
    </p>
    <p
      class="py-4 text-neutral-400 text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ trip.note === "" ? "-" : trip.note }}
    </p>
    <div
      class="flex gap-3 py-4 text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      <p
        class="text-primary-500 hover:text-primary-600 active:text-primary-700 cursor-pointer"
        @click="emit('edit')"
      >
        編輯
      </p>
      <p
        class="text-primary-500 hover:text-primary-600 active:text-primary-700 cursor-pointer"
        @click="emit('delete')"
      >
        刪除
      </p>
    </div>
  </div>
</template>
