<script setup lang="ts">
import { computed } from "vue";
import { useWeather } from "../composables/useWeather";
import type { Peak } from "../types";
import { getWeatherInfo } from "../data/weatherCode";

const props = defineProps<{
  peak: Peak | undefined;
}>();

const { weather, loading, error, fetchWeather } = useWeather(
  () => props.peak?.lat,
  () => props.peak?.lng,
);

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
}

const dailyList = computed(() => {
  const daily = weather.value?.daily;
  if (!daily) return [];

  return daily.time.map((date: string, index: number) => ({
    date,
    label: formatDate(date),
    weather: getWeatherInfo(daily.weather_code[index]),
    min: daily.temperature_2m_min[index],
    max: daily.temperature_2m_max[index],
    rain: daily.precipitation_probability_max[index],
    sunrise: dateToLabel(daily.sunrise[index]),
    sunset: dateToLabel(daily.sunset[index]),
  }));
});

function dateToLabel(date: string): string {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}
</script>

<template>
  <!-- 載入中 -->
  <div
    v-if="loading"
    class="rounded-2xl bg-white p-4 text-sm text-gray-400 shadow-sm ring-1 ring-gray-100"
  >
    天氣資料載入中…
  </div>

  <!-- 錯誤 -->
  <div
    v-else-if="error"
    class="rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100"
  >
    <p>{{ error }}</p>
    <button
      class="mt-2 rounded-lg bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
      @click="fetchWeather"
    >
      重試
    </button>
  </div>

  <!-- 天氣列表 -->
  <div v-else-if="weather" class="space-y-2">
    <div
      v-for="day in dailyList"
      :key="day.date"
      class="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100"
    >
      <span class="text-3xl leading-none">{{ day.weather.icon }}</span>

      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">{{ day.label }}</p>
        <p class="text-xs text-gray-500">{{ day.weather.label }}</p>
      </div>

      <div>
        <p class="text-xs text-yellow-500">日出：{{ day.sunrise }}</p>
        <p class="text-xs text-orange-500">日落：{{ day.sunset }}</p>
      </div>

      <div class="text-right">
        <p class="text-sm font-semibold text-gray-900">
          {{ Math.round(day.min) }}° ～ {{ Math.round(day.max) }}°
        </p>
        <p class="text-xs text-sky-500">💧 {{ day.rain }}%</p>
      </div>
    </div>
  </div>
</template>
