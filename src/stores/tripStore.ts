import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Trip } from "../types";

export const useTripStore = defineStore("trip", () => {
  const STORAGE_KEY = "hundred-peaks-trips";
  // state：所有行程
  const trips = ref<Trip[]>(loadTrips());

  // getter：未刪除的行程
  const activeTrips = computed(() => {
    return trips.value.filter((trip) => !trip.deleted);
  });

  // getter：完成的山峰數量
  const completedCount = computed(() => {
    return completedPeakIds.value.size;
  });

  const completedPeakIds = computed(() => {
    return new Set(activeTrips.value.flatMap((trip) => trip.peakIds));
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
      updatedAt: Date.now(),
      deleted: false,
    });
  }

  function updateTrip(
    id: string,
    date: string,
    peakIds: number[],
    note?: string,
  ) {
    const index = trips.value.findIndex((trip) => trip.id === id);

    if (index !== -1) {
      trips.value[index] = {
        ...trips.value[index],
        date,
        peakIds,
        note,
        updatedAt: Date.now(),
        deleted: false,
      };
    }
  }

  function deleteTrip(id: string) {
    const index = trips.value.findIndex((trip) => trip.id === id);

    if (index !== -1) {
      trips.value[index] = {
        ...trips.value[index],
        updatedAt: Date.now(),
        deleted: true,
      };
    }
  }

  watch(
    trips,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips.value));
    },
    { deep: true },
  );

  return {
    trips,
    activeTrips,
    completedCount,
    completedPeakIds,
    addTrip,
    updateTrip,
    deleteTrip,
  };
});
