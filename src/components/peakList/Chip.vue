<script setup lang="ts">
const props = defineProps<{
  text: string;
  isSelected: boolean;
}>();
</script>

<template>
  <div
    :class="
      isSelected
        ? 'bg-primary-500'
        : 'bg-white border border-neutral-300 transition-colors hover:bg-neutral-100 active:bg-neutral-200'
    "
    class="px-3 py-1 rounded-full cursor-pointer"
  >
    <p
      :class="isSelected ? 'text-white' : 'text-neutral-700'"
      class="transition-colors"
    >
      {{ props.text }}
    </p>
  </div>
</template>
