<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import PeakMap from "../components/PeakMap.vue";
import ProgressBar from "../components/ProgressBar.vue";
import { RouterView } from "vue-router";
import { useMapFocus } from "../composables/useMapFocus";
import PeakDetailView from "./PeakDetailView.vue";

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
          <div class="absolute top-0 right-0 mx-1.5 my-1.5 p-1.5">
            <button
              @click="focusedPeakId = null"
              class="h-9 w-9 flex items-center justify-center bg-centebr hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors cursor-pointer"
            >
              <svg
                focusable="false"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="NMm5M"
              >
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                ></path>
              </svg>
            </button>
          </div>

          <PeakDetailView :peak-id="focusedPeakId" />
        </div>
      </transition>
    </main>
  </div>
</template>
