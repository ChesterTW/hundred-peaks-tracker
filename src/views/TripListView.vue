<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTripStore } from "../stores/tripStore";
import TripTable from "../components/TripTable.vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const { user, isAuthReady } = storeToRefs(authStore);
const store = useTripStore();
const { activeTrips } = storeToRefs(store);
</script>

<template>
  <div class="p-4">
    <!-- 臨時驗證列，驗證 auth 後移除 -->
    <div
      class="p-2 border rounded mb-4 flex items-center gap-2 bg-[#f5f5f5] cursor-pointer"
    >
      <template v-if="user">
        <span>已登入：{{ user.email }}</span>
        <button @click="authStore.logout()">登出</button>
      </template>
      <template v-else-if="!isAuthReady">
        <span>驗證中...</span>
      </template>
      <template v-else>
        <span>未登入</span>
        <button @click="authStore.login()">登入</button>
      </template>
    </div>

    <router-link
      to="/add"
      class="inline-block px-4 py-2 rounded bg-[#42b883] text-white hover:bg-[#369870] mb-4"
      >新增行程</router-link
    >
    <TripTable
      :trips="activeTrips"
      :deletable="true"
      :searchable="true"
    ></TripTable>
  </div>
</template>
