<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Mobile App</h3>
      <p class="text-gray-600">Study anywhere with our mobile application available on iOS and Android.</p>
    </div>

    <!-- 手机展示 -->
    <div class="flex justify-center">
      <div class="relative">
        <!-- 手机框架 -->
        <div class="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
          <div class="w-full h-full bg-white rounded-2xl overflow-hidden">
            <!-- 状态栏 -->
            <div class="bg-blue-500 text-white text-xs px-4 py-2 flex justify-between items-center">
              <span>9:41</span>
              <div class="flex space-x-1">
                <div class="w-4 h-2 bg-white/30 rounded-sm"></div>
                <div class="w-4 h-2 bg-white/30 rounded-sm"></div>
                <div class="w-4 h-2 bg-white/30 rounded-sm"></div>
              </div>
            </div>
            
            <!-- 应用内容 -->
            <div class="p-4 space-y-3">
              <div class="text-center">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-2"></div>
                <h4 class="text-sm font-semibold text-gray-900">Ninja Web</h4>
              </div>
              
              <div class="space-y-2">
                <div class="bg-blue-50 rounded-lg p-2">
                  <div class="text-xs text-blue-800">📚 Study Session</div>
                  <div class="text-xs text-gray-600">Math - Calculus</div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-2">
                  <div class="text-xs text-green-800">✅ Completed</div>
                  <div class="text-xs text-gray-600">Physics - Mechanics</div>
                </div>
                
                <div class="bg-purple-50 rounded-lg p-2">
                  <div class="text-xs text-purple-800">📖 Flashcards</div>
                  <div class="text-xs text-gray-600">Chemistry - 15 cards</div>
                </div>
              </div>
              
              <div class="absolute bottom-4 left-4 right-4">
                <div class="bg-gray-100 rounded-lg p-2">
                  <div class="text-xs text-center text-gray-600">Progress: 75%</div>
                  <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div class="bg-blue-500 h-1 rounded-full" style="width: 75%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 装饰元素 -->
        <div class="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 功能特点 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
        <div class="text-2xl mb-2">📱</div>
        <div class="text-sm font-semibold text-blue-900">Offline Mode</div>
        <div class="text-xs text-blue-600">Study without internet</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center border border-green-100">
        <div class="text-2xl mb-2">⚡</div>
        <div class="text-sm font-semibold text-green-900">Quick Access</div>
        <div class="text-xs text-green-600">Instant flashcards</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>
