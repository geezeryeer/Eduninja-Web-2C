<template>
  <div class="pt-10 pb-20 lg:pt-12 relative z-10">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
    <!-- 标题区域 -->
    <div class="max-w-2xl mb-12">
      <h2 class="text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl mb-3">
        Everything you need to ace your exams
      </h2>
      <p class="text-base text-gray-600">
        Smart tools to simplify your study routine
      </p>
    </div>

    <!-- Features Stack -->
    <div class="flex flex-col gap-20">
      
      <!-- Loop through features -->
      <div v-for="(feature, index) in featuresConfig" :key="feature.id" class="relative">
        <!-- Decorative Pattern Border -->
        <div class="absolute inset-0 bg-gradient-to-br rounded-3xl opacity-50" :style="`background-image: linear-gradient(to bottom right, ${feature.gradientFrom}, ${feature.gradientTo})`"></div>
        <div class="absolute inset-0 rounded-3xl opacity-30" :style="`background: linear-gradient(45deg, ${feature.patternColor} 25%, transparent 25%, transparent 75%, ${feature.patternColor} 75%, ${feature.patternColor}), linear-gradient(45deg, ${feature.patternColor} 25%, transparent 25%, transparent 75%, ${feature.patternColor} 75%, ${feature.patternColor}); background-size: 20px 20px; background-position: 0 0, 10px 10px`"></div>
        
        <!-- Content Container -->
        <div class="relative glass-card rounded-3xl p-4 lg:p-6">
          <!-- 特殊布局：Question Bank - Preview左侧，右侧上下分布 -->
          <div v-if="feature.showCollector" class="flex gap-6">
            <!-- Preview - 左侧 -->
            <div 
              class="flex-[3] rounded-2xl overflow-hidden border border-gray-200/60"
              style="height: 520px;"
            >
              <component 
                :is="feature.component" 
                class="w-full h-full"
                :addedQuestions="addedQuestions"
                @toggle-question="handleToggleQuestion"
              />
            </div>

            <!-- 右侧：QuestionCollector在上，文字在下 -->
            <div class="flex-[2] flex flex-col gap-6">
              <!-- QuestionCollector - 上方 -->
              <div class="flex-shrink-0">
                <QuestionCollector 
                  :selected-questions="selectedQuestions"
                  :paper-title="paperTitle"
                  :total-score="totalScore"
                  @remove-question="removeQuestion"
                  @clear-questions="clearQuestions"
                  @update-title="updateTitle"
                />
              </div>

              <!-- 文字描述 - 下方 -->
              <div class="space-y-3">
                <h3 class="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                  {{ feature.title }}
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  {{ feature.description }}
                </p>
                <a href="#" class="inline-flex items-center text-slate-900 font-medium text-sm group">
                  Try Now
                  <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- 默认布局：其他 features -->
          <div v-else>
            <div 
              :class="feature.customGrid || 'grid grid-cols-5 gap-8 lg:gap-12 items-center'"
            >
              <!-- Preview (3 columns) - Position based on layout -->
              <div 
                :class="[
                  feature.previewCols || 'col-span-3',
                  feature.layout === 'right' ? 'order-2' : 'order-1',
                  feature.containerClass || ''
                ]"
                class="rounded-2xl overflow-hidden border border-gray-200/60"
                :style="feature.height ? `height: ${feature.height}` : ''"
              >
                <component 
                  :is="feature.component" 
                  class="w-full h-full"
                  :mode="feature.id === 'ninjaai' ? currentAIMode : undefined"
                  :title="feature.id === 'ninjaai' ? getCurrentAIMode.title : undefined"
                />
              </div>

              <!-- Text Content (2 columns) - Position based on layout -->
              <div 
                :class="[
                  feature.textCols || 'col-span-2',
                  'flex flex-col h-full',
                  feature.layout === 'right' ? 'order-1 pr-0' : 'order-2 pl-2'
                ]"
              >
                <!-- Ninja AI 特殊布局 -->
                <template v-if="feature.id === 'ninjaai'">
                  <div class="space-y-4 pt-8">
                    <!-- 主标题 -->
                    <div class="px-2">
                      <h3 class="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                        {{ getCurrentAIMode.title }}
                      </h3>
                    </div>

                    <!-- 功能切换列表 -->
                    <div class="flex flex-col gap-1.5 bg-white rounded-xl p-2 border border-gray-100 shadow-sm">
                      <button 
                        v-for="mode in aiModes" 
                        :key="mode.id"
                        @click="currentAIMode = mode.id"
                        class="group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150 text-left"
                        :class="[
                          currentAIMode === mode.id 
                            ? 'bg-gray-100/80' 
                            : 'bg-transparent hover:bg-gray-50'
                        ]"
                      >
                        <!-- 左侧：图标和文字 -->
                        <div class="flex items-center gap-3">
                          <!-- 图标 -->
                          <div 
                            class="flex-shrink-0 w-5 h-5 transition-opacity"
                            :class="currentAIMode === mode.id ? 'opacity-90' : 'opacity-50 group-hover:opacity-70'"
                          >
                            <div 
                              class="w-5 h-5 icon-mask bg-gray-600"
                              :style="{ '-webkit-mask-image': `url(${mode.icon})`, '-webkit-mask-size': 'contain', '-webkit-mask-repeat': 'no-repeat', '-webkit-mask-position': 'center' }"
                          ></div>
                        </div>

                          <!-- 文本 -->
                          <span 
                            class="text-sm font-medium transition-colors"
                            :class="currentAIMode === mode.id ? 'text-gray-900' : 'text-gray-600'"
                          >
                            {{ mode.label }}
                          </span>
                        </div>

                        <!-- 右侧：勾选标记 -->
                        <svg 
                          v-if="currentAIMode === mode.id"
                          class="w-4 h-4 text-gray-600 flex-shrink-0"
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- 描述文字 - 显示当前选中的描述 -->
                    <div class="px-2">
                      <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">How it works</h4>
                      <p class="text-sm text-slate-600 leading-relaxed">
                        {{ getCurrentAIMode.description }}
                      </p>
                    </div>

                    <a href="#" class="inline-flex items-center text-slate-900 font-medium text-sm group px-2">
                      Try Ninja AI Now
                      <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                  </div>
                </template>

                <!-- 其他 features 的默认布局 -->
                <template v-else>
                  <div class="space-y-3">
                    <h3 class="text-xl lg:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                      {{ feature.title }}
                    </h3>
                    <p class="text-sm text-slate-600 leading-relaxed">
                      {{ feature.description }}
                    </p>
                    <a href="#" class="inline-flex items-center text-slate-900 font-medium text-sm group">
                      Try Now
                      <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                  </div>
                </template>
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
import { ref, shallowRef, computed } from 'vue'
import SyllabusPreview from './DemoSection/SyllabusPreview.vue'
import QuestionBankPreview from './DemoSection/QuestionBankPreview.vue'
import NinjaAIPreview from './DemoSection/NinjaAIPreview.vue'
import QuestionCollector from '@/views/Library/AIPanel/QuestionCollector.vue'

// Icons
import brainIcon from '@/assets/Icon/brain.head.profile.svg'
import cameraIcon from '@/assets/Icon/camera.svg'
import documentIcon from '@/assets/Icon/text.document.svg'

// AI 功能切换模式
const currentAIMode = ref('prediction')
const aiModes = ref([
  {
    id: 'prediction',
    label: 'Exam Prediction',
    icon: brainIcon,
    title: 'IB Biology Exam Prediction',
    description: 'AI analyzes past exam patterns to predict high-frequency topics for upcoming IB Biology exams. Get strategic insights to focus your revision effectively.'
  },
  {
    id: 'photo',
    label: 'Photo Search',
    icon: cameraIcon,
    title: 'Instant Photo Search',
    description: 'Snap a photo of any question and get instant answers with detailed step-by-step explanations. Perfect for quick homework help and on-the-go learning.'
  },
  {
    id: 'paper',
    label: 'Smart Paper',
    icon: documentIcon,
    title: 'Smart Paper Generator',
    description: 'Create custom practice papers tailored to your learning needs. Select topics, difficulty levels, and question types to generate personalized exam-style papers.'
  }
])

const getCurrentAIMode = computed(() => {
  return aiModes.value.find(mode => mode.id === currentAIMode.value) || aiModes.value[0]
})

// QuestionCollector 状态管理 - 初始化一个示例题目
const selectedQuestions = ref([
  {
    id: 'q2',
    title: 'Question 2',
    imageKey: '/images/2_paper.png',
    knowledgePoint: 'Cell Structure',
    difficulty: 'Medium',
    questionType: 'Multiple Choice'
  }
])
const paperTitle = ref('My Practice Paper')
const totalScore = ref(0)
const addedQuestions = ref(new Set(['q2']))

// 处理题目切换（添加/移除）
const handleToggleQuestion = ({ questionId, question }) => {
  if (addedQuestions.value.has(questionId)) {
    // 移除题目
    addedQuestions.value.delete(questionId)
    selectedQuestions.value = selectedQuestions.value.filter(q => q.id !== questionId)
  } else {
    // 添加题目
    addedQuestions.value.add(questionId)
    selectedQuestions.value.push(question)
  }
  // 触发响应式更新
  addedQuestions.value = new Set(addedQuestions.value)
}

// QuestionCollector 方法
const removeQuestion = (questionId) => {
  addedQuestions.value.delete(questionId)
  selectedQuestions.value = selectedQuestions.value.filter(q => q.id !== questionId)
  addedQuestions.value = new Set(addedQuestions.value)
}

const clearQuestions = () => {
  selectedQuestions.value = []
  addedQuestions.value.clear()
  addedQuestions.value = new Set()
}

const updateTitle = (newTitle) => {
  paperTitle.value = newTitle
}

// Features configuration
const featuresConfig = ref([
  {
    id: 'syllabus',
    title: 'Syllabus-Aligned Learning',
    description: 'Complete syllabus structure at your fingertips. Browse topics, access aligned materials, and track your progress - all organized by your exam board curriculum.',
    component: shallowRef(SyllabusPreview),
    layout: 'left', // preview on left, text on right
    customGrid: 'grid grid-cols-9 gap-4 lg:gap-6 items-center', // 减少间距
    previewCols: 'col-span-7', // preview占7列（77.8%，接近78%）
    textCols: 'col-span-2', // text占2列（22.2%）
    height: '500px', // 减少高度
    gradientFrom: 'rgb(248, 250, 252)', // slate-50 (white/gray)
    gradientTo: 'rgb(241, 245, 249)', // slate-100 (white/gray)
    patternColor: '#f1f5f9', // slate-100 (white/gray)
    isDark: false,
    showCollector: false
  },
  {
    id: 'questionbank',
    title: 'Smart Question Bank',
    description: 'Access thousands of exam-style questions adapted to your skill level. Our intelligent system tracks your progress topic by topic.',
    component: shallowRef(QuestionBankPreview),
    layout: 'left', // preview on left, text on right
    gradientFrom: 'rgb(248, 250, 252)', // slate-50 (white/gray)
    gradientTo: 'rgb(241, 245, 249)', // slate-100 (white/gray)
    patternColor: '#f1f5f9', // slate-100 (white/gray)
    isDark: false,
    showCollector: true // 显示 QuestionCollector
  },
  {
    id: 'ninjaai',
    title: 'Ninja AI Tutor',
    description: 'Stuck on a tough problem? Get 24/7 instant help. Our AI tutor explains complex concepts step-by-step in real-time.',
    component: shallowRef(NinjaAIPreview),
    layout: 'right', // text on left, preview on right
    height: '640px', // 固定高度，让聊天区域可滚动
    gradientFrom: 'rgb(248, 250, 252)', // slate-50 (white/gray)
    gradientTo: 'rgb(241, 245, 249)', // slate-100 (white/gray)
    patternColor: '#f1f5f9', // slate-100 (white/gray)
    isDark: true,
    showCollector: false
  }
])
</script>

<style scoped>
/* Clean, minimal styles */

/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
