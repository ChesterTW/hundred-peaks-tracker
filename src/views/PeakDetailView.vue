<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { peaks } from "../data/peaks";
import WeatherCard from "../components/WeatherCard.vue";

const route = useRoute();
const peak = computed(() =>
  peaks.find((p) => p.id === Number(route.params.id)),
);
</script>

<template>
  <div v-if="peak" class="space-y-4">
    <!-- 山峰標題卡 -->
    <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">{{ peak.name }}</h1>
      <div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
        <span>📍 {{ peak.region }}</span>
        <span>⛰️ {{ peak.elevation.toLocaleString() }} m</span>
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
