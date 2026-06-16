<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { peaks } from "../data/peaks";

const store = useTripStore();
const { completedCount, recentTrips } = storeToRefs(store);

const peakMap = new Map(peaks.map((p) => [p.id, p.name]));
function peakNames(peakIds: number[]): string {
  return peakIds.map((id) => peakMap.get(id)).join("、");
}
</script>

<template>
  <h1 class="text-2xl font-bold p-4">首頁進度</h1>

  <div class="flex flex-col p-4">
    <p>百岳進度：{{ completedCount }} / 100</p>
  </div>

  <div class="flex flex-col p-4">
    <ul>
      <li v-for="trip in recentTrips" :key="trip.id">
        於 {{ trip.date }} 爬 {{ peakNames(trip.peakIds) }} 等山峰。備註：{{
          trip.note
        }}
      </li>
    </ul>
  </div>
</template>
