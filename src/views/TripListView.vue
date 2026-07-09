<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import TextInput from "../components/Input/TextInput.vue";
import DateRangeInput from "../components/Input/DateRangeInput.vue";
import TripModal from "../components/tripModal/TripModal.vue";
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

const actions = [
  {
    name: "編輯",
    key: "edit",
    action: (tripId: string) => {
      editTripId.value = tripId;
      isTripModalOpen.value = true;
    },
  },
  {
    name: "刪除",
    key: "delete",
    action: (tripId: string) => deleteTrip(tripId),
  },
];

function rowBorderClass(index: number) {
  return index === filteredTrips.value.length - 1
    ? ""
    : "border-b border-neutral-100";
}
</script>

<template>
  <div class="flex flex-col gap-3 px-7 py-6 w-full h-full">
    <div class="flex gap-6 items-center">
      <p class="text-2xl font-bold text-neutral-700">行程紀錄</p>
      <div class="flex gap-3 items-center">
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
        class="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 rounded-md w-fit h-fit cursor-pointer ml-auto"
        @click="isTripModalOpen = true"
      >
        <p class="text-white text-sm mx-4 my-2">新增行程</p>
      </div>
    </div>

    <div
      class="grid grid-cols-[auto_1fr_auto_auto] gap-x-6 px-8 items-center border border-neutral-200 rounded-lg"
    >
      <div
        v-for="header in tableHeaders"
        :key="header.name"
        class="py-3 border-b border-neutral-100"
      >
        <p>{{ header.name }}</p>
      </div>

      <template v-for="(trip, index) in filteredTrips" :key="trip.id">
        <p class="py-4" :class="rowBorderClass(index)">{{ trip.date }}</p>
        <p class="py-4" :class="rowBorderClass(index)">
          {{ trip.peakIds.map((id) => getPeakName(id)).join("、") }}
        </p>
        <p class="py-4" :class="rowBorderClass(index)">
          {{ trip.note === "" ? "-" : trip.note }}
        </p>
        <div class="flex gap-3 py-4" :class="rowBorderClass(index)">
          <p
            v-for="action in actions"
            :key="action.name"
            class="text-primary-500 hover:text-primary-600 active:text-primary-700 cursor-pointer"
            @click="action.action(trip.id)"
          >
            {{ action.name }}
          </p>
        </div>
      </template>
    </div>
  </div>

  <TripModal
    v-if="isTripModalOpen"
    :tripId="editTripId !== null ? editTripId : undefined"
    :open="isTripModalOpen"
    @update:open="isTripModalOpen = $event"
  />
</template>
