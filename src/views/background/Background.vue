<template>
  <!-- 全屏背景 -->
  <div class="fixed inset-0 bg-gradient-to-br from-orange-50/90 via-rose-100/75 to-amber-100/85 backdrop-blur-md">
    <!-- 背景装饰效果 -->
    <div class="absolute inset-0">
      <div class="absolute top-32 left-32 w-96 h-96 bg-orange-300/25 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div class="absolute top-48 right-32 w-96 h-96 bg-rose-300/22 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-32 left-1/2 w-96 h-96 bg-amber-300/28 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      <!-- 额外的装饰层 -->
      <div class="absolute top-1/2 right-1/4 w-80 h-80 bg-pink-200/15 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-6000"></div>
      <div class="absolute bottom-1/4 left-1/4 w-72 h-72 bg-orange-100/20 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-8000"></div>
    </div>
    
    <!-- 左侧导航区域 - 高级设计 -->
    <aside class="fixed left-0 top-0 bottom-0 w-52 z-30">
      <div class="flex flex-col h-full overflow-hidden p-4">
    
        <!-- 应用头部 -->
        <div 
          @click="goToLanding"
          class="flex items-center gap-3 mb-4 py-2 cursor-pointer hover:bg-white/10 rounded-lg transition-all duration-200"
        >
          <img src="/src/assets/images/app_icon_tight_1024.png" alt="EduNinja" class="w-12 h-12 rounded-xl">
          <h1 class="font-semibold text-gray-900 text-base tracking-tight">EduNinja</h1>
        </div>
    
        <!-- 导航菜单 -->
        <nav class="flex-1 overflow-y-auto space-y-4">
          
          <!-- Public Folder -->
          <div class="space-y-1">
            <!-- Public 文件夹 - 胶囊状白色按钮 -->
            <div 
              @click="toggleSection('public')"
              class="rounded-full px-3.5 py-2 shadow-sm cursor-pointer transition-all duration-200"
              :class="activeSection === 'public' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-md'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-base">📁</span>
                  <span class="font-medium text-sm" :class="activeSection === 'public' ? 'text-white' : 'text-gray-800'">Public</span>
                </div>
                <svg 
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="[
                    activeSection === 'public' ? 'text-white' : 'text-gray-400',
                    { 'rotate-90': publicExpanded }
                  ]"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
            
            <!-- Public 学科列表 - 子项目 -->
            <div v-show="publicExpanded" class="ml-4 space-y-0.5 border-l-2 border-white/30 pl-3 relative">
              <!-- 加载状态 -->
              <div v-if="isLoadingSubjects" class="flex items-center justify-center py-6">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span class="ml-2 text-xs text-gray-600">Loading...</span>
              </div>
              
              <!-- 学科列表 -->
              <div 
                v-for="subject in publicSubjects"
                :key="subject.id"
                @click="selectSubject('public', subject)"
                class="group cursor-pointer py-1.5 px-2 transition-all duration-200 relative"
              >
                <!-- 左侧选中指示线 -->
                <div 
                  v-if="activeSubject?.id === subject.id && activeSubject?.space === 'public'"
                  class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-1 h-5 bg-gray-900 rounded-full"
                ></div>
                
                <div class="flex flex-col">
                  <span class="text-gray-900 text-base font-medium leading-tight truncate">
                    {{ subject.name }}
                  </span>
                  <span class="text-sm text-gray-600 leading-tight truncate mt-0.5" 
                        v-if="getSubjectDetails(subject)">
                    {{ getSubjectDetails(subject) }}
                  </span>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-if="!isLoadingSubjects && publicSubjects.length === 0" class="text-center py-6">
                <p class="text-xs text-gray-500">No public subjects</p>
              </div>
            </div>
          </div>

          <!-- Private Folder -->
          <div class="space-y-1">
            <!-- Private 文件夹 - 胶囊状白色按钮 -->
            <div 
              @click="toggleSection('private')"
              class="rounded-full px-3.5 py-2 shadow-sm cursor-pointer transition-all duration-200"
              :class="activeSection === 'private' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-md'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-base">🔒</span>
                  <span class="font-medium text-sm" :class="activeSection === 'private' ? 'text-white' : 'text-gray-800'">Private</span>
                </div>
                <svg 
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="[
                    activeSection === 'private' ? 'text-white' : 'text-gray-400',
                    { 'rotate-90': privateExpanded }
                  ]"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
            
            <!-- Private 学科列表 - 子项目 -->
            <div v-show="privateExpanded" class="ml-4 space-y-0.5 border-l-2 border-white/30 pl-3 relative">
              <!-- 私人学科 -->
              <div 
                v-for="subject in privateSubjects"
                :key="'private-' + subject.id"
                @click="selectSubject('private', subject)"
                class="group cursor-pointer py-1.5 px-2 transition-all duration-200 relative"
              >
                <!-- 左侧选中指示线 -->
                <div 
                  v-if="activeSubject?.id === subject.id && activeSubject?.space === 'private'"
                  class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 w-1 h-5 bg-gray-900 rounded-full"
                ></div>
                
                <div class="flex flex-col">
                  <span class="text-gray-900 text-base font-medium leading-tight truncate">
                    {{ subject.name }}
                  </span>
                  <span class="text-sm text-gray-600 leading-tight truncate mt-0.5" 
                        v-if="getSubjectDetails(subject)">
                    {{ getSubjectDetails(subject) }}
                  </span>
                </div>
              </div>
              
              <!-- 添加按钮 -->
              <button class="w-full py-1 px-2 rounded-lg border-2 border-dashed border-white/40 text-gray-600 hover:border-white/60 hover:bg-white/20 transition-all duration-200 text-xs font-medium">
                + Add Private Subject
              </button>
            </div>
          </div>

        </nav>


        <!-- 底部用户区 -->
        <div class="mt-auto -mx-4">
          <Profile 
            :userName="'Andrew Krauf'"
            :userEmail="'krauf@acniel.com'"
          />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { subjectService } from '@/services'
import Profile from './Profile.vue'

// 路由相关 - 必须在setup顶层调用
const router = useRouter()

// 组件状态
const activeSubject = ref(null)
const activeSection = ref('public')
const publicExpanded = ref(true)
const privateExpanded = ref(true)
const isLoadingSubjects = ref(false)

// 学科数据
const publicSubjects = ref([])
const privateSubjects = ref([
  { id: 'private-math-1', name: 'Advanced Mathematics', clazz: 'A Level', exam: 'CIE', level: 'AS', space: 'private' },
  { id: 'private-physics-1', name: 'Physics', clazz: 'IGCSE', exam: 'Edexcel', level: 'Extended', space: 'private' },
  { id: 'private-chemistry-1', name: 'Chemistry', clazz: 'A Level', exam: 'AQA', level: 'A2', space: 'private' }
])

// 切换展开状态
const toggleSection = (section) => {
  if (section === 'public') publicExpanded.value = !publicExpanded.value
  else if (section === 'private') privateExpanded.value = !privateExpanded.value
}

const selectSubject = (space, subject) => {
  activeSubject.value = { ...subject, space }
  activeSection.value = space
  
  const query = { subject: subject.name, clazz: subject.clazz, exam: subject.exam, level: subject.level, space }
  router.push({ path: '/library', query })
}

const goToLanding = () => router.push('/')


const getSubjectDetails = (subject) => {
  const details = [subject.clazz, subject.exam, subject.level].filter(item => item?.trim())
  return details.join(' | ')
}


const loadSubjects = async () => {
  if (isLoadingSubjects.value) return
  
  isLoadingSubjects.value = true
  try {
    const result = await subjectService.getCollectSubjectList({ id: 123 })
    
    if (result.successful && result.data) {
      publicSubjects.value = result.data
        .filter(item => item.subject?.trim() && item.subject !== 'null')
        .map(item => ({
          id: `${item.clazz || 'unknown'}-${item.exam || 'unknown'}-${item.subject}`.toLowerCase().replace(/\s+/g, '-'),
          name: item.subject,
          clazz: item.clazz || '',
          exam: item.exam || '',
          level: item.level || ''
        }))
    } else {
      throw new Error(result.message || 'Failed to load subjects')
    }
  } catch (error) {
    console.error('Failed to load subjects:', error)
    publicSubjects.value = []
  } finally {
    isLoadingSubjects.value = false
  }
}

onMounted(async () => {
  await loadSubjects()
  if (publicSubjects.value.length > 0) {
    selectSubject('public', publicSubjects.value[0])
  }
})
</script>

<style scoped>
/* 字体优化 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');


/* 背景模糊效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 动画延迟 */
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

.animation-delay-8000 {
  animation-delay: 8s;
}

/* 自定义脉动动画 */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

/* 自定义滚动条样式 */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

</style>