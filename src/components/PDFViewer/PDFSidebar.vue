<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="-ml-48 opacity-0"
    enter-to-class="ml-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="ml-0 opacity-100"
    leave-to-class="-ml-48 opacity-0"
  >
    <div 
      ref="containerRef"
      v-show="isOpen"
      class="w-48 bg-gray-50 border-r border-gray-200 flex-shrink-0 flex flex-col sidebar-scroll-container overflow-y-auto custom-scrollbar z-40"
    >
      <div class="p-4 space-y-4">
        <div 
          v-for="pageNum in totalPages" 
          :key="`thumb-${pageNum}`"
          class="cursor-pointer group relative flex flex-col items-center"
          @click="$emit('page-click', pageNum)"
        >
           <div 
             class="relative w-full transition-all duration-200 p-1 rounded-lg"
             :class="currentPage === pageNum ? 'bg-blue-100 ring-2 ring-blue-500 ring-offset-1' : 'hover:bg-gray-200'"
           >
             <!-- 缩略图 Canvas -->
             <canvas 
               :ref="el => setThumbRef(el, pageNum)" 
               class="w-full block bg-white shadow-sm rounded border border-gray-200" 
             />
           </div>
           <span 
             class="text-xs mt-1 font-medium transition-colors"
             :class="currentPage === pageNum ? 'text-blue-600' : 'text-gray-500'"
           >
             {{ pageNum }}
           </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted, onMounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  totalPages: { type: Number, default: 0 },
  currentPage: { type: Number, default: 1 },
  pdfDocument: { type: Object, default: null }
})

const emit = defineEmits(['page-click'])

const thumbRefs = ref(new Map())
const sidebarObserver = ref(null)
const containerRef = ref(null)

const setThumbRef = (el, pageNum) => {
  if (el) thumbRefs.value.set(pageNum, el)
  else thumbRefs.value.delete(pageNum)
  
  // 如果侧边栏打开且观察器已设置，观察新元素
  if (el && props.isOpen && sidebarObserver.value) {
    sidebarObserver.value.observe(el)
  }
}

const setupSidebarObserver = () => {
  if (sidebarObserver.value) sidebarObserver.value.disconnect()
  
  // 确保容器存在
  if (!containerRef.value) return

  sidebarObserver.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const canvas = entry.target
        // 查找对应的 pageNum
        for (const [pageNum, el] of thumbRefs.value.entries()) {
          if (el === canvas) {
            renderThumbnail(pageNum, canvas)
            sidebarObserver.value.unobserve(canvas) // 渲染后停止观察
            break
          }
        }
      }
    })
  }, {
    root: containerRef.value, // 使用 ref 作为 root
    rootMargin: '100px', // 提前加载
    threshold: 0.1
  })
  
  // 观察所有已存在的缩略图 canvas
  thumbRefs.value.forEach(el => sidebarObserver.value.observe(el))
}

const renderThumbnail = async (pageNum, canvas) => {
  if (!props.pdfDocument || !canvas) return
  
  // 检查是否已经渲染过
  if (canvas.width > 0 && canvas.getAttribute('data-rendered')) return

  try {
    const page = await props.pdfDocument.getPage(pageNum)
    const viewport = page.getViewport({ scale: 0.2 }) // 缩略图比例 0.2
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = viewport.width * dpr
    canvas.height = viewport.height * dpr
    canvas.style.width = '100%' // CSS 宽度由容器决定
    // 保持宽高比
    canvas.style.aspectRatio = `${viewport.width}/${viewport.height}`
    
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    
    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise
    
    canvas.setAttribute('data-rendered', 'true')
  } catch (err) {
    console.warn(`Thumbnail ${pageNum} render error`, err)
  }
}

// 监听 isOpen 变化来启动观察器
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => setupSidebarObserver())
  } else {
    sidebarObserver.value?.disconnect()
  }
})

// 监听 PDF 文档加载完成，如果侧边栏也是打开的，需要初始化
watch(() => props.pdfDocument, (newDoc) => {
  if (newDoc && props.isOpen) {
    nextTick(() => setupSidebarObserver())
  }
})

// 监听 totalPages 变化重置 refs
watch(() => props.totalPages, () => {
  thumbRefs.value.clear()
})

onMounted(() => {
  if (props.isOpen) {
    // 延迟一点以确保 transition 动画开始/结束，或者 DOM 就绪
    nextTick(() => setupSidebarObserver())
  }
})

onUnmounted(() => {
  sidebarObserver.value?.disconnect()
})
</script>
