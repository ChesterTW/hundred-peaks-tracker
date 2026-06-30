import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Trip } from "../types";
import { useAuthStore } from "./authStore";
import {
  mergeTrips,
  fetchAllTrips,
  upsertTrip,
  subscribeTrips,
} from "../tripSync";

export const useTripStore = defineStore("trip", () => {
  const STORAGE_KEY = "hundred-peaks-trips";

  let unsubscribe: (() => void) | null = null;

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

  const authStore = useAuthStore();

  watch(
    () => authStore.user,
    (user) => {
      if (user) {
        // 登入：migration + subscribe
        handleLogin(user.uid);
      } else {
        // 登出：unsubscribe + 重置
        handleLogout();
      }
    },
    { immediate: true },
  );

  async function handleLogin(uid: string) {
    const localTrips = [...trips.value];

    // 1. 訂閱雲端資料，覆蓋 trips.value。
    unsubscribe = subscribeTrips(uid, (cloudTrips) => {
      trips.value = cloudTrips;
    });

    // 2. migration：將 localStorage 的資料與雲端資料合併，並寫回雲端
    // 若 localStorage 沒有資料，則跳過 migration。
    if (localTrips.length > 0) {
      try {
        const cloud = await fetchAllTrips(uid);
        const merged = mergeTrips(localTrips, cloud);
        await Promise.all(merged.map((t) => upsertTrip(uid, t)));

        // 只有在同步成功後，才可以清空本地資料。
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(
          "[tripStore] migration 失敗，保留 localStorage 待重試",
          e,
        );
      }
    }
  }

  async function handleLogout() {
    // 1. 取消訂閱
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    // 2. 清空前一位用戶的資料（避免下一位用戶登入時看到前一位的資料）
    trips.value = [];
  }

  function persist(trip: Trip) {
    const user = authStore.user;
    if (user) {
      // 登入：寫雲端，不碰 trips.value
      upsertTrip(user.uid, trip).catch((e) => {
        // todo：失敗時顯示 toast
        console.error("[tripStore] 寫入雲端失敗", trip.id, e);
      });
    } else {
      // 未登入：改 trips.value（watch 會寫進 localStorage）
      const i = trips.value.findIndex((t) => t.id === trip.id);
      if (i === -1) {
        trips.value.push(trip);
      } else {
        trips.value[i] = trip;
      }
    }
  }

  function loadTrips(): Trip[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw);
  }

  function addTrip(date: string, peakIds: number[], note?: string) {
    persist({
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
    const existing = trips.value.find((trip) => trip.id === id);

    if (!existing) return;

    persist({
      ...existing,
      date,
      peakIds,
      note,
      updatedAt: Date.now(),
      deleted: false,
    });
  }

  function deleteTrip(id: string) {
    const existing = trips.value.find((trip) => trip.id === id);

    if (!existing) return;

    persist({
      ...existing,
      updatedAt: Date.now(),
      deleted: true,
    });
  }

  watch(
    trips,
    () => {
      if (authStore.user) return; // 登入時不寫 localStorage
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
