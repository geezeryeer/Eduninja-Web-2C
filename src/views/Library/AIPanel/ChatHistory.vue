<template>
  <!-- 聊天历史侧边栏 -->
  <transition name="slide-left">
    <div
      v-if="isVisible"
      class="fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200 shadow-2xl flex flex-col"
    >
      <!-- 头部 - 高度 44px，带底部分割线 -->
      <div class="flex items-center justify-between px-3 h-[44px] border-b border-gray-200 bg-white z-10">
        <h3 class="text-[15px] font-semibold text-gray-900">Chat History</h3>
        <button
          @click="close"
          class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 搜索框 -->
      <div class="px-3 py-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm transition-all"
          />
          <svg
            class="absolute left-2.5 top-2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- 历史记录列表 -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <!-- 空状态 -->
        <div v-if="filteredChats.length === 0" class="flex flex-col items-center justify-center h-full text-center p-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <p class="text-gray-500 text-sm">No chat history yet</p>
        </div>

        <!-- 聊天记录列表 -->
        <div v-else class="p-2 space-y-1">
          <!-- 按日期分组 -->
          <div v-for="group in groupedChats" :key="group.date" class="mb-4">
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {{ group.label }}
            </div>
            <div
              v-for="chat in group.chats"
              :key="chat.id"
              @click="selectChat(chat)"
              class="group relative p-3 rounded-lg cursor-pointer transition-all duration-200"
              :class="selectedChatId === chat.id ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'"
            >
              <!-- 聊天预览 -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate mb-1">
                    {{ chat.title || 'Untitled Chat' }}
                  </h4>
                  <p class="text-xs text-gray-500 truncate">
                    {{ chat.preview }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatTime(chat.timestamp) }}
                  </p>
                </div>
                <!-- 删除按钮 -->
                <button
                  @click.stop="deleteChat(chat.id)"
                  class="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all"
                  title="Delete"
                >
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              <!-- 选中指示器 -->
              <div
                v-if="selectedChatId === chat.id"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <!-- 已移除 Clear All History 功能 -->
    </div>
  </transition>

  <!-- 背景遮罩 -->
  <transition name="fade">
    <div
      v-if="isVisible"
      @click="close"
      class="fixed inset-0 bg-black/20 z-40"
    ></div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentChatId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'select-chat', 'delete-chat'])

// 状态
const searchQuery = ref('')
const selectedChatId = ref(props.currentChatId)

// 模拟聊天历史数据（实际应该从 localStorage 或 API 获取）
const chatHistory = ref([
  {
    id: 1,
    title: 'Math Problem Discussion',
    preview: 'How do I solve quadratic equations?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messages: []
  },
  {
    id: 2,
    title: 'Physics Questions',
    preview: 'Explain Newton\'s laws of motion...',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    messages: []
  },
  {
    id: 3,
    title: 'Chemistry Help',
    preview: 'What is the periodic table?',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    messages: []
  },
  {
    id: 4,
    title: 'Biology Study',
    preview: 'Cell structure and function...',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    messages: []
  }
])

// 过滤聊天记录
const filteredChats = computed(() => {
  if (!searchQuery.value) return chatHistory.value
  
  const query = searchQuery.value.toLowerCase()
  return chatHistory.value.filter(chat => 
    chat.title.toLowerCase().includes(query) ||
    chat.preview.toLowerCase().includes(query)
  )
})

// 按日期分组
const groupedChats = computed(() => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  }
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  filteredChats.value.forEach(chat => {
    const chatDate = new Date(chat.timestamp)
    
    if (chatDate >= today) {
      groups.today.push(chat)
    } else if (chatDate >= yesterday) {
      groups.yesterday.push(chat)
    } else if (chatDate >= weekAgo) {
      groups.thisWeek.push(chat)
    } else {
      groups.older.push(chat)
    }
  })
  
  const result = []
  if (groups.today.length) result.push({ date: 'today', label: 'Today', chats: groups.today })
  if (groups.yesterday.length) result.push({ date: 'yesterday', label: 'Yesterday', chats: groups.yesterday })
  if (groups.thisWeek.length) result.push({ date: 'thisWeek', label: 'This Week', chats: groups.thisWeek })
  if (groups.older.length) result.push({ date: 'older', label: 'Older', chats: groups.older })
  
  return result
})

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  // 少于1小时
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return minutes <= 1 ? 'Just now' : `${minutes}m ago`
  }
  
  // 少于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}h ago`
  }
  
  // 显示具体时间
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 方法
const close = () => {
  emit('close')
}

const selectChat = (chat) => {
  selectedChatId.value = chat.id
  emit('select-chat', chat)
  close()
}

const deleteChat = (chatId) => {
  const index = chatHistory.value.findIndex(c => c.id === chatId)
  if (index > -1) {
    if (confirm('Are you sure you want to delete this conversation?')) {
      chatHistory.value.splice(index, 1)
      emit('delete-chat', chatId)
    }
  }
}

// 监听当前聊天ID变化
watch(() => props.currentChatId, (newId) => {
  selectedChatId.value = newId
})

// 暴露方法供父组件使用
defineExpose({
  chatHistory,
  addChat: (chat) => {
    chatHistory.value.unshift(chat)
  },
  updateChat: (chatId, updates) => {
    const chat = chatHistory.value.find(c => c.id === chatId)
    if (chat) {
      Object.assign(chat, updates)
    }
  }
})
</script>

<style scoped>
/* 滑动动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(100%);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 组件样式 */
</style>

