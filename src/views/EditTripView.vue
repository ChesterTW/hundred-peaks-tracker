<script setup lang="ts">
import { useTripStore } from "../stores/tripStore.ts";
import TripForm from "../components/TripForm.vue";
import { useRoute } from "vue-router";
import router from "../router/index.ts";

const route = useRoute();
const tripId = route.params.id;

const store = useTripStore();
const { updateTrip } = store;

const trip = store.trips.find((t) => t.id === tripId);

function handleEditTrip(date: string, selectedPeakIds: number[], note: string) {
  if (trip) {
    updateTrip(trip.id, date, selectedPeakIds, note);
    router.back();
  }
}
</script>

<template>
  <TripForm :initial="trip" @submit="handleEditTrip"></TripForm>
</template>
