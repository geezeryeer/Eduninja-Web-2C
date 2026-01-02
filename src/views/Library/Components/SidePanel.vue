<template>
  <div class="flex flex-col h-full bg-white/60 backdrop-blur-2xl overflow-hidden relative group border-l border-white/20">
    <!-- 拖拽手柄 -->
    <div 
      class="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 hover:bg-blue-500/20 transition-colors flex items-center justify-center"
      @mousedown.prevent="startResize"
    >
      <!-- 视觉指示器 -->
      <div class="w-1 h-8 rounded-full bg-gray-300/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>

    <!-- Header -->
    <div class="h-[52px] flex items-center justify-between px-4 border-b border-gray-200/50 flex-shrink-0 bg-white/40">
      <div class="flex items-center gap-2 overflow-hidden">
        <h3 class="text-[15px] font-semibold text-gray-900 truncate tracking-tight">{{ title }}</h3>
      </div>
      
      <!-- Header Actions Slot -->
      <div class="flex items-center gap-1">
        <slot name="actions"></slot>
        
        <!-- Default Close Button if showClose is true -->
        <button 
          v-if="showClose"
          @click="$emit('close')"
          class="p-2 hover:bg-black/5 rounded-lg transition-all active:scale-95 text-gray-500 hover:text-gray-900"
          title="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content Area (Scrollable) -->
    <div class="flex-1 overflow-y-auto custom-scrollbar relative">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  width: { type: Number, required: true },
  minWidth: { type: Number, default: 300 },
  maxWidth: { type: Number, default: 800 },
  showClose: { type: Boolean, default: false }
})

const emit = defineEmits(['update:width', 'close', 'resize-start', 'resize-end'])

// 简化的拖拽逻辑
const isResizing = ref(false)
let startX = 0
let startWidth = 0

const startResize = (e) => {
  isResizing.value = true
  startX = e.clientX
  startWidth = props.width
  
  emit('resize-start')
  
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  
  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
}

const handleResize = (e) => {
  if (!isResizing.value) return
  
  // 计算新宽度 (从左侧拖拽，鼠标左移宽度增加)
  const deltaX = startX - e.clientX
  const newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, startWidth + deltaX))
  
  emit('update:width', newWidth)
}

const stopResize = () => {
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  
  emit('resize-end')
}

onUnmounted(() => {
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
