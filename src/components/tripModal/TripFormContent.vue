<script setup lang="ts">
import { computed, ref } from "vue";
import type { Peak } from "../../types.ts";
import { peaks } from "../../data/peaks.ts";
import { X, Search } from "@lucide/vue";
import PeakChip from "./PeakChip.vue";
import PeakListItem from "./PeakListItem.vue";
import TextInput from "../Input/TextInput.vue";
import DateInput from "../Input/DateInput.vue";

const date = defineModel<string>("date", { required: true });
const note = defineModel<string>("note", { required: true });
const selectedPeaks = defineModel<Peak[]>("selectedPeaks", { required: true });

defineProps<{
  isEditMode: boolean;
}>();

const emit = defineEmits<{
  close: [];
  save: [];
}>();

const searchKeyword = ref<string>("");

const filteredPeaks = computed(() => {
  if (!searchKeyword.value) return peaks;
  return peaks.filter((peak) => peak.name.includes(searchKeyword.value));
});

const isFormValid = computed(
  () => Boolean(date.value) && selectedPeaks.value.length > 0,
);

function isSelected(peak: Peak) {
  return selectedPeaks.value.some((p) => p.id === peak.id);
}

function togglePeak(peak: Peak) {
  const i = selectedPeaks.value.findIndex((p) => p.id === peak.id);
  if (i === -1) {
    selectedPeaks.value.push(peak);
  } else {
    selectedPeaks.value.splice(i, 1);
  }
}
</script>

<template>
  <div class="flex items-center px-6 py-4">
    <p class="text-xl font-md text-neutral-700">
      {{ isEditMode ? "編輯行程" : "新增行程" }}
    </p>
    <div
      class="bg-neutral-100 w-fit h-fit rounded-md hover:bg-neutral-200 active:bg-neutral-300 cursor-pointer ml-auto"
      @click="emit('close')"
    >
      <X class="text-neutral-700 m-2" :size="16"></X>
    </div>
  </div>

  <div
    class="border-t border-b border-neutral-200 px-6 py-4 max-h-[90vh] overflow-y-auto flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-neutral-700">日期</p>
      <DateInput v-model="date"></DateInput>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-neutral-700">選擇山峰</p>

      <TextInput
        :icon="Search"
        v-model="searchKeyword"
        :placeholder="'搜尋山名...'"
      />

      <div
        v-if="selectedPeaks.length > 0"
        class="flex flex-wrap items-center gap-2"
      >
        <PeakChip
          v-for="peak in selectedPeaks"
          :key="peak.id"
          :peakName="peak.name"
          @remove="togglePeak(peak)"
        />
      </div>

      <div
        class="bg-white border border-neutral-200 rounded-md h-55 overflow-y-auto w-full"
      >
        <div
          v-for="(peak, index) in filteredPeaks"
          :key="peak.id"
          class="border-neutral-100 cursor-pointer"
          :class="index === filteredPeaks.length - 1 ? '' : 'border-b'"
          @click="togglePeak(peak)"
        >
          <PeakListItem :peak="peak" :isSelected="isSelected(peak)" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-neutral-700">備註（選填）</p>
      <TextInput
        v-model="note"
        :placeholder="'例如：單攻、369 山屋、天氣晴…'"
      />
    </div>
  </div>

  <div class="bg-neutral-50 px-6 py-4">
    <div class="w-fit h-fit flex gap-3 ml-auto">
      <div
        class="bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-200 rounded-md w-fit h-fit cursor-pointer"
        @click="emit('close')"
      >
        <p class="text-neutral-700 text-sm mx-4 my-2">取消</p>
      </div>
      <div
        class="rounded-md w-fit h-fit cursor-pointer"
        :class="
          isFormValid
            ? 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700'
            : 'bg-neutral-300 cursor-not-allowed'
        "
        @click="isFormValid && emit('save')"
      >
        <p class="text-white text-sm mx-4 my-2">儲存</p>
      </div>
    </div>
  </div>
</template>
