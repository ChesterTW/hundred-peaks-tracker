<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import TextInput from "../components/Input/TextInput.vue";
import DateRangeInput from "../components/Input/DateRangeInput.vue";
import TripModal from "../components/tripModal/TripModal.vue";
import TripRow from "../components/tripList/TripRow.vue";
import { useTripStore } from "../stores/tripStore";
import { storeToRefs } from "pinia";

const store = useTripStore();
const { activeTrips } = storeToRefs(store);
const { getPeakName, deleteTrip } = useTripStore();

const searchKeyword = ref<string>("");
const dateRange = ref<string[] | null>(null);
const filteredTrips = computed(() => {
  let trips = activeTrips.value;

  if (searchKeyword.value) {
    trips = trips.filter((trip) =>
      trip.peakIds.some((id) => getPeakName(id).includes(searchKeyword.value)),
    );
  }

  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value;
    trips = trips.filter(
      (trip) => trip.date >= startDate && trip.date <= endDate,
    );
  }

  return trips;
});

const isTripModalOpen = ref(false);
const editTripId = ref<string | null>(null);

const tableHeaders = [
  { name: "日期", key: "date" },
  { name: "山名", key: "peakIds" },
  { name: "備註", key: "note" },
  { name: "操作", key: "actions" },
];

function handleEdit(tripId: string) {
  editTripId.value = tripId;
  isTripModalOpen.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-3 px-4 md:px-7 py-6 w-full h-full">
    <div class="flex flex-col md:flex-row gap-3 md:gap-6 md:items-center">
      <p class="text-2xl font-bold text-neutral-700">行程紀錄</p>
      <div class="flex flex-wrap gap-3 items-center">
        <TextInput
          :icon="Search"
          v-model="searchKeyword"
          :placeholder="'搜尋山名...'"
        ></TextInput>

        <DateRangeInput v-model="dateRange" />

        <p class="text-xs text-neutral-400">
          共 {{ filteredTrips.length }} 筆行程
        </p>
      </div>
      <div
        class="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 rounded-md w-fit h-fit cursor-pointer md:ml-auto"
        @click="isTripModalOpen = true"
      >
        <p class="text-white text-sm mx-4 my-2">新增行程</p>
      </div>
    </div>

    <div
      class="flex flex-col md:grid md:grid-cols-[auto_4fr_1fr_1fr] md:grid-rows-[auto_1fr] gap-y-3 md:gap-y-0 md:gap-x-6 md:px-8 md:border md:border-neutral-200 md:rounded-lg flex-1 overflow-hidden"
    >
      <div
        class="hidden md:col-span-4 md:row-start-1 md:grid md:grid-cols-subgrid items-center bg-neutral-100 -mx-8 px-8"
      >
        <div
          v-for="header in tableHeaders"
          :key="header.name"
          class="py-3 border-b border-neutral-100"
        >
          <p class="font-medium text-neutral-400 text-sm">{{ header.name }}</p>
        </div>
      </div>

      <div
        class="flex flex-col gap-3 pb-16 md:pb-0 md:col-span-4 md:row-start-2 md:grid md:grid-cols-subgrid md:gap-x-6 md:items-center md:content-start overflow-y-auto min-h-0 md:-mr-8"
      >
        <TripRow
          v-for="(trip, index) in filteredTrips"
          :key="trip.id"
          :trip="trip"
          :peakNames="trip.peakIds.map((id) => getPeakName(id)).join('、')"
          :isLast="index === filteredTrips.length - 1"
          @edit="handleEdit(trip.id)"
          @delete="deleteTrip(trip.id)"
        />
      </div>
    </div>
  </div>

  <TripModal
    v-if="isTripModalOpen"
    :tripId="editTripId !== null ? editTripId : undefined"
    :open="isTripModalOpen"
    @update:open="isTripModalOpen = $event"
  />
</template>
