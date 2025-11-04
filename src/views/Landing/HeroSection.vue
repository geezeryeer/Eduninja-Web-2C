<template>
  <div class="relative overflow-hidden bg-white">
    <!-- 简约背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 主要背景 - 纯白色 -->
      <div class="absolute inset-0 bg-white"></div>
      
      <!-- 微妙的几何装饰 -->
      <div class="absolute top-20 right-20 w-48 h-48 bg-gray-50 rounded-full opacity-40 blur-3xl"></div>
      <div class="absolute bottom-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-30 blur-2xl"></div>
    </div>
    
    <!-- 主要内容 -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- 左侧：文本内容 -->
        <div class="text-left lg:pr-12">
          
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            AI Companion<br>
            Built for Your<br>
            <span class="text-gray-400">Curriculum</span>
          </h1>
          
          <p class="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
            The AI tutor that knows your syllabus inside out — guiding you through every topic with precision.
          </p>
          
          <!-- 简约特点列表 -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span class="text-base text-gray-700">10,000+ Questions & Past Papers</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span class="text-base text-gray-700">AI-Powered Study Tools</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span class="text-base text-gray-700">Curriculum-Specific Content</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧：筛选框 -->
        <div>
          <div class="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
            <!-- 微妙的顶部装饰 -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900"></div>
            
            <!-- 头部 -->
            <div class="mb-6 text-center">
              <h2 class="text-xl font-bold text-gray-900">
                Get Started
              </h2>
            </div>
            
            <!-- 课程类型选择 -->
            <div class="mb-5">
              <label class="block text-sm font-semibold text-gray-900 mb-3">
                Curriculum
              </label>
              <div v-if="isLoadingData" class="flex items-center justify-center py-8">
                <div class="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              </div>
              <div v-else class="grid grid-cols-2 gap-2.5">
                <button 
                  v-for="curriculum in curriculums" 
                  :key="curriculum.code"
                  @click="selectCurriculum(curriculum)"
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold transition-all duration-300 text-sm relative border-2',
                    selectedCurriculum?.code === curriculum.code 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105' 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-md'
                  ]"
                >
                  {{ curriculum.name }}
                  <div 
                    v-if="selectedCurriculum?.code === curriculum.code"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg class="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- 考试局选择 (仅对IGCSE、A-Level等显示) -->
            <div v-if="needsExamBoard" class="mb-5" :class="{ 'opacity-50': !selectedCurriculum }">
              <label class="block text-sm font-semibold text-gray-900 mb-3">
                Exam Board
              </label>
              <select 
                v-model="selectedExamBoardCode"
                @change="handleExamBoardChange"
                :disabled="!selectedCurriculum"
                class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold appearance-none bg-white shadow-sm"
                :class="[
                  selectedCurriculum 
                    ? 'border-gray-200 text-gray-700 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-100 cursor-pointer' 
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                ]"
                style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236B7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.2em 1.2em;"
              >
                <option value="" disabled>{{ selectedCurriculum ? 'Select an exam board...' : 'Select curriculum first' }}</option>
                <option 
                  v-for="examBoard in availableExamBoards" 
                  :key="examBoard.code" 
                  :value="examBoard.code"
                >
                  {{ examBoard.name }}
                </option>
              </select>
            </div>
            
            <!-- 学科选择 -->
            <div class="mb-5" :class="{ 'opacity-50': needsExamBoard ? !selectedExamBoard : !selectedCurriculum }">
              <label class="block text-sm font-semibold text-gray-900 mb-3">
                Subject
              </label>
              <select 
                v-model="selectedSubjectCode"
                @change="handleSubjectChange"
                :disabled="needsExamBoard ? !selectedExamBoard : !selectedCurriculum"
                class="w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold appearance-none bg-white shadow-sm"
                :class="[
                  (needsExamBoard ? selectedExamBoard : selectedCurriculum)
                    ? 'border-gray-200 text-gray-700 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-100 cursor-pointer' 
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                ]"
                style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236B7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.2em 1.2em;"
              >
                <option value="" disabled>
                  {{ needsExamBoard 
                    ? (selectedExamBoard ? 'Select a subject...' : 'Select exam board first') 
                    : (selectedCurriculum ? 'Select a subject...' : 'Select curriculum first') 
                  }}
                </option>
                <option 
                  v-for="subject in availableSubjects" 
                  :key="subject.code" 
                  :value="subject.code"
                >
                  {{ subject.name }}
                </option>
              </select>
            </div>
            
            <!-- CTA 按钮 -->
            <button 
              @click="handleSearch"
              :disabled="!selectedCurriculum || !selectedSubject || isLoading"
              :class="[
                'w-full px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-2 relative overflow-hidden',
                selectedCurriculum && selectedSubject && !isLoading
                  ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Loading...' : 'Start Exploring' }}</span>
              <svg v-if="!isLoading" class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { filterService } from '@/services'

// 定义 emits
defineEmits(['navigate'])

// 路由
const router = useRouter()

// 加载状态
const isLoading = ref(false)
const isLoadingData = ref(true)

// 课程和学科数据（从API获取）
const curriculums = ref([])
const subjectsDatabase = ref({}) // 按课程体系筛选后的学科列表
const examBoardsDatabase = ref({}) // 按课程体系筛选后的考试局列表

const selectedCurriculum = ref(null)
const selectedExamBoard = ref(null) // 选中的考试局
const selectedExamBoardCode = ref('') // 选中的考试局代码
const selectedSubject = ref(null)
const selectedSubjectCode = ref('')

// 判断课程体系是否需要选择考试局
const needsExamBoard = computed(() => {
  if (!selectedCurriculum.value) return false
  const name = selectedCurriculum.value.name.toUpperCase()
  return ['IGCSE', 'A-LEVEL', 'AS-LEVEL'].includes(name)
})

// 页面加载时获取课程体系列表
const loadCurriculums = async () => {
  try {
    isLoadingData.value = true
    const result = await filterService.getClazzList()
    
    if (result.success && result.data) {
      // 将API返回的数据格式化为组件需要的格式
      curriculums.value = result.data.map(item => ({
        id: item.id,
        code: item.name, // 使用name作为code
        name: item.descName || item.name // 优先使用descName作为显示名称
      }))
      console.log('✅ 课程体系列表加载成功:', curriculums.value)
    } else {
      console.warn('⚠️ 课程体系列表加载失败:', result.message)
    }
  } catch (error) {
    console.error('❌ 加载课程体系列表出错:', error)
  } finally {
    isLoadingData.value = false
  }
}

// 根据课程体系加载考试局列表 - 通过后端API筛选
const loadExamBoards = async (curriculumId) => {
  try {
    const curriculum = curriculums.value.find(c => c.id === curriculumId)
    if (!curriculum) return

    console.log(`📤 调用API获取课程体系${curriculumId}(${curriculum.name})的考试局列表`)

    // 直接调用后端API获取筛选后的考试局
    const result = await filterService.getExamBoardList(curriculumId)
    
    if (result.success && result.data) {
      const examBoards = result.data.map(item => ({
        id: item.id,
        code: item.code || item.name,
        name: item.name
      }))
      
      examBoardsDatabase.value[curriculum.code] = examBoards
      console.log(`✅ 课程体系${curriculumId}(${curriculum.name})的考试局列表加载成功: ${examBoards.length}个考试局`)
    } else {
      console.warn(`⚠️ 课程体系${curriculumId}的考试局列表加载失败:`, result.message)
      examBoardsDatabase.value[curriculum.code] = []
    }
  } catch (error) {
    console.error(`❌ 加载课程体系${curriculumId}的考试局列表出错:`, error)
    const curriculum = curriculums.value.find(c => c.id === curriculumId)
    if (curriculum) {
      examBoardsDatabase.value[curriculum.code] = []
    }
  }
}

// 根据课程体系加载学科列表 - 通过后端API筛选
const loadSubjects = async (curriculumId) => {
  try {
    const curriculum = curriculums.value.find(c => c.id === curriculumId)
    if (!curriculum) return

    console.log(`📤 调用API获取课程体系${curriculumId}(${curriculum.name})的学科列表`)

    // 直接调用后端API获取筛选后的学科
    const result = await filterService.getSubjectList(curriculumId)
    
    if (result.success && result.data) {
      const subjects = result.data.map(item => ({
        id: item.id,
        code: item.code || item.name,
        name: item.name
      }))
      
      subjectsDatabase.value[curriculum.code] = subjects
      console.log(`✅ 课程体系${curriculumId}(${curriculum.name})的学科列表加载成功: ${subjects.length}个学科`)
    } else {
      console.warn(`⚠️ 课程体系${curriculumId}的学科列表加载失败:`, result.message)
      subjectsDatabase.value[curriculum.code] = []
    }
  } catch (error) {
    console.error(`❌ 加载课程体系${curriculumId}的学科列表出错:`, error)
    const curriculum = curriculums.value.find(c => c.id === curriculumId)
    if (curriculum) {
      subjectsDatabase.value[curriculum.code] = []
    }
  }
}

// 组件挂载时加载课程体系列表
onMounted(() => {
  loadCurriculums()
})

// 计算当前可用的考试局
const availableExamBoards = computed(() => {
  if (!selectedCurriculum.value) return []
  return examBoardsDatabase.value[selectedCurriculum.value.code] || []
})

// 计算当前可用的学科
const availableSubjects = computed(() => {
  if (!selectedCurriculum.value) return []
  return subjectsDatabase.value[selectedCurriculum.value.code] || []
})

// 方法
const selectCurriculum = async (curriculum) => {
  selectedCurriculum.value = curriculum
  selectedExamBoard.value = null // 切换课程时清空已选考试局
  selectedExamBoardCode.value = ''
  selectedSubject.value = null // 切换课程时清空已选学科
  selectedSubjectCode.value = '' // 清空select选择
  
  // 判断是否需要考试局
  if (needsExamBoard.value) {
    // 如果该课程体系的考试局列表还未加载，则加载
    if (!examBoardsDatabase.value[curriculum.code]) {
      await loadExamBoards(curriculum.id)
    }
  } else {
    // 不需要考试局，直接加载学科
    if (!subjectsDatabase.value[curriculum.code]) {
      await loadSubjects(curriculum.id)
    }
  }
}

const handleExamBoardChange = async () => {
  if (selectedExamBoardCode.value) {
    const examBoard = availableExamBoards.value.find(e => e.code === selectedExamBoardCode.value)
    selectedExamBoard.value = examBoard
    
    // 选择考试局后，加载学科
    if (selectedCurriculum.value && !subjectsDatabase.value[selectedCurriculum.value.code]) {
      await loadSubjects(selectedCurriculum.value.id)
    }
  } else {
    selectedExamBoard.value = null
  }
}

const handleSubjectChange = () => {
  if (selectedSubjectCode.value) {
    const subject = availableSubjects.value.find(s => s.code === selectedSubjectCode.value)
    selectedSubject.value = subject
  } else {
    selectedSubject.value = null
  }
}

const handleSearch = async () => {
  if (!selectedCurriculum.value || !selectedSubject.value) {
    return
  }
  
  // 设置加载状态
  isLoading.value = true
  
  try {
    // 调用FilterService获取筛选数据（使用id而不是code）
    const filterData = await filterService.getFormattedFilterData({
      clazzId: selectedCurriculum.value.id,
      subjectId: selectedSubject.value.id
    })
    
    if (filterData.success) {
      // 将筛选数据存储到sessionStorage
      sessionStorage.setItem('filterData', JSON.stringify(filterData))
      sessionStorage.setItem('currentCurriculum', selectedCurriculum.value.code)
      sessionStorage.setItem('currentSubject', selectedSubject.value.code)
      
      console.log('✅ 筛选数据已预加载:', filterData)
      
      // 导航到应用页面
      router.push({
        path: '/library',
        query: {
          curriculum: selectedCurriculum.value.code,
          subject: selectedSubject.value.code
        }
      })
    } else {
      console.warn('⚠️ 加载筛选数据失败，仍然继续导航:', filterData.message)
      
      // 即使失败也导航，让用户能进入应用
      router.push({
        path: '/library',
        query: {
          curriculum: selectedCurriculum.value.code,
          subject: selectedSubject.value.code
        }
      })
    }
  } catch (error) {
    console.error('❌ 加载筛选数据出错:', error)
    
    // 出错也导航，不阻塞用户
    router.push({
      path: '/library',
      query: {
        curriculum: selectedCurriculum.value.code,
        subject: selectedSubject.value.code
      }
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 简约动画效果 */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* 微妙的渐变效果 */
.blur-2xl {
  filter: blur(40px);
}

.blur-3xl {
  filter: blur(60px);
}

/* 按钮组hover效果 */
button:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* 平滑过渡 */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 焦点样式优化 */
select:focus {
  outline: none;
}

button:focus {
  outline: none;
}

/* 自定义阴影 */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
