<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">NinjaAI</h3>
      <p class="text-gray-600">AI-powered personalized learning assistant that adapts to your learning style.</p>
    </div>

    <!-- 包裹样式 - 和其他预览组件一样 -->
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
      <!-- 直接调用 AIChatPanel 组件 -->
      <div class="h-64 pointer-events-none">
        <AIChatPanel 
          :embedded="true" 
          :initialExpanded="true"
          class="h-full"
        />
      </div>
    </div>

    <!-- 底部描述 -->
    <div class="bg-gray-50 rounded-lg p-4 text-center">
      <p class="text-sm text-gray-600">
        Get instant AI assistance for your studies. Ask questions, get explanations, and receive personalized learning recommendations.
      </p>
    </div>
  </div>
</template>

<script setup>
import AIChatPanel from '../../Library/AIChatPanel.vue'
</script>

<style scoped>
/* 禁用交互的样式 */
.pointer-events-none {
  pointer-events: none;
  cursor: default;
}
</style>
