<script setup lang="ts">
import { computed } from "vue";
import { Info, Clock, Calendar } from "@lucide/vue";
import { useWeather } from "../composables/useWeather";
import type { Peak } from "../types";
import { getWeatherInfo } from "../data/weatherCode";

const props = defineProps<{
  peak: Peak | undefined;
}>();

const { weather, airQuality, loading, error, fetchWeather } = useWeather(
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
    rain: daily.precipitation_sum[index],
    sunrise: dateToLabel(daily.sunrise[index]),
    sunset: dateToLabel(daily.sunset[index]),
  }));
});

const hourlyList = computed(() => {
  const hourly = weather.value?.hourly;
  if (!hourly) return [];

  return hourly.time.map((time: string, index: number) => ({
    time,
    label: dateToLabel(time),
    weather: getWeatherInfo(hourly.weather_code[index]),
    temp: hourly.temperature_2m[index],
    rain: hourly.precipitation[index],
  }));
});

function dateToLabel(date: string): string {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

// US AQI 分級
function aqiLevel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "良好", color: "text-green-600" };
  if (aqi <= 100) return { label: "普通", color: "text-yellow-600" };
  if (aqi <= 150) return { label: "敏感族群不健康", color: "text-orange-600" };
  return { label: "不健康", color: "text-red-600" };
}

// 紫外線分級
function uvLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "低量級", color: "text-green-600" };
  if (uv <= 7) return { label: "中量級", color: "text-yellow-600" };
  if (uv >= 8) return { label: "高量級", color: "text-orange-600" };
  return { label: "過量級", color: "text-red-600" };
}

// 今日彙總：混合 daily[0]（今天）、current（即時）與空氣品質 API
const summary = computed(() => {
  const daily = weather.value?.daily;
  const current = weather.value?.current;
  if (!daily || !current) return null;

  const aqi = airQuality.value?.current.us_aqi ?? null;
  return {
    rain: daily.precipitation_sum[0],
    sunrise: dateToLabel(daily.sunrise[0]),
    sunset: dateToLabel(daily.sunset[0]),
    humidity: current.relative_humidity_2m,
    pressure: current.surface_pressure,
    windSpeed: current.wind_speed_10m,
    aqi,
    aqiInfo: aqi != null ? aqiLevel(aqi) : null,
    uvIndex: airQuality.value?.current.uv_index ?? null,
    uvInfo:
      airQuality.value?.current.uv_index != null
        ? uvLevel(airQuality.value.current.uv_index)
        : null,
  };
});
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
  <div v-else-if="weather" class="space-y-3">
    <!-- 今日天氣 -->
    <div v-if="summary" class="space-y-3 rounded-lg bg-neutral-50 p-4">
      <div class="flex items-center gap-1">
        <Info :size="16" class="text-neutral-900" />
        <p class="text-xs font-medium text-neutral-900">今日天氣</p>
      </div>
      <div class="grid grid-cols-3 gap-x-3 gap-y-4">
        <div>
          <p class="text-xs text-neutral-400">降水</p>
          <p class="text-base font-medium text-neutral-900">
            {{ summary.rain }} mm
          </p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">濕度</p>
          <p class="text-base font-medium text-neutral-900">
            {{ summary.humidity }}%
          </p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">氣壓</p>
          <p class="text-base font-medium text-neutral-900">
            {{ Math.round(summary.pressure) }} hPa
          </p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">日出</p>
          <p class="text-base font-medium text-warning">
            {{ summary.sunrise }}
          </p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">日落</p>
          <p class="text-base font-medium text-warning">
            {{ summary.sunset }}
          </p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">空氣品質</p>
          <p
            v-if="summary.aqiInfo"
            class="text-base font-medium"
            :class="summary.aqiInfo.color"
          >
            {{ summary.aqi }} {{ summary.aqiInfo.label }}
          </p>
          <p v-else class="text-base font-medium text-neutral-400">—</p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">紫外線</p>
          <p
            v-if="summary.uvInfo"
            class="text-base font-medium"
            :class="summary.uvInfo.color"
          >
            {{ summary.uvIndex }} {{ summary.uvInfo.label }}
          </p>
          <p v-else class="text-base font-medium text-neutral-400">—</p>
        </div>
        <div>
          <p class="text-xs text-neutral-400">風速</p>
          <p class="text-base font-medium text-neutral-900">
            {{ Math.round(summary.windSpeed) }} km/h
          </p>
        </div>
      </div>
    </div>

    <!-- 每小時天氣預報 -->
    <div class="space-y-3 rounded-lg bg-neutral-50 p-4">
      <div class="flex items-center gap-1">
        <Clock :size="16" class="text-neutral-900" />
        <p class="text-xs font-medium text-neutral-900">每小時天氣預報</p>
      </div>
      <div class="flex gap-4 overflow-x-auto">
        <div
          v-for="(hour, index) in hourlyList"
          :key="hour.time"
          class="flex shrink-0 flex-col items-center gap-2"
        >
          <span class="text-xs text-neutral-900">
            {{ Math.round(hour.temp) }}°
          </span>
          <span class="text-2xl leading-none">{{ hour.weather.icon }}</span>
          <span class="h-4 text-xs text-info">{{
            hour.rain > 0 ? hour.rain : ""
          }}</span>
          <span class="text-xs text-neutral-400">{{
            index === 0 ? "現在" : hour.label
          }}</span>
        </div>
      </div>
    </div>

    <!-- 未來 10 天的天氣預報 -->
    <div class="space-y-3 rounded-lg bg-neutral-50 p-4">
      <div class="flex items-center gap-1">
        <Calendar :size="16" class="text-neutral-900" />
        <p class="text-xs font-medium text-neutral-900">未來 10 天的天氣預報</p>
      </div>
      <div class="flex gap-1 overflow-x-auto">
        <div
          v-for="(day, index) in dailyList"
          :key="day.date"
          class="flex shrink-0 flex-col items-center gap-2 rounded-full px-2 py-3"
        >
          <div class="text-center text-xs leading-4">
            <p class="text-neutral-900">{{ Math.round(day.max) }}°</p>
            <p class="text-neutral-400">{{ Math.round(day.min) }}°</p>
          </div>
          <span class="text-2xl leading-none">{{ day.weather.icon }}</span>
          <span class="h-4 text-xs text-info">{{
            day.rain > 0 ? day.rain : ""
          }}</span>
          <p class="text-center text-xs text-neutral-400">
            {{ index === 0 ? "今天" : day.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
