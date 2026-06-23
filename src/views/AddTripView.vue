<script setup lang="ts">
import { useTripStore } from "../stores/tripStore";
import TripForm from "../components/TripForm.vue";

const store = useTripStore();
const { addTrip } = store;

function handleAddTrip(date: string, selectedPeakIds: number[], note: string) {
  addTrip(date, selectedPeakIds, note);
}
</script>

<template>
  <TripForm @submit="handleAddTrip"></TripForm>
</template>
