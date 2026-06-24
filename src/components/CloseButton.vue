<script setup lang="ts">
const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div class="absolute top-0 right-0 mx-1.5 my-1.5 p-1.5">
    <button
      @click="emit('close')"
      class="h-9 w-9 flex items-center justify-center bg-center hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors cursor-pointer"
    >
      <svg focusable="false" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
        ></path>
      </svg>
    </button>
  </div>
</template>
