<script setup lang="ts">
import { ref, computed } from "vue";
import { useTripStore } from "../stores/tripStore";
import { usePeakNames } from "../composables/usePeakNames";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import type { Trip } from "../types";

const store = useTripStore();
const { deleteTrip } = store;
const { peakNames } = usePeakNames();

const props = withDefaults(
  defineProps<{
    deletable?: boolean;
    searchable?: boolean;
    trips: Trip[];
  }>(),
  {
    deletable: false,
    searchable: false,
  },
);

const keyword = ref("");
const dateRange = ref();
const filteredTrips = computed(() => {
  let result = props.trips;

  if (keyword.value) {
    result = result.filter((item) =>
      peakNames(item.peakIds).includes(keyword.value),
    );
  }

  // 依日期區間（起、迄各自獨立判斷）
  if (dateRange.value?.[0]) {
    result = result.filter((trip) => trip.date >= dateRange.value[0]);
  }
  if (dateRange.value?.[1]) {
    result = result.filter((trip) => trip.date <= dateRange.value[1]);
  }

  return result;
});

function handleDelete(id: string) {
  if (confirm("確定刪除這筆行程？")) {
    deleteTrip(id);
  }
}
</script>

<template>
  <div class="flex gap-2 mb-4" v-if="searchable">
    <input
      v-model="keyword"
      placeholder="搜尋山名"
      class="border border-gray-200 px-3 py-2 rounded-lg"
    />
    <VueDatePicker
      v-model="dateRange"
      range
      model-type="yyyy-MM-dd"
      :enable-time-picker="false"
    />
  </div>

  <div class="overflow-hidden rounded-lg border border-gray-200">
    <table class="w-full text-left">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="px-4 py-3">日期</th>
          <th class="px-4 py-3">山峰</th>
          <th class="px-4 py-3">備註</th>
          <th class="px-4 py-3" v-if="deletable">操作</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="trip in filteredTrips"
          :key="trip.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3 whitespace-nowrap">{{ trip.date }}</td>
          <td class="px-4 py-3">{{ peakNames(trip.peakIds) }}</td>
          <td class="px-4 py-3 text-gray-500">{{ trip.note || "—" }}</td>
          <td class="px-4 py-3" v-if="deletable">
            <button
              @click="handleDelete(trip.id)"
              class="text-red-600 hover:text-red-800 hover:underline"
            >
              刪除
            </button>
          </td>
        </tr>

        <tr v-if="filteredTrips.length === 0">
          <td colspan="4" class="px-4 py-8 text-center text-gray-400">
            {{
              trips.length === 0
                ? "還沒有任何行程紀錄"
                : "沒有符合條件的行程紀錄"
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
