<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import TripTable from "../components/TripTable.vue";
import { ref, computed } from "vue";

const store = useTripStore();
const { trips } = storeToRefs(store);
</script>

<template>
  <TripTable :trips="trips" :deletable="true" :searchable="true"></TripTable>
</template>
