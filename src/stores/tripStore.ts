import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Trip } from "../types";

export const useTripStore = defineStore("trip", () => {
  const STORAGE_KEY = "hundred-peaks-trips";
  // state：所有行程
  const trips = ref<Trip[]>(loadTrips());

  // getter：完成的山峰數量
  const completedCount = computed(() => {
    return new Set(trips.value.flatMap((trip) => trip.peakIds)).size;
  });

  function loadTrips(): Trip[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw);
  }

  function addTrip(date: string, peakIds: number[], note?: string) {
    trips.value.push({
      id: crypto.randomUUID(),
      date,
      peakIds,
      note,
    });
  }

  watch(
    trips,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips.value));
    },
    { deep: true },
  );

  return { trips, completedCount, addTrip, loadTrips };
});
