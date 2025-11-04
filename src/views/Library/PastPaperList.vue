<template>
  <div class="space-y-3">
    <!-- 空状态提示 -->
    <div v-if="filteredPapers.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No papers with attachments found</h3>
      <p class="text-sm text-gray-500">Try adjusting your search or filters</p>
    </div>

    <!-- 试卷列表 -->
    <div
      v-for="paper in filteredPapers"
      :key="paper.id"
      class="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- 主要内容区域 - 可点击展开/收起 -->
      <div 
        class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        @click="toggleExpanded(paper.id)"
      >
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-medium text-gray-900 truncate mb-2">{{ paper.title || paper.name || 'Untitled Paper' }}</h3>
          <!-- 标签区域 -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- 年份标签 -->
            <span v-if="paper.year" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ paper.year }}
            </span>
            <!-- 会话标签 -->
            <span v-if="paper.session" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {{ paper.session }}
            </span>
            <!-- 试卷类型标签 -->
            <span v-if="paper.type" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {{ paper.type }}
            </span>
            <!-- 学科标签 -->
            <span v-if="paper.subject" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {{ paper.subject }}
            </span>
            <!-- 考试局标签 -->
            <span v-if="paper.exam" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {{ paper.exam }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-3 ml-4">
          <!-- 展开/收起箭头 -->
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': expandedItems.has(paper.id) }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <!-- 展开的内容区域 -->
      <div 
        v-if="expandedItems.has(paper.id)"
        class="border-t border-gray-100 bg-gray-50"
      >
        
        <!-- 操作按钮区域 -->
        <div class="p-5">
          <div class="flex items-center gap-2">
            <button 
              class="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              @click.stop="downloadPaper(paper)"
            >
              Paper
            </button>
            <button 
              class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-500 transition-colors"
              @click.stop="downloadAnswer(paper)"
            >
              Answer
            </button>
            <button 
              class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
              @click.stop="downloadAttachment(paper)"
            >
              Attachments
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  papers: {
    type: Array,
    default: () => []
  },
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['paper-selected'])

// 展开状态管理
const expandedItems = ref(new Set())

// 切换展开状态
const toggleExpanded = (paperId) => {
  if (expandedItems.value.has(paperId)) {
    expandedItems.value.delete(paperId)
  } else {
    expandedItems.value.add(paperId)
  }
}

// 下载操作
const downloadPaper = (paper) => {
  console.log('Downloading paper:', paper.title)
  // 这里可以添加实际的下载逻辑
}

const downloadAnswer = (paper) => {
  console.log('Downloading answer:', paper.title)
  // 这里可以添加实际的下载逻辑
}

const downloadAttachment = (paper) => {
  console.log('Downloading attachment:', paper.title)
  // 这里可以添加实际的下载逻辑
}


// 筛选试卷
const filteredPapers = computed(() => {
  let filtered = props.papers

  // 只显示有 attachment 的试卷
  filtered = filtered.filter(paper => paper.attachment)

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
