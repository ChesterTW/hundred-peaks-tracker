import type { Trip } from "./types";

export function mergeTrips(a: Trip[], b: Trip[]): Trip[] {
  const byId = new Map<string, Trip>();

  for (const trip of [...a, ...b]) {
    const existing = byId.get(trip.id);
    if (!existing || trip.updatedAt >= existing.updatedAt) {
      byId.set(trip.id, trip);
    }
  }

  return [...byId.values()];
}
