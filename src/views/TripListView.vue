<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import TripTable from "../components/TripTable.vue";

const store = useTripStore();
const { trips } = storeToRefs(store);
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-8">行程紀錄</h1>

    <TripTable :trips="trips" :deletable="true"></TripTable>
  </div>
</template>
