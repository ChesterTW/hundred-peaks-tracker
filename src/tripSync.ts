import type { Trip } from "./types";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";

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

export async function upsertTrip(uid: string, trip: Trip) {
  const docRef = doc(db, `users/${uid}/trips/${trip.id}`);
  await setDoc(docRef, trip);
}

export function subscribeTrips(uid: string, onChange: (trips: Trip[]) => void) {
  const colRef = collection(db, `users/${uid}/trips`);

  const unsubscribe = onSnapshot(colRef, (snapshot) => {
    const trips = snapshot.docs.map((d) => d.data() as Trip);
    onChange(trips);
  });

  return unsubscribe;
}

export async function fetchAllTrips(uid: string): Promise<Trip[]> {
  const colRef = collection(db, `users/${uid}/trips`);

  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((d) => d.data() as Trip);
}
