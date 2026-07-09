<script setup lang="ts">
import type { Component } from "vue";
import { ref } from "vue";
import { Home, Mountain, ClipboardList, User } from "@lucide/vue";
import { useAuthStore } from "../stores/authStore";
import { storeToRefs } from "pinia";
import UserMenu from "./home/UserMenu.vue";
import { useClickOutside } from "../composables/useClickOutside";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

type NavItem = { icon: Component; to: string; name: string };
const navItems: NavItem[] = [
  { icon: Home, to: "/home", name: "home" },
  { icon: Mountain, to: "/peaks", name: "peaks" },
  { icon: ClipboardList, to: "/trips", name: "trips" },
];

const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

useClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false;
});
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
          class="flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 text-neutral-700"
          active-class="bg-primary-500 text-white"
        >
          <component :is="item.icon" :size="24" />
        </router-link>
      </nav>
    </div>

    <!-- 會員入口 -->
    <div class="relative" ref="userMenuRef">
      <div
        class="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-neutral-300 cursor-pointer flex items-center justify-center"
        @click="isUserMenuOpen = !isUserMenuOpen"
      >
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          class="w-full h-full object-cover"
        />
        <User v-else class="text-white" :size="24" />
      </div>

      <!-- 會員選單 -->
      <user-menu v-if="isUserMenuOpen"></user-menu>
    </div>
  </aside>
</template>
