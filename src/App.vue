<script setup lang="ts">
import AppSideBar from "./components/AppSideBar.vue";
</script>

<template>
  <div class="flex h-dvh overflow-hidden">
    <AppSideBar />
    <main class="flex-1 overflow-hidden">
      <router-view />
    </main>
  </div>
</template>
