<script setup lang="ts">
import { ref } from "vue";
import { Calendar, ChevronDown } from "@lucide/vue";

const date = defineModel<string>({});
const emit = defineEmits(["openDatePicker"]);

const dateInput = ref<HTMLInputElement | null>(null);

function openDatePicker() {
  dateInput.value?.showPicker();
}
</script>
<template>
  <div
    class="border border-neutral-200 rounded-md h-10 px-3 flex items-center gap-3 cursor-pointer"
    @click="openDatePicker"
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
