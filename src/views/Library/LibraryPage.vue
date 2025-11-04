<template>
  <div class="h-full flex relative bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl">
    <!-- library 主内容区 -->
    <div class="flex-1 flex flex-col px-4 py-3 min-w-0">
      <!-- 过滤器组件 -->
      <LibraryFilter
        :activeContentType="activeContentType"
        :searchQuery="searchQuery"
        :selectedYear="selectedYear"
        :selectedSession="selectedSession"
        :selectedPaperType="selectedPaperType"
        :selectedDifficulty="selectedDifficulty"
        :selectedTopic="selectedTopic"
        @content-type-change="handleContentTypeChange"
        @search-change="handleSearchChange"
        @year-change="handleYearChange"
        @session-change="handleSessionChange"
        @paper-type-change="handlePaperTypeChange"
        @difficulty-change="handleDifficultyChange"
        @topic-change="handleTopicChange"
      />

      <!-- library 内容组件 -->
      <LibraryContent 
        :activeContentType="activeContentType"
        :searchQuery="searchQuery"
        :selectedYear="selectedYear"
        :selectedSession="selectedSession"
        :selectedPaperType="selectedPaperType"
        :selectedDifficulty="selectedDifficulty"
        :selectedTopic="selectedTopic"
        @item-click="handleItemClick"
        @question-toggle="handleQuestionToggle"
      />
    </div>

    <!-- PDF 查看器模态框 -->
    <PDFViewer 
      :document="selectedDocument"
      :isVisible="showPDFViewer"
      @close="closePDFViewer"
    />
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import LibraryContent from './LibraryContent.vue'
import LibraryFilter from './LibraryFilter.vue'
import PDFViewer from '../PDFViewer.vue'

// 从父组件注入方法
const handleQuestionToggleFromParent = inject('handleQuestionToggle', null)

// UI状态
const searchQuery = ref('')

// PDF查看器状态
const showPDFViewer = ref(false)
const selectedDocument = ref(null)

// 多级筛选状态
const activeContentType = ref('document')
const selectedYear = ref('all')
const selectedSession = ref('all')
const selectedPaperType = ref('all')
const selectedDifficulty = ref('all')
const selectedTopic = ref('all')



// 处理项目点击
const handleItemClick = (item) => {
  console.log('Item clicked:', item)
  
  // 根据内容类型处理点击事件
  switch (activeContentType.value) {
    case 'document':
      // 在PDF查看器中打开文档
      openDocument(item)
      break
    case 'pastpaper':
      // 开始考试或预览试卷
      openDocument(item)
      break
    case 'questions':
      // 进入答题模式
      console.log('Opening question:', item.title)
      // TODO: 实现题目查看逻辑
      break
    default:
      console.warn('未知的内容类型:', activeContentType.value)
  }
}

// 打开文档/试卷
const openDocument = (document) => {
  console.log('📖 打开文档:', document)
  console.log('📋 文档字段:', document ? Object.keys(document) : 'null')
  
  selectedDocument.value = document
  showPDFViewer.value = true
  
  console.log('✅ PDFViewer状态:', {
    showPDFViewer: showPDFViewer.value,
    selectedDocument: selectedDocument.value
  })
}

// 关闭PDF查看器
const closePDFViewer = () => {
  showPDFViewer.value = false
  selectedDocument.value = null
}

// 处理题目选择事件
const handleQuestionToggle = (question) => {
  console.log('🟡 LibraryPage: Question toggled:', question)
  // 调用父组件提供的方法
  if (handleQuestionToggleFromParent) {
    handleQuestionToggleFromParent(question)
  } else {
    console.error('❌ LibraryPage: handleQuestionToggleFromParent not available!')
  }
}

// 事件处理方法
const handleContentTypeChange = (value) => {
  activeContentType.value = value
}

const handleSearchChange = (value) => {
  searchQuery.value = value
}

const handleYearChange = (value) => {
  selectedYear.value = value
}

const handleSessionChange = (value) => {
  selectedSession.value = value
}

const handlePaperTypeChange = (value) => {
  selectedPaperType.value = value
}

const handleDifficultyChange = (value) => {
  selectedDifficulty.value = value
}

const handleTopicChange = (value) => {
  selectedTopic.value = value
}

// 监听内容类型变化
watch(activeContentType, async (newType) => {
  // 重置筛选
  selectedYear.value = 'all'
  selectedSession.value = 'all'
  selectedPaperType.value = 'all'
  selectedDifficulty.value = 'all'
  selectedTopic.value = 'all'
})
</script>

