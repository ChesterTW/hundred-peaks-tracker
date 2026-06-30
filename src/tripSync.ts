import type { Trip } from "./types";

export function mergeTrips(a: Trip[], b: Trip[]): Trip[] {
  // 在數學表達上，就是要將 A 和 B 做成「聯集（Union）」，也就是包含所有在 A 或 B 中的元素。
  // 但是又不要有重複的元素，所以要用「去重（Deduplication）」的方式來處理。
  let merged: Trip[] = [];

  // 取得所有 a 的 id，方便後續判斷某個 id 是否只在 a 中出現。
  const aIds = new Set(a.map((trip) => trip.id));

  for (const trip of [...a, ...b]) {
    // 如果這個 ID 只在 b 中出現，沒有在 a 中出現，就直接加入 merged。
    if (!aIds.has(trip.id)) {
      merged.push(trip);
    } else {
      const aTrip = a.find((t) => t.id === trip.id);

      // 如果這個 ID 在 a、b 都有
      // 優先取得 updatedAt 較新的那一個，並將其加入 merged。
      if (aTrip && aTrip.updatedAt < trip.updatedAt) {
        merged = merged.filter((t) => t.id !== trip.id);
        merged.push(trip);
      }

      // 某個 id 在 b 是 deleted: true（墓碑）、在 a 是正常的，且墓碑的 updatedAt 較新」
      if (aTrip && trip.deleted && trip.updatedAt > aTrip.updatedAt) {
        merged = merged.filter((t) => t.id !== trip.id);
        merged.push(trip);
      }

      // 兩邊 updatedAt 完全相等
      if (aTrip && aTrip.updatedAt === trip.updatedAt) {
        merged = merged.filter((t) => t.id !== trip.id);
        merged.push(trip);
      }
    }
  }

  return merged;
}
