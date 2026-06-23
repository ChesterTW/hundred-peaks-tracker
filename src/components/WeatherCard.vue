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

const dailyList = computed(() => {
  const daily = weather.value?.daily;
  if (!daily) return [];

  return daily.time.map((date: string, index: number) => ({
    date,
    weather: getWeatherInfo(daily.weather_code[index]),
    min: daily.temperature_2m_min[index],
    max: daily.temperature_2m_max[index],
    rain: daily.precipitation_probability_max[index],
  }));
});
</script>

<template>
  <div v-if="loading">天氣資料載入中...</div>
  <div v-else-if="error">
    {{ error }}
    <button @click="fetchWeather">重試</button>
  </div>
  <div v-else-if="weather">
    <div v-for="day in dailyList" :key="day.date">
      {{ day.date }}： {{ day.min }}° ～ {{ day.max }}°， 降雨 {{ day.rain }}%
      {{ day.weather.icon }}
      {{ day.weather.label }}
    </div>
  </div>
  <div v-else-if="dailyList.length">天氣資料載入中...</div>
</template>
