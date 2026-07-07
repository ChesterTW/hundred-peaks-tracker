<script setup lang="ts">
import type { Component } from "vue";
import { User, LogInIcon, LogOutIcon } from "@lucide/vue";
import { useAuthStore } from "../../stores/authStore";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user, isLoggedIn } = storeToRefs(authStore);

type UserLogInItem = { icon: Component; onclick: () => void; name: string };
const userLogInItems: UserLogInItem[] = [
  { icon: LogInIcon, onclick: authStore.login, name: "登入" },
  { icon: LogOutIcon, onclick: authStore.logout, name: "登出" },
];
</script>

<template>
  <div
    class="absolute left-0 bottom-full mb-2 w-48 shadow-lg rounded-lg overflow-hidden"
  >
    <div class="p-1 bg-white rounded-lg">
      <!-- 會員資訊 -->
      <div class="px-3 py-2 rounded-lg gap-2">
        <div v-if="isLoggedIn" class="flex items-center gap-2">
          <img
            v-if="user?.photoURL"
            :src="user?.photoURL"
            class="w-6 h-6 rounded-full object-cover"
          />
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
          <div
            class="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center"
          >
            <User class="text-white" :size="12" />
          </div>

          <p class="text-sm font-medium text-neutral-700">訪客</p>
        </div>
      </div>

      <!-- 登入 / 登出按鈕 -->
      <div
        v-for="(item, index) in userLogInItems"
        :key="index"
        class="px-3 py-2 hover:bg-neutral-100 rounded-lg cursor-pointer text-sm font-medium"
      >
        <div @click="item.onclick">
          <component :is="item.icon" :size="16" class="inline-block mr-2" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
