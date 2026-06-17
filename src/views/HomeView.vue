<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import TripTable from "../components/TripTable.vue";

const store = useTripStore();
const { completedCount, recentTrips } = storeToRefs(store);
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-8">首頁進度</h1>

    <p class="mb-4">百岳進度：{{ completedCount }} / 100</p>

    <TripTable :trips="recentTrips"></TripTable>
  </div>
</template>
