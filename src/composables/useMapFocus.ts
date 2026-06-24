import { ref } from "vue";

const focusedPeakId = ref<string | null>(null);
const hoveredPeakId = ref<number | null>(null);

export function useMapFocus() {
  return { focusedPeakId, hoveredPeakId };
}
