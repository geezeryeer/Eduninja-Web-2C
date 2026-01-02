<template>
  <div
    class="bg-white rounded-xl border border-gray-200/80 transition-all duration-150"
    :class="cardClass"
  >
    <!-- 顶部信息行（仅在 collector 模式显示题号） -->
    <div v-if="showQuestionNumber" class="px-4 pt-3 pb-2.5">
      <div class="flex items-center gap-1.5 text-sm">
        <span class="font-semibold text-gray-900">{{ questionNumber }}.</span>
      </div>
    </div>

    <!-- 第一层题目图片区域 - 优化：使用缓存的 computed URL -->
    <div v-if="question.imageKey" class="pt-3 pb-2.5">
      <img 
        :src="mainQuestionImageUrl"
        :alt="question.title || 'Question Image'"
        class="w-full cursor-pointer bg-gray-50 hover:opacity-90 transition-opacity"
        @click="openImageViewer(mainQuestionImageUrl)"
        @error="handleImageError"
      />
    </div>

    <!-- 第一层答案图片（展开时显示） - 优化：使用缓存的 computed URL -->
    <div 
      v-if="expandedAnswers.has(question.id) && question.answerImageKey" 
      class="pb-2.5"
    >
      <div class="bg-gray-50 p-2.5">
        <img 
          :src="mainAnswerImageUrl"
          :alt="'Answer for ' + (question.title || 'Question')"
          class="w-full cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageViewer(mainAnswerImageUrl)"
          @error="handleImageError"
        />
      </div>
    </div>

    <!-- 标签和按钮区域（仅在主题目有图片时显示） -->
    <div v-if="question.imageKey" class="px-4 pb-2.5 flex items-center gap-3" :class="showRemoveButtons ? 'justify-end' : 'justify-between'">
      <!-- 标签区域 (仅在 list 模式显示) -->
      <div v-if="!showRemoveButtons" class="flex items-center gap-1.5 flex-wrap">
        <!-- 知识点标签 -->
        <span class="px-2 py-0.5 bg-blue-50 text-link-dark rounded-md text-[11px] font-medium truncate max-w-[120px]">
          {{ question.knowledgePoint || 'Algebra' }}
        </span>
        
        <!-- 难度标签 -->
        <span class="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-[11px] font-medium">
          {{ question.difficulty || 'Medium' }}
        </span>
        
        <!-- 题型标签 -->
        <span class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[11px] font-medium">
          {{ question.questionType || 'Multiple Choice' }}
        </span>
      </div>
      
      <!-- View Answer 按钮（仅在有答案时显示） -->
      <button 
        v-if="question.answerImageKey"
        @click.stop="toggleAnswer(question.id)"
        class="flex items-center gap-1 text-link text-[13px] font-normal hover:opacity-70 transition-opacity duration-200 active:scale-95 flex-shrink-0"
      >
        <span>{{ expandedAnswers.has(question.id) ? 'Hide Answer' : 'View Answer' }}</span>
        <div 
          class="w-3 h-3 transition-transform duration-200 icon-mask bg-current"
          :class="{ 'rotate-180': expandedAnswers.has(question.id) }"
          :style="{ '-webkit-mask-image': `url(${chevronDownIcon})` }"
        ></div>
      </button>
    </div>

    <!-- 第二层题目 (childList) -->
    <div v-if="question.childList && question.childList.length > 0" class="px-4">
      <div 
        v-for="(childQuestion, childIndex) in question.childList" 
        :key="childQuestion.id || `child-${childIndex}`"
        class="mb-4"
      >
        <!-- 第二层题目头部（带删除按钮 - 仅 collector 模式） -->
        <div v-if="showRemoveButtons && childQuestion.imageKey" class="flex items-center justify-between mb-2">
          <div class="text-xs font-medium text-gray-600">
            {{ getSubQuestionNumber(childQuestion.title, questionNumber) }}
          </div>
          <button 
            @click="$emit('remove-child', childIndex)"
            class="p-1 hover:opacity-60 transition-opacity duration-200 active:scale-90"
            title="Remove sub-question"
          >
            <div 
              class="w-[15px] h-[15px] text-red-500 icon-mask bg-current"
              :style="{ '-webkit-mask-image': `url(${minusCircleIcon})` }"
            ></div>
          </button>
        </div>

        <!-- 第二层题目图片 -->
        <div 
          v-if="childQuestion.imageKey" 
          class="mb-2.5"
          :class="{ 'pt-3': childIndex === 0 && !question.imageKey }"
        >
          <img 
            :src="getImageUrl(childQuestion.imageKey)"
            :alt="childQuestion.title || 'Child Question Image'"
            class="w-full rounded-lg cursor-pointer bg-gray-50 hover:opacity-90 transition-opacity"
            @click="openImageViewer(getImageUrl(childQuestion.imageKey))"
            @error="handleImageError"
          />
        </div>

        <!-- 第二层答案图片（展开时显示） -->
        <div 
          v-if="expandedAnswers.has(getChildQuestionId(question.id, childIndex)) && childQuestion.answerImageKey" 
          class="mb-2.5"
        >
          <div class="bg-gray-50 rounded-lg p-2.5">
            <img 
              :src="getImageUrl(childQuestion.answerImageKey)"
              :alt="'Answer for child question'"
              class="w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageViewer(getImageUrl(childQuestion.answerImageKey))"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- 第二层标签和答案按钮 -->
        <div v-if="childQuestion.answerImageKey" class="mb-2.5 flex items-center gap-3" :class="(childQuestion.knowledgePoint || childQuestion.difficulty || childQuestion.questionType) && !showRemoveButtons ? 'justify-between' : 'justify-end'">
          <!-- 标签区域（仅在有标签数据且非 collector 模式时显示） -->
          <div 
            v-if="!showRemoveButtons && (childQuestion.knowledgePoint || childQuestion.difficulty || childQuestion.questionType)" 
            class="flex items-center gap-1.5 flex-wrap"
          >
            <span v-if="childQuestion.knowledgePoint" class="px-2 py-0.5 bg-blue-50 text-link-dark rounded-md text-[11px] font-medium truncate max-w-[120px]">
              {{ childQuestion.knowledgePoint }}
            </span>
            <span v-if="childQuestion.difficulty" class="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-[11px] font-medium">
              {{ childQuestion.difficulty }}
            </span>
            <span v-if="childQuestion.questionType" class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[11px] font-medium">
              {{ childQuestion.questionType }}
            </span>
          </div>
          
          <!-- View Answer 按钮 -->
          <button 
            @click.stop="toggleAnswer(getChildQuestionId(question.id, childIndex))"
            class="flex items-center gap-1 text-link text-[13px] font-normal hover:opacity-70 transition-opacity duration-200 active:scale-95 flex-shrink-0"
          >
            <span>{{ expandedAnswers.has(getChildQuestionId(question.id, childIndex)) ? 'Hide Answer' : 'View Answer' }}</span>
            <div 
              class="w-3 h-3 transition-transform duration-200 icon-mask bg-current"
              :class="{ 'rotate-180': expandedAnswers.has(getChildQuestionId(question.id, childIndex)) }"
              :style="{ '-webkit-mask-image': `url(${chevronDownIcon})` }"
            ></div>
          </button>
        </div>

        <!-- 第三层题目 (childList.childList) -->
        <div v-if="childQuestion.childList && childQuestion.childList.length > 0">
          <div 
            v-for="(grandChildQuestion, grandChildIndex) in childQuestion.childList" 
            :key="grandChildQuestion.id || `grandchild-${grandChildIndex}`"
            class="mb-3"
          >
            <!-- 第三层题目头部（带删除按钮 - 仅 collector 模式） -->
            <div v-if="showRemoveButtons && grandChildQuestion.imageKey" class="flex items-center justify-between mb-2">
              <div class="text-xs font-medium text-gray-600">
                {{ getSubQuestionNumber(grandChildQuestion.title, questionNumber) }}
              </div>
              <button 
                @click="$emit('remove-grandchild', { childIndex, grandChildIndex })"
                class="p-1 hover:opacity-60 transition-opacity duration-200 active:scale-90"
                title="Remove sub-sub-question"
              >
                <div 
                  class="w-[15px] h-[15px] text-red-500 icon-mask bg-current"
                  :style="{ '-webkit-mask-image': `url(${minusCircleIcon})` }"
                ></div>
              </button>
            </div>

            <!-- 第三层题目图片 -->
            <div 
              v-if="grandChildQuestion.imageKey" 
              class="mb-2.5"
              :class="{ 'pt-3': grandChildIndex === 0 && !childQuestion.imageKey }"
            >
              <img 
                :src="getImageUrl(grandChildQuestion.imageKey)"
                :alt="grandChildQuestion.title || 'Grand Child Question Image'"
                class="w-full rounded-lg cursor-pointer bg-gray-50 hover:opacity-90 transition-opacity"
                @click="openImageViewer(getImageUrl(grandChildQuestion.imageKey))"
                @error="handleImageError"
              />
            </div>

            <!-- 第三层答案图片（展开时显示） -->
            <div 
              v-if="expandedAnswers.has(getGrandChildQuestionId(question.id, childIndex, grandChildIndex)) && grandChildQuestion.answerImageKey" 
              class="mb-2.5"
            >
              <div class="bg-gray-50 rounded-lg p-2.5">
                <img 
                  :src="getImageUrl(grandChildQuestion.answerImageKey)"
                  :alt="'Answer for grand child question'"
                  class="w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                  @click="openImageViewer(getImageUrl(grandChildQuestion.answerImageKey))"
                  @error="handleImageError"
                />
              </div>
            </div>

            <!-- 第三层标签和答案按钮 -->
            <div v-if="grandChildQuestion.answerImageKey" class="flex items-center gap-3" :class="(grandChildQuestion.knowledgePoint || grandChildQuestion.difficulty || grandChildQuestion.questionType) && !showRemoveButtons ? 'justify-between' : 'justify-end'">
              <!-- 标签区域（仅在有标签数据且非 collector 模式时显示） -->
              <div 
                v-if="!showRemoveButtons && (grandChildQuestion.knowledgePoint || grandChildQuestion.difficulty || grandChildQuestion.questionType)" 
                class="flex items-center gap-1.5 flex-wrap"
              >
                <span v-if="grandChildQuestion.knowledgePoint" class="px-2 py-0.5 bg-blue-50 text-link-dark rounded-md text-[11px] font-medium truncate max-w-[120px]">
                  {{ grandChildQuestion.knowledgePoint }}
                </span>
                <span v-if="grandChildQuestion.difficulty" class="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-[11px] font-medium">
                  {{ grandChildQuestion.difficulty }}
                </span>
                <span v-if="grandChildQuestion.questionType" class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[11px] font-medium">
                  {{ grandChildQuestion.questionType }}
                </span>
              </div>
              
              <!-- View Answer 按钮 -->
              <button 
                @click.stop="toggleAnswer(getGrandChildQuestionId(question.id, childIndex, grandChildIndex))"
                class="flex items-center gap-1 text-link text-[13px] font-normal hover:opacity-70 transition-opacity duration-200 active:scale-95 flex-shrink-0"
              >
                <span>{{ expandedAnswers.has(getGrandChildQuestionId(question.id, childIndex, grandChildIndex)) ? 'Hide Answer' : 'View Answer' }}</span>
                <div 
                  class="w-3 h-3 transition-transform duration-200 icon-mask bg-current"
                  :class="{ 'rotate-180': expandedAnswers.has(getGrandChildQuestionId(question.id, childIndex, grandChildIndex)) }"
                  :style="{ '-webkit-mask-image': `url(${chevronDownIcon})` }"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮区域 -->
    <div class="px-4 pb-3 pt-1.5">
      <slot name="footer" :question="question">
        <!-- 默认：添加/移除按钮 (list 模式) -->
        <button 
          @click.stop="$emit('toggle-question', question)"
          class="w-full flex items-center justify-center gap-1.5 py-2.5 text-[14px] font-normal transition-all duration-200 active:scale-98 active:opacity-70"
          :class="isAdded 
            ? 'text-red-600' 
            : 'text-link'"
        >
          <div 
            v-if="isAdded"
            class="w-[18px] h-[18px] icon-mask bg-current"
            :style="{ '-webkit-mask-image': `url(${trashIcon})` }"
          ></div>
          <div 
            v-else
            class="w-[18px] h-[18px] icon-mask bg-current"
            :style="{ '-webkit-mask-image': `url(${addCircleIcon})` }"
          ></div>
          <span>{{ isAdded ? 'Remove Question' : 'Add Question' }}</span>
        </button>
      </slot>
    </div>

    <!-- ImageViewer 组件 -->
    <ImageViewer ref="imageViewer" />
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import ImageViewer from '@/components/ImageViewer.vue'
import chevronDownIcon from '@/assets/Icon/chevron.down.svg'
import trashIcon from '@/assets/Icon/trash.svg'
import addCircleIcon from '@/assets/Icon/plus.circle.svg'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    default: null
  },
  showQuestionNumber: {
    type: Boolean,
    default: false
  },
  showRemoveButtons: {
    type: Boolean,
    default: false
  },
  isAdded: {
    type: Boolean,
    default: false
  },
  cardClass: {
    type: String,
    default: ''
  },
  baseImageUrl: {
    type: String,
    default: 'https://cheese-test-public.oss-accelerate.aliyuncs.com/'
  }
})

const emit = defineEmits([
  'toggle-question',
  'remove-child',
  'remove-grandchild',
  'image-click'
])

// 状态管理 - 优化：使用 shallowRef 提升 Set 的性能
const expandedAnswers = shallowRef(new Set())

// ImageViewer ref
const imageViewer = ref(null)

// 打开图片查看器
const openImageViewer = (imageUrl) => {
  if (imageViewer.value) {
    imageViewer.value.open(imageUrl)
  }
  // 仍然触发 image-click 事件，以保持向后兼容
  emit('image-click', imageUrl)
}

// 生成子题目ID
const getChildQuestionId = (parentId, childIndex) => {
  return `${parentId}-child-${childIndex}`
}

// 生成孙题目ID
const getGrandChildQuestionId = (parentId, childIndex, grandChildIndex) => {
  return `${parentId}-child-${childIndex}-grandchild-${grandChildIndex}`
}

// 切换答案显示 - 优化：创建新 Set 实例来触发响应式更新
const toggleAnswer = (questionId) => {
  const newSet = new Set(expandedAnswers.value)
  if (newSet.has(questionId)) {
    newSet.delete(questionId)
  } else {
    newSet.add(questionId)
  }
  expandedAnswers.value = newSet
}

// 构建图片URL - 保持原有逻辑
const getImageUrl = (imageKey) => {
  if (!imageKey) return ''
  if (imageKey.startsWith('http')) return imageKey
  return `${props.baseImageUrl}${imageKey}`
}

// 优化：缓存主题目的图片 URL
const mainQuestionImageUrl = computed(() => getImageUrl(props.question.imageKey))
const mainAnswerImageUrl = computed(() => getImageUrl(props.question.answerImageKey))

// 处理图片加载错误
const handleImageError = (event) => {
  console.log('Image load error:', event)
}

// 根据小程序逻辑处理子题目题号
const getSubQuestionNumber = (title, mainQuestionNumber) => {
  if (!title || !mainQuestionNumber) return title || ''
  
  const underscoreIndex = title.indexOf('_')
  if (underscoreIndex !== -1) {
    return mainQuestionNumber + title.substring(underscoreIndex)
  }
  
  return mainQuestionNumber
}
</script>

