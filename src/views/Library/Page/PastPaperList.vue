<template>
  <div class="space-y-2">
    <!-- 空状态提示 -->
    <div v-if="filteredPapers.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-sm text-gray-400">No past papers found</p>
    </div>

    <!-- 试卷列表 -->
    <div
      v-for="paper in filteredPapers"
      :key="paper.id"
      class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] transition-shadow duration-200 overflow-hidden"
    >
      <!-- 主要内容区域 - 可点击展开/收起 -->
      <div 
        class="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors"
        @click="toggleExpanded(paper.id)"
      >
        <div class="flex-1 min-w-0 pr-3">
          <h3 class="text-base font-medium text-gray-900 truncate">
            {{ paper.title || paper.name || 'Untitled Paper' }}
          </h3>
        </div>
        
        <!-- 展开/收起箭头 -->
        <svg 
          class="w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0"
          :class="{ 'rotate-180': expandedItems.has(paper.id) }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      <!-- 展开的内容区域 -->
      <div 
        v-if="expandedItems.has(paper.id)"
        class="border-t border-gray-100 px-4 py-3 bg-gray-50"
      >
        <div class="flex items-center gap-2">
          <!-- Paper 按钮 - 只在有fileUrl时显示 -->
          <button 
            v-if="paper.fileUrl"
            class="px-3 py-1.5 bg-black text-white text-sm rounded-lg active:bg-gray-800 transition-colors"
            @click.stop="downloadPaper(paper)"
          >
            Paper
          </button>
          <!-- Answer 按钮 - 只在有fileAnswerUrl时显示 -->
          <button 
            v-if="paper.fileAnswerUrl"
            class="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg active:bg-gray-700 transition-colors"
            @click.stop="downloadAnswer(paper)"
          >
            Answer
          </button>
          <!-- Attachments 按钮 - 只在有attachmentUrl时显示 -->
          <button 
            v-if="paper.attachmentUrl"
            class="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg active:bg-gray-600 transition-colors"
            @click.stop="downloadAttachment(paper)"
          >
            Attachments
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, inject } from 'vue'

const props = defineProps({
  papers: {
    type: Array,
    default: () => []
  },
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['paper-selected'])

// 注入 openPDF 函数
const openPDF = inject('openPDF', () => console.warn('openPDF not provided'))

// 展开状态管理
const expandedItems = ref(new Set())

// 切换展开状态
const toggleExpanded = (paperId) => {
  const newSet = new Set(expandedItems.value)
  if (newSet.has(paperId)) {
    newSet.delete(paperId)
  } else {
    newSet.add(paperId)
  }
  expandedItems.value = newSet
}

// 打开 Paper 操作 - 使用 PDF 查看器
const downloadPaper = (paper) => {
  if (paper.fileUrl) {
    console.log('Opening paper in PDF viewer:', paper.title)
    // 使用内置 PDF 查看器
    openPDF({
      ...paper,
      fileUrl: paper.fileUrl,
      paperUrl: paper.fileUrl,
      answerUrl: paper.fileAnswerUrl,
      attachmentUrl: paper.attachmentUrl,
      title: paper.title || paper.name || 'Untitled Paper',
      initMode: 'paper'
    })
  }
}

// 打开 Answer 操作 - 使用 PDF 查看器
const downloadAnswer = (paper) => {
  if (paper.fileAnswerUrl) {
    console.log('Opening answer in PDF viewer:', paper.title)
    // 使用内置 PDF 查看器，将答案URL作为主文件URL
    openPDF({
      ...paper,
      fileUrl: paper.fileAnswerUrl,
      paperUrl: paper.fileUrl,
      answerUrl: paper.fileAnswerUrl,
      attachmentUrl: paper.attachmentUrl,
      title: `${paper.title || paper.name || 'Untitled Paper'} - Answer`,
      initMode: 'answer'
    })
  }
}

// 打开附件 - 尝试在 PDF Viewer 中打开，以便可以切换
const downloadAttachment = (paper) => {
  if (paper.attachmentUrl) {
    console.log('Opening attachment in PDF viewer:', paper.title)
    openPDF({
      ...paper,
      fileUrl: paper.attachmentUrl,
      paperUrl: paper.fileUrl,
      answerUrl: paper.fileAnswerUrl,
      attachmentUrl: paper.attachmentUrl,
      title: `${paper.title || paper.name || 'Untitled Paper'} - Resource`,
      initMode: 'attachment'
    })
  }
}


// 筛选试卷
const filteredPapers = computed(() => {
  let filtered = props.papers

  // 搜索筛选
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(paper => 
      (paper.title || paper.name || '').toLowerCase().includes(query) ||
      (paper.subject || '').toLowerCase().includes(query) ||
      (paper.year || '').toString().toLowerCase().includes(query) ||
      (paper.session || '').toLowerCase().includes(query) ||
      (paper.type || '').toLowerCase().includes(query)
    )
  }

  // 年份筛选
  if (props.filters?.year && props.filters.year !== 'all') {
    filtered = filtered.filter(paper => paper.year === props.filters.year)
  }

  // 会话筛选
  if (props.filters?.session && props.filters.session !== 'all') {
    filtered = filtered.filter(paper => paper.session.toLowerCase().includes(props.filters.session.toLowerCase()))
  }

  // 试卷类型筛选
  if (props.filters?.paperType && props.filters.paperType !== 'all') {
    filtered = filtered.filter(paper => paper.type === props.filters.paperType)
  }

  return filtered
})

// 打开试卷
const openPaper = (paper) => {
  emit('paper-selected', paper)
  console.log('Opening paper:', paper.title)
}
</script>
