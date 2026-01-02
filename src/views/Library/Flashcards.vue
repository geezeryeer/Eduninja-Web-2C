<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Flashcards</h1>
        <p class="text-gray-600">Review and practice with AI-generated flashcards</p>
      </div>
      <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        Generate Cards
      </button>
    </div>

    <!-- 闪卡区域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🃏</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No flashcards yet</h3>
          <p class="text-gray-500 mb-4">Upload materials to automatically generate flashcards</p>
          <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Generate Your First Cards
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Flashcards 组件逻辑
</script>
