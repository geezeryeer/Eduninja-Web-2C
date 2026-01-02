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

    <!-- 主工具栏：缩放 + 页码 -->
    <div class="flex items-center p-1.5 pl-2 pr-4 bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 rounded-full text-gray-700">
      
      <!-- 缩放控制 -->
      <div class="flex items-center gap-1 text-gray-600 px-2">
        <button 
          @click="$emit('zoom-out')"
          class="p-2 hover:bg-black/5 rounded-full active:scale-95 transition-all"
          :disabled="scale <= 0.5"
          title="Zoom Out"
        >
          <div class="w-4 h-4 icon-mask bg-gray-600" :style="{ '-webkit-mask-image': `url(${ZoomOutIcon})` }"></div>
        </button>
        <span class="text-[13px] font-semibold w-12 text-center tabular-nums">{{ Math.round(scale * 100) }}%</span>
        <button 
          @click="$emit('zoom-in')"
          class="p-2 hover:bg-black/5 rounded-full active:scale-95 transition-all"
          :disabled="scale >= 3"
          title="Zoom In"
        >
          <div class="w-4 h-4 icon-mask bg-gray-600" :style="{ '-webkit-mask-image': `url(${ZoomInIcon})` }"></div>
        </button>
      </div>

      <div class="w-px h-4 bg-gray-200 mx-1"></div>

      <!-- 页码控制 - 优化后的高级样式 -->
      <div class="ml-1 px-2.5 py-1 bg-gray-50/80 rounded-full border border-gray-200/60 flex items-center gap-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
        <input 
          type="number" 
          :value="currentPage"
          @input="$emit('update:currentPage', parseInt($event.target.value))"
          @keydown.enter="$emit('jump-to-page')"
          @blur="$emit('jump-to-page')"
          class="w-6 text-center bg-transparent text-xs font-bold text-gray-900 focus:outline-none p-0 border-none tabular-nums placeholder-gray-300"
          :min="1"
          :max="totalPages"
        />
        <span class="text-[10px] font-medium text-gray-400 select-none">/</span>
        <span class="text-xs font-medium text-gray-500 tabular-nums">{{ totalPages }}</span>
      </div>
    </div>

    <!-- 右侧独立按钮组：搜索、下载 -->
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
import DownloadIcon from '@/assets/Icon/square.and.arrow.down.svg'
import SearchIcon from '@/assets/Icon/magnifyingglass.svg'
import ZoomInIcon from '@/assets/Icon/plus.circle.svg'
import ZoomOutIcon from '@/assets/Icon/minus.circle.fill.svg'
import SidebarIcon from '@/assets/Icon/sidebar.left.svg'

defineProps({
  scale: Number,
  currentPage: Number,
  totalPages: Number,
  showControls: Boolean,
  showSidebar: Boolean,
  showSearch: Boolean
})

defineEmits([
  'zoom-in', 
  'zoom-out', 
  'update:currentPage', 
  'jump-to-page', 
  'toggle-search', 
  'toggle-sidebar',
  'download'
])
</script>