<script setup lang="ts">
import TripTable from "../components/TripTable.vue";
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-8">行程紀錄</h1>

    <TripTable :deletable="true"></TripTable>
  </div>
</template>
