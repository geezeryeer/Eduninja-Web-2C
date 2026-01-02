<template>
  <div class="pt-16 pb-10 lg:pt-20 lg:pb-12 relative z-10">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
      <div class="flex flex-col items-center">
        <!-- Top Content (Centered) -->
        <div class="text-center mb-16 max-w-5xl mx-auto">
            <h1 class="text-[56px] lg:text-[80px] font-semibold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                Master Exams. <br class="hidden sm:block">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#D1FAE5] via-[#818CF8] to-[#F3E8FF] animate-gradient-x" style="background-size: 200% auto;">
                  Syllabus Aligned.
                </span>
            </h1>
            
            <p class="text-lg lg:text-xl text-gray-500 mb-0 leading-relaxed max-w-2xl mx-auto">
                The only AI platform trained on exact exam board curriculums. 
                A complete learning ecosystem built for IB, A-Level, AP & IGCSE.
            </p>
        </div>

        <!-- Bottom Form (Centered) -->
        <div class="relative w-full max-w-xl mx-auto">
          <!-- Decorative blurred blob behind the card -->
          <div class="absolute -top-10 -right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div class="glass-card rounded-3xl p-8 relative shadow-2xl shadow-blue-900/5 ring-1 ring-white/60">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Get Started</h2>
            
            <!-- Curriculum Selection -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                Curriculum
              </label>
              <div v-if="isLoadingData" class="flex items-center justify-center py-8">
                <div class="w-6 h-6 border-2 border-gray-200 border-t-slate-600 rounded-full animate-spin"></div>
              </div>
              <div v-else class="grid grid-cols-3 gap-3">
                <button 
                  v-for="curriculum in curriculums" 
                  :key="curriculum.code"
                  @click="selectCurriculum(curriculum)"
                  :class="[
                    'px-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 border text-center active:scale-[0.98]',
                    selectedCurriculum?.code === curriculum.code 
                      ? 'bg-slate-600 text-white border-slate-600 shadow-lg shadow-slate-600/20 hover:bg-slate-500' 
                      : 'bg-white/80 hover:bg-white text-gray-700 border-gray-200/60 hover:border-gray-300 hover:shadow-sm'
                  ]"
                >
                  {{ curriculum.name }}
                </button>
              </div>
            </div>
            
            <!-- Exam Board Selection -->
            <div v-if="needsExamBoard" class="mb-5 animate-fade-in-down">
              <label class="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Exam Board
              </label>
              <div class="relative group">
                <select 
                    v-model="selectedExamBoardCode"
                    @change="handleExamBoardChange"
                    :disabled="!selectedCurriculum"
                    class="w-full px-4 py-3.5 rounded-xl border text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors font-medium cursor-pointer"
                    :class="[
                    selectedCurriculum 
                        ? 'bg-white/90 hover:bg-white border-gray-200 hover:border-slate-500 text-gray-900' 
                        : 'bg-gray-50/50 border-gray-200 text-gray-400 cursor-not-allowed'
                    ]"
                >
                    <option value="" disabled>{{ selectedCurriculum ? 'Select Exam Board' : 'Select Curriculum First' }}</option>
                    <option v-for="examBoard in availableExamBoards" :key="examBoard.code" :value="examBoard.code">{{ examBoard.name }}</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-slate-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            
            <!-- Subject Selection -->
            <div class="mb-8">
              <label class="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Subject
              </label>
              <div class="relative group">
                <select 
                    v-model="selectedSubjectCode"
                    @change="handleSubjectChange"
                    :disabled="needsExamBoard ? !selectedExamBoard : !selectedCurriculum"
                    class="w-full px-4 py-3.5 rounded-xl border text-[15px] appearance-none focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors font-medium cursor-pointer"
                    :class="[
                    (needsExamBoard ? selectedExamBoard : selectedCurriculum)
                        ? 'bg-white/90 hover:bg-white border-gray-200 hover:border-slate-500 text-gray-900' 
                        : 'bg-gray-50/50 border-gray-200 text-gray-400 cursor-not-allowed'
                    ]"
                >
                    <option value="" disabled>Select Subject</option>
                    <option v-for="subject in availableSubjects" :key="subject.code" :value="subject.code">{{ subject.name }}</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-slate-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            
            <!-- CTA Button -->
            <button 
              @click="handleSearch"
              :disabled="!selectedCurriculum || !selectedSubject || isLoading"
              :class="[
                'w-full px-6 py-4 text-[16px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]',
                selectedCurriculum && selectedSubject && !isLoading
                  ? 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-500/25 hover:shadow-slate-500/40 hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              ]"
            >
              <div v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
              <span>{{ isLoading ? '' : 'Start Learning' }}</span>
              <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
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
h1, h2, p, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
