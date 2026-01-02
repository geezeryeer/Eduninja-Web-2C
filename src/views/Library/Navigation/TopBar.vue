<template>
  <!-- 顶部栏：路径导航和搜索 -->
  <div 
    class="fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-300"
  >
    <!-- 背景层 - 已移除白色背景，完全透明 -->
    <!-- <div class="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 pointer-events-auto"></div> -->
    
    <!-- 内容层 -->
    <div class="relative h-12 flex items-center justify-between px-6 w-full pointer-events-auto">
      <div class="flex items-center gap-4">
        <!-- Logo -->
        <div 
          @click="goToLanding"
          class="flex items-center gap-2.5 cursor-pointer transition-opacity hover:opacity-60 flex-shrink-0"
        >
          <img src="/src/assets/images/app_icon_tight_1024.png" alt="EduNinja" class="w-6 h-6">
          <h1 class="font-semibold text-gray-900 text-[15px] tracking-tight">EduNinja</h1>
        </div>

        <!-- Syllabus 按钮 -->
        <button
          class="flex items-center gap-2 px-3 py-1.5 bg-white/40 hover:bg-white/60 border border-white/20 backdrop-blur-md rounded-full transition-all duration-200 shadow-sm group"
        >
          <div 
            class="w-4 h-4 bg-gray-600 group-hover:bg-gray-900 transition-colors icon-mask"
            :style="{ maskImage: `url(${subjectIcon})`, WebkitMaskImage: `url(${subjectIcon})` }"
          ></div>
          <span class="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Syllabus</span>
        </button>
        
        <!-- 学科切换器 (Subject Switcher) with Tree -->
        <div class="relative flex-shrink-0">
      <button 
            @click="toggleSubjectDropdown"
            class="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100/40 transition-all duration-200"
      >
            <span class="text-[13px] font-medium text-gray-700 group-hover:text-gray-900 truncate max-w-[200px] transition-colors">
              {{ currentSubjectDisplay || 'Select Subject' }}
            </span>
            <div 
              class="w-3 h-3 bg-gray-400 group-hover:bg-gray-600 transition-all duration-200 icon-mask"
              :class="{ 'rotate-180': showSubjectDropdown }"
              :style="{ maskImage: `url(${chevronDownIcon})`, WebkitMaskImage: `url(${chevronDownIcon})` }"
        ></div>
      </button>
      
          <!-- Dropdown Menu with Tree Structure -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-95"
          >
            <div 
              v-if="showSubjectDropdown"
              class="absolute top-full left-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/60 py-3 overflow-hidden z-50 origin-top-left"
            >
              <div class="max-h-[500px] overflow-y-auto custom-scrollbar px-3">
                <!-- Subject Tree -->
                <SubjectTree
                  v-for="subject in subjectsWithChildren"
                  :key="subject.id"
                  :node="subject"
                  :active-id="activeId"
                  :expanded-ids="expandedSubjects"
                  :is-active-root="activeSubject?.id === subject.id"
                  @select="handleNodeSelect"
                  @toggle="handleNodeToggle"
                />

                <!-- Add Subject Button -->
                <button
                  v-if="subjects.length > 0"
                  @click="handleAddSubject"
                  class="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100/60 transition-all duration-200 text-left group"
                >
                  <div class="w-4 h-4 flex items-center justify-center border border-dashed border-gray-400 rounded-md group-hover:border-gray-600 transition-colors">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                  <span class="text-[13px] font-medium">Add Subject</span>
                </button>

                <!-- Empty State -->
                <div v-if="subjects.length === 0" class="py-12 text-center">
                  <span class="text-xs text-gray-400">No subjects yet</span>
                </div>
              </div>
            </div>
          </Transition>
          
          <!-- Backdrop -->
          <div 
            v-if="showSubjectDropdown" 
            class="fixed inset-0 z-40 cursor-default" 
            @click="showSubjectDropdown = false"
          ></div>
        </div>

        <!-- 分隔符 -->
        <div v-if="breadcrumbPath.length > 0" class="h-5 w-px bg-gray-300/60"></div>

        <!-- 路径导航 (Topics only) -->
      <div v-if="breadcrumbPath.length > 0" class="flex items-center gap-2 text-[13px] text-gray-500 flex-shrink-0">
        <span
          v-for="(item, index) in breadcrumbPath"
          :key="index"
          class="flex items-center gap-2"
        >
          <span 
            :class="index === breadcrumbPath.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'"
            class="transition-colors"
          >
            {{ item }}
          </span>
          <svg
            v-if="index < breadcrumbPath.length - 1"
            class="w-3 h-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
      </div>

      <!-- 右侧工具栏 -->
      <div class="flex items-center gap-3">
        <!-- Studio Toggle Button -->
        <button 
          v-if="!showStudio"
          @click="$emit('toggle-studio')"
          class="p-2 hover:bg-gray-100/80 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
          title="Show Studio"
        >
          <div 
            class="w-5 h-5 bg-gray-500 hover:bg-gray-700 transition-colors icon-mask"
            :style="{ '-webkit-mask-image': `url(${rightSidebarIcon})` }"
          ></div>
        </button>
        
        <!-- Profile (Avatar Only) -->
        <div class="relative">
          <Profile 
            :isCollapsed="true"
          />
      </div>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <AddSubjectModal 
      :show="showAddSubjectModal"
      @close="showAddSubjectModal = false"
      @added="handleSubjectAdded"
    />
  </div>
</template>

<script setup>
import { computed, inject, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mineService } from '@/services'
import { mockKnowledgePoints } from './mockData'
import Profile from '../Navigation/Profile.vue'
import SubjectTree from '../Navigation/SubjectTree.vue'
import AddSubjectModal from '../Navigation/AddSubjectModal.vue'
import rightSidebarIcon from '@/assets/Icon/sidebar.squares.right.svg'
import subjectIcon from '@/assets/Icon/book.svg'
import chevronDownIcon from '@/assets/Icon/chevron.down.svg'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  showStudio: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-studio', 'search-change'])

// 从父组件获取搜索状态
const searchQuery = inject('searchQuery', ref(''))

// 学科数据状态
const subjects = ref([])
const showSubjectDropdown = ref(false)
const activeSubject = ref(null)
const expandedSubjects = ref(new Set())
const selectedKnowledgePoint = ref(null)
const showAddSubjectModal = ref(false)

// 递归处理 mock 数据，将 learningObjectives 转换为子节点
const processMockData = (data, parentId = null) => {
  return data.map(topic => ({
    ...topic,
    parentId,
    children: topic.children?.map(subtopic => ({
      ...subtopic,
      parentId: topic.id,
      children: subtopic.learningObjectives?.map((obj, index) => ({
        id: `${subtopic.id}-obj-${index}`,
        name: obj,
        isObjective: true,
        parentId: subtopic.id
      })) || []
    }))
  }))
}

// 学科列表（带知识树）
const subjectsWithChildren = computed(() => {
  const processedMockData = processMockData(mockKnowledgePoints)
  
  return subjects.value.map(subject => ({ 
    ...subject, 
    children: processedMockData.map(topic => ({ ...topic, parentId: subject.id })) 
  }))
})

const activeId = computed(() => {
  if (selectedKnowledgePoint.value) return selectedKnowledgePoint.value.id
  if (activeSubject.value) return activeSubject.value.id
  return null
})

// 当前选中的学科显示名称
const currentSubjectDisplay = computed(() => {
  if (route.query.subject) {
    const parts = []
    if (route.query.clazz) parts.push(route.query.clazz)
    if (route.query.exam) parts.push(route.query.exam)
    parts.push(route.query.subject)
    return parts.join(' | ')
  }
  
  if (subjects.value.length > 0) {
    const s = subjects.value[0]
    const parts = []
    if (s.clazz) parts.push(s.clazz)
    if (s.exam) parts.push(s.exam)
    parts.push(s.name)
    return parts.join(' | ')
  }
  return ''
})

// 解析 subject 字符串 "clazz | exam | subject"
const parseSubjectString = (subjectName) => {
  let clazz = '', exam = '', name = subjectName
  
  if (subjectName.includes(' | ')) {
    const parts = subjectName.split(' | ').map(s => s.trim())
    if (parts.length >= 3) {
      [clazz, exam, name] = parts
    } else if (parts.length === 2) {
      [clazz, name] = parts
    }
  }
  
  return {
    id: `${clazz}-${exam}-${name}`.toLowerCase().replace(/\s+/g, '-'),
    name,
    clazz,
    exam,
    fullName: subjectName
  }
}

// 加载学科列表
const loadSubjects = async () => {
  try {
    const userProfile = await mineService.getUserProfile()
    subjects.value = (userProfile?.subscribeSubjectList || [])
      .map(name => parseSubjectString(name))
  } catch (error) {
    console.error('Failed to load subjects:', error)
  }
}

const toggleSubjectDropdown = () => {
  showSubjectDropdown.value = !showSubjectDropdown.value
}

const handleNodeSelect = ({ node, level }) => {
  showSubjectDropdown.value = false
  
  const rootSubject = level === 0 ? node : (activeSubject.value || subjectsWithChildren.value.find(s => expandedSubjects.value.has(s.id)))
  if (!rootSubject) return
  
  selectedKnowledgePoint.value = level === 0 ? null : { ...node, subjectId: rootSubject.id }
  activeSubject.value = rootSubject
  
  const query = { 
    subject: rootSubject.name, 
    clazz: rootSubject.clazz, 
    exam: rootSubject.exam, 
    level: rootSubject.level
  }
  
  // 构建完整的知识点路径
  if (level > 0) {
    const path = findNodePath(subjectsWithChildren.value, node.id)
    if (path.length > 1) {
      if (path[1]) query.topic = path[1].name
      if (path[2]) query.subtopic = path[2].name
      if (path[3]) query.objective = path[3].name
    }
  }
  
  router.push({ path: '/library', query })
}

// 辅助函数：在树中查找节点的完整路径
const findNodePath = (roots, targetId, currentPath = []) => {
  for (const root of roots) {
    const path = [...currentPath, root]
    if (root.id === targetId) return path
    if (root.children) {
      const found = findNodePath(root.children, targetId, path)
      if (found.length > 0) return found
    }
  }
  return []
}

// 辅助函数：在树中查找节点的兄弟节点ID
const findSiblingIds = (rootList, targetNode) => {
  let siblings = []
  
  const traverse = (nodes) => {
    for (const node of nodes) {
      if (node.id === targetNode.id) {
        siblings = nodes.filter(n => n.id !== targetNode.id).map(n => n.id)
        return true
      }
      if (node.children) {
        if (traverse(node.children)) return true
      }
    }
    return false
  }
  
  traverse(rootList)
  return siblings
}

const handleNodeToggle = (node) => {
  const isExpanded = expandedSubjects.value.has(node.id)
  
  if (!isExpanded) {
    const siblingIds = findSiblingIds(subjectsWithChildren.value, node)
    siblingIds.forEach(id => expandedSubjects.value.delete(id))
  }
  
  isExpanded ? expandedSubjects.value.delete(node.id) : expandedSubjects.value.add(node.id)
}

const goToLanding = () => router.push('/')

const handleAddSubject = () => {
  showAddSubjectModal.value = true
  showSubjectDropdown.value = false
}

const handleSubjectAdded = async () => {
  await loadSubjects()
}

// 计算路径导航 (只显示 Topic 层级，不显示 Subject)
const breadcrumbPath = computed(() => {
  const path = []
  
  // 知识点层级（完整路径）
  if (route.query.topic) path.push(route.query.topic)
  if (route.query.subtopic) path.push(route.query.subtopic)
  if (route.query.objective) path.push(route.query.objective)
  
  // 兼容旧的 knowledgePoint 参数
  if (route.query.knowledgePoint && !route.query.topic) {
    path.push(route.query.knowledgePoint)
  }
  
  return path
})

onMounted(async () => {
  await loadSubjects()
  
  // 选择第一个学科
  const firstSubject = subjectsWithChildren.value[0]
  if (firstSubject && !route.query.subject) {
    handleNodeSelect({ node: firstSubject, level: 0 })
  }
})
</script>

<style scoped>
/* 确保下拉菜单在最上层 */
.z-50 {
  z-index: 50;
}

/* 精致的滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
  transition: background 0.2s;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.5);
}

/* 平滑过渡 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
