<script setup lang="ts">
import { ref } from "vue";
import { useTripStore } from "../stores/tripStore";

const { addTrip } = useTripStore();

const date = ref<string>("");
const peakIds = ref<number[]>([]);
const note = ref<string>();
</script>

<template>
  <h1 class="text-2xl font-bold p-4">新增登山行程</h1>

  <div class="flex flex-col gap-2 p-4">
    <input
      v-model="date"
      class="border border-gray-300 rounded px-3 py-2"
      placeholder="日期"
    />
    <input
      v-model="peakIds"
      class="border border-gray-300 rounded px-3 py-2"
      placeholder="山峰ID"
    />
    <input
      v-model="note"
      class="border border-gray-300 rounded px-3 py-2"
      placeholder="備註（選填）"
    />

    <button
      @click="addTrip(date, peakIds, note)"
      class="border border-gray-300 rounded px-3 py-2"
    >
      新增
    </button>
  </div>
</template>
