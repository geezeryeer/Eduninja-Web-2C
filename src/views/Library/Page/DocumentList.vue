<template>
  <div class="document-list-container">
    <div 
      class="masonry-container"
    >
      <div
        v-for="document in filteredDocuments"
        :key="document.id"
      class="masonry-item group relative bg-white rounded-xl border border-gray-200/60 hover:border-gray-300/80 transition-all duration-200 overflow-hidden mb-3"
    >
      <!-- 上部分：封面+标题+元数据 (可点击) -->
      <div class="flex w-full p-3 cursor-pointer active:bg-gray-50/50" @click="openDocument(document)">
        <!-- 左侧: PDF封面图片 -->
        <div class="flex-shrink-0 w-14 h-[72px] rounded-lg overflow-hidden relative" :class="shouldShowCover(document) ? 'border border-gray-200/60' : ''">
          <img 
            v-if="shouldShowCover(document)"
            :src="getCoverUrl(document)"
            :alt="document.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="handleImageError(document.id)"
          />
          <!-- 没有封面或加载失败时显示图标 -->
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-50/50">
             <img 
               :src="textPageIcon" 
               alt="Document"
               class="w-9 h-9 opacity-30 group-hover:opacity-40 transition-opacity duration-200"
             />
          </div>
        </div>

        <!-- 右侧: 文件名和基本信息 -->
        <div class="flex-1 min-w-0 ml-3 flex flex-col justify-between">
           <div>
             <!-- 标题行：文件名 + 收藏按钮 -->
             <div class="flex items-start justify-between gap-2">
             <!-- 文件名 - 只显示一行 -->
               <h3 class="text-[15px] font-semibold text-gray-900 leading-tight group-hover:text-link transition-colors line-clamp-1 flex-1">
                {{ document.title || 'Untitled Document' }}
             </h3>
             </div>

            <!-- 标签 (放在标题下面) -->
            <div v-if="document.labelList && document.labelList.length > 0" class="flex flex-nowrap gap-1 mt-1 overflow-x-auto scrollbar-hide">
               <span 
                 v-for="label in getDisplayLabels(document)" 
                 :key="label"
                 class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100/80 text-gray-600 whitespace-nowrap flex-shrink-0"
               >
                 {{ label }}
               </span>
            </div>

             <!-- 非知识点模式：显示描述 -->
             <div v-if="!isKnowledgePointMode" class="mt-1 text-[13px] text-gray-500 line-clamp-1 leading-relaxed">
                {{ document.description || 'No description available for this document.' }}
             </div>
           </div>

           <!-- 底部元数据 -->
           <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-1.5">
              <div v-if="document.authorName" class="flex items-center gap-1">
                <div 
                  class="w-3.5 h-3.5 bg-gray-400 rounded-full flex-shrink-0 icon-mask"
                  :style="{ maskImage: `url(${personIcon})`, WebkitMaskImage: `url(${personIcon})` }"
                ></div>
                <span class="truncate max-w-[80px]">{{ document.authorName }}</span>
              </div>
              
              <span v-if="document.authorName && document.type" class="text-gray-300">·</span>
              
              <span v-if="document.type" class="uppercase tracking-wide">{{ document.type }}</span>
              
              <!-- 日期或其他信息 -->
              <span v-if="document.createdTime" class="ml-auto font-mono opacity-50">
                {{ formatDate(document.createdTime) }}
              </span>
           </div>
        </div>
      </div>

      <!-- 下部分：RAG内容区域 (知识点模式下显示，独立区域) -->
      <div v-if="isKnowledgePointMode && getRagContents(document).length > 0" class="border-t border-gray-100/80 bg-gray-50/50">
        <!-- RAG内容列表 -->
        <div class="divide-y divide-gray-100/80">
          <div v-for="(ragItem, index) in getDisplayRagContents(document)" 
               :key="ragItem.id"
               class="px-3 py-2.5 hover:bg-gray-50 transition-colors">
            <!-- 引用样式的内容 -->
            <div class="flex gap-2">
              <div class="w-0.5 self-stretch bg-link/30 rounded-full my-0.5"></div>
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] text-gray-700 leading-relaxed" v-html="ragItem.highlightedContent"></p>
                <div class="flex items-center mt-2 gap-2">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-white border border-gray-200 text-gray-500">
                    p.{{ ragItem.pageNumber }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 展开/收起按钮 -->
        <div 
          v-if="getRagContents(document).length > 3"
          class="px-3 pb-2.5 pt-1 border-t border-gray-100/50"
        >
          <button
            @click="toggleRagExpansion($event, document.id)"
            class="flex items-center gap-1 text-[12px] text-link hover:text-link-dark font-medium transition-colors active:scale-95 w-full justify-center py-1"
          >
            <span>{{ isRagExpanded(document.id) ? 'Show Less' : `Show ${getRagContents(document).length - 3} More Matches` }}</span>
            <svg 
              class="w-3 h-3 transition-transform duration-200"
              :class="{ 'rotate-180': isRagExpanded(document.id) }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getDocumentRagContent, getDocumentRagSummary } from '@/utils/mockRagData'
import textPageIcon from '@/assets/Icon/text.page.svg'
import starIcon from '@/assets/Icon/star.svg'
import personIcon from '@/assets/Icon/person.crop.circle.svg'

const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  },
  searchQuery: String,
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['document-selected'])

// 用于追踪哪些文档的RAG内容被展开
const expandedRagDocs = ref(new Set())
const failedImageIds = ref(new Set()) // 追踪加载失败的图片

// 星星图标样式
const starMaskStyle = {
  maskImage: `url(${starIcon})`,
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskImage: `url(${starIcon})`,
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center'
}

// 判断是否处于知识点筛选模式（包括点击学科或知识点）
const isKnowledgePointMode = computed(() => {
  return !!(props.filters?.knowledgePoint || props.filters?.subject)
})

// 获取当前的关键词（优先使用知识点，否则使用学科名）
const getCurrentKeyword = computed(() => {
  return props.filters?.knowledgePoint || props.filters?.subject || ''
})

// 获取封面图片URL
const getCoverUrl = (document) => {
  const coverKey = document.zipCoverUrl || document.coverUrl
  if (!coverKey) return null
  if (coverKey.startsWith('http') || coverKey.startsWith('/')) return coverKey
  return `https://cheese-test-public.oss-accelerate.aliyuncs.com/${coverKey}`
}

// 决定是否显示封面图
const shouldShowCover = (document) => {
  return getCoverUrl(document) && !failedImageIds.value.has(document.id)
}

const handleImageError = (documentId) => {
  failedImageIds.value.add(documentId)
}

// 筛选文档
const filteredDocuments = computed(() => {
  let filtered = props.documents
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

// 获取需要显示的标签
const getDisplayLabels = (document) => {
  return document.labelList?.slice(0, 2) || []
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch (e) {
    return ''
  }
}

const openDocument = (document) => {
  emit('document-selected', document)
}

// 切换RAG内容展开/收起
const toggleRagExpansion = (event, documentId) => {
  event.stopPropagation() // 阻止触发文档点击事件
  
  if (expandedRagDocs.value.has(documentId)) {
    expandedRagDocs.value.delete(documentId)
  } else {
    expandedRagDocs.value.add(documentId)
  }
  
  // 触发响应式更新
  expandedRagDocs.value = new Set(expandedRagDocs.value)
}

// 检查文档是否展开
const isRagExpanded = (documentId) => {
  return expandedRagDocs.value.has(documentId)
}

// 获取文档的RAG内容列表
const getRagContents = (document) => {
  if (!isKnowledgePointMode.value) return []
  return getDocumentRagContent(document, getCurrentKeyword.value)
}

// 获取要显示的RAG内容（未展开时显示3个，展开后显示全部）
const getDisplayRagContents = (document) => {
  const allContents = getRagContents(document)
  if (isRagExpanded(document.id)) {
    return allContents
  }
  return allContents.slice(0, 3)
}
</script>

<style scoped>
/* 启用容器查询 */
.document-list-container {
  container-type: inline-size;
  container-name: doc-list;
}

/* 瀑布流容器 - 只显示 1 列 */
.masonry-container {
  column-count: 1;
  column-gap: 0.75rem;
  width: 100%;
}

/* 防止卡片被分割到不同列 */
.masonry-item {
  break-inside: avoid;
  /* 强制硬件加速以避免渲染闪烁 */
  transform: translateZ(0); 
}

/* 隐藏水平滚动条但保持滚动功能 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>
