<template>
  <!-- 题目收集器区域 - 圆形包裹设计 -->
  <div class="mx-4 my-3 bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-lg overflow-hidden">

    <!-- 题目列表区域 -->
    <div v-if="selectedQuestions.length > 0">
      <!-- 收集器头部 -->
      <div class="flex items-center justify-between p-3 pb-2">
        <div class="flex items-center gap-2">
          <div class="flex flex-col">
            <h4 class="text-sm font-medium text-gray-700">
              {{ paperTitle || 'Selected Questions' }}
            </h4>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span v-if="totalScore">{{ totalScore }}分</span>
              <span>{{ selectedQuestions.length }}题</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="generatePaper"
            class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 text-xs font-medium"
            title="Generate Paper"
          >
            Generate
          </button>
          <button 
            @click="toggleCollapsed"
            class="p-1 hover:bg-white/50 rounded transition-colors"
            :title="questionsCollapsed ? 'Expand' : 'Collapse'"
          >
            <svg 
              class="w-4 h-4 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': questionsCollapsed }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <button 
            @click="clearQuestions" 
            class="p-1 hover:bg-red-50 rounded transition-colors group"
            title="Clear All"
          >
            <svg class="w-4 h-4 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 题目列表 -->
      <div v-if="!questionsCollapsed" class="px-3 pb-3 space-y-3 max-h-96 overflow-y-auto">
        <!-- 题目卡片 -->
        <div 
          v-for="(question, index) in selectedQuestions" 
          :key="question.id"
          class="group bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg overflow-hidden hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <!-- 题目头部 -->
          <div class="px-3 py-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <!-- 一级题号 -->
                <div class="flex-shrink-0 text-sm font-medium text-gray-700">
                  {{ index + 1 }}.
                </div>
                <div class="flex-1">
                  <!-- 题目元信息 -->
                  <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span v-if="question.difficulty" class="px-2 py-0.5 bg-gray-100 rounded-full">
                      {{ question.difficulty }}
                    </span>
                    <span v-if="question.knowledgePoint" class="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                      {{ question.knowledgePoint }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 题目详细内容 -->
          <div class="px-3 py-2 space-y-2 bg-gray-50/30">
            <!-- 第一层题目图片 -->
            <div v-if="question.imageKey" class="space-y-2">
              <img 
                :src="getImageUrl(question.imageKey)"
                :alt="question.title || 'Main Question'"
                class="w-full max-h-32 object-contain rounded border border-gray-200 bg-white cursor-pointer"
                @click="openImageViewer(question.imageKey)"
                @error="handleImageError"
              />
            </div>

            <!-- 第一层答案按钮 -->
            <div v-if="question.answerImageKey" class="flex justify-end mb-2">
              <button 
                @click="toggleAnswer(getAnswerId(question.id))"
                class="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                <span>{{ expandedAnswers.has(getAnswerId(question.id)) ? 'Hide Answer' : 'View Answer' }}</span>
                <svg 
                  class="w-3 h-3 transition-transform duration-200"
                  :class="{ 'rotate-180': expandedAnswers.has(getAnswerId(question.id)) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>

            <!-- 第一层答案图片 -->
            <div v-if="question.answerImageKey && expandedAnswers.has(getAnswerId(question.id))" class="space-y-2">
              <div class="text-xs font-medium text-green-600 flex items-center gap-1">
                Answer
              </div>
              <img 
                :src="getImageUrl(question.answerImageKey)"
                :alt="'Answer for main question'"
                class="w-full max-h-32 object-contain rounded border border-green-200 bg-green-50 cursor-pointer"
                @click="openImageViewer(question.answerImageKey)"
                @error="handleImageError"
              />
            </div>

            <!-- 第二层子题目 -->
            <div v-if="question.childList && question.childList.length > 0" class="space-y-3">
              <div 
                v-for="(childQuestion, childIndex) in question.childList" 
                :key="childQuestion.id || `child-${childIndex}`"
                class="space-y-2"
              >
                <!-- 第二层题目图片 -->
                <div v-if="childQuestion.imageKey" class="space-y-2">
                  <div class="text-xs font-medium text-gray-600 flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      {{ getSubQuestionNumber(childQuestion.title, index + 1) }}
                    </div>
                    <button 
                      @click="removeChildQuestion(question.id, childIndex)"
                      class="flex items-center justify-center w-5 h-5 bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                      title="Remove sub-question"
                    >
                      <span class="text-red-500 group-hover:text-red-600 text-sm font-bold leading-none">-</span>
                    </button>
                  </div>
                  <img 
                    :src="getImageUrl(childQuestion.imageKey)"
                    :alt="childQuestion.title || `Sub-question ${childIndex + 1}`"
                    class="w-full max-h-32 object-contain rounded border border-gray-200 bg-white cursor-pointer"
                    @click="openImageViewer(childQuestion.imageKey)"
                    @error="handleImageError"
                  />
                </div>

                <!-- 第二层答案按钮 -->
                <div v-if="childQuestion.answerImageKey" class="flex justify-end mb-2">
                  <button 
                    @click="toggleAnswer(getChildAnswerId(question.id, childIndex))"
                    class="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    <span>{{ expandedAnswers.has(getChildAnswerId(question.id, childIndex)) ? 'Hide Answer' : 'View Answer' }}</span>
                    <svg 
                      class="w-3 h-3 transition-transform duration-200"
                      :class="{ 'rotate-180': expandedAnswers.has(getChildAnswerId(question.id, childIndex)) }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>

                <!-- 第二层答案图片 -->
                <div v-if="childQuestion.answerImageKey && expandedAnswers.has(getChildAnswerId(question.id, childIndex))" class="space-y-2">
                  <div class="text-xs font-medium text-green-600 flex items-center gap-1">
                    Answer
                  </div>
                  <img 
                    :src="getImageUrl(childQuestion.answerImageKey)"
                    :alt="'Answer for sub-question'"
                    class="w-full max-h-32 object-contain rounded border border-green-200 bg-green-50 cursor-pointer"
                    @click="openImageViewer(childQuestion.answerImageKey)"
                    @error="handleImageError"
                  />
                </div>

                <!-- 第三层子题目 -->
                <div v-if="childQuestion.childList && childQuestion.childList.length > 0" class="space-y-2 ml-4">
                  <div 
                    v-for="(grandChildQuestion, grandChildIndex) in childQuestion.childList" 
                    :key="grandChildQuestion.id || `grandchild-${grandChildIndex}`"
                    class="space-y-2"
                  >
                    <!-- 第三层题目图片 -->
                    <div v-if="grandChildQuestion.imageKey" class="space-y-2">
                      <div class="text-xs font-medium text-gray-600 flex items-center justify-between">
                        <div class="flex items-center gap-1">
                          {{ getSubQuestionNumber(grandChildQuestion.title, index + 1) }}
                        </div>
                        <button 
                          @click="removeGrandChildQuestion(question.id, childIndex, grandChildIndex)"
                          class="flex items-center justify-center w-5 h-5 bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                          title="Remove sub-sub-question"
                        >
                          <span class="text-red-500 group-hover:text-red-600 text-sm font-bold leading-none">-</span>
                        </button>
                      </div>
                      <img 
                        :src="getImageUrl(grandChildQuestion.imageKey)"
                        :alt="grandChildQuestion.title || `Sub-question ${childIndex + 1}.${grandChildIndex + 1}`"
                        class="w-full max-h-32 object-contain rounded border border-gray-200 bg-white cursor-pointer"
                        @click="openImageViewer(grandChildQuestion.imageKey)"
                        @error="handleImageError"
                      />
                    </div>

                    <!-- 第三层答案按钮 -->
                    <div v-if="grandChildQuestion.answerImageKey" class="flex justify-end mb-2">
                      <button 
                        @click="toggleAnswer(getGrandChildAnswerId(question.id, childIndex, grandChildIndex))"
                        class="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                      >
                        <span>{{ expandedAnswers.has(getGrandChildAnswerId(question.id, childIndex, grandChildIndex)) ? 'Hide Answer' : 'View Answer' }}</span>
                        <svg 
                          class="w-3 h-3 transition-transform duration-200"
                          :class="{ 'rotate-180': expandedAnswers.has(getGrandChildAnswerId(question.id, childIndex, grandChildIndex)) }"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- 第三层答案图片 -->
                    <div v-if="grandChildQuestion.answerImageKey && expandedAnswers.has(getGrandChildAnswerId(question.id, childIndex, grandChildIndex))" class="space-y-2">
                      <div class="text-xs font-medium text-green-600 flex items-center gap-1">
                        Answer
                      </div>
                      <img 
                        :src="getImageUrl(grandChildQuestion.answerImageKey)"
                        :alt="'Answer for grand child question'"
                        class="w-full max-h-32 object-contain rounded border border-green-200 bg-green-50 cursor-pointer"
                        @click="openImageViewer(grandChildQuestion.answerImageKey)"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主题目删除按钮 -->
            <div class="flex justify-center pt-2">
              <button 
                @click="removeQuestion(question.id)"
                class="flex items-center gap-1 text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                title="Remove question"
              >
                <span class="text-lg font-bold">-</span>
                <span>Remove Question</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- 折叠状态的简化显示 -->
      <div v-else class="pb-3">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { questionService } from '@/services'

// Props
const props = defineProps({
  selectedQuestions: {
    type: Array,
    default: () => []
  },
  paperTitle: {
    type: String,
    default: ''
  },
  totalScore: {
    type: Number,
    default: 0
  },
  paperId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits([
  'toggle-collapsed', 
  'remove-question',
  'remove-child-question',
  'remove-grandchild-question',
  'clear-questions', 
  'analyze-questions',
  'score-updated'
])

// 内部状态
const questionsCollapsed = ref(false)
const expandedAnswers = ref(new Set())


// 工具方法
const getImageUrl = (imageKey) => {
  if (!imageKey) return ''
  // 如果已经是完整URL，直接返回
  if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
    return imageKey
  }
  // 否则拼接基础URL
  return `https://oss.ninjaedu.com/${imageKey}`
}


const openImageViewer = (imageKey) => {
  // 这里可以实现图片查看器功能
  console.log('Open image viewer for:', imageKey)
}

const handleImageError = (event) => {
  console.error('Image load error:', event.target.src)
  event.target.style.display = 'none'
}

// 根据小程序逻辑处理子题目题号
const getSubQuestionNumber = (title, mainQuestionNumber) => {
  if (!title) return mainQuestionNumber
  
  // 模拟小程序的 replaceTitleFun2 逻辑
  const underscoreIndex = title.indexOf('_')
  if (underscoreIndex !== -1) {
    // 如果有下划线，保留下划线后的部分，前面加上主题号
    return mainQuestionNumber + title.substring(underscoreIndex)
  }
  
  // 如果没有下划线，直接返回主题号
  return mainQuestionNumber
}

const toggleAnswer = (answerId) => {
  if (expandedAnswers.value.has(answerId)) {
    expandedAnswers.value.delete(answerId)
  } else {
    expandedAnswers.value.add(answerId)
  }
}

const getAnswerId = (questionId, type = 'main') => {
  return `${questionId}-${type}`
}

const getChildAnswerId = (questionId, childIndex) => {
  return `${questionId}-child-${childIndex}`
}

const getGrandChildAnswerId = (questionId, childIndex, grandChildIndex) => {
  return `${questionId}-child-${childIndex}-grand-${grandChildIndex}`
}

// 方法
const toggleCollapsed = () => {
  questionsCollapsed.value = !questionsCollapsed.value
  emit('toggle-collapsed', questionsCollapsed.value)
}

const removeQuestion = async (questionId) => {
  // 先从云端删除
  if (props.paperId) {
    await removeQuestionFromCloud(questionId)
  }
  // 再通知父组件从本地状态删除
  emit('remove-question', questionId)
}

// 从云端删除题目
const removeQuestionFromCloud = async (questionId) => {
  try {
    console.log('🗑️ QuestionCollector: 从云端删除题目:', questionId)
    const result = await questionService.removeQuestionFromCloud(questionId, props.paperId)
    
    if (result) {
      console.log('✅ QuestionCollector: 题目删除成功')
      // 通知父组件更新分数
      emit('score-updated', result.score)
    }
  } catch (error) {
    console.error('❌ QuestionCollector: 从云端删除题目失败:', error)
  }
}

const removeChildQuestion = (parentQuestionId, childIndex) => {
  emit('remove-child-question', { parentQuestionId, childIndex })
}

const removeGrandChildQuestion = (parentQuestionId, childIndex, grandChildIndex) => {
  emit('remove-grandchild-question', { parentQuestionId, childIndex, grandChildIndex })
}

const clearQuestions = () => {
  emit('clear-questions')
}

const generatePaper = () => {
  emit('analyze-questions', props.selectedQuestions)
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.max-h-96::-webkit-scrollbar {
  width: 4px;
}

.max-h-96::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>