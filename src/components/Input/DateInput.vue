<script setup lang="ts">
import { Calendar, ChevronDown } from "@lucide/vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";

const date = defineModel<string>({});
const emit = defineEmits(["openDatePicker"]);
</script>
<template>
  <VueDatePicker
    v-model="date"
    model-type="yyyy-MM-dd"
    :time-config="{ enableTimePicker: false }"
  >
    <template #trigger>
      <div
        class="border border-neutral-200 rounded-md h-10 px-3 flex items-center gap-3 cursor-pointer"
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
