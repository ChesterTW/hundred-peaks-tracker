<script setup lang="ts">
import CheckBox from "../CheckBox.vue";

defineProps<{
  label: string;
  description: string;
  modelValue: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<template>
  <div
    class="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
    @click="emit('update:modelValue', !modelValue)"
  >
    <CheckBox
      :isSelected="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-neutral-700">{{ label }}</p>
      <p class="text-xs text-neutral-400">{{ description }}</p>
    </div>
  </div>
</template>
