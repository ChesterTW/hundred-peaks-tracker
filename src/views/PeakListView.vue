<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Search } from "@lucide/vue";
import TextInput from "../components/Input/TextInput.vue";
import { peaks } from "../data/peaks.ts";
import Chip from "../components/peakList/Chip.vue";
import PeakRow from "../components/peakList/PeakRow.vue";
import DifficultyMatrixPopover from "../components/peakList/DifficultyMatrixPopover.vue";
import { useTripStore } from "../stores/tripStore";
import { storeToRefs } from "pinia";
import { ChevronDown } from "@lucide/vue";

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);

const searchKeyword = ref<string>("");

const isDifficultyPopoverOpen = ref(false);
const selectedDifficulty = ref<{ physical: number; risk: number } | null>(null);
const difficultyFilterRef = ref<HTMLElement | null>(null);

const filteredPeaks = computed(() => {
  let result = peaks;

  if (searchKeyword.value) {
    result = result.filter((peak) => peak.name.includes(searchKeyword.value));
  }

  if (selectedChip.value === "已登頂") {
    result = result.filter((peak) => completedPeakIds.value.has(peak.id));
  } else if (selectedChip.value === "未登頂") {
    result = result.filter((peak) => !completedPeakIds.value.has(peak.id));
  }

  if (selectedDifficulty.value) {
    const { physical, risk } = selectedDifficulty.value;
    result = result.filter(
      (peak) => peak.rating.physical === physical && peak.rating.risk === risk,
    );
  }

  return result;
});

function handleSelectDifficulty(physical: number, risk: number) {
  selectedDifficulty.value = { physical, risk };
  isDifficultyPopoverOpen.value = false;
}

function handleClearDifficulty() {
  selectedDifficulty.value = null;
  isDifficultyPopoverOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (
    isDifficultyPopoverOpen.value &&
    difficultyFilterRef.value &&
    !difficultyFilterRef.value.contains(event.target as Node)
  ) {
    isDifficultyPopoverOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});

const tableHeaders = [
  { name: "狀態", key: "status" },
  { name: "排名", key: "id" },
  { name: "山名", key: "peakIds" },
  { name: "高度", key: "elevation" },
  { name: "山脈", key: "range" },
  { name: "難度", key: "rating" },
];

const chips = [{ text: "全部" }, { text: "已登頂" }, { text: "未登頂" }];
const selectedChip = ref<string>(chips[0].text);
</script>

<template>
  <div class="flex flex-col gap-3 px-4 md:px-7 py-6 w-full h-full">
    <div class="flex flex-col md:flex-row gap-3 md:gap-6 md:items-center">
      <p class="text-2xl font-bold text-neutral-700">山峰清單</p>
      <div class="flex flex-wrap gap-3 items-center">
        <TextInput
          :icon="Search"
          v-model="searchKeyword"
          :placeholder="'搜尋山名...'"
        ></TextInput>
        <template v-for="chip in chips" :key="chip.text">
          <Chip
            :text="chip.text"
            :isSelected="selectedChip === chip.text"
            @click="selectedChip = chip.text"
          />
        </template>
        <div ref="difficultyFilterRef" class="relative">
          <button
            type="button"
            class="flex gap-1 items-center rounded-md border pl-3 pr-2 py-1 cursor-pointer hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
            :class="
              selectedDifficulty ? 'border-primary-500' : 'border-neutral-300'
            "
            :aria-expanded="isDifficultyPopoverOpen"
            @click="isDifficultyPopoverOpen = !isDifficultyPopoverOpen"
          >
            <p class="text-neutral-700 text-sm">
              {{
                selectedDifficulty
                  ? `體能 Lv.${selectedDifficulty.physical}・風險 Lv.${selectedDifficulty.risk}`
                  : "難度"
              }}
            </p>
            <ChevronDown class="text-neutral-700" :size="16" />
          </button>

          <DifficultyMatrixPopover
            v-if="isDifficultyPopoverOpen"
            class="absolute top-full mt-2 left-0 z-20"
            :peaks="peaks"
            :selected="selectedDifficulty"
            @select="handleSelectDifficulty"
            @clear="handleClearDifficulty"
          />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col md:grid md:grid-cols-[auto_auto_1fr_1fr_1fr_1fr] md:grid-rows-[auto_1fr] gap-y-3 md:gap-y-0 md:gap-x-6 md:px-8 md:border md:border-neutral-200 md:rounded-lg flex-1 overflow-hidden"
    >
      <div
        class="hidden md:col-span-6 md:row-start-1 md:grid md:grid-cols-subgrid items-center bg-neutral-100 -mx-8 px-8"
      >
        <div
          v-for="header in tableHeaders"
          :key="header.name"
          class="py-3 border-b border-neutral-100"
        >
          <p class="font-medium text-neutral-400 text-sm">{{ header.name }}</p>
        </div>
      </div>

      <div
        class="flex flex-col gap-3 pb-16 md:pb-0 md:col-span-6 md:row-start-2 md:grid md:grid-cols-subgrid md:gap-x-6 md:items-center md:content-start overflow-y-auto min-h-0 md:-mr-8"
      >
        <PeakRow
          v-for="(peak, index) in filteredPeaks"
          :key="peak.id"
          :peak="peak"
          :isCompleted="completedPeakIds.has(peak.id)"
          :isLast="index === peaks.length - 1"
        />
      </div>
    </div>
  </div>
</template>
