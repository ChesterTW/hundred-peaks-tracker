<script setup lang="ts">
import { ref, computed } from "vue";
import { Calendar, ChevronDown } from "@lucide/vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";

const dateRange = ref<string[] | null>(null);
const emit = defineEmits(["openDatePicker"]);

const dateRangeDisplay = computed(() => {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
    return "選擇日期範圍";
  }
  return `${dateRange.value[0]} ~ ${dateRange.value[1]}`;
});
</script>
<template>
  <VueDatePicker
    v-model="dateRange"
    range
    model-type="yyyy-MM-dd"
    :time-config="{ enableTimePicker: false }"
  >
    <template #trigger>
      <div
        class="border border-neutral-200 rounded-md h-10 px-3 flex items-center gap-3 cursor-pointer"
      >
        <Calendar class="text-neutral-400 shrink-0" :size="16" />
        <span
          class="flex-1 min-w-0 text-sm"
          :class="dateRange?.values ? 'text-neutral-700' : 'text-neutral-400'"
          >{{ dateRangeDisplay }}</span
        >
        <ChevronDown class="text-neutral-400 shrink-0" :size="16" />
      </div>
    </template>
  </VueDatePicker>
</template>
