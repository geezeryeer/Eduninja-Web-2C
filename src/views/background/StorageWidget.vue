<template>
  <div class="bg-gray-50 rounded-lg p-3">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-medium text-gray-500">Storage</span>
      <span class="text-xs text-gray-400">{{ usedStorage }}GB / {{ totalStorage }}GB</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div 
        class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
        :style="{ width: storagePercentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式数据
const usedStorage = ref(2.4)
const totalStorage = ref(5)

// 计算存储百分比
const storagePercentage = computed(() => {
  return Math.round((usedStorage.value / totalStorage.value) * 100)
})
</script>

<style scoped>
</style>
