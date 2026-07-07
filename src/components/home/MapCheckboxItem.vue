<script setup lang="ts">
defineProps<{
  label: string;
  description: string;
  modelValue: boolean;
}>();
defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<template>
  <label
    class="flex items-center gap-3 px-5 py-2.5 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
      class="w-4 h-4 accent-primary-500 cursor-pointer shrink-0"
    />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-neutral-700">{{ label }}</p>
      <p class="text-xs text-neutral-400">{{ description }}</p>
    </div>
  </label>
</template>
