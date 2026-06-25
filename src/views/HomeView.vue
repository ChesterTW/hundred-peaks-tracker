<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import PeakMap from "../components/PeakMap.vue";
import ProgressBar from "../components/ProgressBar.vue";
import { RouterView } from "vue-router";
import { useMapFocus } from "../composables/useMapFocus";
import PeakDetailDrawer from "../components/PeakDetailDrawer.vue";

const store = useTripStore();
const { completedCount } = storeToRefs(store);

const { focusedPeakId } = useMapFocus();
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <aside class="w-1/3 overflow-y-auto space-y-4 shadow-lg">
      <!-- 進度條 -->
      <ProgressBar :value="completedCount" :total="100"></ProgressBar>

      <!-- 導覽列 -->
      <nav class="flex gap-4 p-4 border-b">
        <router-link to="/">首頁</router-link>
        <router-link to="/peaks">山峰清單</router-link>
      </nav>

      <!-- 內容區塊 -->
      <router-view />
    </aside>

    <main class="flex-1 relative">
      <!-- 地圖 -->
      <PeakMap></PeakMap>

      <!-- 山峰詳細資訊 -->
      <PeakDetailDrawer
        v-if="focusedPeakId !== null"
        :peakId="focusedPeakId"
        @close="focusedPeakId = null"
      />
    </main>
  </div>
</template>
