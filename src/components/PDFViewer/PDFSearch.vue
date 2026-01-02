<template>
  <div 
    v-if="isVisible"
    class="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
    :class="{ 'translate-y-24 opacity-0': !isVisible, 'translate-y-0 opacity-100': isVisible }"
  >
    <div class="flex items-center gap-2 p-2 pr-3 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 rounded-full">
      <!-- 搜索输入框 -->
      <input 
        ref="inputRef"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        @keydown.enter="$emit('find-next')"
        @keydown.esc="$emit('close')"
        type="text"
        placeholder="Search in PDF..."
        class="w-64 px-4 py-1.5 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
      />
      
      <!-- 搜索结果计数 -->
      <div v-if="searchQuery && totalMatches > 0" class="text-xs text-gray-500 whitespace-nowrap">
        {{ currentMatch + 1 }} / {{ totalMatches }}
      </div>
      <div v-else-if="searchQuery && totalMatches === 0 && !isSearching" class="text-xs text-gray-400">
        No results
      </div>
      
      <!-- 上一个 -->
      <button 
        @click="$emit('find-prev')"
        :disabled="totalMatches === 0"
        class="p-1.5 hover:bg-black/5 rounded-full active:scale-95 transition-all disabled:opacity-30"
        title="Previous (Shift+Enter)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
      
      <!-- 下一个 -->
      <button 
        @click="$emit('find-next')"
        :disabled="totalMatches === 0"
        class="p-1.5 hover:bg-black/5 rounded-full active:scale-95 transition-all disabled:opacity-30"
        title="Next (Enter)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      
      <!-- 关闭搜索 -->
      <button 
        @click="$emit('close')"
        class="p-1.5 hover:bg-black/5 rounded-full active:scale-95 transition-all"
        title="Close (Esc)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  searchQuery: String,
  currentMatch: Number,
  totalMatches: Number,
  isSearching: Boolean
})

defineEmits(['update:searchQuery', 'find-next', 'find-prev', 'close'])

const inputRef = ref(null)

watch(() => props.isVisible, async (val) => {
  if (val) {
    await nextTick()
    inputRef.value?.focus()
  }
})
</script>
