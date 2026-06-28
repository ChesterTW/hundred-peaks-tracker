import { computed, ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import { storeToRefs } from "pinia";
import { peaks } from "../data/peaks";

export function usePeakFilter() {
  const store = useTripStore();
  const { completedPeakIds } = storeToRefs(store);
  const completion = ref<"all" | "completed" | "incomplete">("all");

  const difficulties = ref<string[]>([]);
  const difficultyLevels = computed(() =>
    [...new Set(peaks.map((p) => p.difficulty))].sort(),
  );

  const filteredPeaks = computed(() => {
    return peaks.filter((peak) => {
      // 條件 A:完成狀態
      let completionStatus;

      switch (completion.value) {
        case "completed":
          completionStatus = completedPeakIds.value.has(peak.id);
          break;
        case "incomplete":
          completionStatus = !completedPeakIds.value.has(peak.id);
          break;
        default:
          completionStatus = true;
          break;
      }

      // 條件 B:難度
      let difficultyStatus;

      if (difficulties.value.length === 0) {
        difficultyStatus = true;
      } else if (difficulties.value.includes(peak.difficulty)) {
        difficultyStatus = true;
      } else {
        difficultyStatus = false;
      }
      // 兩者都通過才回 true
      return completionStatus && difficultyStatus;
    });
  });

  function toggleDifficulty(level: string) {
    const i = difficulties.value.indexOf(level);
    if (i === -1)
      difficulties.value.push(level); // 不在 → 加入
    else difficulties.value.splice(i, 1); // 已在 → 移除
  }

  return {
    completion,
    difficulties,
    filteredPeaks,
    difficultyLevels,
    toggleDifficulty,
  };
}
