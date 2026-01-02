<template>
  <div class="h-[520px] flex flex-col">
    <!-- 模拟 TopBar（与真实组件样式完全一致） -->
    <div 
      class="h-12"
      style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
    >
      <div class="h-full flex items-center px-5 w-full">
        <!-- 面包屑路径 - 模拟 TopBar 样式 -->
        <div class="flex items-center gap-1.5 text-[13px] font-medium text-gray-900 pl-1">
          <span>Public</span>
          <span class="text-gray-300">|</span>
          <span>IB</span>
          <span class="text-gray-300">|</span>
          <span>Biology</span>
        </div>
      </div>
    </div>

    <!-- 模拟界面内容 -->
    <div class="flex-1 bg-white flex flex-col overflow-hidden relative">
      <!-- LibraryFilter - 吸顶固定 -->
      <div class="px-5 pt-3 pb-2 z-10 bg-white/95 backdrop-blur-sm sticky top-0 border-b border-gray-50">
        <LibraryFilter 
          activeContentType="questions"
          searchQuery=""
          selectedYear="all"
          selectedSession="all"
          selectedDifficulty="all"
          selectedTopic="all"
          selectedPaperType="all"
          @content-type-change="() => {}"
          @year-change="() => {}"
          @session-change="() => {}"
          @difficulty-change="() => {}"
          @question-type-change="() => {}"
          @topic-change="() => {}"
          @paper-type-change="() => {}"
        />
      </div>

      <!-- 问题列表 - 可滚动区域 -->
      <div class="flex-1 overflow-auto custom-scrollbar px-5 pb-6 pt-2 space-y-3">
        <!-- Question 2 -->
        <QuestionCard 
          :question="questions.question2"
          :isAdded="props.addedQuestions.has('q2')"
          :baseImageUrl="''"
          @toggle-question="toggleQuestion('q2')"
        />

        <!-- Question 5 (包含 5a 和 5b) -->
        <QuestionCard 
          :question="questions.question5"
          :isAdded="props.addedQuestions.has('q5')"
          :baseImageUrl="''"
          @toggle-question="toggleQuestion('q5')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import QuestionCard from '@/views/Library/Page/QuestionCard.vue'
import LibraryFilter from '@/views/Library/Page/LibraryFilter.vue'

// Props
const props = defineProps({
  addedQuestions: {
    type: Set,
    default: () => new Set()
  }
})

// Emits
const emit = defineEmits(['toggle-question'])

// 写死的题目数据 - 使用 public 文件夹的图片（直接访问路径）
const questions = reactive({
  question2: {
    id: 'q2',
    title: 'Question 2',
    imageKey: '/images/2_paper.png',
    knowledgePoint: 'Cell Structure',
    difficulty: 'Medium',
    questionType: 'Multiple Choice'
  },
  
  question5: {
    id: 'q5',
    title: 'Question 5',
    childList: [
      {
        id: 'q5a',
        title: '(a)',
        imageKey: '/images/5_a_paper.png',
        answerImageKey: '/images/5_a_answer.png',
        knowledgePoint: 'Population & Ecology',
        difficulty: 'Medium',
        questionType: 'Multi-part Question'
      },
      {
        id: 'q5b',
        title: '(b)',
        imageKey: '/images/5_b_paper.png',
        knowledgePoint: 'Population & Ecology',
        difficulty: 'Medium',
        questionType: 'Multi-part Question'
      }
    ]
  }
})

// 切换题目的添加/移除状态
const toggleQuestion = (questionId) => {
  const question = questions[`question${questionId.replace('q', '')}`]
  emit('toggle-question', { questionId, question })
}
</script>

