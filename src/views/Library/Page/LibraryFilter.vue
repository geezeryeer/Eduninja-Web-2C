<template>
  <!-- 过滤器组件 - 现代简洁设计 -->
  <div class="w-full pb-3">
    <div class="space-y-4">
      <!-- 第一行：内容类型切换 -->
      <div class="flex items-center gap-3">
        <!-- 内容类型切换 - 现代 Segmented Control 风格 -->
        <div class="inline-flex flex-nowrap p-1 bg-gray-100/80 rounded-xl select-none overflow-x-auto no-scrollbar max-w-full backdrop-blur-sm">
          <button
            v-for="type in contentTypes"
            :key="type.value"
            @click="$emit('content-type-change', type.value)"
            class="relative px-4 py-2 text-[13px] font-medium transition-all duration-200 rounded-[10px] z-10 whitespace-nowrap flex-shrink-0"
            :class="[
              activeContentType === type.value
                ? 'text-gray-900 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 第二行：筛选器 -->
      <div v-if="showSubFilters" class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2 flex-wrap">
          <!-- 动态渲染筛选器 -->
            <div 
            v-for="filter in activeFilters" 
            :key="filter.key"
            class="filter-container" 
            :ref="el => setFilterRef(filter.key, el)"
          >
            <button 
              @click="toggleDropdown(filter.key)"
              :class="['filter-btn', { 'active': filter.value !== 'all' }]"
            >
              {{ filter.label }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-if="dropdownStates[filter.key]" class="filter-dropdown custom-scrollbar">
              <div class="filter-options">
                <div 
                  v-for="option in filter.options"
                  :key="option.value"
                  @click.stop="selectOption(filter.key, option)"
                  :class="['filter-option', { 'selected': filter.value === option.value }]"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { questionService, pastPaperService } from '@/services'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  activeContentType: { type: String, default: 'document' },
  searchQuery: { type: String, default: '' },
  selectedYear: { type: String, default: 'all' },
  selectedSession: { type: String, default: 'all' },
  selectedDifficulty: { type: String, default: 'all' },
  selectedTopic: { type: String, default: 'all' },
  selectedPaperType: { type: String, default: 'all' },
  selectedQuestionType: { type: String, default: 'all' }
})

const emit = defineEmits([
  'content-type-change', 'search-change', 'year-change', 'session-change',
  'difficulty-change', 'topic-change', 'paper-type-change', 'question-type-change'
])

// 内容类型选项
const contentTypes = computed(() => {
  return [
    { value: 'document', label: 'Documents' },
    { value: 'questions', label: 'Questions' },
    { value: 'pastpaper', label: 'Past Papers' }
  ]
})

// 显示子筛选器的条件
const showSubFilters = computed(() => 
  props.activeContentType === 'pastpaper' || props.activeContentType === 'questions'
)

// 统一管理所有筛选选项
const filterOptions = reactive({
  year: [{ value: 'all', label: 'All Years' }],
  session: [{ value: 'all', label: 'All Sessions' }],
  paperType: [{ value: 'all', label: 'All Types' }],
  difficulty: [{ value: 'all', label: 'Difficulty' }],
  questionType: [{ value: 'all', label: 'Type' }],
  topic: [{ value: 'all', label: 'Topics' }]
})

// 统一管理下拉状态
const dropdownStates = reactive({
  year: false,
  session: false,
  paperType: false,
  difficulty: false,
  questionType: false,
  topic: false
})

// 统一管理 refs
const filterRefs = reactive({})
const setFilterRef = (key, el) => {
  if (el) filterRefs[key] = el
}

// 根据内容类型动态获取激活的筛选器
const activeFilters = computed(() => {
  const configs = {
    pastpaper: [
      { key: 'year', emitKey: 'year-change', value: props.selectedYear },
      { key: 'session', emitKey: 'session-change', value: props.selectedSession },
      { key: 'paperType', emitKey: 'paper-type-change', value: props.selectedPaperType }
    ],
    questions: [
      { key: 'difficulty', emitKey: 'difficulty-change', value: props.selectedDifficulty },
      { key: 'questionType', emitKey: 'question-type-change', value: props.selectedQuestionType },
      { key: 'topic', emitKey: 'topic-change', value: props.selectedTopic }
    ]
  }
  
  return (configs[props.activeContentType] || []).map(filter => ({
    ...filter,
    options: filterOptions[filter.key],
    label: getFilterLabel(filter.key, filter.value)
  }))
})

// 获取筛选器标签
const getFilterLabel = (key, value) => {
  const option = filterOptions[key].find(opt => opt.value === value)
  return option ? option.label : filterOptions[key][0].label
}

// 切换下拉菜单
const toggleDropdown = (key) => {
  Object.keys(dropdownStates).forEach(k => {
    dropdownStates[k] = k === key ? !dropdownStates[k] : false
  })
}

// 选择选项
const selectOption = (key, option) => {
  const emitMap = {
    year: 'year-change',
    session: 'session-change',
    paperType: 'paper-type-change',
    difficulty: 'difficulty-change',
    questionType: 'question-type-change',
    topic: 'topic-change'
  }
  
  if (emitMap[key]) {
    emit(emitMap[key], option.value)
  }
  dropdownStates[key] = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  // 如果点击的是 dropdown 内部（由于 teleport + @click.stop，这里不会触发，除非没有 stop）
  // 但为了安全起见，我们主要依赖 @click.stop
  
  Object.entries(filterRefs).forEach(([key, ref]) => {
    // 如果点击不在按钮容器内，则关闭
    if (ref && !ref.contains(event.target)) {
      dropdownStates[key] = false
    }
  })
}

// 滚动时关闭所有下拉
const handleScroll = (event) => {
  // 检查滚动是否发生在当前打开的下拉菜单内部
  const isScrollingDropdown = Object.keys(dropdownStates).some(key => {
    if (!dropdownStates[key]) return false
    const ref = filterRefs[key]
    const dropdown = ref?.querySelector('.filter-dropdown')
    // 如果滚动目标是下拉菜单本身或其内部元素，则不关闭
    return dropdown && (event.target === dropdown || dropdown.contains(event.target))
  })

  if (isScrollingDropdown) return

  Object.keys(dropdownStates).forEach(k => dropdownStates[k] = false)
}

// 加载筛选选项
const isLoadingFilters = ref(false)
const loadFilterOptions = async () => {
  if (isLoadingFilters.value) return
  isLoadingFilters.value = true
  
  try {
    const subjectParams = {
      clazz: route.query.clazz || '',
      exam: route.query.exam || '',
      level: route.query.level || '',
      subject: route.query.subject || ''
    }
    
    if (props.activeContentType === 'pastpaper') {
      const result = await pastPaperService.getPastPaperFilterSelector(subjectParams)
      
      if (result.years?.length) {
        filterOptions.year = [
          { value: 'all', label: 'All Years' },
          ...result.years.map(year => ({ value: year, label: year }))
        ]
      }
      
      if (result.seasons?.length) {
        filterOptions.session = [
          { value: 'all', label: 'All Sessions' },
          ...result.seasons.map(season => ({ value: season.toLowerCase(), label: season }))
        ]
      }
      
      if (result.types?.length) {
        filterOptions.paperType = [
          { value: 'all', label: 'All Types' },
          ...result.types.map(type => ({ value: type.toLowerCase(), label: type }))
        ]
      }
    } else if (props.activeContentType === 'questions') {
      try {
        const result = await questionService.getAllFilterOptions(subjectParams)
        
        if (result.difficulties?.length) {
          filterOptions.difficulty = [
            { value: 'all', label: 'Difficulty' },
            ...result.difficulties.map(d => ({ value: d.toLowerCase(), label: d.charAt(0).toUpperCase() + d.slice(1) }))
          ]
        }
        
        if (result.questionTypes?.length) {
          filterOptions.questionType = [
            { value: 'all', label: 'Type' },
            ...result.questionTypes.map(t => ({ value: t.toLowerCase(), label: t }))
          ]
        }
        
        if (result.knowledgePoints?.length) {
          filterOptions.topic = [
            { value: 'all', label: 'Topics' },
            ...result.knowledgePoints.map(point => ({ value: point.toLowerCase(), label: point }))
          ]
        }
      } catch (err) {
        console.warn('Failed to load question filters, using defaults', err)
      }
    }
  } catch (error) {
    console.error('❌ 加载筛选选项失败:', error)
  } finally {
    isLoadingFilters.value = false
  }
}

watch(() => props.activeContentType, async (newType) => {
  if (newType === 'pastpaper' || newType === 'questions') {
    await loadFilterOptions()
  }
}, { immediate: true })

watch(() => route.query, async () => {
  if (props.activeContentType === 'pastpaper' || props.activeContentType === 'questions') {
    await loadFilterOptions()
  }
}, { deep: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true) // capture=true to catch scroll in sub-elements
  if (props.activeContentType === 'pastpaper' || props.activeContentType === 'questions') {
    loadFilterOptions()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
})
</script>

<style scoped>
.space-y-3 > div:last-child.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.space-y-3 > div:last-child.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.filter-container {
  @apply relative inline-block flex-shrink-0;
}

.filter-btn {
  @apply flex items-center justify-center px-4 py-2;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.12);
  color: #1f2937;
}

.filter-btn:active {
  transform: scale(0.98);
}

.filter-btn.active {
  @apply bg-link;
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.filter-dropdown {
  @apply absolute top-full left-0 mt-2.5 bg-white/95 rounded-xl shadow-2xl border border-gray-200/60;
  min-width: 140px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 9999;
  backdrop-filter: blur(20px);
}

.filter-options {
  @apply py-2;
}

.filter-option {
  @apply px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-100/80 cursor-pointer transition-all duration-200;
}

.filter-option.selected {
  @apply bg-blue-50/80 text-link font-medium;
}

.filter-option:first-child {
  @apply rounded-t-xl;
}

.filter-option:last-child {
  @apply rounded-b-xl;
}

/* 隐藏滚动条但保留功能 */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
