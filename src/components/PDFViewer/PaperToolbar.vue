<template>
  <div 
    class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 flex items-center gap-3"
    :class="{ 'translate-y-24 opacity-0': !showControls, 'translate-y-0 opacity-100': showControls }"
  >
    <!-- 左侧：侧边栏独立按钮 -->
    <button 
      @click="$emit('toggle-sidebar')"
      class="p-3 bg-white/90 backdrop-blur-xl shadow-lg border border-white/20 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all"
      :class="{ 'ring-2 ring-blue-100': showSidebar }"
      title="Toggle Sidebar"
    >
      <div 
        class="w-5 h-5 icon-mask transition-colors"
        :class="showSidebar ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-900'"
        :style="{ '-webkit-mask-image': `url(${SidebarIcon})` }"
      ></div>
    </button>

    <!-- 主工具栏 -->
    <div class="flex items-center p-1.5 pl-3 pr-4 bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 rounded-full text-gray-700">
      
      <!-- 中间：核心切换器 -->
      <div v-if="hasMultipleOptions" class="flex items-center bg-gray-100 rounded-full p-1 mx-2">
        <button 
          v-if="hasPaper"
          @click="$emit('switch-mode', 'paper')"
          class="px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 min-w-[64px]"
          :class="currentMode === 'paper' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'"
        >
          Paper
        </button>
        <button 
          v-if="hasAnswer"
          @click="$emit('switch-mode', 'answer')"
          class="px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 min-w-[64px]"
          :class="currentMode === 'answer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'"
        >
          Answer
        </button>
        <button 
          v-if="hasAttachment"
          @click="$emit('switch-mode', 'attachment')"
          class="px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 min-w-[64px]"
          :class="currentMode === 'attachment' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'"
        >
          Data
        </button>
      </div>

      <!-- 单一选项时的标题 -->
      <div v-else class="px-4 text-xs font-semibold text-gray-700">
        {{ currentMode === 'paper' ? 'Paper' : (currentMode === 'answer' ? 'Answer' : 'Resource') }}
      </div>

      <!-- 分隔线 -->
      <div class="w-px h-4 bg-gray-200 mx-1"></div>

      <!-- 页码显示 - 优化后的高级样式 -->
      <div class="ml-2 px-3 py-1 bg-gray-50/80 rounded-full border border-gray-200/60 flex items-center gap-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] min-w-[70px] justify-center">
        <span class="text-xs font-bold text-gray-900 tabular-nums tracking-tight">{{ currentPage }}</span>
        <span class="text-[10px] font-medium text-gray-400 select-none">/</span>
        <span class="text-xs font-medium text-gray-500 tabular-nums tracking-tight">{{ totalPages }}</span>
      </div>
    </div>

    <!-- 右侧独立功能按钮组 -->
    <div class="flex items-center gap-2">
      <!-- 搜索 -->
      <button 
        @click="$emit('toggle-search')"
        class="p-3 bg-white/90 backdrop-blur-xl shadow-lg border border-white/20 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all"
        :class="{ 'ring-2 ring-blue-100': showSearch }"
        title="Search"
      >
        <div 
          class="w-5 h-5 icon-mask transition-colors"
          :class="showSearch ? 'bg-gray-900' : 'bg-gray-600 hover:bg-gray-900'"
          :style="{ '-webkit-mask-image': `url(${SearchIcon})` }"
        ></div>
      </button>

      <!-- 下载 -->
      <button
        @click="$emit('download')"
        class="p-3 bg-white/90 backdrop-blur-xl shadow-lg border border-white/20 rounded-full hover:bg-white hover:scale-105 active:scale-95 transition-all group"
        title="Download"
      >
        <div 
          class="w-5 h-6 icon-mask bg-gray-600 group-hover:bg-gray-900 transition-colors"
          :style="{ '-webkit-mask-image': `url(${DownloadIcon})` }"
        ></div>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import DownloadIcon from '@/assets/Icon/square.and.arrow.down.svg'
import SearchIcon from '@/assets/Icon/magnifyingglass.svg'
import SidebarIcon from '@/assets/Icon/sidebar.left.svg'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  showControls: Boolean,
  showSidebar: Boolean,
  showSearch: Boolean,
  
  // 资源状态
  hasPaper: Boolean,
  hasAnswer: Boolean,
  hasAttachment: Boolean,
  
  // 当前模式
  currentMode: {
    type: String, // 'paper' | 'answer' | 'attachment'
    default: 'paper'
  }
})

defineEmits([
  'toggle-search', 
  'toggle-sidebar',
  'download',
  'switch-mode'
])

const hasMultipleOptions = computed(() => {
  return [props.hasPaper, props.hasAnswer, props.hasAttachment].filter(Boolean).length > 1
})
</script>