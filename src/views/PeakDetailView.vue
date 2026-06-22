<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { peaks } from "../data/peaks";

const route = useRoute();
const id = Number(route.params.id);
const peak = peaks.find((p) => p.id === id);

const weather = ref<any>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchWeather() {
  if (!peak) return;

  loading.value = true;
  error.value = null;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${peak.lat}&longitude=${peak.lng}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=Asia/Taipei&forecast_days=3`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("天氣服務回應異常");
    weather.value = await res.json();
  } catch (e) {
    error.value = "無法取得天氣資料";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchWeather);
</script>

<template>
  <div v-if="peak">
    <h1>{{ peak.name }}</h1>
    <p>海拔 {{ peak.elevation }} 公尺</p>
    <p>{{ peak.region }}</p>

    <h2>未來三天天氣</h2>

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
      </div>
    </div>
    <div v-else>天氣資料載入中...</div>
  </div>
  <div v-else>查無此山峰</div>
</template>
