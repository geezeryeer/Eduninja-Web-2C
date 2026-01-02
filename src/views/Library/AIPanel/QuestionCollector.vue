<template>
  <div 
    class="bg-white/95 backdrop-blur-md border border-gray-200/60 overflow-hidden transition-all duration-300 shadow-sm"
    :class="questionsCollapsed ? 'rounded-xl' : 'rounded-[20px]'"
  >
    <div v-if="selectedQuestions.length > 0">
      <!-- 收集器头部 -->
      <div class="px-3.5" :class="questionsCollapsed ? 'py-2.5' : 'py-3'">
        <!-- 第一行：标题 + 收起按钮 -->
        <div class="flex items-center justify-between" :class="{ 'mb-2.5': !questionsCollapsed }">
          <input
            v-if="isEditingTitle"
            ref="titleInput"
            v-model="editingTitle"
            @blur="saveTitle"
            @keydown.enter="saveTitle"
            @keydown.esc="isEditingTitle = false"
            class="flex-1 text-[14px] font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 mr-2 transition-colors"
            placeholder="Enter paper title"
          />
          <h4 
            v-else
            @click="startEdit"
            class="text-[14px] font-semibold text-gray-900 truncate cursor-text hover:text-blue-600 transition-colors select-none"
            title="Click to edit"
          >
            {{ paperTitle || 'Selected Questions' }}
          </h4>
          <button 
            @click="toggle"
            class="p-1.5 hover:bg-gray-100/80 rounded-full transition-all active:scale-95 flex-shrink-0 ml-2"
            :title="questionsCollapsed ? 'Expand' : 'Collapse'"
          >
            <div 
              class="w-3 h-3 text-gray-400 hover:text-gray-600 transition-transform duration-300 icon-mask bg-current"
              :class="{ 'rotate-180': questionsCollapsed }"
              :style="{ '-webkit-mask-image': `url(${chevronDownIcon})` }"
            ></div>
          </button>
        </div>
        
        <!-- 第二行：分数、题数 + 操作按钮 -->
        <div v-if="!questionsCollapsed" class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
            <span v-if="totalScore" class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{{ totalScore }}分</span>
            <span v-if="totalScore" class="text-gray-300">·</span>
            <span class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{{ selectedQuestions.length }}题</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="$emit('analyze-questions', selectedQuestions)"
              class="px-3 py-1.5 btn-primary rounded-lg transition-all duration-200 text-[12px] font-medium active:scale-[0.97] shadow-sm whitespace-nowrap"
              title="Generate Paper"
            >
              Generate
            </button>
            <button 
              @click="handleClearAll" 
              class="p-1.5 hover:bg-red-50 rounded-lg transition-all active:scale-95 group"
              title="Clear All"
            >
              <div 
                class="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 icon-mask bg-current transition-colors duration-200"
                :style="{ '-webkit-mask-image': `url(${trashIcon})` }"
              ></div>
            </button>
          </div>
        </div>
      </div>

      <!-- 题目列表 -->
      <div v-if="!questionsCollapsed" class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar mx-2 mb-2 pr-1">
        <QuestionCard
          v-for="(question, index) in selectedQuestions" 
          :key="question.id"
          :question="question"
          :question-number="index + 1"
          :show-question-number="true"
          :show-remove-buttons="true"
          :is-added="true"
          card-class="bg-gray-50/50 hover:bg-white transition-colors border border-transparent hover:border-gray-100 shadow-sm"
          base-image-url="https://oss.ninjaedu.com/"
          @toggle-question="(q) => handleRemoveQuestion(q.id)"
          @remove-child="(childIndex) => handleRemoveChild(question.id, childIndex)"
          @remove-grandchild="({ childIndex, grandChildIndex }) => handleRemoveGrandChild(question.id, childIndex, grandChildIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { questionService } from '@/services'
import QuestionCard from '../Page/QuestionCard.vue'
import chevronDownIcon from '@/assets/Icon/chevron.down.svg'
import trashIcon from '@/assets/Icon/trash.svg'

const props = defineProps({
  selectedQuestions: { type: Array, default: () => [] },
  paperTitle: { type: String, default: '' },
  totalScore: { type: Number, default: 0 },
  paperId: { type: [String, Number], default: null }
})

const emit = defineEmits([
  'questions-changed',  // 题目变化时触发，让父组件刷新
  'analyze-questions',
  'update-title'
])

// 状态
const questionsCollapsed = ref(false)
const isEditingTitle = ref(false)
const editingTitle = ref('')
const titleInput = ref(null)

// 方法
const toggle = () => questionsCollapsed.value = !questionsCollapsed.value

const startEdit = () => {
  editingTitle.value = props.paperTitle || ''
  isEditingTitle.value = true
  nextTick(() => titleInput.value?.select())
}

const saveTitle = () => {
  const t = editingTitle.value.trim()
  if (t && t !== props.paperTitle) emit('update-title', t)
  isEditingTitle.value = false
}

// 通用删除方法：删除题目并同步到云端
const deleteFromCloud = async (question) => {
  if (!props.paperId) return false
  
  try {
    const deleteId = question.subjectId || question.id
    await questionService.removeQuestionFromCloud(deleteId, props.paperId)
    emit('questions-changed') // 通知父组件刷新
    return true
  } catch (error) {
    console.error('❌ 删除失败:', error)
    alert(`删除失败: ${error.message}`)
    return false
  }
}

const handleRemoveQuestion = async (questionId) => {
  const question = props.selectedQuestions.find(q => q.id === questionId)
  if (question && props.paperId) {
    await deleteFromCloud(question)
  }
}

const handleRemoveChild = async (parentQuestionId, childIndex) => {
  const parent = props.selectedQuestions.find(q => q.id === parentQuestionId)
  const child = parent?.childList?.[childIndex]
  if (child && props.paperId) {
    await deleteFromCloud(child)
  }
}

const handleRemoveGrandChild = async (parentQuestionId, childIndex, grandChildIndex) => {
  const parent = props.selectedQuestions.find(q => q.id === parentQuestionId)
  const grandChild = parent?.childList?.[childIndex]?.childList?.[grandChildIndex]
  if (grandChild && props.paperId) {
    await deleteFromCloud(grandChild)
  }
}

const handleClearAll = async () => {
  if (!props.paperId || props.selectedQuestions.length === 0) return
  
  if (!confirm(`确定要清空所有 ${props.selectedQuestions.length} 个题目吗？`)) {
    return
  }
  
  try {
    const deletePromises = props.selectedQuestions.map(q => {
      const deleteId = q.subjectId || q.id
      return questionService.removeQuestionFromCloud(deleteId, props.paperId)
    })
    
    await Promise.all(deletePromises)
    emit('questions-changed') // 通知父组件刷新
  } catch (error) {
    console.error('❌ 清空失败:', error)
    alert(`清空失败: ${error.message}`)
  }
}
</script>
