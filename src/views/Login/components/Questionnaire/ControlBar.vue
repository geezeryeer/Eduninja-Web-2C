<template>
  <div class="fixed bottom-8 left-0 right-0 px-4 flex justify-center z-50">
    <div class="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-2xl p-4 w-full max-w-2xl flex items-center justify-between">
      <!-- Previous Button -->
      <button 
        @click="$emit('back')"
        :disabled="!canGoBack"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        :class="canGoBack ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Previous
      </button>

      <!-- Points/Progress -->
      <div class="flex items-center gap-3">
        <div class="flex items-baseline gap-1 text-gray-900">
          <span class="text-lg font-bold font-mono">{{ Math.round((currentStep / totalSteps) * 100) }}</span>
          <span class="text-xs text-gray-500 font-medium">/ 100</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: Number,
  totalSteps: Number,
  canGoBack: Boolean
})

defineEmits(['back'])
</script>
