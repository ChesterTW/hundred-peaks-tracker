import { peaks } from "../data/peaks";

const peakMap = new Map(peaks.map((p) => [p.id, p.name]));

export function usePeakNames() {
  function peakNames(peakIds: number[]): string {
    return peakIds.map((id) => peakMap.get(id)).join("、");
  }

  return { peakNames };
}
