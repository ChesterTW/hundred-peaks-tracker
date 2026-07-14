<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
  }>(),
  {
    open: false,
  },
);
const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="props.open"
        class="md:hidden fixed inset-0 bg-black/50 z-2000"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="sheet">
      <div
        v-if="props.open"
        class="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-2000"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩 */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* 內容面板 */
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s ease-out;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
