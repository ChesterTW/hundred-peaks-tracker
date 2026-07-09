<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import TextInput from "../components/Input/TextInput.vue";
import { peaks } from "../data/peaks.ts";
import Chip from "../components/peakList/Chip.vue";
import { useTripStore } from "../stores/tripStore";
import { storeToRefs } from "pinia";

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);

const searchKeyword = ref<string>("");
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

  return result;
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
          <p
            class="py-4 text-neutral-700 font-medium text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.id }}
          </p>
          <p
            class="py-4 text-neutral-700 font-medium text-sm"
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
            class="py-4 text-neutral-400 text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.elevation }} m
          </p>
          <p
            class="py-4 text-neutral-400 text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.range }}
          </p>
          <p
            class="py-4 text-neutral-400 text-sm"
            :class="rowBorderClass(index)"
          >
            {{ peak.rating }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
