<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ExternalLink } from "@lucide/vue";
import { peaks } from "../data/peaks";
import { useTripStore } from "../stores/tripStore";
import WeatherCard from "../components/WeatherCard.vue";
import { X } from "@lucide/vue";

const emit = defineEmits<{ close: [] }>();
const props = defineProps<{
  peakId: number;
}>();

const peak = computed(() => peaks.find((p) => p.id === props.peakId));

const tripStore = useTripStore();
const { completedPeakIds } = storeToRefs(tripStore);

const lastSummitDate = computed(() =>
  peak.value ? tripStore.getLastSummitDate(peak.value.id) : null,
);

const links = computed(() => {
  if (!peak.value) return [];
  const p = peak.value;
  return [
    {
      label: "健行筆記",
      href: `https://hiking.biji.co/index.php?q=mountain&act=detail&id=${p.id}`,
    },
    {
      label: "HikingBook",
      href: `https://zh-tw.hikingbook.net/explore/trails?regions=Taiwan&query=${p.name}&order=latest`,
    },
    {
      label: "Windy 天氣",
      href: `https://www.windy.com/${p.lat}/${p.lng}?rain,${p.lat},${p.lng},11,p:cities`,
    },
  ];
});
</script>

<template>
  <div
    class="absolute inset-y-0 left-0 w-96 z-1100 bg-white shadow-xl overflow-y-auto p-6 flex flex-col"
  >
    <div v-if="peak" class="space-y-6">
      <!-- 山峰標題資訊 -->
      <div class="flex flex-col items-start gap-3">
        <div class="flex items-center w-full gap-3">
          <h1 class="w-full text-3xl leading-11 font-bold text-neutral-700">
            {{ peak.name }}
          </h1>

          <div
            class="w-fit h-fit bg-neutral-100 rounded-md hover:bg-neutral-200 active:bg-neutral-300 cursor-pointer"
            @click="emit('close')"
          >
            <X class="text-neutral-700 m-2" :size="16"></X>
          </div>
        </div>

        <div class="flex items-end gap-3">
          <div
            v-if="completedPeakIds.has(peak.id)"
            class="bg-[#E5F0E5] px-3 py-1 rounded-full"
          >
            <p class="text-success text-xs font-medium">已登頂</p>
          </div>
          <div
            v-else
            class="bg-white px-3 py-1 rounded-full border border-neutral-300"
          >
            <p class="text-neutral-400 text-xs font-medium">未登頂</p>
          </div>
          <span
            class="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
          >
            體能 LV.{{ peak.rating.physical }}・風險 LV.{{ peak.rating.risk }}
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs text-neutral-700">
          <span>{{ peak.range }}</span>
          <div class="h-3 w-px bg-neutral-700" />
          <span>{{ peak.elevation.toLocaleString() }} m</span>
          <div class="h-3 w-px bg-neutral-700" />
          <span>百岳排名 {{ peak.id }}</span>
        </div>

        <p v-if="lastSummitDate" class="text-xs text-neutral-400">
          最近登頂：{{ lastSummitDate }}
        </p>
      </div>

      <!-- 連結區塊 -->
      <div class="flex flex-wrap gap-3">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-xs text-neutral-400 underline"
        >
          {{ link.label }}
          <ExternalLink :size="12" />
        </a>
      </div>

      <div class="w-full h-px bg-neutral-200"></div>

      <!-- 天氣區塊 -->
      <section class="space-y-3">
        <div class="flex items-baseline gap-2 px-1">
          <h2 class="text-lg font-medium text-gray-700">天氣預報</h2>
          <span class="text-xs text-neutral-400">JMA Seamless 模型</span>
        </div>
        <WeatherCard :peak="peak"></WeatherCard>
      </section>
    </div>

    <div
      v-else
      class="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm ring-1 ring-gray-100"
    >
      查無此山峰
    </div>
  </div>
</template>
