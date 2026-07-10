<script setup lang="ts">
import { Check } from "@lucide/vue";
const props = defineProps<{
  isSelected: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

function toggle() {
  emit("update:modelValue", !props.isSelected);
}
</script>

<template>
  <div
    class="w-4.5 h-4.5 rounded-sm shrink-0 flex items-center justify-center"
    :class="
      props.isSelected ? 'bg-primary-500' : 'bg-white border border-neutral-300'
    "
    role="checkbox"
    :aria-checked="props.isSelected"
    tabindex="0"
    @click.stop="toggle"
    @keydown.enter="toggle"
    @keydown.space.prevent="toggle"
  >
    <Check v-if="props.isSelected" class="text-white" :size="12" />
  </div>
</template>
