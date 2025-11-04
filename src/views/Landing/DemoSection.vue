<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <!-- 标题区域 -->
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        What makes Ninja Web so effective?
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Explore our comprehensive study tools designed to maximize your learning potential
      </p>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <!-- 左侧功能列表 -->
      <div class="space-y-2">
        <div
          v-for="(item, index) in features"
          :key="item.id"
          @mouseenter="activeFeature = item.id"
          :class="[
            'flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 group',
            activeFeature === item.id 
              ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
              : 'hover:bg-gray-50 border-2 border-transparent'
          ]"
        >
          <!-- 图标 -->
          <div class="flex-shrink-0 mr-4">
            <div 
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                activeFeature === item.id ? item.activeBg : item.bg
              ]"
            >
              <!-- 图标 SVG -->
              <svg v-if="item.id === 'questionbank'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <svg v-else-if="item.id === 'pastpapers'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <svg v-else-if="item.id === 'predictionexams'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <svg v-else-if="item.id === 'flashcards'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <svg v-else-if="item.id === 'mobileapp'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <svg v-else-if="item.id === 'newtonai'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          
          <!-- 文字内容 -->
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 text-lg">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ item.description }}</p>
          </div>
          
          <!-- 箭头指示器 -->
          <div 
            :class="[
              'transition-all duration-300',
              activeFeature === item.id 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform -translate-x-2'
            ]"
          >
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- 右侧动态内容展示 -->
      <div class="relative">
        <!-- 默认状态或选中状态的展示内容 -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 h-[600px] border overflow-hidden">
          <!-- 动态内容区域 -->
          <div class="animate-fadeIn h-full overflow-y-auto">
            <component :is="getActiveComponent()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuestionBankPreview from './DemoSection/QuestionBankPreview.vue'
import PastPapersPreview from './DemoSection/PastPapersPreview.vue'
import PredictionExamsPreview from './DemoSection/PredictionExamsPreview.vue'
import FlashcardsPreview from './DemoSection/FlashcardsPreview.vue'
import MobileAppPreview from './DemoSection/MobileAppPreview.vue'
import NinjaAIPreview from './DemoSection/NinjaAIPreview.vue'

// 定义 emits
defineEmits(['navigate'])

// 当前激活的功能，默认选中第一个
const activeFeature = ref('questionbank')

// 功能列表数据
const features = ref([
  {
    id: 'questionbank',
    title: 'Questionbank',
    description: 'Access thousands of categorized questions',
    icon: 'QuestionBankIcon',
    bg: 'bg-blue-100',
    activeBg: 'bg-blue-500',
    iconColor: 'text-blue-600',
    activeIconColor: 'text-white'
  },
  {
    id: 'pastpapers',
    title: 'Past Papers',
    description: 'Official past papers with detailed solutions',
    icon: 'PastPapersIcon',
    bg: 'bg-green-100',
    activeBg: 'bg-green-500',
    iconColor: 'text-green-600',
    activeIconColor: 'text-white'
  },
  {
    id: 'predictionexams',
    title: 'Prediction Exams',
    description: 'AI-powered predictions for upcoming exams',
    icon: 'PredictionExamsIcon',
    bg: 'bg-indigo-100',
    activeBg: 'bg-indigo-500',
    iconColor: 'text-indigo-600',
    activeIconColor: 'text-white'
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Smart flashcards for effective memorization',
    icon: 'FlashcardsIcon',
    bg: 'bg-pink-100',
    activeBg: 'bg-pink-500',
    iconColor: 'text-pink-600',
    activeIconColor: 'text-white'
  },
  {
    id: 'mobileapp',
    title: 'Mobile App',
    description: 'Study anywhere with our mobile application',
    icon: 'MobileAppIcon',
    bg: 'bg-cyan-100',
    activeBg: 'bg-cyan-500',
    iconColor: 'text-cyan-600',
    activeIconColor: 'text-white'
  },
  {
    id: 'newtonai',
    title: 'Ninja AI',
    description: 'AI-powered personalized learning assistant',
    icon: 'NewtonAIIcon',
    bg: 'bg-emerald-100',
    activeBg: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    activeIconColor: 'text-white'
  }
])

// 获取当前激活的组件
const getActiveComponent = () => {
  const componentMap = {
    'questionbank': QuestionBankPreview,
    'pastpapers': PastPapersPreview,
    'predictionexams': PredictionExamsPreview,
    'flashcards': FlashcardsPreview,
    'mobileapp': MobileAppPreview,
    'newtonai': NinjaAIPreview
  }
  return componentMap[activeFeature.value] || null
}

</script>

<style scoped>
.animation-delay-1000 {
  animation-delay: 1s;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
