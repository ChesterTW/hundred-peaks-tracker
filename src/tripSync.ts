import type { Trip } from "./types";
import * as api from "./api";

export function fetchAllTrips(): Promise<Trip[]> {
  return api.fetchTrips();
}

export function createTrip(input: {
  date: string;
  peakIds: number[];
  note?: string;
}): Promise<Trip> {
  return api.createTrip(input);
}

export function updateTripRemote(
  id: string,
  input: { date: string; peakIds: number[]; note?: string },
): Promise<Trip> {
  return api.updateTrip(id, input);
}

export function deleteTripRemote(id: string): Promise<void> {
  return api.deleteTrip(id);
}
