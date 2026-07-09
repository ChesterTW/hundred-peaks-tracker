<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Search } from "@lucide/vue";
import TextInput from "../components/Input/TextInput.vue";
import { peaks } from "../data/peaks.ts";
import Chip from "../components/peakList/Chip.vue";
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

function rowBorderClass(index: number) {
  return index === peaks.length - 1 ? "" : "border-b border-neutral-100";
}
</script>

<template>
  <div class="flex flex-col gap-3 px-7 py-6 w-full h-full">
    <div class="flex gap-6 items-center">
      <p class="text-2xl font-bold text-neutral-700">山峰清單</p>
      <div class="flex gap-3 items-center">
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
      class="grid grid-cols-[auto_auto_1fr_auto_auto_1fr] grid-rows-[auto_1fr] gap-x-6 px-8 border border-neutral-200 rounded-lg flex-1 overflow-hidden"
    >
      <div
        class="col-span-6 row-start-1 grid grid-cols-subgrid items-center bg-neutral-100 -mx-8 px-8"
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
        class="col-span-6 row-start-2 grid grid-cols-subgrid gap-x-6 items-center content-start overflow-y-auto min-h-0 -mr-8"
      >
        <template v-for="(peak, index) in filteredPeaks" :key="peak.id">
          <div>
            <div
              v-if="completedPeakIds.has(peak.id)"
              class="bg-[#E5F0E5] px-3 py-1 rounded-full"
            >
              <p class="text-success text-xs font-medium">已登頂</p>
            </div>
            <div
              v-else
              class="bg-white px-3 py-1 rounded-full border border-neutral-300"
            >
              <p class="text-neutral-400 text-xs font-medium">未登頂</p>
            </div>
          </div>

          <p
            class="py-4 text-neutral-400 font-medium text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.id }}
          </p>
          <p
            class="py-4 text-neutral-700 font-medium text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.name }}
          </p>
          <p
            class="py-4 text-neutral-700 text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.elevation }} m
          </p>
          <p
            class="py-4 text-neutral-700 text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.range }}
          </p>
          <div>
            <div class="bg-neutral-100 rounded-full px-3 py-1 w-fit h-fit">
              <p class="text-neutral-700 text-xs">
                體能 Lv.{{ peak.rating.physical }}・風險 Lv.{{
                  peak.rating.risk
                }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
