<script setup lang="ts">
import type { Peak } from "../../types";

defineProps<{
  peak: Peak;
  isCompleted: boolean;
  isLast: boolean;
}>();
</script>

<template>
  <!-- 手機版卡片 -->
  <div
    class="md:hidden flex flex-col gap-3 rounded-lg border border-neutral-200 p-4"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="text-neutral-700 font-medium text-base">{{ peak.name }}</p>
      <div
        v-if="isCompleted"
        class="bg-[#E5F0E5] px-3 py-1 rounded-full shrink-0"
      >
        <p class="text-success text-xs font-medium">已登頂</p>
      </div>
      <div
        v-else
        class="bg-white px-3 py-1 rounded-full border border-neutral-300 shrink-0"
      >
        <p class="text-neutral-400 text-xs font-medium">未登頂</p>
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs text-neutral-400">
      <span>排名 {{ peak.id }}</span>
      <div class="w-px h-3 bg-neutral-300" />
      <span>{{ peak.elevation }} m</span>
      <div class="w-px h-3 bg-neutral-300" />
      <span>{{ peak.range }}</span>
    </div>

    <div class="bg-neutral-100 rounded-full px-3 py-1 w-fit">
      <p class="text-neutral-700 text-xs">
        體能 Lv.{{ peak.rating.physical }}・風險 Lv.{{ peak.rating.risk }}
      </p>
    </div>
  </div>

  <!-- 桌面版：表格儲存格（用 contents 讓自己消失，讓子層直接對齊父層的 subgrid） -->
  <div class="hidden md:contents">
    <div>
      <div v-if="isCompleted" class="bg-[#E5F0E5] px-3 py-1 rounded-full">
        <p class="text-success text-xs font-medium">已登頂</p>
      </div>
      <div
        v-else
        class="bg-white px-3 py-1 rounded-full border border-neutral-300"
      >
        <p class="text-neutral-400 text-xs font-medium">未登頂</p>
      </div>
    </div>

    <p
      class="py-4 text-neutral-400 font-medium text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ peak.id }}
    </p>
    <p
      class="py-4 text-neutral-700 font-medium text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ peak.name }}
    </p>
    <p
      class="py-4 text-neutral-700 text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ peak.elevation }} m
    </p>
    <p
      class="py-4 text-neutral-700 text-sm"
      :class="isLast ? '' : 'border-b border-neutral-100'"
    >
      {{ peak.range }}
    </p>
    <div>
      <div class="bg-neutral-100 rounded-full px-3 py-1 w-fit h-fit">
        <p class="text-neutral-700 text-xs">
          體能 Lv.{{ peak.rating.physical }}・風險 Lv.{{ peak.rating.risk }}
        </p>
      </div>
    </div>
  </div>
</template>
