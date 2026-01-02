<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Flashcards</h3>
      <p class="text-gray-600">Smart flashcards for effective memorization and spaced repetition learning.</p>
    </div>

    <!-- 卡片展示 -->
    <div class="relative">
      <!-- 背景卡片 -->
      <div class="absolute top-4 left-4 w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl transform rotate-2 opacity-60"></div>
      
      <!-- 中间卡片 -->
      <div class="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl transform rotate-1 opacity-80"></div>
      
      <!-- 前景卡片 -->
      <div class="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-8 text-white shadow-2xl">
        <div class="text-center">
          <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h4 class="text-xl font-bold mb-2">Physics</h4>
          <p class="text-lg mb-4">Newton's Laws of Motion</p>
          
          <div class="bg-white/20 rounded-lg p-4 mb-4">
            <p class="text-sm">What is Newton's Second Law?</p>
          </div>
          
          <div class="flex justify-center space-x-4">
            <button class="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Show Answer
            </button>
            <button class="bg-green-500/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
        <div class="text-2xl font-bold text-blue-600">156</div>
        <div class="text-sm text-blue-600">Total Cards</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center border border-green-100">
        <div class="text-2xl font-bold text-green-600">89</div>
        <div class="text-sm text-green-600">Mastered</div>
      </div>
      <div class="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
        <div class="text-2xl font-bold text-orange-600">67</div>
        <div class="text-sm text-orange-600">Review</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>
