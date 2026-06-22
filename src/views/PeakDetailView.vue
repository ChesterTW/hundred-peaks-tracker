<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { peaks } from "../data/peaks";

const route = useRoute();
const id = Number(route.params.id);
const peak = peaks.find((p) => p.id === id);

const weather = ref<any>(null);

onMounted(async () => {
  if (!peak) return;

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${peak.lat}&longitude=${peak.lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=Asia/Taipei&forecast_days=3`;

  const res = await fetch(url);
  weather.value = await res.json();
});
</script>

<template>
  <div v-if="peak">
    <h1>{{ peak.name }}</h1>
    <p>海拔 {{ peak.elevation }} 公尺</p>
    <p>{{ peak.region }}</p>

    <h2>未來三天天氣</h2>
    <div v-if="weather">
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
