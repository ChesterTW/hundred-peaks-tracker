<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import PeakMap from "../components/PeakMap.vue";
import ProgressBar from "../components/ProgressBar.vue";
import { RouterView } from "vue-router";

const store = useTripStore();
const { completedCount } = storeToRefs(store);
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

    <main class="flex-1">
      <PeakMap></PeakMap>
    </main>
  </div>
</template>
