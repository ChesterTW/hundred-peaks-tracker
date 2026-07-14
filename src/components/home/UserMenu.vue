<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { LogOutIcon } from "@lucide/vue";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";
import { renderGoogleButton } from "../../googleAuth";

const props = withDefaults(
  defineProps<{
    placement?: "bottom-left" | "top-right";
  }>(),
  {
    placement: "bottom-left",
  },
);

const positionClass = computed(() =>
  props.placement === "top-right"
    ? "absolute right-0 top-full mt-2"
    : "absolute left-0 bottom-full mb-2",
);

const authStore = useAuthStore();
const { user, isLoggedIn } = storeToRefs(authStore);

const googleButtonContainer = ref<HTMLElement | null>(null);

// 先註冊登入完成後的回呼，再把 Google 官方按鈕畫進容器；未登入時容器才會存在
onMounted(async () => {
  await authStore.initGoogleButton();
  if (googleButtonContainer.value) {
    renderGoogleButton(googleButtonContainer.value);
  }
});
</script>

<template>
  <div :class="[positionClass, 'w-fit shadow-lg rounded-lg overflow-hidden']">
    <div class="p-1 bg-white rounded-lg">
      <!-- 會員資訊 -->
      <div class="px-3 py-2 rounded-lg gap-2">
        <div v-if="isLoggedIn" class="flex items-center gap-2">
          <div class="min-w-0">
            <p class="text-sm font-medium text-neutral-700 truncate">
              {{ user?.displayName ?? "使用者" }}
            </p>
            <p v-if="user?.email" class="text-sm text-neutral-400 truncate">
              {{ user?.email }}
            </p>
          </div>
        </div>
        <div v-else class="flex items-center gap-2">
          <p class="text-sm font-medium text-neutral-700">訪客身份</p>
        </div>
      </div>

      <!-- 未登入：顯示 Google 官方登入按鈕，點擊後的彈窗/帳號選擇都由 Google 處理 -->
      <div
        v-if="!isLoggedIn"
        ref="googleButtonContainer"
        class="px-1 py-1"
      ></div>

      <!-- 已登入：登出按鈕 -->
      <button
        v-else
        type="button"
        class="w-full text-left px-3 py-2 hover:bg-neutral-100 rounded-lg cursor-pointer text-sm font-medium"
        @click="authStore.logout"
      >
        <LogOutIcon :size="16" class="inline-block mr-2" />
        <span>登出</span>
      </button>
    </div>
  </div>
</template>
