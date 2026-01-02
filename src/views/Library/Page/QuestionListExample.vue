<template>
  <div class="space-y-4 p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Biology Questions</h2>
    
    <!-- Question 2 -->
    <QuestionCard 
      :question="questions.question2"
      :isAdded="addedQuestions.has('q2')"
      @toggle-question="toggleQuestion('q2')"
    />

    <!-- Question 5(a) -->
    <QuestionCard 
      :question="questions.question5a"
      :isAdded="addedQuestions.has('q5a')"
      @toggle-question="toggleQuestion('q5a')"
    />

    <!-- Question 5(b) -->
    <QuestionCard 
      :question="questions.question5b"
      :isAdded="addedQuestions.has('q5b')"
      @toggle-question="toggleQuestion('q5b')"
    />

    <!-- Question 5(c) -->
    <QuestionCard 
      :question="questions.question5c"
      :isAdded="addedQuestions.has('q5c')"
      @toggle-question="toggleQuestion('q5c')"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import QuestionCard from './QuestionCard.vue'

// 写死的题目数据
const questions = reactive({
  question2: {
    id: 'q2',
    title: 'Question 2',
    imageKey: 'https://cheese-mock-public.oss-accelerate.aliyuncs.com/images/2paper.png',
    knowledgePoint: 'Cell Biology',
    difficulty: 'Medium',
    questionType: 'Multiple Choice'
  },
  
  question5a: {
    id: 'q5a',
    title: 'Question 5(a)',
    imageKey: 'https://cheese-mock-public.oss-accelerate.aliyuncs.com/images/5apaper.png',
    answerImageKey: 'https://cheese-mock-public.oss-accelerate.aliyuncs.com/images/5aanswer.png',
    knowledgePoint: 'Population Growth',
    difficulty: 'Medium',
    questionType: 'Graph Drawing'
  },
  
  question5b: {
    id: 'q5b',
    title: 'Question 5(b)',
    imageKey: 'https://cheese-mock-public.oss-accelerate.aliyuncs.com/images/5bpaper.png',
    knowledgePoint: 'Ecology',
    difficulty: 'Easy',
    questionType: 'Description'
  },
  
  question5c: {
    id: 'q5c',
    title: 'Question 5(c)',
    imageKey: 'https://cheese-mock-public.oss-accelerate.aliyuncs.com/images/5cpaper.png',
    knowledgePoint: 'Environmental Science',
    difficulty: 'Hard',
    questionType: 'Explanation'
  }
})

// 已添加的题目集合
const addedQuestions = ref(new Set())

// 切换题目的添加/移除状态
const toggleQuestion = (questionId) => {
  if (addedQuestions.value.has(questionId)) {
    addedQuestions.value.delete(questionId)
  } else {
    addedQuestions.value.add(questionId)
  }
  // 触发响应式更新
  addedQuestions.value = new Set(addedQuestions.value)
  
  console.log('Current added questions:', Array.from(addedQuestions.value))
}
</script>

