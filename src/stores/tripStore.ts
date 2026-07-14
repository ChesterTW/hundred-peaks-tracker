import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Trip } from "../types";
import { useAuthStore } from "./authStore";
import {
  fetchAllTrips,
  createTrip as createTripRemote,
  updateTripRemote,
  deleteTripRemote,
} from "../tripSync";
import { peaks } from "../data/peaks";

export const useTripStore = defineStore("trip", () => {
  const STORAGE_KEY = "hundred-peaks-trips";

  // state：所有行程
  const trips = ref<Trip[]>(loadTrips());

  const activeTrips = computed(() => trips.value);

  // getter：完成的山峰數量
  const completedCount = computed(() => {
    return completedPeakIds.value.size;
  });

  const completedPeakIds = computed(() => {
    return new Set(trips.value.flatMap((trip) => trip.peakIds));
  });

  const authStore = useAuthStore();

  watch(
    () => authStore.user,
    (user) => {
      if (user) {
        handleLogin();
      } else {
        handleLogout();
      }
    },
    { immediate: true },
  );

  async function handleLogin() {
    // 把登入前在本機（訪客身份）新增、還沒上雲的行程搬上雲端
    const localTrips = [...trips.value];
    if (localTrips.length > 0) {
      try {
        await Promise.all(
          localTrips.map((trip) =>
            createTripRemote({
              date: trip.date,
              peakIds: trip.peakIds,
              note: trip.note,
            }),
          ),
        );
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(
          "[tripStore] 本機行程搬上雲端失敗，保留本機資料待重試",
          e,
        );
      }
    }

    try {
      trips.value = await fetchAllTrips();
    } catch (e) {
      console.error("[tripStore] 讀取雲端行程失敗", e);
    }
  }

  function handleLogout() {
    trips.value = loadTrips();
  }

  function loadTrips(): Trip[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw);
  }

  function persistLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips.value));
  }

  async function addTrip(date: string, peakIds: number[], note?: string) {
    if (authStore.user) {
      try {
        const created = await createTripRemote({ date, peakIds, note });
        trips.value.push(created);
      } catch (e) {
        console.error("[tripStore] 新增行程失敗", e);
      }
      return;
    }

    trips.value.push({
      id: crypto.randomUUID(),
      date,
      peakIds,
      note,
      updatedAt: Date.now(),
    });
    persistLocal();
  }

  async function updateTrip(
    id: string,
    date: string,
    peakIds: number[],
    note?: string,
  ) {
    const index = trips.value.findIndex((trip) => trip.id === id);
    if (index === -1) return;

    if (authStore.user) {
      try {
        trips.value[index] = await updateTripRemote(id, {
          date,
          peakIds,
          note,
        });
      } catch (e) {
        console.error("[tripStore] 更新行程失敗", id, e);
      }
      return;
    }

    trips.value[index] = {
      ...trips.value[index],
      date,
      peakIds,
      note,
      updatedAt: Date.now(),
    };
    persistLocal();
  }

  async function deleteTrip(id: string) {
    const index = trips.value.findIndex((trip) => trip.id === id);
    if (index === -1) return;

    if (authStore.user) {
      try {
        await deleteTripRemote(id);
        trips.value.splice(index, 1);
      } catch (e) {
        console.error("[tripStore] 刪除行程失敗", id, e);
      }
      return;
    }

    trips.value.splice(index, 1);
    persistLocal();
  }

  function getTripById(id: string): Trip | undefined {
    return trips.value.find((trip) => trip.id === id);
  }

  function getPeakName(peakId: number) {
    const peak = peaks.find((p) => p.id === peakId);
    return peak ? peak.name : `未知山峰 #${peakId}`;
  }

  function getLastSummitDate(peakId: number): string | null {
    const dates = activeTrips.value
      .filter((trip) => trip.peakIds.includes(peakId))
      .map((trip) => trip.date)
      .sort();

    return dates.at(-1) ?? null;
  }

  return {
    trips,
    activeTrips,
    completedCount,
    completedPeakIds,
    addTrip,
    updateTrip,
    deleteTrip,
    getPeakName,
    getTripById,
    getLastSummitDate,
  };
});
