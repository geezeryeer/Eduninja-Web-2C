<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div 
      v-if="visible"
      class="absolute bottom-full left-3 right-3 mb-2 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg rounded-2xl overflow-hidden z-50 flex flex-col max-h-[320px]"
    >
      <!-- Visual Search Header (Non-interactive, reflects ChatInput) -->
      <div class="px-3 pt-3 pb-2 shrink-0">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-100/50 rounded-lg border border-gray-200/50">
          <div class="w-4 h-4 icon-mask bg-gray-400" :style="iconStyle(magnifyingGlassIcon)" />
          <span class="text-[13px] text-gray-500 truncate">
            {{ filterText || 'Search...' }}
          </span>
        </div>
      </div>

      <!-- Header / Breadcrumbs -->
      <div class="px-3 py-2 border-b border-gray-100/50 bg-gray-50/50 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <button 
            v-if="currentMode !== 'root'"
            class="hover:text-gray-900 flex items-center gap-1 transition-colors"
            @click="currentMode = 'root'"
          >
            <div class="w-3 h-3 icon-mask bg-current" :style="iconStyle(backIcon)" />
            Back
          </button>
          <span v-if="currentMode !== 'root'" class="text-gray-300">/</span>
          <span :class="currentMode === 'root' ? 'text-gray-500' : 'text-gray-900'">
            {{ modeLabel }}
          </span>
        </div>
        
        <span v-if="loading" class="text-xs text-gray-400 flex items-center gap-1">
          <div class="w-2 h-2 rounded-full border border-gray-400 border-t-transparent animate-spin"></div>
        </span>
      </div>

      <!-- Content Area -->
      <div class="overflow-y-auto custom-scrollbar py-1" ref="listRef">
        
        <!-- Root Menu: Categories -->
        <template v-if="currentMode === 'root'">
          <div class="px-2 pb-1">
             <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5">Categories</div>
          </div>
          <button
            v-for="(category, index) in categories"
            :key="category.id"
            class="w-full text-left px-4 py-2 flex items-center gap-3 transition-colors duration-150"
            :class="index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'"
            @click="enterCategory(category.id)"
            @mouseenter="selectedIndex = index"
          >
            <!-- Icon -->
            <div 
              class="w-4 h-4 icon-mask bg-gray-500 shrink-0"
              :style="iconStyle(category.icon)"
            />
            
            <!-- Text Content -->
            <div class="flex-1 min-w-0 flex items-center justify-between">
              <span class="text-[13px] text-gray-700 font-medium">
                {{ category.label }}
              </span>
              
              <!-- Arrow -->
              <div 
                class="w-3 h-3 icon-mask bg-gray-400 opacity-50"
                :style="iconStyle(chevronRightIcon)"
              />
            </div>
          </button>
        </template>

        <!-- List Mode: Items -->
        <template v-else>
           <div class="px-2 pb-1">
             <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5">
               {{ modeLabel }}
             </div>
          </div>
          
          <div v-for="(item, index) in filteredItems" :key="item.id">
            <!-- Special layout for Questions: Use QuestionCard -->
            <div v-if="currentMode === 'questions'" class="px-2 py-1">
              <QuestionCard 
                v-if="item.original"
                :question="item.original" 
                :show-question-number="false"
                :show-remove-buttons="false"
                card-class="hover:border-blue-500/50 cursor-pointer"
                @click="selectItem(item)"
              >
                 <template #footer>
                    <!-- Hide footer buttons by empty slot -->
                    <div />
                 </template>
              </QuestionCard>
            </div>

            <!-- Standard List Item for other types -->
            <button
              v-else
              class="w-full text-left px-4 py-2 flex items-center gap-3 transition-colors duration-150"
              :class="index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'"
              @click="selectItem(item)"
              @mouseenter="selectedIndex = index"
            >
              <!-- Icon -->
              <div 
                class="w-4 h-4 icon-mask shrink-0"
                :class="item.type === 'document' ? 'bg-blue-500' : (item.type === 'tag' ? 'bg-purple-500' : 'bg-gray-500')"
                :style="iconStyle(item.icon)"
              />
              
              <!-- Text Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-[13px] text-gray-700 font-medium truncate">
                    {{ item.label }}
                  </span>
                </div>
                <!-- Description line for search actions -->
                <div v-if="item.isSearchAction" class="text-[11px] text-blue-500 mt-0.5">
                  {{ item.desc }}
                </div>
              </div>
              
               <!-- Tag/Desc (Right Aligned like reference) -->
              <div v-if="item.desc && !item.isSearchAction" class="shrink-0 text-[11px] text-gray-400">
                 {{ item.type === 'document' ? 'PDF' : (item.type === 'tag' ? 'Tag' : '') }}
              </div>
            </button>
          </div>
          
          <!-- Empty State -->
          <div v-if="filteredItems.length === 0 && !loading" class="px-4 py-8 text-center text-gray-400 text-sm">
            <div class="mb-2 opacity-50">
              <div class="w-8 h-8 mx-auto icon-mask bg-current" :style="iconStyle(magnifyingGlassIcon)" />
            </div>
            No results found
          </div>
        </template>
        
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { docService, questionService, pastPaperService } from '@/services' // Ensure pastPaperService is exported in index.js or import directly
// Note: If pastPaperService is not in index.js, import it directly:
// import pastPaperService from '@/services/PastPaperService'

import brainIcon from '@/assets/Icon/brain.head.profile.svg'
import folderIcon from '@/assets/Icon/folder.svg'
import docIcon from '@/assets/Icon/text.document.fill.svg'
import paperIcon from '@/assets/Icon/document.on.document.svg'
import tagIcon from '@/assets/Icon/tag.svg'
import chevronRightIcon from '@/assets/Icon/chevron.right.svg'
import chevronLeftIcon from '@/assets/Icon/chevron.left.svg'
import magnifyingGlassIcon from '@/assets/Icon/magnifyingglass.svg'

const props = defineProps({
  visible: Boolean,
  filterText: {
    type: String,
    default: ''
  },
  subjectInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['select', 'close'])

// State
const currentMode = ref('root') // 'root' | 'files' | 'tags' | 'papers'
const items = ref([])
const selectedIndex = ref(0)
const loading = ref(false)
const listRef = ref(null)

import questionIcon from '@/assets/Icon/questionmark.circle.svg'

import QuestionCard from '@/views/Library/Page/QuestionCard.vue'

// Assets map
const backIcon = chevronLeftIcon

// Categories configuration
const categories = [
  { id: 'documents', label: 'Documents', desc: 'Browse documents', icon: docIcon },
  { id: 'questions', label: 'Questions', desc: 'Browse questions', icon: questionIcon },
  { id: 'tags', label: 'Tags', desc: 'Knowledge points', icon: tagIcon }
]

const modeLabel = computed(() => {
  switch (currentMode.value) {
    case 'documents': return 'Documents'
    case 'questions': return 'Questions'
    case 'tags': return 'Tags'
    default: return 'Suggested'
  }
})

const filteredItems = computed(() => {
  if (currentMode.value === 'root') {
    if (!props.filterText) return categories
    
    // If filtering in root, show "Search in..." options
    return categories.map(cat => ({
      id: cat.id,
      label: `Search in ${cat.label}`,
      desc: `Find "${props.filterText}" in ${cat.label}`,
      icon: cat.icon,
      isSearchAction: true
    }))
  }
  
  if (!props.filterText) return items.value
  
  const query = props.filterText.toLowerCase()
  return items.value.filter(item => 
    item.label.toLowerCase().includes(query) || 
    (item.desc && item.desc.toLowerCase().includes(query))
  )
})

const iconStyle = (icon) => ({
  '-webkit-mask-image': `url(${icon})`
})

// Data Fetching
const fetchData = async (mode) => {
  if (!props.subjectInfo.subject) return
  
  loading.value = true
  items.value = []
  
  try {
    const params = { ...props.subjectInfo, pageIndex: 1, pageSize: 50 }
    
    if (mode === 'documents') {
      const res = await docService.getDocList(params)
      if (res?.successful) {
        items.value = (res.data?.records || res.data?.list || []).map(doc => ({
          id: `doc_${doc.id}`,
          type: 'document',
          label: doc.title || doc.fileName,
          desc: `${doc.subject || 'Document'} • ${(doc.fileSize / 1024 / 1024).toFixed(2)}MB`,
          icon: docIcon,
          original: doc
        }))
      }
    } else if (mode === 'questions') {
      // Fetch Questions
      const res = await questionService.getList(params)
      if (res) { // getList returns data directly
         const list = res.records || res.list || []
         items.value = list.map(q => ({
           id: `q_${q.id}`,
           type: 'question',
           label: q.title || (q.content ? q.content.substring(0, 50) + '...' : 'Question'),
           desc: `${q.questionType || 'Question'} • ${q.difficulty || 'Normal'}`,
           icon: questionIcon,
           original: q
         }))
      }
    } else if (mode === 'tags') {
      // Fetch Tags (formerly Papers, now using knowledge points or tags API)
      const kpList = await questionService.getFilterOptions('knowledgePoint', params)
      if (kpList) {
         items.value = kpList.map((kp, idx) => ({
           id: `tag_${idx}`,
           type: 'tag',
           label: kp,
           desc: 'Knowledge Point',
           icon: tagIcon,
           original: kp
         }))
      }
    }
  } catch (err) {
    console.error(`Failed to fetch ${mode}:`, err)
  } finally {
    loading.value = false
    selectedIndex.value = 0
  }
}

// Actions
const enterCategory = (mode) => {
  currentMode.value = mode
  fetchData(mode)
}

const selectItem = (item) => {
  emit('select', item)
  // Optional: Reset mode after selection? 
  // For now keep it simple, parent handles closing
}

// Watchers
watch(() => props.visible, (val) => {
  if (val) {
    currentMode.value = 'root'
    selectedIndex.value = 0
  }
})

watch(() => props.filterText, (newText, oldText) => {
  if (!props.visible) return
  
  // If user deletes all text, maybe go back to root?
  // Only if they were in a category and cleared filter? 
  // Actually, usually filter applies to current list.
  // If we want to support "Back" via backspace, we need to handle that in ChatInput.
  
  // Here we just re-filter the local list (client-side filtering for responsiveness)
  selectedIndex.value = 0
})

// Public Methods
const handleKeydown = (e) => {
  if (!props.visible) return false
  
  const list = currentMode.value === 'root' ? categories : filteredItems.value
  if (list.length === 0) return false
  
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + list.length) % list.length
    return true
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % list.length
    return true
  }
  if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    if (currentMode.value === 'root') {
      enterCategory(list[selectedIndex.value].id)
    } else {
      selectItem(list[selectedIndex.value])
    }
    return true
  }
  if (e.key === 'Escape') {
    e.preventDefault()
    if (currentMode.value !== 'root') {
      currentMode.value = 'root'
    } else {
      emit('close')
    }
    return true
  }
  // Backspace to go back
  if (e.key === 'Backspace' && props.filterText === '' && currentMode.value !== 'root') {
     e.preventDefault()
     currentMode.value = 'root'
     return true
  }
  
  return false
}

defineExpose({
  handleKeydown
})
</script>
