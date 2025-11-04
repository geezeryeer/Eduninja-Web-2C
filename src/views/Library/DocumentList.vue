<template>
  <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
    <div
      v-for="document in filteredDocuments"
      :key="document.id"
      class="break-inside-avoid mb-6 rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
      @click="openDocument(document)"
    >
      <!-- 封面图片区域 -->
      <div class="relative overflow-hidden">
        <img 
          v-if="getCoverUrl(document)"
          :src="getCoverUrl(document)"
          :alt="document.title"
          class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImageError"
        />
        <div v-else class="w-full aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
          <svg class="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm font-medium">{{ document.type || 'Document' }}</span>
        </div>
        
        <!-- 页数标签 -->
        <div v-if="document.pageCount" class="absolute top-3 right-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/80 backdrop-blur-sm text-white">
            {{ document.pageCount }}页
          </span>
        </div>
      </div>

      <!-- 文档信息区域 -->
      <div class="p-5">
        <h3 class="text-base font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight">
          {{ document.title || 'Untitled Document' }}
        </h3>
        
        <!-- 作者信息 -->
        <div v-if="document.authorName" class="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <div class="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
            <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </div>
          <span>{{ document.authorName }}</span>
        </div>

        <!-- 标签 -->
        <div v-if="document.labelList && document.labelList.length > 0" class="flex flex-wrap gap-1.5">
          <span 
            v-for="label in document.labelList.slice(0, 3)" 
            :key="label"
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
          >
            {{ label }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  },
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['document-selected'])

// 获取封面图片URL
const getCoverUrl = (document) => {
  // 优先使用压缩后的封面，然后是原始封面
  const coverKey = document.zipCoverUrl || document.coverUrl
  if (!coverKey) return null
  
  // 如果已经是完整URL，直接返回
  if (coverKey.startsWith('http')) return coverKey
  
  // 构建OSS完整URL
  return `https://cheese-test-public.oss-accelerate.aliyuncs.com/${coverKey}`
}

// 处理图片加载错误
const handleImageError = (event) => {
  console.log('Cover image load error:', event)
  // 图片加载失败时隐藏img元素，显示默认占位符
  event.target.style.display = 'none'
}

// 筛选文档
const filteredDocuments = computed(() => {
  let filtered = props.documents

  // 搜索筛选
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(doc => 
      (doc.title || '').toLowerCase().includes(query) ||
      (doc.description || '').toLowerCase().includes(query) ||
      (doc.subject || '').toLowerCase().includes(query) ||
      (doc.type || '').toLowerCase().includes(query) ||
      (doc.authorName || '').toLowerCase().includes(query)
    )
  }

  return filtered
})

// 打开文档
const openDocument = (document) => {
  emit('document-selected', document)
  console.log('Opening document:', document.title)
}
</script>
