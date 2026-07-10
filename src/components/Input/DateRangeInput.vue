<script setup lang="ts">
import { ref, computed } from "vue";
import { Calendar, ChevronDown, X } from "@lucide/vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";

const dateRange = ref<string[] | null>(null);
const emit = defineEmits(["openDatePicker"]);

const datePickerRef = ref<InstanceType<typeof VueDatePicker>>();

const dateRangeDisplay = computed(() => {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
    return "選擇日期範圍";
  }
  return `${dateRange.value[0]} ~ ${dateRange.value[1]}`;
});

const isDateRangeSelected = computed(() => {
  return dateRange.value && dateRange.value.length === 2;
});

const clearDateRange = (event: Event) => {
  event.stopPropagation();
  datePickerRef.value?.clearValue();
};

const isDatePickerOpen = ref(false);
</script>
<template>
  <VueDatePicker
    ref="datePickerRef"
    v-model="dateRange"
    range
    model-type="yyyy-MM-dd"
    :time-config="{ enableTimePicker: false }"
    @open="isDatePickerOpen = true"
    @closed="isDatePickerOpen = false"
  >
    <template #trigger>
      <div
        class="border rounded-md h-10 px-3 flex items-center gap-3 cursor-pointer"
        :class="
          isDatePickerOpen
            ? ' border-primary-500 ring-3 ring-primary-500/20'
            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
        "
      >
        <Calendar class="text-neutral-400 shrink-0" :size="16" />
        <span
          class="flex-1 min-w-0 text-sm"
          :class="isDateRangeSelected ? 'text-neutral-700' : 'text-neutral-400'"
          >{{ dateRangeDisplay }}</span
        >
        <ChevronDown
          v-if="!isDateRangeSelected"
          class="text-neutral-400 shrink-0"
          :size="16"
        />
        <X
          v-if="isDateRangeSelected"
          class="text-neutral-400 shrink-0"
          :size="16"
          @click="clearDateRange"
        />
      </div>
    </template>
  </VueDatePicker>
</template>
