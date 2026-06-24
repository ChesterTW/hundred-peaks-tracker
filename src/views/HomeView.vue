<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import PeakMap from "../components/PeakMap.vue";
import ProgressBar from "../components/ProgressBar.vue";
import { RouterView } from "vue-router";
import { useMapFocus } from "../composables/useMapFocus";
import PeakDetailView from "./PeakDetailView.vue";
import CloseButton from "../components/CloseButton.vue";

const store = useTripStore();
const { completedCount } = storeToRefs(store);
const { focusedPeakId } = useMapFocus();
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <aside class="w-1/3 overflow-y-auto space-y-4 shadow-lg">
      <ProgressBar :value="completedCount" :total="100"></ProgressBar>

      <nav class="flex gap-4 p-4 border-b">
        <router-link to="/">首頁</router-link>
        <router-link to="/peaks">山峰清單</router-link>
      </nav>

      <router-view />
    </aside>

    <main class="flex-1 relative">
      <PeakMap></PeakMap>

      <transition name="slide">
        <div
          v-if="focusedPeakId !== null"
          class="absolute inset-y-0 left-0 w-96 z-1100 bg-white shadow-xl overflow-y-auto p-4"
        >
          <CloseButton @close="focusedPeakId = null" />

          <PeakDetailView :peak-id="focusedPeakId" />
        </div>
      </transition>
    </main>
  </div>
</template>
