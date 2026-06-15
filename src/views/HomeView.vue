<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";

const store = useTripStore();
const { trips, completedCount } = storeToRefs(store);
</script>

<template>
  <h1 class="text-2xl font-bold p-4">首頁進度</h1>

  <div class="flex flex-col p-4">
    <p>百岳進度：{{ completedCount }} / 100</p>
  </div>

  <div class="flex flex-col p-4">
    <ul>
      <li v-for="trip in trips" :key="trip.id">
        於 {{ trip.date }} 爬 {{ trip.peakIds }} 等山峰。備註：{{ trip.note }}
      </li>
    </ul>
  </div>
</template>
