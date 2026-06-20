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
  <div class="flex h-screen overflow-hidden">
    <aside class="w-1/3 overflow-y-auto p-4 space-y-4 shadow-4">
      <ProgressBar :value="completedCount" :total="100"></ProgressBar>
      <TripTable :trips="recentTrips"></TripTable>
    </aside>

    <main class="flex-1">
      <PeakMap></PeakMap>
    </main>
  </div>
</template>
