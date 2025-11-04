<template>
  <!-- 主布局 - Background 组件提供全屏背景 -->
  <div class="min-h-screen relative">
    <!-- 全屏背景组件 -->
    <Background />
    
    <!-- Library 内容区域 - 左侧，宽度会根据 AI Panel 的显示状态调整 -->
    <div 
      class="fixed top-6 bottom-6 z-40"
      :class="{ 'transition-all duration-300': !isResizing }"
      :style="{ 
        left: '210px',
        right: aiChatPanelWidth > 0 ? `${aiChatPanelWidth + 24}px` : '6px',
        willChange: isResizing ? 'right' : 'auto'
      }"
    >
      <div class="h-full bg-transparent rounded-3xl overflow-hidden">
        <router-view />
      </div>
    </div>
    
    <!-- AI Chat Panel - 右侧独立面板 -->
    <div
      v-if="aiChatPanelWidth > 0"
      class="fixed top-6 bottom-6 right-6 z-40"
      :class="{ 'transition-all duration-300': !isResizing }"
      :style="{ 
        width: `${aiChatPanelWidth}px`,
        willChange: isResizing ? 'width' : 'auto'
      }"
    >
      <!-- 拖拽时减少模糊效果以提升性能 -->
      <div 
        class="h-full rounded-2xl border border-gray-200/50 shadow-2xl"
        :class="isResizing ? 'bg-white/95' : 'bg-white/90 backdrop-blur-sm'"
      >
        <AIChatPanel 
          ref="aiChatPanel" 
          :embedded="false" 
          @resize="handleAIChatResize"
          @resizing="handleResizingState"
        />
      </div>
    </div>
    
    <!-- 全局加载状态 -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
    >
      <div class="bg-white rounded-2xl p-8 flex items-center space-x-4 shadow-2xl">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <span class="text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Background from '../views/background/Background.vue'
import AIChatPanel from '../views/Library/AIChatPanel.vue'

// 响应式数据
const isLoading = ref(false)
const aiChatPanelWidth = ref(384) // 默认宽度 384px，设置为 0 可以完全隐藏
const aiChatPanel = ref(null)
const isResizing = ref(false) // 跟踪是否正在拖拽调整大小

// 方法
const setLoading = (loading) => {
  isLoading.value = loading
}

const toggleAIChatPanel = () => {
  // 如果当前显示，则隐藏；如果隐藏，则显示
  aiChatPanelWidth.value = aiChatPanelWidth.value > 0 ? 0 : 384
}

// 处理 AI Chat Panel 的大小调整
const handleAIChatResize = (newWidth) => {
  // 限制最小和最大宽度
  aiChatPanelWidth.value = Math.max(0, Math.min(800, newWidth))
}

// 处理拖拽状态变化
const handleResizingState = (resizing) => {
  isResizing.value = resizing
}

// 处理题目选择事件（供子组件调用）
const handleQuestionToggle = (question) => {
  console.log('🟢 LibraryLayout: Question toggled:', question)
  
  // 如果面板未打开，先打开面板
  if (aiChatPanelWidth.value === 0) {
    aiChatPanelWidth.value = 384
  }
  
  // 将题目传递给AI聊天面板
  if (aiChatPanel.value) {
    console.log('🟢 LibraryLayout: Calling aiChatPanel.handleQuestionToggle')
    aiChatPanel.value.handleQuestionToggle(question)
  } else {
    console.error('❌ LibraryLayout: aiChatPanel.value is null!')
  }
}

// 通过 provide 提供给子组件
provide('handleQuestionToggle', handleQuestionToggle)
provide('toggleAIChatPanel', toggleAIChatPanel)

// 暴露方法供子组件使用
defineExpose({
  setLoading,
  handleQuestionToggle,
  toggleAIChatPanel
})
</script>

<style scoped>
/* 浮窗系统样式 */
.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* 背景模糊效果 */
.filter.blur-xl {
  filter: blur(64px);
}

/* 混合模式 */
.mix-blend-multiply {
  mix-blend-mode: multiply;
}

/* AI Chat Panel 滑动动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* GPU 加速优化 - 用于提升拖拽性能 */
.fixed {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
