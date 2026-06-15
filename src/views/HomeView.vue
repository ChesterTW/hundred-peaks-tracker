<script setup lang="ts">
import { useTripStore } from "../stores/tripStore";

const { trips, completedCount, addTrip, loadTrips } = useTripStore();
</script>

<template>
  <h1 class="text-2xl font-bold p-4">首頁進度</h1>

  <div class="flex flex-col p-4">
    <text>百岳進度：{{ completedCount }} / 100</text>
  </div>
</template>
