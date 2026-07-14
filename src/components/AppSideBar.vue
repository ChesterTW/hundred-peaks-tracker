<script setup lang="ts">
import type { Component } from "vue";
import { Home, Mountain, ClipboardList } from "@lucide/vue";
import UserMenuEntrance from "./home/UserMenuEntrance.vue";

type NavItem = { icon: Component; to: string; name: string };
const navItems: NavItem[] = [
  { icon: Home, to: "/home", name: "首頁" },
  { icon: Mountain, to: "/peaks", name: "山峰清單" },
  { icon: ClipboardList, to: "/trips", name: "行程紀錄" },
];
</script>

<template>
  <!-- 桌面版：左側側邊欄 -->
  <aside
    class="hidden md:flex flex-col items-center justify-between bg-white border-r border-neutral-200 w-20 px-4 py-5 h-dvh shrink-0 z-2000"
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
          class="flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 text-neutral-700"
          active-class="bg-primary-500 text-white"
          :aria-label="item.name"
        >
          <component :is="item.icon" :size="24" />
        </router-link>
      </nav>
    </div>

    <!-- 會員入口 -->
    <UserMenuEntrance />
  </aside>

  <!-- 手機版：底部 Tab Bar -->
  <nav
    class="flex md:hidden fixed bottom-0 left-0 right-0 items-stretch justify-around bg-white border-t border-neutral-200 pb-[env(safe-area-inset-bottom)] z-2000"
  >
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-neutral-700 transition-colors duration-200"
      active-class="bg-primary-500 text-white"
      :aria-label="item.name"
    >
      <component :is="item.icon" :size="24" />
      <span class="text-xs">{{ item.name }}</span>
    </router-link>
  </nav>
</template>
