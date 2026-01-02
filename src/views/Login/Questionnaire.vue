<template>
  <div class="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center py-12 selection:bg-gray-200">
    <!-- Clean Gradient Background -->
    <CleanGradientBackground />

    <!-- Paper Stack Container -->
    <div class="relative w-full max-w-2xl h-[580px] perspective-1000 z-0">
      <div 
        class="relative w-full h-full flex justify-center items-center"
      >
        <!-- Iterate through all steps to maintain stack context -->
        <!-- We use a custom transition logic via style binding -->
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="absolute w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-transform"
          :style="getStackStyle(index)"
          :class="{ 'pointer-events-none': index !== currentStepIndex }"
        >
          <PaperLayer 
            :is-active="index === currentStepIndex"
            :is-done="index < currentStepIndex"
            :scene-number="index + 1"
          >
            <!-- Content Switch -->
            <component
              :is="step.component"
              v-bind="step.props"
              :model-value="answers[step.key]"
              @select="(val) => handleSelect(step.key, val)"
              @next="nextStep"
            />
          </PaperLayer>
        </div>
      </div>
    </div>

    <!-- Bottom Control -->
    <transition name="slide-up">
      <ControlBar 
        v-if="currentStepIndex > 0"
        :current-step="progressIndex"
        :total-steps="steps.length - 1"
        :can-go-back="currentStepIndex > 0"
        @back="prevStep"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import PaperLayer from './components/Questionnaire/PaperLayer.vue'
import ControlBar from './components/Questionnaire/ControlBar.vue'
import SelectionStep from './components/Questionnaire/SelectionStep.vue'
import LetterStep from './components/Questionnaire/LetterStep.vue'
import CleanGradientBackground from '@/components/CleanGradientBackground.vue'

const router = useRouter()
const currentStepIndex = ref(0) // 0 is Letter
const answers = ref({
  role: '',
  grade: '',
  goal: ''
})

// Configuration
const roleOptions = [
  { value: 'student', label: 'Student', icon: '🎓', description: 'I\'m preparing for exams' },
  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫', description: 'I\'m teaching students' },
  { value: 'parent', label: 'Parent', icon: '👪', description: 'I\'m supporting my child' }
]

const gradeOptions = [
  { value: 'year10', label: 'Year 10' },
  { value: 'year11', label: 'Year 11' },
  { value: 'year12', label: 'Year 12' },
  { value: 'year13', label: 'Year 13' },
  { value: 'ib_year1', label: 'IB Year 1' },
  { value: 'ib_year2', label: 'IB Year 2' },
  { value: 'other', label: 'Other' }
]

const goalOptions = [
  { value: 'improve_grades', label: 'Improve Grades', description: 'Get better scores in exams' },
  { value: 'exam_prep', label: 'Exam Preparation', description: 'Prepare for upcoming exams' },
  { value: 'understand_concepts', label: 'Understand Concepts', description: 'Deep dive into topics' },
  { value: 'practice', label: 'Practice & Review', description: 'Reinforce what I learned' }
]

// Steps Configuration
const steps = [
  {
    id: 'step-letter',
    component: markRaw(LetterStep),
    props: {}
  },
  {
    id: 'step-role',
    key: 'role',
    component: markRaw(SelectionStep),
    props: {
      title: 'Which role best describes you?',
      subtitle: 'Select one option',
      options: roleOptions
    }
  },
  {
    id: 'step-grade',
    key: 'grade',
    component: markRaw(SelectionStep),
    props: {
      title: 'Academic Level',
      subtitle: 'Which grade are you currently in?',
      options: gradeOptions
    }
  },
  {
    id: 'step-goal',
    key: 'goal',
    component: markRaw(SelectionStep),
    props: {
      title: 'Your Main Goal',
      subtitle: 'What do you want to achieve with Eduninja?',
      options: goalOptions
    }
  }
]

// Logic
const progressIndex = computed(() => {
  // Letter doesn't count as a step for progress bar
  return Math.max(0, currentStepIndex.value)
})

const getStackStyle = (index) => {
  // SPECIAL CASE: If showing the Letter (first step), hide all future cards completely
  if (currentStepIndex.value === 0 && index > 0) {
    return {
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translateY(60px)', // No scale
      zIndex: -1
    }
  }

  const diff = index - currentStepIndex.value
  
  // 1. 已完成的卡片 (Done)
  if (diff < 0) {
    if (diff < -4) return { opacity: 0, pointerEvents: 'none' }
    
    // 向上位移，模拟翻过去的效果
    const stackOffset = -20 * Math.abs(diff) - 40 
    
    return {
      zIndex: 20 + diff, 
      transform: `translateY(${stackOffset}px)`, // No scale
      opacity: 0.6 + (0.1 * (4 + diff)),
      filter: 'grayscale(0.1)'
    }
  }
  
  // 2. 当前卡片 (Active)
  if (diff === 0) {
    return {
      zIndex: 50,
      transform: 'translateY(0)', // No scale
      opacity: 1,
      filter: 'none'
    }
  }
  
  // 3. 未来卡片 (Future)
  if (diff > 0) {
    if (diff > 3) return { opacity: 0 }
    
    // 只做位移，不做缩放，确保看起来一样大
    const offset = diff * 4 // 微小的偏移暗示厚度
    
    return {
      zIndex: 50 - diff,
      transform: `translateY(${offset}px)`, // No scale
      opacity: 1 // 完全不透明，增加实感
    }
  }
}

const handleSelect = (key, value) => {
  answers.value[key] = value
  
  // Delay for visual feedback before moving next
  setTimeout(() => {
    nextStep()
  }, 350)
}

const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
  } else {
    submit()
  }
}

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const submit = async () => {
  // Simulate submission animation
  await new Promise(resolve => setTimeout(resolve, 800))
  router.push('/library')
}
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
