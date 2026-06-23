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
  <div v-if="peak">
    <h1>{{ peak.name }}</h1>
    <p>海拔 {{ peak.elevation }} 公尺</p>
    <p>{{ peak.region }}</p>

    <h2>未來三天天氣</h2>
    <WeatherCard :peak="peak"></WeatherCard>
  </div>
  <div v-else>查無此山峰</div>
</template>
