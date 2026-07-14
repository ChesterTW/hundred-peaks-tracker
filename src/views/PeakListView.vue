<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import TextInput from "../components/Input/TextInput.vue";
import { peaks } from "../data/peaks.ts";
import Chip from "../components/peakList/Chip.vue";
import PeakRow from "../components/peakList/PeakRow.vue";
import DifficultyFilterButton from "../components/peakList/DifficultyFilterButton.vue";
import { useTripStore } from "../stores/tripStore";
import { storeToRefs } from "pinia";

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);

const searchKeyword = ref<string>("");

const selectedDifficulty = ref<{ physical: number; risk: number } | null>(null);

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
}

function handleClearDifficulty() {
  selectedDifficulty.value = null;
}

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
      <p class="hidden md:block text-2xl font-bold text-neutral-700">
        山峰清單
      </p>

      <!-- 桌面版 -->
      <div class="hidden md:flex gap-3 items-center">
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
        <DifficultyFilterButton
          :peaks="peaks"
          :selected="selectedDifficulty"
          @select="handleSelectDifficulty"
          @clear="handleClearDifficulty"
        />
      </div>

      <!-- 手機版 -->
      <div class="md:hidden flex flex-col gap-3 items-center">
        <TextInput
          :icon="Search"
          v-model="searchKeyword"
          :placeholder="'搜尋山名...'"
          class="w-full"
        ></TextInput>
        <div class="flex gap-3 w-full">
          <template v-for="chip in chips" :key="chip.text">
            <Chip
              :text="chip.text"
              :isSelected="selectedChip === chip.text"
              @click="selectedChip = chip.text"
            />
          </template>
          <DifficultyFilterButton
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
