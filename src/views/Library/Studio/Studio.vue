<template>
  <div class="h-full flex flex-col bg-transparent overflow-hidden relative">
    <!-- 拖拽调整区域 (左侧) -->
    <div 
      class="absolute left-0 top-0 bottom-0 w-4 cursor-col-resize z-50 flex items-center justify-center group"
      @mousedown="startResize"
      title="Drag to resize"
    >
      <!-- Apple 风格极简手柄 -->
      <div class="w-1 h-8 bg-gray-300 rounded-full group-hover:bg-gray-400 group-hover:w-1.5 transition-all duration-200"></div>
    </div>

    <!-- Header -->
    <div class="h-[52px] flex items-center justify-between px-5 border-b border-gray-200/60 bg-white/50 backdrop-blur-md flex-shrink-0 pl-6">
      <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">Studio</h2>
      <button 
        @click="$emit('close')"
        class="p-2 hover:bg-gray-200/60 rounded-lg transition-all duration-200 active:scale-95 group"
        title="Hide Studio"
      >
        <div 
          class="w-[18px] h-[18px] bg-gray-500 group-hover:bg-gray-800 transition-colors icon-mask"
          :style="{ maskImage: `url(${sidebarIcon})`, WebkitMaskImage: `url(${sidebarIcon})` }"
        ></div>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
      <!-- Section: Output -->
      <div class="mb-8">
        
        <!-- Cards Grid -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Flashcard -->
          <button
            @click="selectTool('flashcard')"
            class="group relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            :class="selectedTool === 'flashcard' 
              ? 'bg-rose-50/80 border-rose-200/60 ring-1 ring-rose-200' 
              : 'bg-rose-50/40 border-rose-100/60 hover:bg-rose-50/60 hover:border-rose-200/50'"
          >
            <div class="flex items-center justify-between w-full mb-3">
              <div 
                class="w-6 h-6 bg-rose-900/80 icon-mask transition-transform group-hover:scale-110 duration-300"
                :style="{ maskImage: `url(${flashcardIcon})`, WebkitMaskImage: `url(${flashcardIcon})` }"
              ></div>
            </div>
            <h4 class="text-[13px] font-bold text-rose-900/90 leading-tight">Flashcard</h4>
          </button>

          <!-- Test -->
          <button
            @click="selectTool('test')"
            class="group relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            :class="selectedTool === 'test' 
              ? 'bg-emerald-50/80 border-emerald-200/60 ring-1 ring-emerald-200' 
              : 'bg-emerald-50/40 border-emerald-100/60 hover:bg-emerald-50/60 hover:border-emerald-200/50'"
          >
            <div class="flex items-center justify-between w-full mb-3">
              <div 
                class="w-6 h-6 bg-emerald-900/80 icon-mask transition-transform group-hover:scale-110 duration-300"
                :style="{ maskImage: `url(${testIcon})`, WebkitMaskImage: `url(${testIcon})` }"
              ></div>
            </div>
            <h4 class="text-[13px] font-bold text-emerald-900/90 leading-tight">Test</h4>
          </button>

          <!-- Mind Map -->
          <button
            @click="selectTool('mindmap')"
            class="group relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            :class="selectedTool === 'mindmap' 
              ? 'bg-purple-50/80 border-purple-200/60 ring-1 ring-purple-200' 
              : 'bg-purple-50/40 border-purple-100/60 hover:bg-purple-50/60 hover:border-purple-200/50'"
          >
            <div class="flex items-center justify-between w-full mb-3">
              <div 
                class="w-6 h-6 bg-purple-900/80 icon-mask transition-transform group-hover:scale-110 duration-300"
                :style="{ maskImage: `url(${mindmapIcon})`, WebkitMaskImage: `url(${mindmapIcon})` }"
              ></div>
            </div>
            <h4 class="text-[13px] font-bold text-purple-900/90 leading-tight">Mind Map</h4>
          </button>

          <!-- Generate Paper -->
          <button
            @click="selectTool('paper')"
            class="group relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            :class="selectedTool === 'paper' 
              ? 'bg-amber-50/80 border-amber-200/60 ring-1 ring-amber-200' 
              : 'bg-amber-50/40 border-amber-100/60 hover:bg-amber-50/60 hover:border-amber-200/50'"
          >
            <div class="flex items-center justify-between w-full mb-3">
              <div 
                class="w-6 h-6 bg-amber-900/80 icon-mask transition-transform group-hover:scale-110 duration-300"
                :style="{ maskImage: `url(${paperIcon})`, WebkitMaskImage: `url(${paperIcon})` }"
              ></div>
            </div>
            <h4 class="text-[13px] font-bold text-amber-900/90 leading-tight">Paper Builder</h4>
          </button>
        </div>
      </div>

      <!-- Output Section -->
      <div class="pt-6 border-t border-gray-100/60">
        <div v-if="!selectedTool" class="text-center py-24 flex flex-col items-center justify-center opacity-60">
          <h3 class="text-[15px] font-semibold text-gray-900 mb-2">No outputs yet</h3>
          <p class="text-[13px] text-gray-500 max-w-[200px] leading-relaxed">
            Select a card above to generate content, or add notes
          </p>
        </div>
        
        <!-- 这里将来放置具体工具的UI -->
        <div v-else class="py-4">
           <!-- Tool Specific UI -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import flashcardIcon from '@/assets/Icon/square.3.layers.3d.svg'
import testIcon from '@/assets/Icon/questionmark.app.svg'
import mindmapIcon from '@/assets/Icon/app.connected.to.app.below.fill.svg'
import paperIcon from '@/assets/Icon/document.fill.svg'
import sidebarIcon from '@/assets/Icon/sidebar.squares.right.svg'
import folderIcon from '@/assets/Icon/folder.svg'

const emit = defineEmits(['close', 'resize', 'resizing'])

const selectedTool = ref(null)

// 拖拽相关逻辑
const minWidth = 320
const maxWidth = 600
const isResizing = ref(false)
let startX = 0
let startWidth = 0

const props = defineProps({
  width: {
    type: Number,
    default: 400
  }
})

const startResize = (e) => {
  isResizing.value = true
  startX = e.clientX
  startWidth = props.width
  emit('resizing', true)
  
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  
  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
}

const handleResize = (e) => {
  if (!isResizing.value) return
  
  // 计算偏移量：向左拖动是增加宽度
  const deltaX = startX - e.clientX
  const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX))
  
  emit('resize', newWidth)
}

const stopResize = () => {
  isResizing.value = false
  emit('resizing', false)
  
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
}

const selectTool = (tool) => {
  selectedTool.value = tool
  console.log('Selected tool:', tool)
  // TODO: Implement tool-specific functionality
}

onUnmounted(() => {
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
/* Custom scrollbar optimized for macOS feel */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.8);
}
</style>
