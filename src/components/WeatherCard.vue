<script setup lang="ts">
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
</script>

<template>
  <div v-if="loading">天氣資料載入中...</div>
  <div v-else-if="error">
    {{ error }}
    <button @click="fetchWeather">重試</button>
  </div>
  <div v-else-if="weather">
    <div v-for="(day, index) in weather.daily.time" :key="day">
      {{ day }}： {{ weather.daily.temperature_2m_min[index] }}° ～
      {{ weather.daily.temperature_2m_max[index] }}°， 降雨
      {{ weather.daily.precipitation_probability_max[index] }}%
      {{ getWeatherInfo(weather.daily.weather_code[index]).icon }}
      {{ getWeatherInfo(weather.daily.weather_code[index]).label }}
    </div>
  </div>
  <div v-else>天氣資料載入中...</div>
</template>
