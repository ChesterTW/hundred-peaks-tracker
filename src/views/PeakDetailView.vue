<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { peaks } from "../data/peaks";
import { useWeather } from "../composables/useWeather";

const route = useRoute();
const peak = computed(() =>
  peaks.find((p) => p.id === Number(route.params.id)),
);

const { weather, loading, error, fetchWeather } = useWeather(
  () => peak.value?.lat,
  () => peak.value?.lng,
);

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
