<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { peaks } from "../data/peaks";
import { useTripStore } from "../stores/tripStore";

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);

const keyword = ref<string>("");
const filteredPeaks = computed(() => {
  if (!keyword.value) return peaks;
  return peaks.filter((item) => item.name.includes(keyword.value));
});
</script>

<template>
  <h1 class="text-2xl font-bold p-4">百岳列表</h1>

  <div class="p-4">
    <input
      v-model="keyword"
      placeholder="搜尋山名"
      class="border border-gray-200 px-3 py-2 rounded-lg mb-4"
    />
    <div class="overflow-hidden rounded-lg border border-gray-200">
      <table class="w-full text-left">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
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
            class="hover:bg-gray-50"
          >
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
