<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";

const store = useTripStore();
const { trips } = storeToRefs(store);
</script>

<template>
  <h1 class="text-2xl font-bold p-4">百岳列表</h1>

  <div class="flex flex-col p-4">
    <ul>
      <li v-for="trip in trips" :key="trip.id">
        於 {{ trip.date }} 爬 {{ trip.peakIds }} 等山峰。備註：{{ trip.note }}
      </li>
    </ul>
  </div>
</template>
