<script setup lang="ts">
import { ref, watch } from "vue";
import { Compass, Award, User } from "@lucide/vue";
import { storeToRefs } from "pinia";
import PeakMap from "../components/PeakMap.vue";
import StatCard from "../components/home/StatCard.vue";
import RecommendCard from "../components/home/RecommendCard.vue";
import UserMenu from "../components/home/UserMenu.vue";
import PeakDetailView from "../views/PeakDetailView.vue";
import { useMapFocus } from "../composables/useMapFocus";
import { useAuthStore } from "../stores/authStore";
import { useClickOutside } from "../composables/useClickOutside";
import TripModal from "../components/tripModal/TripModal.vue";
import BottomSheet from "../components/BottomSheet.vue";

const { focusedPeakId } = useMapFocus();
const isTripModalOpen = ref(false);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
useClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false;
});

const RECOMMEND_CARD_OPEN_KEY = "hundred-peaks-recommend-card-open";
const isRecommendCardOpen = ref(
  localStorage.getItem(RECOMMEND_CARD_OPEN_KEY) !== "false",
);
watch(isRecommendCardOpen, (open) => {
  localStorage.setItem(RECOMMEND_CARD_OPEN_KEY, String(open));
});

const isStatSheetOpen = ref(false);
const isRecommendSheetOpen = ref(false);
</script>

<template>
  <div class="relative flex-1 h-screen overflow-hidden">
    <!-- 全螢幕地圖 -->
    <PeakMap />

    <template v-if="focusedPeakId === null">
      <!-- 左上：百岳完登進度 Card（桌面版） -->
      <div class="hidden md:block absolute top-3 left-3 z-1500">
        <StatCard @openAddTripModal="isTripModalOpen = true" />
      </div>
    </template>

    <!-- 右上：下一座百岳 Card（桌面版） -->
    <div class="hidden md:block absolute top-3 right-3 z-1500">
      <RecommendCard
        v-if="isRecommendCardOpen"
        @close="isRecommendCardOpen = false"
      />
      <button
        v-else
        type="button"
        class="flex items-center justify-center bg-white rounded-full shadow hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer"
        aria-label="開啟下一座百岳推薦卡片"
        @click="isRecommendCardOpen = true"
      >
        <Compass class="text-neutral-700 m-3" :size="24" />
      </button>
    </div>

    <!-- 手機版：頂部圖示按鈕（會員入口／完登進度／推薦） -->
    <div class="flex flex-col md:hidden absolute top-3 right-3 z-1500 gap-2">
      <div class="relative" ref="userMenuRef">
        <button
          type="button"
          class="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-neutral-300 shadow cursor-pointer flex items-center justify-center"
          aria-label="會員選單"
          :aria-expanded="isUserMenuOpen"
          @click="isUserMenuOpen = !isUserMenuOpen"
        >
          <img
            v-if="user?.photoURL"
            :src="user.photoURL"
            class="w-full h-full object-cover"
          />
          <User v-else class="text-white" :size="24" />
        </button>

        <UserMenu v-if="isUserMenuOpen" placement="top-right" />
      </div>

      <button
        type="button"
        class="flex items-center justify-center bg-white rounded-full shadow hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer"
        aria-label="開啟完登進度"
        @click="isStatSheetOpen = true"
      >
        <Award class="text-neutral-700 m-3" :size="24" />
      </button>
      <button
        type="button"
        class="flex items-center justify-center bg-white rounded-full shadow hover:bg-neutral-100 active:bg-neutral-200 transition-colors cursor-pointer"
        aria-label="開啟下一座百岳推薦"
        @click="isRecommendSheetOpen = true"
      >
        <Compass class="text-neutral-700 m-3" :size="24" />
      </button>
    </div>

    <!-- 手機版：BottomSheet 內容 -->
    <BottomSheet :open="isStatSheetOpen" @close="isStatSheetOpen = false">
      <div class="p-4">
        <StatCard
          @openAddTripModal="
            isStatSheetOpen = false;
            isTripModalOpen = true;
          "
        />
      </div>
    </BottomSheet>
    <BottomSheet
      :open="isRecommendSheetOpen"
      @close="isRecommendSheetOpen = false"
    >
      <div class="p-4">
        <RecommendCard @close="isRecommendSheetOpen = false" />
      </div>
    </BottomSheet>

    <!-- 山峰詳細資訊 Drawer -->
    <PeakDetailView
      v-if="focusedPeakId !== null"
      :peakId="focusedPeakId"
      @close="focusedPeakId = null"
    />

    <TripModal
      v-if="isTripModalOpen"
      :open="isTripModalOpen"
      @update:open="isTripModalOpen = $event"
    />
  </div>
</template>
