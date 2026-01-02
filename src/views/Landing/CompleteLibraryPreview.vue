<template>
  <section class="relative py-20 overflow-hidden z-10">

    <div class="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
      <!-- Section Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-medium text-gray-900 sm:text-3xl">
          Your Complete Learning Hub
        </h2>
        <p class="mt-2 text-gray-600 text-base">
          Everything you need in one place - syllabus, resources, questions, and AI tutor.
        </p>
      </div>

      <!-- Complete Preview Container: Navigation + Library + AI Chat -->
      <div class="bg-white rounded-2xl border border-gray-200/80 overflow-hidden" style="height: 700px;">
        <div class="flex h-full">
          <!-- Left: Navigation + Library Content (使用 SyllabusPreview) -->
          <div class="flex-1 min-w-0">
            <SyllabusPreview />
          </div>

          <!-- Right: AI Chat Panel -->
          <div class="w-72 border-l border-gray-200/80 bg-[#F9F9F9] flex flex-col shrink-0">
            <AIChatPanel :embedded="true" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SyllabusPreview from './DemoSection/SyllabusPreview.vue'
import AIChatPanel from '@/views/Library/AIPanel/AIChatPanel.vue'
</script>

<style scoped>
/* 调整 AIChatPanel 的样式，让它更紧凑 */
:deep(.w-96) {
  /* 顶部工具栏高度减小 */
  & > div > div[style*="height: 64px"] {
    height: 52px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  
  /* 标题字体减小 */
  & h3 {
    font-size: 14px !important;
  }
  
  /* 聊天消息区域 padding 减小 */
  & .custom-scrollbar {
    padding: 12px !important;
  }
  
  /* 欢迎消息字体减小 */
  & .text-lg {
    font-size: 15px !important;
  }
  
  & .text-sm {
    font-size: 12px !important;
  }
}
</style>

