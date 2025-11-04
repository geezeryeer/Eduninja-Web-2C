<template>
  <!-- 主内容区域 - 纯内容显示组件 -->
  <div ref="scrollContainer" class="flex-1 overflow-y-auto bg-white rounded-2xl py-4">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center py-12 px-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span class="ml-3 text-gray-600">Loading {{ props.activeContentType }}...</span>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12 px-4">
        <div class="text-red-600 mb-4">
          <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900">Error Loading Content</h3>
          <p class="text-gray-600 mt-2">{{ error }}</p>
        </div>
      <button
          @click="loadContent()" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
      </button>
    </div>

      <!-- 根据内容类型显示不同的组件 -->
      <div v-else-if="apiData.length > 0" class="px-4">
        
        <!-- 内容切换动画容器 -->
        <Transition 
          name="content-fade" 
          mode="out-in"
          appear
        >
          <!-- Document 专用组件 -->
          <DocumentList 
            v-if="props.activeContentType === 'document'"
            key="document"
            :documents="apiData"
            :searchQuery="props.searchQuery"
            :filters="{}"
            @document-selected="handleItemClick"
          />

          <!-- Past Paper 专用组件 -->
          <PastPaperList 
            v-else-if="props.activeContentType === 'pastpaper'"
            key="pastpaper"
            :papers="apiData"
            :searchQuery="props.searchQuery"
            :filters="{ 
              year: props.selectedYear, 
              session: props.selectedSession 
            }"
            @paper-selected="handleItemClick"
          />

          <!-- Questions 专用组件 -->
          <QuestionsList 
            v-else-if="props.activeContentType === 'questions'"
            key="questions"
            :questions="apiData"
            :searchQuery="props.searchQuery"
            :filters="{ 
              difficulty: props.selectedDifficulty 
            }"
            @question-selected="handleItemClick"
            @question-toggle="handleQuestionToggle"
          />
          
               </Transition>

               <!-- 加载更多状态 -->
               <div v-if="isLoadingMore" class="flex justify-center items-center py-6 px-4">
                 <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                 <span class="ml-2 text-gray-500 text-sm">Loading more...</span>
               </div>

               <!-- 没有更多数据提示 -->
               <div v-else-if="!hasMore && apiData.length > 0" class="text-center py-6 px-4">
                 <span class="text-gray-400 text-sm">No more content</span>
               </div>
             </div>

             <!-- 空状态 -->
             <div v-else class="text-center py-12 px-4">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No {{ props.activeContentType }} found</h3>
        <p class="text-gray-600">Try adjusting your filters or search query</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import PastPaperList from './PastPaperList.vue'
import QuestionsList from './QuestionsList.vue'
import DocumentList from './DocumentList.vue'

// 简化：只导入需要的服务
import { docService, pastPaperService, questionService } from '@/services'

const route = useRoute()

// 定义组件的 props
const props = defineProps({
  activeContentType: {
    type: String,
    default: 'document'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  selectedYear: {
    type: String,
    default: 'all'
  },
  selectedSession: {
    type: String,
    default: 'all'
  },
  selectedDifficulty: {
    type: String,
    default: 'all'
  },
  selectedTopic: {
    type: String,
    default: 'all'
  },
  selectedPaperType: {
    type: String,
    default: 'all'
  }
})

// 定义组件的 emits
const emit = defineEmits(['item-click'])

// API数据状态
const isLoading = ref(false)
const isLoadingMore = ref(false)
const apiData = ref([])
const error = ref(null)
const currentPage = ref(1)
const pageSize = ref(10) // 减少页面大小，更容易触发分页
const hasMore = ref(true)

// 简单防抖
let loadingTimeout = null


// ===================
// API调用函数
// ===================

// 防抖加载内容
const loadContent = async (isLoadMore = false) => {
  if (!isLoadMore) {
    // 重新加载：立即设置loading状态，清空旧数据
    isLoading.value = true
    error.value = null
    apiData.value = []
    currentPage.value = 1
    hasMore.value = true
  } else {
    // 加载更多：设置加载更多状态
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
  }
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }
  
  loadingTimeout = setTimeout(async () => {
    try {
      switch (props.activeContentType) {
        case 'document':
          await loadDocuments(isLoadMore)
          break
        case 'pastpaper':
          await loadPastPapers(isLoadMore)
          break
        case 'questions':
          await loadQuestions(isLoadMore)
          break
        default:
          if (!isLoadMore) {
            apiData.value = []
          }
      }
    } catch (err) {
      console.error(`Failed to load ${props.activeContentType}:`, err)
      error.value = err.message || 'Failed to load content'
      if (!isLoadMore) {
        apiData.value = []
      }
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }, isLoadMore ? 0 : 100) // 加载更多时不需要防抖
}

// 加载文档数据 - 调用真实API
const loadDocuments = async (isLoadMore = false) => {
  const params = {
    pageIndex: currentPage.value,  // API使用pageIndex而不是current
    pageSize: pageSize.value,      // API使用pageSize而不是size
    keyword: props.searchQuery,
    isPrivate: false              // 默认不过滤私有文档
  }
  
  // 添加学科筛选参数
  if (route.query.subject) {
    params.subject = route.query.subject
  }
  if (route.query.clazz) {
    params.clazz = route.query.clazz
  }
  if (route.query.exam) {
    params.exam = route.query.exam
  }
  
  const response = await docService.getDocList(params)
  
  if (response.successful && response.data) {
    const newData = response.data.list || []
    if (isLoadMore) {
      apiData.value = [...apiData.value, ...newData]
    } else {
      apiData.value = newData
    }
    
    hasMore.value = newData.length === pageSize.value
    if (hasMore.value) {
      currentPage.value += 1
    }
  } else {
    throw new Error(response.message || 'Failed to load documents')
  }
}

// 加载试卷数据 - 调用真实API
const loadPastPapers = async (isLoadMore = false) => {
  const params = pastPaperService.buildListQuery({
    current: currentPage.value,
    size: pageSize.value,
    year: props.selectedYear !== 'all' ? props.selectedYear : null,
    session: props.selectedSession !== 'all' ? props.selectedSession : null,
    paperType: props.selectedPaperType !== 'all' ? props.selectedPaperType : null,
    keyword: props.searchQuery
  })
  
  // 添加学科筛选参数
  if (route.query.subject) {
    params.subject = route.query.subject
  }
  if (route.query.clazz) {
    params.clazz = route.query.clazz
  }
  if (route.query.exam) {
    params.exam = route.query.exam
  }
  
  const response = await pastPaperService.getPastPaperList(params)
  
  if (response.successful && response.data) {
    const newData = response.data.list || []
    if (isLoadMore) {
      apiData.value = [...apiData.value, ...newData]
    } else {
      apiData.value = newData
    }
    
    hasMore.value = newData.length === pageSize.value
    if (hasMore.value) {
      currentPage.value += 1
    }
  } else {
    throw new Error(response.message || 'Failed to load past papers')
  }
}

// 加载题目数据 - 调用真实API
const loadQuestions = async (isLoadMore = false) => {
  const params = {
    pageIndex: currentPage.value,
    pageSize: pageSize.value,
    accountId: "123" // 必需参数
  }
  
  // 添加筛选参数 - 参考miniapp的searchData
  if (props.searchQuery) params.keyword = props.searchQuery
  if (props.selectedDifficulty && props.selectedDifficulty !== 'all') params.difficulty = props.selectedDifficulty
  
  // 添加学科相关参数 - 参考miniapp的postData
  if (route.query.subject) params.subject = route.query.subject
  if (route.query.clazz) params.clazz = route.query.clazz
  if (route.query.exam) params.exam = route.query.exam
  
  // 添加miniapp中的其他筛选参数
  if (props.selectedYear && props.selectedYear !== 'all') params.yearAt = props.selectedYear
  if (props.selectedSession && props.selectedSession !== 'all') params.season = props.selectedSession
  
  // 添加默认的排序参数
  params.sortType = ""
  params.type = ""
  
  try {
    console.log(`📚 开始加载题目 (页码: ${currentPage.value}, 加载更多: ${isLoadMore})`)
    console.log('📤 发送的API参数:', params)
    const response = await questionService.getList(params)
    
    // 处理响应数据 - 参考miniapp的逻辑
    let newData = []
    let totalPages = 1
    
    if (response && response.code === 200 && response.data) {
      // 处理标准API响应格式
      if (Array.isArray(response.data.list)) {
        newData = response.data.list
        totalPages = response.data.pages || 1
      } else if (Array.isArray(response.data)) {
        newData = response.data
      }
    } else if (Array.isArray(response)) {
      newData = response
    } else if (response && Array.isArray(response.list)) {
      newData = response.list
      totalPages = response.pages || 1
    }
    
    // 只保留父题目（大题），子题目包含在 childList 中
    // 同时过滤掉空标题的题目，参考SwiftUI版本
    newData = newData.filter(question => 
      (question.parentId === null || question.parentId === "0" || question.parentId === 0) &&
      question.title && question.title.trim() !== ''
    )
    
    console.log(`📋 获取到 ${newData.length} 个有效题目，总页数: ${totalPages}`)
    
    if (isLoadMore) {
      apiData.value = [...apiData.value, ...newData]
      
      // 安全检查：如果加载更多时没有获得新数据，停止分页
      if (newData.length === 0) {
        hasMore.value = false
        console.log('🚫 没有更多题目数据，停止分页')
        return
      }
    } else {
      apiData.value = newData
    }
    
    // 检查是否还有更多数据 - 参考miniapp的逻辑
    // 使用总页数来判断是否还有更多数据
    hasMore.value = currentPage.value < totalPages
    if (hasMore.value) {
      currentPage.value += 1
    }
    
    console.log(`📊 分页状态: hasMore=${hasMore.value}, currentPage=${currentPage.value}, totalPages=${totalPages}`)
    
  } catch (error) {
    console.error('❌ Questions API error:', error)
    throw error
  }
}



// 处理项目点击
const handleItemClick = (item) => {
  // 向父组件发送点击事件
  emit('item-click', item)
}

// 处理题目添加/移除
const handleQuestionToggle = (question) => {
  console.log('🟢 LibraryContent: Question toggle:', question)
  console.log('🟢 LibraryContent: Emitting question-toggle event')
  // 将事件传递给父组件
  emit('question-toggle', question)
}

// 滚动监听和加载更多
const scrollContainer = ref(null)

const handleScroll = () => {
  if (!scrollContainer.value || isLoadingMore.value || !hasMore.value) {
    console.log('🚫 滚动监听跳过:', {
      hasContainer: !!scrollContainer.value,
      isLoadingMore: isLoadingMore.value,
      hasMore: hasMore.value
    })
    return
  }
  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
  
  console.log('📜 滚动状态:', {
    scrollTop,
    scrollHeight,
    clientHeight,
    distanceFromBottom,
    shouldLoadMore: distanceFromBottom <= 50
  })
  
  // 当滚动到距离底部50px时触发加载更多
  if (distanceFromBottom <= 50) {
    console.log('🔄 触发加载更多')
    loadContent(true) // 加载更多
  }
}

// 组件挂载时添加滚动监听
onMounted(() => {
  console.log('Component mounted, scrollContainer:', scrollContainer.value)
  // 使用 nextTick 确保 DOM 已经渲染
  nextTick(() => {
    if (scrollContainer.value) {
      console.log('Adding scroll listener to:', scrollContainer.value)
      scrollContainer.value.addEventListener('scroll', handleScroll)
    } else {
      console.warn('scrollContainer not found after nextTick')
    }
  })
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})


// 监听 props 变化，重新加载内容
watch(() => [props.activeContentType, props.searchQuery, props.selectedYear, props.selectedSession, props.selectedPaperType, props.selectedDifficulty, props.selectedTopic], async () => {
  await loadContent()
}, { immediate: true })

// 监听路由变化，响应sidebar学科选择
watch(() => route.query, async (newQuery, oldQuery) => {
  // 如果学科信息发生变化，重新加载内容
  if (newQuery.subject !== oldQuery?.subject || 
      newQuery.clazz !== oldQuery?.clazz || 
      newQuery.exam !== oldQuery?.exam) {
    await loadContent()
  }
}, { deep: true })
</script>

<style scoped>
/* 内容切换动画 */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: all 0.3s ease;
}

.content-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.content-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.content-fade-enter-to,
.content-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

</style>

