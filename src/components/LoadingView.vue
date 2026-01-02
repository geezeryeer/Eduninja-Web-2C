<template>
  <div class="flex flex-col items-center justify-center p-4">
    <!-- 动态圆环加载器 -->
    <div class="relative w-12 h-12">
      <!-- 底部轨道 -->
      <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
      <!-- 旋转的渐变圆弧 -->
      <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
    
    <!-- 加载文字 (可选) -->
    <p v-if="text" class="mt-3 text-sm font-medium text-gray-500 tracking-wide animate-pulse">
      {{ text }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
