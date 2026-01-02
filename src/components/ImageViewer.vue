<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
        @click="close"
      >
        <!-- 顶部按钮组 -->
        <div class="absolute top-6 right-6 flex items-center gap-2 z-10">
          <!-- 下载按钮 -->
          <button
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-95"
            @click.stop="downloadImage"
            title="Download Image"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          
          <!-- 关闭按钮 -->
          <button
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-95"
            @click.stop="close"
            title="Close"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 图片容器 -->
        <div 
          class="w-full h-full flex items-center justify-center p-4"
          :class="{ 'overflow-auto': isZoomed }"
        >
          <Transition name="zoom" mode="out-in">
            <img
              v-if="currentImageUrl"
              :key="currentImageUrl"
              :src="currentImageUrl"
              :alt="alt"
              class="cursor-zoom-in transition-transform duration-300"
              :class="{ 
                'cursor-zoom-out': isZoomed,
                'max-w-full max-h-full object-contain': !isZoomed,
                'w-auto h-auto': isZoomed
              }"
              :style="isZoomed ? 'transform: scale(2); transform-origin: center center;' : ''"
              @click.stop="toggleZoom"
              @load="onImageLoad"
              @error="onImageError"
            />
          </Transition>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- 图片信息（可选） -->
        <div v-if="showInfo" class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm">
          {{ imageInfo }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Image'
  },
  showInfo: {
    type: Boolean,
    default: false
  },
  imageInfo: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'load', 'error'])

const isOpen = ref(false)
const isLoading = ref(false)
const isZoomed = ref(false)
const currentImageUrl = ref('')

// 打开查看器
const open = (url) => {
  currentImageUrl.value = url || props.imageUrl
  isOpen.value = true
  isLoading.value = true
  isZoomed.value = false
  document.body.style.overflow = 'hidden'
}

// 关闭查看器
const close = () => {
  isOpen.value = false
  isZoomed.value = false
  document.body.style.overflow = ''
  emit('close')
}

// 切换缩放
const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

// 图片加载完成
const onImageLoad = () => {
  isLoading.value = false
  emit('load')
}

// 图片加载错误
const onImageError = () => {
  isLoading.value = false
  emit('error')
}

// 下载图片
const downloadImage = async () => {
  if (!currentImageUrl.value) return
  
  try {
    // 获取图片文件名
    const urlParts = currentImageUrl.value.split('/')
    const fileName = urlParts[urlParts.length - 1] || 'image.png'
    
    // 创建临时 a 标签下载
    const response = await fetch(currentImageUrl.value)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 释放 URL 对象
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    // 如果跨域下载失败，尝试直接打开图片让用户手动保存
    window.open(currentImageUrl.value, '_blank')
  }
}

// 监听 ESC 键关闭
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

// 生命周期
watch(() => isOpen.value, (newVal) => {
  if (newVal) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<style scoped>
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 缩放动画 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>

