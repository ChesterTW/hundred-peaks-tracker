<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Peak } from "../../types.ts";
import { peaks } from "../../data/peaks.ts";
import { useTripStore } from "../../stores/tripStore.ts";
import TripFormContent from "./TripFormContent.vue";
import BottomSheet from "../BottomSheet.vue";

const store = useTripStore();

const props = withDefaults(
  defineProps<{
    open: boolean;
    tripId?: string | null;
  }>(),
  {
    tripId: null,
  },
);
const emit = defineEmits<{
  "update:open": [boolean];
}>();

const date = ref<string>(new Date().toISOString().slice(0, 10));
const note = ref<string>("");
const selectedPeaks = ref<Peak[]>([]);

const isEditMode = computed(() => props.tripId !== null);

function close() {
  date.value = new Date().toISOString().slice(0, 10);
  note.value = "";
  selectedPeaks.value = [];

  emit("update:open", false);
}

function handleSaveTrip() {
  if (isEditMode.value) {
    store.updateTrip(
      props.tripId!,
      date.value,
      selectedPeaks.value.map((p) => p.id),
      note.value,
    );
  } else {
    store.addTrip(
      date.value,
      selectedPeaks.value.map((p) => p.id),
      note.value,
    );
  }
  close();
}

function loadTripData() {
  if (isEditMode.value) {
    const trip = store.getTripById(props.tripId!);
    if (trip) {
      date.value = trip.date;
      note.value = trip?.note ?? "";
      selectedPeaks.value = peaks.filter((peak) =>
        trip.peakIds.includes(peak.id),
      );
    }
  }
}

onMounted(() => {
  loadTripData();
});
</script>

<template>
  <!-- 桌面版：置中彈窗 -->
  <Teleport to="body">
    <div
      v-if="open"
      class="hidden md:flex fixed inset-0 bg-black/70 items-center justify-center z-2000"
    >
      <div
        class="bg-white rounded-2xl overflow-hidden w-150 max-h-[90vh] flex flex-col"
      >
        <TripFormContent
          v-model:date="date"
          v-model:note="note"
          v-model:selectedPeaks="selectedPeaks"
          :isEditMode="isEditMode"
          @close="close"
          @save="handleSaveTrip"
        />
      </div>
    </div>
  </Teleport>

  <!-- 手機版：BottomSheet -->
  <BottomSheet :open="open" @close="close">
    <div class="max-h-[85vh] overflow-y-auto flex flex-col">
      <TripFormContent
        v-model:date="date"
        v-model:note="note"
        v-model:selectedPeaks="selectedPeaks"
        :isEditMode="isEditMode"
        @close="close"
        @save="handleSaveTrip"
      />
    </div>
  </BottomSheet>
</template>
