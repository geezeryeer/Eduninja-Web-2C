<template>
  <div>
    <div class="flex items-center justify-end mb-2">
      <span class="text-[10px] font-medium text-gray-400">{{ usedStorage }}GB / {{ totalStorage }}GB</span>
    </div>
    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
      <div 
        class="bg-gradient-to-r from-gray-700 to-gray-900 h-full rounded-full transition-all duration-300" 
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
