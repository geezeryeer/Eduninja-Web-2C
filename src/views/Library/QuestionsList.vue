<template>
  <div class="space-y-3">
    <div
      v-for="question in filteredQuestions"
      :key="question.id"
      class="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- 顶部信息行 -->
      <div class="p-4 pb-2">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span v-if="question.difficulty">{{ question.difficulty }}</span>
          <span v-if="question.difficulty && question.knowledgePoint" class="text-gray-400">|</span>
          <span v-if="question.knowledgePoint">{{ question.knowledgePoint }}</span>
        </div>
      </div>

      <!-- 第一层题目图片区域 -->
      <div v-if="question.imageKey" class="px-4">
        <img 
          :src="getImageUrl(question.imageKey)"
          :alt="question.title || 'Question Image'"
          class="w-full rounded-lg cursor-pointer border border-gray-200 mb-3"
          @click="openImageViewer(question.imageKey)"
          @error="handleImageError"
        />
      </div>

      <!-- 第一层题目文字内容（如果没有图片） -->
      <div v-else-if="question.title" class="px-4 pb-2">
        <p class="text-gray-900 text-base">{{ question.title }}</p>
      </div>

      <!-- 第一层答案图片（展开时显示） -->
      <div 
        v-if="expandedAnswers.has(question.id) && question.answerImageKey" 
        class="px-4 pb-3"
      >
        <div class="bg-gray-50 rounded-lg border border-gray-200 p-3">
          <img 
            :src="getImageUrl(question.answerImageKey)"
            :alt="'Answer for ' + (question.title || 'Question')"
            class="w-full rounded cursor-pointer"
            @click="openImageViewer(question.answerImageKey)"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- 第一层答案按钮 -->
      <div v-if="question.answerImageKey" class="px-4 pb-3 flex justify-end">
        <button 
          @click.stop="toggleAnswer(question.id)"
          class="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          <span>{{ expandedAnswers.has(question.id) ? 'Hide Answer' : 'View Answer' }}</span>
          <svg 
            class="w-3 h-3 transition-transform duration-200"
            :class="{ 'rotate-180': expandedAnswers.has(question.id) }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      <!-- 第二层题目 (childList) -->
      <div v-if="question.childList && question.childList.length > 0" class="px-4">
        <div 
          v-for="(childQuestion, childIndex) in question.childList" 
          :key="childQuestion.id || `child-${childIndex}`"
          class="mb-4"
        >
          <!-- 第二层题目图片 -->
          <div v-if="childQuestion.imageKey" class="mb-3">
            <img 
              :src="getImageUrl(childQuestion.imageKey)"
              :alt="childQuestion.title || 'Child Question Image'"
              class="w-full rounded-lg cursor-pointer border border-gray-200"
              @click="openImageViewer(childQuestion.imageKey)"
              @error="handleImageError"
            />
          </div>

          <!-- 第二层答案图片（展开时显示） -->
          <div 
            v-if="expandedAnswers.has(getChildQuestionId(question.id, childIndex)) && childQuestion.answerImageKey" 
            class="mb-3"
          >
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-3">
              <img 
                :src="getImageUrl(childQuestion.answerImageKey)"
                :alt="'Answer for child question'"
                class="w-full rounded cursor-pointer"
                @click="openImageViewer(childQuestion.answerImageKey)"
                @error="handleImageError"
              />
            </div>
          </div>

          <!-- 第二层答案按钮 -->
          <div v-if="childQuestion.answerImageKey" class="mb-3 flex justify-end">
            <button 
              @click.stop="toggleAnswer(getChildQuestionId(question.id, childIndex))"
              class="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              <span>{{ expandedAnswers.has(getChildQuestionId(question.id, childIndex)) ? 'Hide Answer' : 'View Answer' }}</span>
              <svg 
                class="w-3 h-3 transition-transform duration-200"
                :class="{ 'rotate-180': expandedAnswers.has(getChildQuestionId(question.id, childIndex)) }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>

          <!-- 第三层题目 (childList.childList) -->
          <div v-if="childQuestion.childList && childQuestion.childList.length > 0">
            <div 
              v-for="(grandChildQuestion, grandChildIndex) in childQuestion.childList" 
              :key="grandChildQuestion.id || `grandchild-${grandChildIndex}`"
              class="mb-3"
            >
              <!-- 第三层题目图片 -->
              <div v-if="grandChildQuestion.imageKey" class="mb-3">
                <img 
                  :src="getImageUrl(grandChildQuestion.imageKey)"
                  :alt="grandChildQuestion.title || 'Grand Child Question Image'"
                  class="w-full rounded-lg cursor-pointer border border-gray-200"
                  @click="openImageViewer(grandChildQuestion.imageKey)"
                  @error="handleImageError"
                />
              </div>

              <!-- 第三层答案图片（展开时显示） -->
              <div 
                v-if="expandedAnswers.has(getGrandChildQuestionId(question.id, childIndex, grandChildIndex)) && grandChildQuestion.answerImageKey" 
                class="mb-3"
              >
                <div class="bg-gray-50 rounded-lg border border-gray-200 p-3">
                  <img 
                    :src="getImageUrl(grandChildQuestion.answerImageKey)"
                    :alt="'Answer for grand child question'"
                    class="w-full rounded cursor-pointer"
                    @click="openImageViewer(grandChildQuestion.answerImageKey)"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <!-- 第三层答案按钮 -->
              <div v-if="grandChildQuestion.answerImageKey" class="flex justify-end">
                <button 
                  @click.stop="toggleAnswer(getGrandChildQuestionId(question.id, childIndex, grandChildIndex))"
                  class="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                >
                  <span>{{ expandedAnswers.has(getGrandChildQuestionId(question.id, childIndex, grandChildIndex)) ? 'Hide Answer' : 'View Answer' }}</span>
                  <svg 
                    class="w-3 h-3 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedAnswers.has(getGrandChildQuestionId(question.id, childIndex, grandChildIndex)) }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加题目按钮 -->
      <div class="px-4 pb-4">
        <button 
          @click.stop="toggleQuestion(question)"
          class="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors"
          :class="isQuestionAdded(question.id) 
            ? 'text-red-600 hover:text-red-700' 
            : 'text-blue-600 hover:text-blue-700'"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path v-if="isQuestionAdded(question.id)" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"/>
            <path v-else 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
          </svg>
          <span>{{ isQuestionAdded(question.id) ? 'Remove Question' : 'Add Question' }}</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  },
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['question-selected', 'question-toggle'])

// 状态管理
const expandedAnswers = ref(new Set())
const addedQuestions = ref(new Set())

// 生成子题目ID
const getChildQuestionId = (parentId, childIndex) => {
  return `${parentId}-child-${childIndex}`
}

// 生成孙题目ID
const getGrandChildQuestionId = (parentId, childIndex, grandChildIndex) => {
  return `${parentId}-child-${childIndex}-grandchild-${grandChildIndex}`
}

// 切换答案显示
const toggleAnswer = (questionId) => {
  if (expandedAnswers.value.has(questionId)) {
    expandedAnswers.value.delete(questionId)
  } else {
    expandedAnswers.value.add(questionId)
  }
}

// 添加/移除题目
const toggleQuestion = (question) => {
  emit('question-toggle', question)
  if (addedQuestions.value.has(question.id)) {
    addedQuestions.value.delete(question.id)
  } else {
    addedQuestions.value.add(question.id)
  }
}

// 检查题目是否已添加
const isQuestionAdded = (questionId) => {
  return addedQuestions.value.has(questionId)
}

// 构建图片URL
const getImageUrl = (imageKey) => {
  if (!imageKey) return ''
  if (imageKey.startsWith('http')) return imageKey
  return `https://cheese-test-public.oss-accelerate.aliyuncs.com/${imageKey}`
}

// 打开图片查看器
const openImageViewer = (imageKey) => {
  // 这里可以集成图片查看器
  console.log('Opening image viewer for:', imageKey)
}

// 处理图片加载错误
const handleImageError = (event) => {
  console.log('Image load error:', event)
  // 可以设置默认图片或隐藏图片元素
}

// 筛选问题
const filteredQuestions = computed(() => {
  let filtered = props.questions

  // 搜索筛选
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(question => 
      (question.title || '').toLowerCase().includes(query) ||
      (question.knowledgePoint || '').toLowerCase().includes(query) ||
      (question.difficulty || '').toLowerCase().includes(query) ||
      (question.questionType || '').toLowerCase().includes(query)
    )
  }

  // 难度筛选
  if (props.filters?.difficulty && props.filters.difficulty !== 'all') {
    filtered = filtered.filter(question => 
      (question.difficulty || '').toLowerCase() === props.filters.difficulty.toLowerCase()
    )
  }

  return filtered
})
</script>
