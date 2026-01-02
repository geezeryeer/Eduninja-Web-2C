<template>
  <!-- 主布局 -->
  <div class="min-h-screen relative overflow-hidden">
    <!-- Clean Gradient Background -->
    <CleanGradientBackground />
    
    <!-- 顶部栏：路径导航和搜索 -->
    <TopBar 
      @search-change="handleSearchChange"
      @toggle-studio="toggleStudio"
      :showStudio="showStudio"
    />
    
    <!-- Library 内容区域 - 改为悬浮卡片样式 -->
    <div 
      class="fixed top-[56px] bottom-4 left-4 z-10 transition-all duration-300 rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-2xl shadow-xl overflow-hidden"
      :style="{ 
        right: `${totalRightOffset}px`,
        willChange: 'right'
      }"
    >
      <div class="h-full bg-transparent overflow-hidden relative">
        <!-- 列表视图 -->
        <div v-show="!showPDFViewer" class="h-full">
          <router-view />
        </div>

        <!-- PDF 查看器 (直接嵌入) -->
        <PDFViewer 
          v-if="showPDFViewer"
          :document="pdfDocument"
          :isVisible="true"
          @close="closePDFViewer"
        />
      </div>
    </div>
    
    <!-- AI Chat Panel - 右侧固定侧边栏，Apple风格 -->
    <div
      v-if="aiChatPanelWidth > 0"
      class="fixed top-[56px] bottom-4 z-[110] rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-2xl shadow-xl transition-all duration-300"
      :class="{ 'transition-smooth': !isResizing }"
      :style="{ 
        right: showStudio ? `${studioWidth + 32}px` : '16px',
        width: `${aiChatPanelWidth}px`,
        willChange: 'width, right'
      }"
    >
      <AIChatPanel 
        ref="aiChatPanel" 
        :embedded="false" 
        :rightOffset="showStudio ? studioWidth + 32 : 16"
        @resize="handleAIChatResize"
        @resizing="handleResizingState"
      />
    </div>

    <!-- Studio Panel - 最右侧固定侧边栏 -->
    <Transition name="slide-from-right">
    <div
        v-show="showStudio"
        class="fixed top-[56px] bottom-4 right-4 z-[115] rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-2xl shadow-xl transition-all duration-300"
        :class="{ 'transition-smooth': !isResizing }"
      :style="{ 
        width: `${studioWidth}px`,
          willChange: 'width, transform'
      }"
    >
      <Studio 
        :width="studioWidth"
        @close="closeStudio" 
        @resize="handleStudioResize"
        @resizing="handleResizingState"
      />
    </div>
    </Transition>
    
    <!-- 全局加载状态 -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[100]"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import AIChatPanel from '../views/Library/AIPanel/AIChatPanel.vue'
import TopBar from '../views/Library/Navigation/TopBar.vue'
import PDFViewer from '@/components/PDFViewer/PDFViewer.vue'
import Studio from '../views/Library/Studio/Studio.vue'
import CleanGradientBackground from '@/components/CleanGradientBackground.vue'

// 路由
const route = useRoute()

// PDF Viewer 状态管理
const showPDFViewer = ref(false)
const pdfDocument = ref(null)

const openPDF = (document) => {
  pdfDocument.value = document
  showPDFViewer.value = true
}

const closePDFViewer = () => {
  showPDFViewer.value = false
  pdfDocument.value = null
}

// 搜索状态
const searchQuery = ref('')
const handleSearchChange = (value) => {
  searchQuery.value = value
  // 通过 provide 传递给子组件
}

// 响应式数据
const isLoading = ref(false)
const aiChatPanelWidth = ref(384) // 默认宽度 384px
const aiChatPanel = ref(null)
const isResizing = ref(false)
const studioWidth = ref(400) // Studio 默认宽度 400px
const showStudio = ref(true) // 控制 Studio 显示/隐藏

// 提供给子组件
provide('aiChatPanelWidth', aiChatPanelWidth)

// 计算总的右侧偏移量
const totalRightOffset = computed(() => {
  let offset = 16 // 基础右边距
  
  if (showStudio.value) {
    offset += studioWidth.value + 16 // Studio宽度 + 间距
  }
  
  if (aiChatPanelWidth.value > 0) {
    offset += aiChatPanelWidth.value + 16 // AI Panel宽度 + 间距
  }
  
  return offset
})

// 方法
const setLoading = (loading) => {
  isLoading.value = loading
}

const toggleAIChatPanel = () => {
  // 如果当前显示，则隐藏；如果隐藏，则显示
  aiChatPanelWidth.value = aiChatPanelWidth.value > 0 ? 0 : 384
}

const toggleStudio = () => {
  showStudio.value = !showStudio.value
}

const closeStudio = () => {
  showStudio.value = false
}

// 处理 AI Chat Panel 的大小调整
const handleAIChatResize = (newWidth) => {
  // 限制最小和最大宽度
  aiChatPanelWidth.value = Math.max(0, Math.min(800, newWidth))
}

// 处理 Studio 的大小调整
const handleStudioResize = (newWidth) => {
  studioWidth.value = Math.max(320, Math.min(600, newWidth))
}

// 处理拖拽状态变化
const handleResizingState = (resizing) => {
  isResizing.value = resizing
}

// 处理题目选择事件（供子组件调用）
// 优化：使用 requestAnimationFrame 确保 UI 更新流畅，避免阻塞
const handleQuestionToggle = (question) => {
  console.log('🟢 LibraryLayout: Question toggled:', question)
  
  // 使用 requestAnimationFrame 确保动画流畅
  requestAnimationFrame(() => {
  // 如果面板未打开，先打开面板
  if (aiChatPanelWidth.value === 0) {
    aiChatPanelWidth.value = 384
  }
  
    // 将题目传递给AI聊天面板 - 延迟到下一帧确保面板动画先完成
    requestAnimationFrame(() => {
  if (aiChatPanel.value) {
    console.log('🟢 LibraryLayout: Calling aiChatPanel.handleQuestionToggle')
    aiChatPanel.value.handleQuestionToggle(question)
  } else {
    console.error('❌ LibraryLayout: aiChatPanel.value is null!')
  }
    })
  })
}

// 通过 provide 提供给子组件
provide('handleQuestionToggle', handleQuestionToggle)
provide('toggleAIChatPanel', toggleAIChatPanel)
provide('toggleStudio', toggleStudio)
provide('searchQuery', searchQuery)
provide('handleSearchChange', handleSearchChange)
provide('openPDF', openPDF)

// 暴露方法供子组件使用
defineExpose({
  setLoading,
  handleQuestionToggle,
  toggleAIChatPanel,
  toggleStudio,
  openPDF
})
</script>

<style scoped>
/* Studio Panel 滑动动画 (从右侧) */
.slide-from-right-enter-active,
.slide-from-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.98);
}

/* GPU 加速优化 */
.fixed {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
