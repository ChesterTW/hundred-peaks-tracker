<script setup lang="ts">
import { computed } from "vue";
import { peaks } from "../data/peaks";
import WeatherCard from "../components/WeatherCard.vue";

const props = defineProps<{
  peakId: number;
}>();

const peak = computed(() => peaks.find((p) => p.id === props.peakId));
</script>

<template>
  <div v-if="peak" class="space-y-4">
    <!-- 山峰標題卡 -->
    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">{{ peak.name }}</h1>
      <div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
        <span>📍 {{ peak.region }}</span>
        <span>⛰️ {{ peak.elevation.toLocaleString() }} m</span>
        <a
          :href="`https://hiking.biji.co/index.php?q=mountain&act=detail&id=${peak.id}`"
          target="_blank"
          rel="noopener noreferrer"
          >📝 健行筆記連結</a
        >
        <a
          :href="`https://zh-tw.hikingbook.net/explore/trails?regions=Taiwan&query=${peak.name}&order=latest`"
          target="_blank"
          rel="noopener noreferrer"
          >📝 HikingBook 連結</a
        >
        <a
          :href="`https://www.windy.com/${peak.lat}/${peak.lng}?rain,${peak.lat},${peak.lng},11,p:cities`"
          target="_blank"
          rel="noopener noreferrer"
          >📝 Windy 連結</a
        >
      </div>
    </div>

    <!-- 天氣區塊 -->
    <section class="space-y-2">
      <h2 class="px-1 text-sm font-semibold text-gray-700">未來三天天氣</h2>
      <WeatherCard :peak="peak"></WeatherCard>
    </section>
  </div>

  <div
    v-else
    class="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm ring-1 ring-gray-100"
  >
    查無此山峰
  </div>
</template>
