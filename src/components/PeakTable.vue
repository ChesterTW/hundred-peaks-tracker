<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useTripStore } from "../stores/tripStore";
import { peaks } from "../data/peaks";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    selectable?: boolean;
  }>(),
  {
    selectable: false,
  },
);

const store = useTripStore();
const { completedPeakIds } = storeToRefs(store);
const router = useRouter();

const keyword = ref<string>("");
const filterStatus = ref<"all" | "completed" | "incomplete">("all");
const filters = [
  { value: "all", label: "全部" },
  { value: "completed", label: "已登頂" },
  { value: "incomplete", label: "未登頂" },
] as const;

const selectedPeakIds = defineModel<number[]>("selected", {
  default: () => [],
});

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

function goToDetail(peakId: number) {
  if (props.selectable) {
    return;
  }
  router.push({ name: "peak-detail", params: { id: peakId } });
}
</script>

<template>
  <div class="flex gap-2 sticky top-0 bg-white z-10 py-4">
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
      :class="filterStatus === filter.value ? 'bg-[#42b883] text-white' : ''"
    >
      {{ filter.label }}
    </button>
  </div>

  <div class="overflow-hidden rounded-lg border border-gray-200">
    <table class="w-full text-left">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="px-4 py-3" v-if="selectable">選擇</th>
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
          :class="[
            props.selectable ? '' : 'cursor-pointer',
            selectedPeakIds.includes(peak.id)
              ? 'bg-green-100'
              : 'hover:bg-gray-50',
          ]"
          @click="goToDetail(peak.id)"
        >
          <td class="px-4 py-3" v-if="selectable">
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
</template>
