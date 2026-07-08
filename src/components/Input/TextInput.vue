<script setup lang="ts">
import type { Component } from "vue";
import { X } from "@lucide/vue";

const inputValue = defineModel<string>({});
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    icon?: Component;
  }>(),
  {
    placeholder: "",
  },
);
</script>

<template>
  <div
    class="border border-neutral-200 focus-within:border-primary-500 rounded-md h-10 px-3 flex items-center gap-3"
  >
    <component
      :is="icon"
      v-if="icon"
      class="text-neutral-400 shrink-0"
      :size="16"
    />

    <input
      v-model="inputValue"
      :placeholder="props.placeholder"
      class="placeholder:font-normal flex-1 min-w-0 outline-none bg-transparent text-sm text-neutral-900"
    />
    <X
      v-if="inputValue"
      class="text-neutral-400 shrink-0 cursor-pointer"
      :size="18"
      @click="inputValue = ''"
    />
  </div>
</template>
