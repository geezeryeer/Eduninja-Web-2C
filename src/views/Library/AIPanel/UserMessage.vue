<template>
  <div class="flex justify-end">
    <div class="max-w-sm">
      <!-- 纯文字消息 -->
      <div v-if="messageType === 'text'" class="btn-primary px-4 py-2 rounded-2xl">
        <p class="text-sm leading-relaxed">{{ content }}</p>
      </div>

      <!-- 图片消息 -->
      <div v-else-if="messageType === 'image'" class="space-y-2">
        <!-- 图片（放在上面） -->
        <div class="rounded-2xl overflow-hidden">
          <img 
            :src="imageUrl" 
            :alt="content || 'Uploaded image'"
            class="w-full h-auto max-h-64 object-contain cursor-pointer hover:opacity-95 transition-opacity"
            @click="openImageViewer"
          />
        </div>
        <!-- 如果有文字说明（放在下面） -->
        <div v-if="content" class="btn-primary px-4 py-2 rounded-2xl">
          <p class="text-sm leading-relaxed">{{ content }}</p>
        </div>
      </div>

      <!-- 文件消息 -->
      <div v-else-if="messageType === 'file'" class="space-y-2">
        <!-- 如果有文字说明 -->
        <div v-if="content" class="btn-primary px-4 py-2 rounded-2xl">
          <p class="text-sm leading-relaxed">{{ content }}</p>
        </div>
        <!-- 文件卡片 -->
        <div class="btn-primary px-4 py-3 rounded-2xl flex items-center gap-3">
          <!-- 文件图标 -->
          <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <!-- 文件信息 -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ fileName }}</p>
            <p class="text-xs text-white/70">{{ fileSize }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  fileSize: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['open-image'])

// 判断消息类型
const messageType = computed(() => {
  if (props.imageUrl) return 'image'
  if (props.fileUrl) return 'file'
  return 'text'
})

// 打开图片查看器
const openImageViewer = () => {
  emit('open-image', props.imageUrl)
}
</script>

<style scoped>
/* 继承全局 btn-primary 样式 */
</style>

