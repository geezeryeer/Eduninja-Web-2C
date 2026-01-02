<template>
  <div class="space-y-2.5">
    <QuestionCard
      v-for="question in filteredQuestions"
      :key="question.id"
      :question="question"
      :is-added="isQuestionAdded(question.id)"
      @toggle-question="toggleQuestion"
      @image-click="openImageViewer"
                />
  </div>
</template>

<script setup>
import { computed, ref, shallowRef } from 'vue'
import QuestionCard from './QuestionCard.vue'

const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  },
  searchQuery: String,
  filters: Object
})

const emit = defineEmits(['question-selected', 'question-toggle'])

// 状态管理 - 使用 shallowRef 优化 Set 的响应式性能
const addedQuestions = shallowRef(new Set())

// 添加/移除题目 - 优化：创建新 Set 实例触发响应式更新
const toggleQuestion = (question) => {
  emit('question-toggle', question)
  const newSet = new Set(addedQuestions.value)
  if (newSet.has(question.id)) {
    newSet.delete(question.id)
  } else {
    newSet.add(question.id)
  }
  addedQuestions.value = newSet
}

// 检查题目是否已添加 - 优化：使用 shallowRef 避免深度响应式
const isQuestionAdded = (questionId) => {
  return addedQuestions.value.has(questionId)
}

// 打开图片查看器
const openImageViewer = (imageKey) => {
  // 这里可以集成图片查看器
  console.log('Opening image viewer for:', imageKey)
}

// 筛选问题 - 优化：缓存 toLowerCase 结果，减少重复计算
const filteredQuestions = computed(() => {
  let filtered = props.questions

  // 搜索筛选 - 优化性能
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase().trim()
    if (query) {
      filtered = filtered.filter(question => {
        // 缓存字段值，避免重复访问
        const title = question.title || ''
        const knowledgePoint = question.knowledgePoint || ''
        const difficulty = question.difficulty || ''
        const questionType = question.questionType || ''
        
        // 使用短路逻辑，找到匹配后立即返回
        return title.toLowerCase().includes(query) ||
               knowledgePoint.toLowerCase().includes(query) ||
               difficulty.toLowerCase().includes(query) ||
               questionType.toLowerCase().includes(query)
      })
    }
  }

  // 难度筛选 - 优化：提前处理筛选条件
  if (props.filters?.difficulty && props.filters.difficulty !== 'all') {
    const targetDifficulty = props.filters.difficulty.toLowerCase()
    filtered = filtered.filter(question => 
      (question.difficulty || '').toLowerCase() === targetDifficulty
    )
  }

  return filtered
})
</script>
