<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import { peaks } from "../data/peaks";

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);
const { addTrip } = store;

const date = ref<string>("");
const note = ref<string>("");

const keyword = ref<string>("");
const filterStatus = ref<"all" | "completed" | "incomplete">("all");
const filters = [
  { value: "all", label: "全部" },
  { value: "completed", label: "已登頂" },
  { value: "incomplete", label: "未登頂" },
] as const;

const selectedPeakIds = ref<number[]>([]);

const filteredPeaks = computed(() => {
  let result = peaks;

  // 1. 關鍵字篩選
  if (keyword.value) {
    result = peaks.filter((item) => item.name.includes(keyword.value));
  }

  // 2. 根據狀態篩選
  if (filterStatus.value === "completed") {
    result = result.filter((item) => completedPeakIds.value.has(item.id));
  } else if (filterStatus.value === "incomplete") {
    result = result.filter((item) => !completedPeakIds.value.has(item.id));
  }

  return result;
});

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

    <div class="flex gap-2 mb-4 mt-8">
      <input
        v-model="keyword"
        placeholder="搜尋山名"
        class="border border-gray-200 px-3 py-2 rounded-lg"
      />

      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="filterStatus = filter.value"
        class="border border-gray-200 rounded-lg px-3 py-2"
        :class="{ active: filterStatus === filter.value }"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200">
      <table class="w-full text-left">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3">選擇</th>
            <th class="px-4 py-3">狀態</th>
            <th class="px-4 py-3">排名</th>
            <th class="px-4 py-3">山名</th>
            <th class="px-4 py-3">高度</th>
            <th class="px-4 py-3">行政區</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="peak in filteredPeaks"
            :key="peak.id"
            :class="
              selectedPeakIds.includes(peak.id)
                ? 'bg-green-100'
                : 'hover:bg-gray-50'
            "
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :value="peak.id"
                v-model="selectedPeakIds"
                class="w-4 h-4"
              />
            </td>
            <td class="px-4 py-3">
              {{ completedPeakIds.has(peak.id) ? "已登頂" : "-" }}
            </td>
            <td class="px-4 py-3">{{ peak.id }}</td>
            <td class="px-4 py-3">{{ peak.name }}</td>
            <td class="px-4 py-3">{{ peak.elevation }}</td>
            <td class="px-4 py-3">{{ peak.region }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: #42b883;
  color: white;
}
</style>
