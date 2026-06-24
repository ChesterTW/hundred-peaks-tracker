import { ref } from "vue";

const focusedPeakId = ref<string | null>(null);

export function useMapFocus() {
  return { focusedPeakId };
}
