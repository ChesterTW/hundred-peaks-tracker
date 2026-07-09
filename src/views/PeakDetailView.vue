<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ExternalLink } from "@lucide/vue";
import { peaks } from "../data/peaks";
import { useTripStore } from "../stores/tripStore";
import WeatherCard from "../components/WeatherCard.vue";

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
  <div v-if="peak" class="space-y-6">
    <!-- 山峰標題資訊 -->
    <div class="flex flex-col items-start gap-3">
      <div class="flex items-end gap-3">
        <h1 class="text-4xl leading-11 font-bold text-neutral-700">
          {{ peak.name }}
        </h1>
        <span
          v-if="completedPeakIds.has(peak.id)"
          class="rounded-full bg-[#e5f0e5] px-3 py-1 text-xs font-medium text-success"
        >
          已登頂
        </span>
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

      <div class="flex flex-wrap gap-2.5">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-info"
        >
          {{ link.label }}
          <ExternalLink :size="16" />
        </a>
      </div>
    </div>

    <!-- 天氣區塊 -->
    <section class="space-y-2">
      <div class="flex items-baseline gap-2 px-1">
        <h2 class="text-lg font-md text-gray-700">天氣預報</h2>
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
</template>
