<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { peaks } from "../data/peaks";

const store = useTripStore();
const { trips } = storeToRefs(store);
const { deleteTrip } = store;

const peakMap = new Map(peaks.map((p) => [p.id, p.name]));
function peakNames(peakIds: number[]): string {
  return peakIds.map((id) => peakMap.get(id)).join("、");
}
</script>

<template>
  <h1 class="text-2xl font-bold p-4">行程紀錄</h1>

  <div class="flex flex-col p-4">
    <ul>
      <li v-for="trip in trips" :key="trip.id">
        於 {{ trip.date }} 爬 {{ peakNames(trip.peakIds) }} 等山峰。備註：{{
          trip.note
        }}
        <button @click="deleteTrip(trip.id)">刪除</button>
      </li>
    </ul>
  </div>
</template>
