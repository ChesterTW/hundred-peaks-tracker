<script setup lang="ts">
import { ref } from "vue";
import PeakMap from "../components/PeakMap.vue";
import StatCard from "../components/home/StatCard.vue";
import RecentTripsCard from "../components/home/RecentTripsCard.vue";
import RecommendCard from "../components/home/RecommendCard.vue";
import PeakDetailDrawer from "../components/PeakDetailDrawer.vue";
import TrailDetailDrawer from "../components/TrailDetailDrawer.vue";
import { useMapFocus } from "../composables/useMapFocus";
import TripModal from "../components/tripModal/TripModal.vue";

const { focusedPeakId, focusedTrailId } = useMapFocus();
const isTripModalOpen = ref(false);
</script>

<template>
  <div class="relative flex-1 h-screen overflow-hidden">
    <!-- 全螢幕地圖 -->
    <PeakMap />

    <template v-if="focusedPeakId === null">
      <!-- 左上：百岳完登進度 Card -->
      <div class="absolute top-7 left-7 z-1500">
        <StatCard />
      </div>

      <!-- 左下：最近行程 Card -->
      <div class="absolute bottom-7 left-7 z-1500">
        <RecentTripsCard @openAddTripModal="isTripModalOpen = true" />
      </div>

      <!-- 右上：下一座百岳 Card -->
      <div class="absolute top-7 right-7 z-1500">
        <RecommendCard />
      </div>
    </template>

    <!-- 山峰詳細資訊 Drawer -->
    <PeakDetailDrawer
      v-if="focusedPeakId !== null"
      :peakId="focusedPeakId"
      @close="focusedPeakId = null"
    />

    <!-- 路線詳細資訊 Drawer -->
    <TrailDetailDrawer
      v-if="focusedTrailId !== null"
      :trailId="focusedTrailId"
      @close="focusedTrailId = null"
    />

    <TripModal
      v-if="isTripModalOpen"
      :open="isTripModalOpen"
      @update:open="isTripModalOpen = $event"
    />
  </div>
</template>
