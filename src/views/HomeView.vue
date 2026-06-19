<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import TripTable from "../components/TripTable.vue";
import PeakMap from "../components/PeakMap.vue";
import ProgressBar from "../components/ProgressBar.vue";

const store = useTripStore();
const { completedCount, recentTrips } = storeToRefs(store);
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-8">首頁進度</h1>

    <ProgressBar :value="completedCount" :total="100"></ProgressBar>

    <TripTable :trips="recentTrips"></TripTable>
  </div>

  <PeakMap></PeakMap>
</template>
