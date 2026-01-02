<template>
  <!-- 过滤器组件 -->
  <div class="border-b border-white/30 py-3">
    <div class="flex flex-col gap-4">
      <!-- 标题和内容类型切换 -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 truncate min-w-0 flex-1 mr-4">{{ subjectTitle }}</h1>
        
        <!-- 内容类型切换按钮 -->
        <div class="flex gap-2">
          <button
            v-for="type in contentTypes"
            :key="type.value"
            @click="$emit('content-type-change', type.value)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              activeContentType === type.value
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 搜索栏和筛选器 -->
      <div class="flex items-center gap-4">
        <!-- 搜索框 -->
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            :value="searchQuery"
            @input="$emit('search-change', $event.target.value)"
            placeholder="Search documents, past papers, or questions..."
            class="w-full pl-10 pr-4 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-sm"
            style="height: 36px; font-size: 14px;"
          />
        </div>

        <!-- 过滤器 (只在Past Paper和Questions时显示) -->
        <div v-if="showSubFilters" class="flex items-center gap-3">
          <!-- Past Paper筛选 -->
          <template v-if="activeContentType === 'pastpaper'">
            <div class="filter-container" ref="yearFilterRef">
                <button 
                  @click="toggleYearDropdown"
                  :class="['filter-btn', { 'active': selectedYear !== 'all' }]"
                >
                  {{ getYearLabel(selectedYear) }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div v-if="showYearDropdown" class="filter-dropdown">
                  <div class="filter-options">
                    <div 
                      v-for="option in yearOptions"
                      :key="option.value"
                      @click="selectYear(option)"
                      :class="['filter-option', { 'selected': selectedYear === option.value }]"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
            </div>
            <div class="filter-container" ref="sessionFilterRef">
                <button 
                  @click="toggleSessionDropdown"
                  :class="['filter-btn', { 'active': selectedSession !== 'all' }]"
                >
                  {{ getSessionLabel(selectedSession) }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div v-if="showSessionDropdown" class="filter-dropdown">
                  <div class="filter-options">
                    <div 
                      v-for="option in sessionOptions"
                      :key="option.value"
                      @click="selectSession(option)"
                      :class="['filter-option', { 'selected': selectedSession === option.value }]"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
            </div>
            <div class="filter-container" ref="paperTypeFilterRef">
                <button 
                  @click="togglePaperTypeDropdown"
                  :class="['filter-btn', { 'active': selectedPaperType !== 'all' }]"
                >
                  {{ getPaperTypeLabel(selectedPaperType) }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div v-if="showPaperTypeDropdown" class="filter-dropdown">
                  <div class="filter-options">
                    <div 
                      v-for="option in paperTypeOptions"
                      :key="option.value"
                      @click="selectPaperType(option)"
                      :class="['filter-option', { 'selected': selectedPaperType === option.value }]"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
            </div>
          </template>
          
          <!-- Questions筛选 -->
          <template v-if="activeContentType === 'questions'">
            <div class="filter-container" ref="difficultyFilterRef">
                <button 
                  @click="toggleDifficultyDropdown"
                  :class="['filter-btn', { 'active': selectedDifficulty !== 'all' }]"
                >
                  {{ getDifficultyLabel(selectedDifficulty) }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div v-if="showDifficultyDropdown" class="filter-dropdown">
                  <div class="filter-options">
                    <div 
                      v-for="option in difficultyOptions"
                      :key="option.value"
                      @click="selectDifficulty(option)"
                      :class="['filter-option', { 'selected': selectedDifficulty === option.value }]"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
            </div>
            <div class="filter-container" ref="topicFilterRef">
                <button 
                  @click="toggleTopicDropdown"
                  :class="['filter-btn', { 'active': selectedTopic !== 'all' }]"
                >
                  {{ getTopicLabel(selectedTopic) }}
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div v-if="showTopicDropdown" class="filter-dropdown">
                  <div class="filter-options">
                    <div 
                      v-for="option in topicOptions"
                      :key="option.value"
                      @click="selectTopic(option)"
                      :class="['filter-option', { 'selected': selectedTopic === option.value }]"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { questionService, pastPaperService } from '@/services'

const route = useRoute()

// Props
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

// Emits
const emit = defineEmits([
  'content-type-change',
  'search-change',
  'year-change',
  'session-change',
  'difficulty-change',
  'topic-change',
  'paper-type-change'
])

// Subject title
const subjectTitle = computed(() => {
  const subject = route.params.subject || route.query.subject
  const clazz = route.query.clazz
  const exam = route.query.exam
  const level = route.query.level
  
  if (!subject) return 'app'
  
  const parts = []
  if (clazz && clazz.trim()) parts.push(clazz)
  if (exam && exam.trim()) parts.push(exam)
  if (level && level.trim()) parts.push(level)
  if (subject && subject.trim()) parts.push(subject)
  
  return parts.join(' | ')
})

// 下拉状态管理
const showYearDropdown = ref(false)
const showSessionDropdown = ref(false)
const showPaperTypeDropdown = ref(false)
const showDifficultyDropdown = ref(false)
const showTopicDropdown = ref(false)

const yearFilterRef = ref(null)
const sessionFilterRef = ref(null)
const paperTypeFilterRef = ref(null)
const difficultyFilterRef = ref(null)
const topicFilterRef = ref(null)

// 内容类型选项
const contentTypes = [
  { value: 'document', label: 'Documents' },
  { value: 'pastpaper', label: 'Past Papers' },
  { value: 'questions', label: 'Questions' }
]

// 显示子筛选器的条件
const showSubFilters = computed(() => {
  return props.activeContentType === 'pastpaper' || props.activeContentType === 'questions'
})

// 筛选选项 - 动态加载
const yearOptions = ref([
  { value: 'all', label: 'All Years' }
])

const sessionOptions = ref([
  { value: 'all', label: 'All Sessions' }
])

const difficultyOptions = ref([
  { value: 'all', label: 'All Levels' }
])

const topicOptions = ref([
  { value: 'all', label: 'All Topics' }
])

const paperTypeOptions = ref([
  { value: 'all', label: 'All Types' }
])

// 加载状态
const isLoadingFilters = ref(false)

// 下拉菜单控制方法
const toggleYearDropdown = () => {
  showYearDropdown.value = !showYearDropdown.value
  showSessionDropdown.value = false
  showPaperTypeDropdown.value = false
  showDifficultyDropdown.value = false
  showTopicDropdown.value = false
}

const toggleSessionDropdown = () => {
  showSessionDropdown.value = !showSessionDropdown.value
  showYearDropdown.value = false
  showPaperTypeDropdown.value = false
  showDifficultyDropdown.value = false
  showTopicDropdown.value = false
}

const togglePaperTypeDropdown = () => {
  showPaperTypeDropdown.value = !showPaperTypeDropdown.value
  showYearDropdown.value = false
  showSessionDropdown.value = false
  showDifficultyDropdown.value = false
  showTopicDropdown.value = false
}

const toggleDifficultyDropdown = () => {
  showDifficultyDropdown.value = !showDifficultyDropdown.value
  showYearDropdown.value = false
  showSessionDropdown.value = false
  showPaperTypeDropdown.value = false
  showTopicDropdown.value = false
}

const toggleTopicDropdown = () => {
  showTopicDropdown.value = !showTopicDropdown.value
  showYearDropdown.value = false
  showSessionDropdown.value = false
  showPaperTypeDropdown.value = false
  showDifficultyDropdown.value = false
}

// 选择方法
const selectYear = (option) => {
  emit('year-change', option.value)
  showYearDropdown.value = false
}

const selectSession = (option) => {
  emit('session-change', option.value)
  showSessionDropdown.value = false
}

const selectPaperType = (option) => {
  emit('paper-type-change', option.value)
  showPaperTypeDropdown.value = false
}

const selectDifficulty = (option) => {
  emit('difficulty-change', option.value)
  showDifficultyDropdown.value = false
}

const selectTopic = (option) => {
  emit('topic-change', option.value)
  showTopicDropdown.value = false
}

// 动态加载筛选选项的方法
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
      // 加载 Past Paper 筛选选项
      const result = await pastPaperService.getPastPaperFilterSelector(subjectParams)
      
      // 更新年份选项
      if (result.years && result.years.length > 0) {
        yearOptions.value = [
          { value: 'all', label: 'All Years' },
          ...result.years.map(year => ({ value: year, label: year }))
        ]
      }
      
      // 更新会话选项
      if (result.seasons && result.seasons.length > 0) {
        sessionOptions.value = [
          { value: 'all', label: 'All Sessions' },
          ...result.seasons.map(season => ({ value: season.toLowerCase(), label: season }))
        ]
      }
      
      // 更新试卷类型选项
      if (result.types && result.types.length > 0) {
        paperTypeOptions.value = [
          { value: 'all', label: 'All Types' },
          ...result.types.map(type => ({ value: type.toLowerCase(), label: type }))
        ]
      }
      
    } else if (props.activeContentType === 'questions') {
      // 加载 Question 筛选选项 - 使用专门的 question filter API
      const result = await questionService.getAllFilterOptions(subjectParams)
      
      // 更新难度选项
      if (result.difficulties && result.difficulties.length > 0) {
        difficultyOptions.value = [
          { value: 'all', label: 'All Levels' },
          ...result.difficulties.map(difficulty => ({ 
            value: difficulty.toLowerCase(), 
            label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1) 
          }))
        ]
      }
      
      // 更新主题选项
      if (result.knowledgePoints && result.knowledgePoints.length > 0) {
        topicOptions.value = [
          { value: 'all', label: 'All Topics' },
          ...result.knowledgePoints.map(point => ({ value: point.toLowerCase(), label: point }))
        ]
      }
    }
    
  } catch (error) {
    console.error('❌ 加载筛选选项失败:', error)
    // 保持默认选项
  } finally {
    isLoadingFilters.value = false
  }
}

// 标签获取方法
const getYearLabel = (value) => {
  const option = yearOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Years'
}

const getSessionLabel = (value) => {
  const option = sessionOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Sessions'
}

const getDifficultyLabel = (value) => {
  const option = difficultyOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Levels'
}

const getTopicLabel = (value) => {
  const option = topicOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Topics'
}

const getPaperTypeLabel = (value) => {
  const option = paperTypeOptions.value.find(opt => opt.value === value)
  return option ? option.label : 'All Types'
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (yearFilterRef.value && !yearFilterRef.value.contains(event.target)) {
    showYearDropdown.value = false
  }
  if (sessionFilterRef.value && !sessionFilterRef.value.contains(event.target)) {
    showSessionDropdown.value = false
  }
  if (paperTypeFilterRef.value && !paperTypeFilterRef.value.contains(event.target)) {
    showPaperTypeDropdown.value = false
  }
  if (difficultyFilterRef.value && !difficultyFilterRef.value.contains(event.target)) {
    showDifficultyDropdown.value = false
  }
  if (topicFilterRef.value && !topicFilterRef.value.contains(event.target)) {
    showTopicDropdown.value = false
  }
}

// 监听内容类型变化，重新加载筛选选项
watch(() => props.activeContentType, async (newType) => {
  if (newType === 'pastpaper' || newType === 'questions') {
    await loadFilterOptions()
  }
}, { immediate: true })

// 监听路由变化，重新加载筛选选项
watch(() => route.query, async () => {
  if (props.activeContentType === 'pastpaper' || props.activeContentType === 'questions') {
    await loadFilterOptions()
  }
}, { deep: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 初始加载筛选选项
  if (props.activeContentType === 'pastpaper' || props.activeContentType === 'questions') {
    loadFilterOptions()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.filter-container {
  @apply relative inline-block;
}

.filter-btn {
  @apply flex items-center justify-center px-4 py-2;
  height: 36px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  min-width: fit-content;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #111827;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-btn.active {
  background: #1f2937;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.filter-dropdown {
  @apply absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50;
  min-width: 120px;
}

.filter-options {
  @apply py-1;
}

.filter-option {
  @apply px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150;
}

.filter-option.selected {
  @apply bg-blue-50 text-blue-700 font-medium;
}

.filter-option:first-child {
  @apply rounded-t-lg;
}

.filter-option:last-child {
  @apply rounded-b-lg;
}
</style>
