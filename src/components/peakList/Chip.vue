<script setup lang="ts">
const props = defineProps<{
  text: string;
  isSelected: boolean;
}>();
</script>

<template>
  <button
    type="button"
    :class="
      isSelected
        ? 'bg-primary-500'
        : 'bg-white border border-neutral-300 transition-colors hover:bg-neutral-100 active:bg-neutral-200'
    "
    class="px-3 py-1 rounded-full cursor-pointer"
    :aria-pressed="isSelected"
  >
    <p
      :class="isSelected ? 'text-white' : 'text-neutral-700'"
      class="transition-colors text-sm"
    >
      {{ props.text }}
    </p>
  </button>
</template>
