<script setup lang="ts">
import { peaks } from "../data/peaks";
</script>

<template>
  <h1 class="text-2xl font-bold p-4">百岳列表</h1>

  <div class="p-4">
    <div class="overflow-hidden rounded-lg border border-gray-200">
      <table class="w-full text-left">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-3">排名</th>
            <th class="px-4 py-3">山名</th>
            <th class="px-4 py-3">高度</th>
            <th class="px-4 py-3">行政區</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr v-for="peak in peaks" :key="peak.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ peak.id }}</td>
            <td class="px-4 py-3">{{ peak.name }}</td>
            <td class="px-4 py-3">{{ peak.elevation }}</td>
            <td class="px-4 py-3">{{ peak.region }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
