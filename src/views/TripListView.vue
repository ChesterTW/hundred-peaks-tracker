<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import TripTable from "../components/TripTable.vue";

const store = useTripStore();
const { trips } = storeToRefs(store);
</script>

<template>
  <router-link
    to="/add"
    class="inline-block px-4 py-2 rounded bg-[#42b883] text-white hover:bg-[#369870] mb-4"
    >新增行程</router-link
  >
  <TripTable :trips="trips" :deletable="true" :searchable="true"></TripTable>
</template>
