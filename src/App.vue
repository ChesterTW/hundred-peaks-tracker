<script setup lang="ts">
import AppSideBar from "./components/AppSideBar.vue";
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <AppSideBar />
    <router-view />
  </div>
</template>
