<script setup lang="ts">
import { ref } from "vue";
import { User } from "@lucide/vue";
import { useAuthStore } from "../../stores/authStore.ts";
import { storeToRefs } from "pinia";
import UserMenu from "./UserMenu.vue";
import { useClickOutside } from "../../composables/useClickOutside.ts";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

useClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false;
});
</script>

<template>
  <div class="relative" ref="userMenuRef">
    <button
      type="button"
      class="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-neutral-200 cursor-pointer flex items-center justify-center"
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

    <!-- 會員選單 -->
    <user-menu v-if="isUserMenuOpen"></user-menu>
  </div>
</template>
