<script setup lang="ts">
import MapCheckboxItem from "./MapCheckboxItem.vue";
import MapRadioItem from "./MapRadioItem.vue";

defineProps<{
  type: "checkbox" | "radio";
  label: string;
  description: string;
  modelValue: boolean;
}>();
defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<template>
  <MapCheckboxItem
    v-if="type === 'checkbox'"
    :label="label"
    :description="description"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
  <MapRadioItem
    v-else
    :label="label"
    :description="description"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
