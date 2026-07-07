<script setup lang="ts">
import type { Component } from "vue";
import { ref } from "vue";
import {
  Home,
  Mountain,
  ClipboardList,
  User,
  LogInIcon,
  LogOutIcon,
} from "@lucide/vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { storeToRefs } from "pinia";

const route = useRoute();

const navItems: { icon: Component; to: string; name: string }[] = [
  { icon: Home, to: "/home", name: "home" },
  { icon: Mountain, to: "/peaks", name: "peaks" },
  { icon: ClipboardList, to: "/trips", name: "trips" },
];

const authStore = useAuthStore();
const { user, isAuthReady } = storeToRefs(authStore);

const isOpen = ref(false);

function isActive(name: string): boolean {
  return !!name && route.name === name;
}
</script>

<template>
  <aside
    class="flex flex-col items-center justify-between bg-white border-r border-neutral-200 w-20 px-4 py-5 h-screen shrink-0 z-2000"
  >
    <div class="flex flex-col items-center gap-5 w-full">
      <!-- Logo -->
      <div class="w-12 h-12 bg-primary-100 rounded-lg shrink-0" />

      <!-- Divider -->
      <div class="w-full h-px bg-neutral-200" />

      <!-- 頁面入口 -->
      <nav class="flex flex-col gap-3 w-full">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200"
          :class="
            isActive(item.name)
              ? 'bg-primary-500 text-white'
              : 'text-neutral-700'
          "
        >
          <component :is="item.icon" :size="24" />
        </router-link>
      </nav>
    </div>

    <!-- 會員入口 -->
    <div class="relative">
      <div
        class="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-neutral-300 cursor-pointer flex items-center justify-center"
        @click="isOpen = !isOpen"
      >
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          class="w-full h-full object-cover"
        />
        <User v-else class="text-white" :size="24" />
      </div>

      <!-- 懸浮視窗 -->
      <div
        v-if="isOpen"
        class="absolute left-0 bottom-full mb-2 w-48 shadow-lg rounded-lg overflow-hidden"
      >
        <div class="p-1 bg-white rounded-lg">
          <!-- 會員資訊 -->
          <div class="px-3 py-2 rounded-lg gap-2">
            <div v-if="isAuthReady && user" class="flex items-center gap-2">
              <img
                v-if="user.photoURL"
                :src="user.photoURL"
                class="w-6 h-6 rounded-full object-cover"
              />
              <div class="min-w-0">
                <p class="text-sm font-medium text-neutral-700 truncate">
                  {{ user.displayName ?? "使用者" }}
                </p>
                <p class="text-sm text-neutral-400 truncate">
                  {{ user.email ?? "使用者" }}
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
            class="px-3 py-2 hover:bg-neutral-100 rounded-lg cursor-pointer text-sm font-medium"
          >
            <div
              v-if="isAuthReady && user"
              @click="authStore.logout()"
              class="flex items-center gap-2"
            >
              <LogOutIcon :size="16" />
              <p>登出</p>
            </div>
            <div
              v-else
              @click="authStore.login()"
              class="flex items-center gap-2"
            >
              <LogInIcon v-if="!user" :size="16" />
              <p>登入</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
