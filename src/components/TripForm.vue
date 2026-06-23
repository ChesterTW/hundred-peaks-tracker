<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Trip } from "../types.ts";
import PeakTable from "./PeakTable.vue";

const date = ref<string>("");
const note = ref<string>("");
const selectedPeakIds = ref<number[]>([]);

const emit = defineEmits(["submit"]);

const props = withDefaults(
  defineProps<{
    initial?: Trip;
  }>(),
  {
    initial: undefined,
  },
);

function handleSubmit() {
  emit("submit", date.value, selectedPeakIds.value, note.value);

  date.value = new Date().toISOString().slice(0, 10);
  note.value = "";
  selectedPeakIds.value = [];
}

onMounted(() => {
  if (props.initial) {
    date.value = props.initial.date;
    note.value = props.initial.note ?? "";
    selectedPeakIds.value = props.initial.peakIds;
  } else {
    date.value = new Date().toISOString().slice(0, 10);
  }
});
</script>

<template>
  <div class="flex flex-col gap-2 mb-8">
    <input
      type="date"
      v-model="date"
      class="border border-gray-300 rounded px-3 py-2"
      placeholder="日期"
    />
    <input
      v-model="note"
      class="border border-gray-300 rounded px-3 py-2"
      placeholder="備註（選填）"
    />

    <button
      @click="handleSubmit"
      class="border border-gray-300 rounded px-3 py-2"
    >
      {{ props.initial ? "更新" : "新增" }}
    </button>
  </div>

  <PeakTable :selectable="true" v-model:selected="selectedPeakIds"></PeakTable>
</template>
