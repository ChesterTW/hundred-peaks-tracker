<script setup lang="ts">
import { ref } from "vue";
import { Calendar, ChevronDown } from "@lucide/vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";

const date = defineModel<string>({});
const emit = defineEmits(["openDatePicker"]);

const isDatePickerOpen = ref(false);
</script>
<template>
  <VueDatePicker
    v-model="date"
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
            ? 'border-primary-500 ring-3 ring-primary-500/20'
            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
        "
      >
        <Calendar class="text-neutral-400 shrink-0" :size="16" />
        <input
          ref="dateInput"
          type="date"
          v-model="date"
          class="flex-1 min-w-0 outline-none bg-transparent text-sm text-neutral-900 [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
        />
        <ChevronDown class="text-neutral-400 shrink-0" :size="16" />
      </div>
    </template>
  </VueDatePicker>
</template>
