<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="close"></div>

        <!-- 模态框内容 -->
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 bg-gray-50/80 backdrop-blur-md border-b border-gray-200">
            <button 
              @click="handleBackOrClose" 
              class="text-[15px] font-medium text-link hover:text-link-hover transition-colors px-2 py-1"
            >
              {{ currentStep > 1 ? 'Back' : 'Cancel' }}
            </button>
            
            <h3 class="text-[17px] font-semibold text-gray-900">
              {{ currentTitle }}
            </h3>

            <button 
              v-if="currentStep === 3"
              @click="handleSave"
              :disabled="isSaving || !selectedSubject"
              class="text-[15px] font-semibold text-link hover:text-link-hover transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Saving...' : 'Add' }}
            </button>
            <div v-else class="w-[50px]"></div> <!-- 占位符保持标题居中 -->
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white">
            <!-- Loading -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-link"></div>
            </div>

            <!-- List -->
            <ul v-else class="divide-y divide-gray-100">
              <li 
                v-for="item in currentList" 
                :key="item.id"
                @click="handleSelect(item)"
                class="group flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <span class="text-[15px] text-gray-900 font-medium">{{ item.name }}</span>
                <svg v-if="currentStep < 3" class="w-4 h-4 text-gray-300 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <svg v-else-if="item.id === selectedSubject?.id" class="w-5 h-5 text-link" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </li>

              <!-- Empty State -->
              <li v-if="currentList.length === 0" class="px-5 py-8 text-center text-gray-400 text-sm">
                No options available
              </li>
            </ul>
          </div>

          <!-- 底部进度指示器 (Optional) -->
          <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
            <span>Step {{ currentStep }} of 3</span>
            <span>
              {{ selectedPathText }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { filterService, mineService } from '@/services'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'added'])

// 状态
const currentStep = ref(1) // 1: Curriculum, 2: Exam, 3: Subject
const isLoading = ref(false)
const isSaving = ref(false)

// 选中数据
const selectedCurriculum = ref(null)
const selectedExam = ref(null)
const selectedSubject = ref(null)

// 列表数据
const curriculumList = ref([])
const examList = ref([])
const subjectList = ref([])

// 计算属性
const currentTitle = computed(() => {
  switch (currentStep.value) {
    case 1: return 'Select Curriculum'
    case 2: return 'Select Exam Board'
    case 3: return 'Select Subject'
    default: return 'Add Subject'
  }
})

const currentList = computed(() => {
  switch (currentStep.value) {
    case 1: return curriculumList.value
    case 2: return examList.value
    case 3: return subjectList.value
    default: return []
  }
})

const selectedPathText = computed(() => {
  const parts = []
  if (selectedCurriculum.value) parts.push(selectedCurriculum.value.name)
  if (selectedExam.value) parts.push(selectedExam.value.name)
  return parts.join(' > ')
})

// 方法
const loadData = async () => {
  isLoading.value = true
  try {
    if (currentStep.value === 1 && curriculumList.value.length === 0) {
      const res = await filterService.getClazzList()
      if (res.success) curriculumList.value = res.data
    } else if (currentStep.value === 2) {
      const res = await filterService.getExamBoardList(selectedCurriculum.value?.id)
      if (res.success) {
        // 如果只有一个选项或没有选项，自动处理？暂时手动选择
        examList.value = res.data
        // 特殊处理：如果列表为空，是否跳过？
        if (examList.value.length === 0) {
           // Skip to Step 3
           currentStep.value = 3
           await loadData()
           return
        }
      }
    } else if (currentStep.value === 3) {
      // 获取关联的学科
      // API: filterService.getSubjectList(clazzId) -> 返回所有
      // 或者 getSubjectLevelPaperMapping -> 更精确
      // 使用 getSubjectList 简单获取
      const res = await filterService.getSubjectList(selectedCurriculum.value?.id)
      if (res.success) subjectList.value = res.data
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSelect = async (item) => {
  if (currentStep.value === 1) {
    selectedCurriculum.value = item
    currentStep.value = 2
    await loadData()
  } else if (currentStep.value === 2) {
    selectedExam.value = item
    currentStep.value = 3
    await loadData()
  } else if (currentStep.value === 3) {
    selectedSubject.value = item
  }
}

const handleBackOrClose = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    if (currentStep.value === 2) selectedExam.value = null
    if (currentStep.value === 1) selectedCurriculum.value = null
    selectedSubject.value = null
  } else {
    close()
  }
}

const handleSave = async () => {
  if (!selectedSubject.value || !selectedCurriculum.value) return
  
  isSaving.value = true
  try {
    // 构造 subject string: "IGCSE | CAIE | Economics" or "IB | Economics"
    let subjectString = selectedCurriculum.value.name
    if (selectedExam.value) {
      subjectString += ` | ${selectedExam.value.name}`
    }
    subjectString += ` | ${selectedSubject.value.name}`
    
    // 获取当前用户 Profile
    const userProfile = await mineService.getUserProfile()
    let currentList = userProfile.subscribeSubjectList || []
    
    // 检查是否已存在
    if (!currentList.includes(subjectString)) {
      currentList.push(subjectString)
      
      // 更新 Profile
      await mineService.updateUserInfo({
        subscribeSubjectList: currentList
      })
      
      emit('added', subjectString)
    }
    
    close()
  } catch (error) {
    console.error('Failed to save subject:', error)
    alert('Failed to add subject. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const close = () => {
  emit('close')
  // 重置状态
  setTimeout(() => {
    currentStep.value = 1
    selectedCurriculum.value = null
    selectedExam.value = null
    selectedSubject.value = null
  }, 300)
}

// 监听显示状态
watch(() => props.show, (val) => {
  if (val) {
    currentStep.value = 1
    loadData()
  }
})
</script>

