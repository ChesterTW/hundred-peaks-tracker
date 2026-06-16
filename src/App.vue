<script setup lang="ts"></script>

<template>
  <nav class="flex gap-4 p-4 border-b">
    <router-link to="/">首頁</router-link>
    <router-link to="/peaks">山峰清單</router-link>
    <router-link to="/trips">行程紀錄</router-link>
    <router-link to="/add">新增行程</router-link>
  </nav>

  <router-view />
</template>
