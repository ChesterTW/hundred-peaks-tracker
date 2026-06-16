<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import PeakTable from "../components/PeakTable.vue";

const store = useTripStore();
const { addTrip } = store;

const date = ref<string>(new Date().toISOString().slice(0, 10));
const note = ref<string>("");

const selectedPeakIds = ref<number[]>([]);

function handleAddTrip() {
  addTrip(date.value, selectedPeakIds.value, note.value);

  date.value = "";
  selectedPeakIds.value = [];
  note.value = "";
}
</script>

<template>
  <h1 class="text-2xl font-bold p-4">新增登山行程</h1>

  <div class="flex flex-col gap-2 p-4">
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
      @click="handleAddTrip()"
      class="border border-gray-300 rounded px-3 py-2"
    >
      新增
    </button>

    <PeakTable
      :selectable="true"
      v-model:selected="selectedPeakIds"
    ></PeakTable>
  </div>
</template>
