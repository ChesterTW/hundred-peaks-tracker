import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Trip } from "../types";

export const useTripStore = defineStore("trip", () => {
  const STORAGE_KEY = "hundred-peaks-trips";
  // state：所有行程
  const trips = ref<Trip[]>(loadTrips());

  // getter：完成的山峰數量
  const completedCount = computed(() => {
    return completedPeakIds.value.size;
  });

  const completedPeakIds = computed(() => {
    return new Set(trips.value.flatMap((trip) => trip.peakIds));
  });

  const recentTrips = computed(() => {
    return [...trips.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
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

  function updateTrip(
    id: string,
    date: string,
    peakIds: number[],
    note?: string,
  ) {
    const index = trips.value.findIndex((trip) => trip.id === id);

    if (index !== -1) {
      trips.value[index] = { ...trips.value[index], date, peakIds, note };
    }
  }

  function deleteTrip(id: string) {
    trips.value = trips.value.filter((trip) => trip.id != id);
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
    completedCount,
    completedPeakIds,
    recentTrips,
    addTrip,
    updateTrip,
    deleteTrip,
  };
});
