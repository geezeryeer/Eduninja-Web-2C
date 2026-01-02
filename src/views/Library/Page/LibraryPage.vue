<template>
  <div class="h-full flex flex-col min-w-0 overflow-hidden">
    <!-- 过滤器组件 -->
    <div class="px-3 pt-3 pb-0 relative z-50">
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
    </div>

    <!-- 内容区域 -->
    <div 
      ref="scrollContainer" 
      class="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 relative z-0"
    >
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex flex-col justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 mb-4"></div>
        <span class="text-sm text-gray-500">Loading {{ activeContentType }}...</span>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path>
          </svg>
        </div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">Error Loading Content</h3>
        <p class="text-sm text-gray-500 mb-6 text-center max-w-sm">{{ error }}</p>
        <button
          @click="loadContent()" 
          class="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- 内容列表 -->
      <div v-else-if="apiData.length > 0">
        <!-- Document 列表 -->
        <DocumentList
          v-if="activeContentType === 'document'"
          :documents="apiData"
          :searchQuery="searchQuery"
          :filters="{ 
            knowledgePoint: route.query.knowledgePoint,
            subject: route.query.subject
          }"
          @document-selected="handleItemClick"
        />

        <!-- Past Paper 列表 -->
        <PastPaperList 
          v-else-if="activeContentType === 'pastpaper'"
          :papers="apiData"
          :searchQuery="searchQuery"
          :filters="{ 
            year: selectedYear, 
            session: selectedSession,
            paperType: selectedPaperType
          }"
          @paper-selected="handleItemClick"
        />

        <!-- Questions 列表 -->
        <QuestionsList 
          v-else-if="activeContentType === 'questions'"
          :questions="apiData"
          :searchQuery="searchQuery"
          :filters="{ difficulty: selectedDifficulty }"
          @question-selected="handleItemClick"
          @question-toggle="handleQuestionToggle"
        />

        <!-- 加载更多状态 -->
        <div v-if="isLoadingMore" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-gray-900"></div>
          <span class="ml-3 text-sm text-gray-500">Loading more...</span>
        </div>

        <!-- 没有更多数据提示 -->
        <div v-if="!hasMore && apiData.length > 0" class="text-center py-8">
          <span class="text-sm text-gray-400">No more content</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div 
          class="w-14 h-14 mb-5 bg-gray-400 icon-mask"
          :style="{ maskImage: `url(${folderIcon})`, WebkitMaskImage: `url(${folderIcon})` }"
        ></div>
        <h3 class="text-base font-semibold text-gray-900 mb-2">No Content</h3>
        <p class="text-sm text-gray-500">Try adjusting your filters</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, inject, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import PastPaperList from './PastPaperList.vue'
import QuestionsList from './QuestionsList.vue'
import DocumentList from './DocumentList.vue'
import LibraryFilter from './LibraryFilter.vue'
import { docService, pastPaperService, questionService, mineService } from '@/services'
import { getCurrentUserId } from '@/services/AuthService'
import folderIcon from '@/assets/Icon/folder.svg'

const route = useRoute()

// 从父组件注入方法和状态
const handleQuestionToggleFromParent = inject('handleQuestionToggle', null)
const searchQuery = inject('searchQuery', ref(''))
const handleSearchChangeFromParent = inject('handleSearchChange', null)
const openPDF = inject('openPDF', () => console.warn('openPDF not provided'))

// 多级筛选状态
const activeContentType = ref('document')
const selectedYear = ref('all')
const selectedSession = ref('all')
const selectedPaperType = ref('all')
const selectedDifficulty = ref('all')
const selectedTopic = ref('all')

// API数据状态
const isLoading = ref(false)
const isLoadingMore = ref(false)
const apiData = ref([])
const error = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

// 滚动容器引用
const scrollContainer = ref(null)

// 简单防抖
let loadingTimeout = null

// 获取当前学科信息
const currentSubject = computed(() => {
  return {
    subject: route.query.subject || '',
    clazz: route.query.clazz || '',
    exam: route.query.exam || '',
    level: route.query.level || '',
    space: route.query.space || 'public'
  }
})

// 加载内容
const loadContent = async (isLoadMore = false) => {
  if (!isLoadMore) {
    isLoading.value = true
    error.value = null
    apiData.value = []
    currentPage.value = 1
    hasMore.value = true
  } else {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
  }
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }
  
  loadingTimeout = setTimeout(async () => {
    try {
      switch (activeContentType.value) {
        case 'document':
          await loadDocuments(isLoadMore)
          break
        case 'pastpaper':
        case 'paper':
          await loadPastPapers(isLoadMore)
          break
        case 'questions':
          await loadQuestions(isLoadMore)
          break
        case 'flashcard':
          await loadFlashcards(isLoadMore)
          break
        default:
          if (!isLoadMore) {
            apiData.value = []
          }
      }
    } catch (err) {
      console.error(`Failed to load ${activeContentType.value}:`, err)
      error.value = err.message || 'Failed to load content'
      if (!isLoadMore) {
        apiData.value = []
      }
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }, isLoadMore ? 0 : 100)
}

// 数据映射器配置
const mappers = {
  document: (item) => ({
        id: item.contentId || item.id,
        title: item.title,
        type: item.type,
        fileUrl: item.fileUrl,
        coverUrl: item.coverUrl,
        zipCoverUrl: item.zipCoverUrl,
        fileSize: item.fileSize,
        pageCount: item.pageCount,
        authorId: item.authorId,
        authorName: item.authorName,
        authorAvatar: item.authorAvatar,
        labelList: item.labelList,
        isCollected: item.isCollected,
        isPrivate: item.isPrivate,
        viewCount: item.viewCount,
        isVip: item.isVip,
        genYear: item.genYear,
        clazz: item.clazz,
        exam: item.exam,
        subject: item.subject,
        levelList: item.levelList,
        createTime: item.createTime
  }),
  paper: (item) => ({
          id: item.contentId || item.id,
          title: item.title,
          fileUrl: item.fileUrl,
          fileSize: item.fileSize,
          fileAnswerUrl: item.fileAnswerUrl || item.answerUrl,  // 兼容两种字段名
          subject: item.subject,
          clazz: item.clazz,
          exam: item.exam,
          type: item.type,
          levelList: item.levelList,
          isCollected: item.isCollected,
          isPrivate: item.isPrivate
  }),
  question: (item) => {
    if (!item.title?.trim()) return null
    return {
      id: item.contentId || item.id,
      title: item.title,
      pdfKey: item.fileUrl,
      answerPdfKey: item.answerUrl,
      createTime: item.createTime,
      isCollected: item.isCollected,
      isPrivate: item.isPrivate
    }
  },
  flashcard: (item) => ({
    id: item.contentId || item.id,
    title: item.title,
    cardCount: item.cardCount,
    subject: item.subject,
    clazz: item.clazz,
    exam: item.exam,
    tags: item.labelList || [],
    isCollected: item.isCollected,
    isPrivate: item.isPrivate,
    createTime: item.createTime
  })
}

// 提取私有内容加载逻辑
const loadPrivateContent = async (contentType, mapper, isLoadMore) => {
  const response = await mineService.getCollectedContentList(
    contentType,
    currentSubject.value.subject,
    currentSubject.value.clazz,
    currentSubject.value.exam,
    currentPage.value,
    pageSize.value,
    Date.now()
  )

  const newData = (response?.list || []).map(mapper).filter(Boolean)
  apiData.value = isLoadMore ? [...apiData.value, ...newData] : newData
  hasMore.value = response?.pages ? currentPage.value < response.pages : false
  if (hasMore.value) currentPage.value += 1
}

// 添加路由参数到请求
const addRouteQueryToParams = (params) => {
  if (route.query.subject) params.subject = route.query.subject
  if (route.query.clazz) params.clazz = route.query.clazz
  if (route.query.exam) params.exam = route.query.exam
  return params
}

// 更新数据和分页状态
const updateData = (newData, isLoadMore, pageSize) => {
  apiData.value = isLoadMore ? [...apiData.value, ...newData] : newData
  hasMore.value = newData.length === pageSize
  if (hasMore.value) currentPage.value += 1
}

// 加载文档数据
const loadDocuments = async (isLoadMore = false) => {
  if (currentSubject.value.space === 'private') {
    await loadPrivateContent(1, mappers.document, isLoadMore)
    return
  }

  const params = addRouteQueryToParams({
    pageIndex: currentPage.value,
    pageSize: pageSize.value,
    keyword: searchQuery.value,
    isPrivate: false
  })
  
  const response = await docService.getDocList(params)
  if (!response.successful || !response.data) {
    throw new Error(response.message || 'Failed to load documents')
  }

  let filteredList = response.data.list || []
  
  // 知识点筛选
  if (route.query.knowledgePoint) {
    const kp = route.query.knowledgePoint.toLowerCase()
    filteredList = filteredList.filter(doc => 
      doc.labelList?.some(label => 
        label.toLowerCase().includes(kp) || kp.includes(label.toLowerCase())
      )
    )
  }
  
  updateData(filteredList, isLoadMore, pageSize.value)
}

// 加载试卷数据
const loadPastPapers = async (isLoadMore = false) => {
  const paperPageSize = 30 // 更大的pageSize确保足够内容触发滚动
  
  if (currentSubject.value.space === 'private') {
    const originalPageSize = pageSize.value
    pageSize.value = paperPageSize
    await loadPrivateContent(6, mappers.paper, isLoadMore)
    pageSize.value = originalPageSize
      return
  }

  const params = addRouteQueryToParams(pastPaperService.buildListQuery({
    current: currentPage.value,
    size: paperPageSize,
    year: selectedYear.value !== 'all' ? selectedYear.value : null,
    session: selectedSession.value !== 'all' ? selectedSession.value : null,
    paperType: selectedPaperType.value !== 'all' ? selectedPaperType.value : null,
    keyword: searchQuery.value
  }))
  
  const response = await pastPaperService.getPastPaperList(params)
  if (!response.successful || !response.data) {
    throw new Error(response.message || 'Failed to load past papers')
  }

  // 使用 mapper 映射数据（确保字段一致，包括 fileAnswerUrl）
  const mappedList = (response.data.list || []).map(mappers.paper).filter(Boolean)
  
  updateData(mappedList, isLoadMore, paperPageSize)
}

// 加载闪卡数据
const loadFlashcards = async (isLoadMore = false) => {
  // Flashcard 仅在 private 空间可用
  if (currentSubject.value.space !== 'private') {
    apiData.value = []
    hasMore.value = false
    return
  }

  await loadPrivateContent(2, mappers.flashcard, isLoadMore)
}

// 加载题目数据
const loadQuestions = async (isLoadMore = false) => {
  if (currentSubject.value.space === 'private') {
    await loadPrivateContent(6, mappers.question, isLoadMore)
      return
  }

  const params = {
    pageIndex: currentPage.value,
    pageSize: pageSize.value,
    accountId: getCurrentUserId(),
    sortType: "",
    type: ""
  }
  
  if (searchQuery.value) params.keyword = searchQuery.value
  if (selectedDifficulty.value !== 'all') params.difficulty = selectedDifficulty.value
  if (route.query.knowledgePoint) params.knowledgePoint = route.query.knowledgePoint
  if (route.query.subject) params.subject = route.query.subject
  if (route.query.clazz) params.clazz = route.query.clazz
  if (route.query.exam) params.exam = route.query.exam
  if (selectedYear.value !== 'all') params.yearAt = selectedYear.value
  if (selectedSession.value !== 'all') params.season = selectedSession.value
  
    const response = await questionService.getList(params)
    
  // 统一处理各种响应格式
    let newData = []
    let totalPages = 1
    
  if (response?.code === 200 && response.data) {
    newData = Array.isArray(response.data.list) ? response.data.list : response.data
        totalPages = response.data.pages || 1
    } else if (Array.isArray(response)) {
      newData = response
  } else if (response?.list) {
      newData = response.list
      totalPages = response.pages || 1
    }
    
  // 过滤顶级问题
  newData = newData.filter(q => 
    [null, "0", 0].includes(q.parentId) && q.title?.trim()
    )
    
  apiData.value = isLoadMore ? [...apiData.value, ...newData] : newData
  hasMore.value = isLoadMore ? newData.length > 0 && currentPage.value < totalPages : currentPage.value < totalPages
  if (hasMore.value) currentPage.value += 1
}

// PDF查看器操作
const handleItemClick = (item) => {
  if (['document', 'pastpaper'].includes(activeContentType.value)) {
    openPDF(item)
  }
}

// 题目选择事件
const handleQuestionToggle = (question) => handleQuestionToggleFromParent?.(question)

// 事件处理方法 - 简化为对象模式
const handleContentTypeChange = (value) => { activeContentType.value = value }
const handleSearchChange = (value) => { handleSearchChangeFromParent?.(value) }
const handleYearChange = (value) => { selectedYear.value = value }
const handleSessionChange = (value) => { selectedSession.value = value }
const handlePaperTypeChange = (value) => { selectedPaperType.value = value }
const handleDifficultyChange = (value) => { selectedDifficulty.value = value }
const handleTopicChange = (value) => { selectedTopic.value = value }

// 滚动加载更多
const handleScroll = () => {
  if (!scrollContainer.value || isLoadingMore.value || !hasMore.value) {
    return
  }
  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
  
  if (distanceFromBottom <= 50) {
    loadContent(true)
  }
}

// 监听器
watch(activeContentType, () => {
  // 切换内容类型时重置所有筛选条件
  selectedYear.value = selectedSession.value = selectedPaperType.value = selectedDifficulty.value = selectedTopic.value = 'all'
})

watch(() => [activeContentType.value, searchQuery.value, selectedYear.value, selectedSession.value, selectedPaperType.value, selectedDifficulty.value, selectedTopic.value], 
  () => loadContent(), { immediate: true })

watch(() => route.query, (newQuery, oldQuery) => {
  // 监听 space 变化，切换 Public/Private 时重置为 document
  if (newQuery.space !== oldQuery?.space) {
    activeContentType.value = 'document'
    loadContent()
    return
  }
  
  // 监听其他参数变化
  const keys = ['subject', 'clazz', 'exam', 'knowledgePoint']
  if (keys.some(key => newQuery[key] !== oldQuery?.[key])) {
    loadContent()
  }
}, { deep: true })

// 生命周期
onMounted(() => nextTick(() => scrollContainer.value?.addEventListener('scroll', handleScroll)))
onUnmounted(() => scrollContainer.value?.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* Apple 风格滚动条 - 与Navigation保持一致 */
/* .custom-scrollbar 已在全局 main.css 中定义 */
</style>
