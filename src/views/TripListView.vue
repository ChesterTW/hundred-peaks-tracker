<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import { usePeakNames } from "../composables/usePeakNames";

const store = useTripStore();
const { trips } = storeToRefs(store);
const { deleteTrip } = store;
const { peakNames } = usePeakNames();

function handleDelete(id: string) {
  if (confirm("確定刪除這筆行程？")) {
    deleteTrip(id);
  }
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
        <button @click="handleDelete(trip.id)">刪除</button>
      </li>
    </ul>
  </div>
</template>
