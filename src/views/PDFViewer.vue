<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-[100] bg-black bg-opacity-90"
    @click="closeViewer"
  >
    <div 
      class="w-full h-full bg-white flex flex-col"
      @click.stop
    >
      <!-- 顶部工具栏 -->
      <div class="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div class="flex items-center space-x-4">
          <!-- 缩放控制 -->
          <div class="flex items-center space-x-2">
            <button 
              @click="zoomOut"
              class="p-2 hover:bg-gray-200 rounded"
              :disabled="scale <= 0.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            
            <span class="text-sm font-medium min-w-16 text-center">
              {{ Math.round(scale * 100) }}%
            </span>
            
            <button 
              @click="zoomIn"
              class="p-2 hover:bg-gray-200 rounded"
              :disabled="scale >= 3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
            
            <button 
              @click="fitToWidth"
              class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              适合宽度
            </button>
          </div>
          
          <!-- 页面信息 -->
          <div v-if="totalPages > 0" class="text-sm text-gray-600">
            共 {{ totalPages }} 页
          </div>
        </div>
        
        <!-- 关闭按钮 -->
        <button 
          @click="closeViewer"
          class="p-2 hover:bg-gray-200 rounded-full"
          title="关闭 (按 Esc)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- PDF内容区域 -->
      <div ref="scrollContainer" class="flex-1 overflow-auto bg-gray-100">
        <!-- PDF.js渲染方案 - 保护下载权限 -->
        <div v-if="pdfDocument" class="flex flex-col items-center py-8 space-y-4">
          
          <div 
            v-for="pageNum in renderedPages" 
            :key="`page-${pageNum}`"
            class="bg-white shadow-md rounded-lg overflow-hidden mb-4"
            :style="{ width: `${pageWidth}px` }"
          >
            <canvas 
              :ref="el => setPageRef(el, pageNum)"
              class="w-full block"
            />
          </div>
          
          <!-- 加载状态提示 -->
          <div v-if="renderedPages < totalPages && isLoadingMore" class="mt-8 text-center py-6">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-else-if="isLoading" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p class="text-gray-600 mt-4">正在加载PDF...</p>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">无法加载PDF</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button 
              @click="loadPDF"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重试
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">没有PDF文档</h3>
            <p class="text-gray-600">请选择一个PDF文档进行查看</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

// PDF.js 实例管理 - 使用完全隔离的方式
let pdfJSInstance = null

// 使用CDN版本的PDF.js完全避开Vite模块处理
const createPDFJSInstance = async () => {
  console.log('🔄 开始创建CDN版PDF.js实例...')
  
  try {
    // 强制清理旧的PDF.js实例，避免版本冲突
    if (window.pdfjsLib) {
      console.log('🧹 清理旧的PDF.js实例')
      delete window.pdfjsLib
    }
    
    // 清理可能存在的旧脚本标签
    const oldScripts = document.querySelectorAll('script[src*="pdf.min.js"]')
    oldScripts.forEach(script => {
      console.log('🧹 移除旧的PDF.js脚本标签')
      script.remove()
    })
    
    console.log('🔄 动态加载CDN PDF.js...')
    
    // 动态加载CDN版本的PDF.js - 使用更稳定的旧版本
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js'
    
    const loadPromise = new Promise((resolve, reject) => {
      script.onload = () => {
        console.log('✅ CDN PDF.js脚本加载成功')
        
        if (window.pdfjsLib) {
          // 设置worker路径 - 使用对应版本的worker
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js'
          
          console.log('📋 CDN PDF.js实例信息:', {
            version: window.pdfjsLib.version,
            getDocument: typeof window.pdfjsLib.getDocument,
            workerSrc: window.pdfjsLib.GlobalWorkerOptions.workerSrc
          })
          
          // 验证版本是否正确
          if (window.pdfjsLib.version && window.pdfjsLib.version.startsWith('2.11')) {
            console.log('✅ PDF.js版本验证通过:', window.pdfjsLib.version)
          } else {
            console.warn('⚠️ PDF.js版本可能不匹配:', window.pdfjsLib.version)
          }
          
          resolve(window.pdfjsLib)
        } else {
          reject(new Error('PDF.js未正确加载到window.pdfjsLib'))
        }

      }
      
      script.onerror = () => {
        reject(new Error('CDN PDF.js脚本加载失败'))
      }
    })
    
    // 添加脚本到页面
    document.head.appendChild(script)
    
    // 等待加载完成
    const pdfjs = await loadPromise
    console.log('✅ CDN PDF.js实例创建完成')
    
    return pdfjs
    
  } catch (error) {
    console.error('❌ CDN PDF.js实例创建失败:')
    console.error('📋 错误详情:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    
    // 如果CDN失败，回退到本地版本
    console.log('🔄 CDN失败，尝试回退到本地版本...')
    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js'
      console.log('✅ 本地PDF.js回退成功')
      return pdfjs
    } catch (fallbackError) {
      console.error('❌ 本地PDF.js回退也失败:', fallbackError.message)
      throw new Error(`PDF.js加载完全失败: ${error.message}`)
    }
  }
}

// 清理PDF.js实例
const cleanupPDFJSInstance = () => {
  pdfJSInstance = null
}

const props = defineProps({
  document: { type: Object, default: null },
  isVisible: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const isLoading = ref(false)
const error = ref(null)
const pdfDocument = ref(null)
const totalPages = ref(0)
const scale = ref(1.2)
const pageWidth = ref(800)
const pageRefs = ref(new Map())
const renderedPages = ref(0) // 已渲染的页面数
const isLoadingMore = ref(false) // 是否正在加载更多页面
const scrollContainer = ref(null) // 滚动容器引用

// helper: 从 props.document 中提取 pdf url
const getPDFUrl = () => {
  console.log('🔍 检查文档对象:', props.document)
  
  if (!props.document) {
    console.warn('⚠️ 没有文档对象')
    return null
  }
  
  // 检查各种可能的URL字段
  const url = props.document.fileUrl || props.document.pdfUrl || props.document.url ||
         (props.document.ossKey ? `https://cheese-test-public.oss-accelerate.aliyuncs.com/${props.document.ossKey}` : null)
  
  console.log('📄 提取的PDF URL:', url)
  console.log('📋 文档对象字段:', Object.keys(props.document))
  
  return url
}

// 当前加载任务引用，用于取消
let currentLoadingTask = null

const cleanupPDFDocument = () => {
  console.log('🧹 开始清理PDF文档资源...')
  
  // 取消当前加载任务
  if (currentLoadingTask) {
    try {
      currentLoadingTask.destroy()
      console.log('✅ 加载任务已取消')
    } catch (e) {
      console.warn('取消加载任务失败:', e)
    }
    currentLoadingTask = null
  }
  
  // 清理PDF文档
  if (pdfDocument.value) {
    try {
      pdfDocument.value.destroy()
      console.log('✅ PDF文档已销毁')
    } catch (e) {
      console.warn('清理PDF文档失败:', e)
    }
    pdfDocument.value = null
  }
  
  // 清理PDF.js实例
  cleanupPDFJSInstance()
  
  // 重置状态
  totalPages.value = 0
  pageRefs.value.clear()
  
  console.log('✅ PDF文档资源清理完成')
}

const loadPDF = async () => {
  const url = getPDFUrl()
  if (!url) {
    error.value = '文档链接无效'
    return
  }

  console.log('📥 开始加载 PDF：', url)
  isLoading.value = true
  error.value = null

  // 清理旧资源
  cleanupPDFDocument()

  try {
    // 使用PDF.js方案保护下载权限
    console.log('🔄 开始创建PDF.js实例...')
    pdfJSInstance = await createPDFJSInstance()
    console.log('✅ PDF.js 实例创建完成')
    console.log('📋 PDF.js实例详情:', {
      exists: !!pdfJSInstance,
      getDocument: typeof pdfJSInstance.getDocument,
      GlobalWorkerOptions: !!pdfJSInstance.GlobalWorkerOptions,
      workerSrc: pdfJSInstance.GlobalWorkerOptions?.workerSrc,
      version: pdfJSInstance.version
    })
    
    // 简化的PDF加载配置
    console.log('🔄 开始加载PDF文档...')
    currentLoadingTask = pdfJSInstance.getDocument(url)
    console.log('✅ 加载任务创建成功')
    
    currentLoadingTask.onProgress = (progress) => {
      if (progress.total > 0) {
        const percent = Math.round((progress.loaded / progress.total) * 100)
        console.log('📊 加载进度:', percent + '%')
      }
    }
    
    const pdf = await currentLoadingTask.promise
    console.log('✅ PDF 文档加载完成')
    console.log('📋 PDF文档详情:', {
      numPages: pdf.numPages,
      constructor: pdf.constructor?.name,
      type: typeof pdf,
      getPage: typeof pdf.getPage,
      prototype: Object.getPrototypeOf(pdf)?.constructor?.name
    })
    
    pdfDocument.value = pdf
    totalPages.value = pdf.numPages
    currentLoadingTask = null
    error.value = null

    console.log('🔄 等待DOM更新...')
    // 等待DOM更新
    await nextTick()
    await nextTick()
    
    console.log('🔄 开始渲染页面...')
    
    // 简化渲染策略：立即渲染前5页，其余通过按钮加载
    const initialPages = Math.min(totalPages.value, 5) // 立即渲染前5页
    
    console.log(`📋 立即渲染 ${initialPages} 页，总共 ${totalPages.value} 页`)
    
    let successCount = 0
    
    // 渲染前几页
    for (let pageNum = 1; pageNum <= initialPages; pageNum++) {
      console.log(`🔄 准备渲染页面 ${pageNum}/${initialPages}`)
      const success = await renderPage(pageNum)
      if (success) {
        successCount++
        console.log(`✅ 页面 ${pageNum} 渲染成功`)
      } else {
        console.warn(`⚠️ 页面 ${pageNum} 渲染失败，但继续处理其他页面`)
      }
    }
    
    console.log(`📊 渲染完成: ${successCount}/${initialPages} 页成功`)
    renderedPages.value = Math.max(successCount, initialPages)
    
    if (totalPages.value > initialPages) {
      console.log(`📋 剩余 ${totalPages.value - initialPages} 页可通过"加载更多"按钮加载`)
    }
    
    isLoading.value = false
    console.log('✅ PDF加载和渲染流程完成')
    
  } catch (err) {
    console.error('❌ PDF加载过程失败:')
    console.error('📋 错误详情:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      constructor: err.constructor?.name
    })
    console.error('📋 完整错误对象:', err)
    error.value = `PDF加载失败: ${err.message || String(err)}`
    isLoading.value = false
  }
}


const renderPage = async (pageNum) => {
  if (!pdfDocument.value) {
    console.error(`❌ PDF文档不存在，无法渲染页面 ${pageNum}`)
    return false
  }
  
  const canvas = pageRefs.value.get(pageNum)
  if (!canvas) {
    console.error(`❌ Canvas ${pageNum} 未找到`)
    return false
  }
  
  try {
    // 获取页面对象
    const page = await pdfDocument.value.getPage(pageNum)
    const context = canvas.getContext('2d')
    
    // 获取设备像素比，提高清晰度
    const devicePixelRatio = window.devicePixelRatio || 1
    const viewport = page.getViewport({ scale: scale.value * devicePixelRatio })
    
    // 设置canvas实际尺寸（高分辨率）
    canvas.width = viewport.width
    canvas.height = viewport.height
    
    // 设置canvas显示尺寸（CSS尺寸）
    canvas.style.width = `${viewport.width / devicePixelRatio}px`
    canvas.style.height = `${viewport.height / devicePixelRatio}px`
    
    if (pageNum === 1) {
      pageWidth.value = viewport.width / devicePixelRatio
    }

    // 清除画布
    context.clearRect(0, 0, viewport.width, viewport.height)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, viewport.width, viewport.height)

    // 渲染页面
    const renderTask = page.render({
      canvasContext: context,
      viewport: viewport
    })
    
    await renderTask.promise
    console.log(`✅ 页面 ${pageNum} 渲染完成`)
    
    return true
    
  } catch (error) {
    console.error(`❌ 页面 ${pageNum} 渲染失败: ${error.message}`)
    
    // 在canvas上显示错误信息
    const context = canvas.getContext('2d')
    if (context) {
      const devicePixelRatio = window.devicePixelRatio || 1
      context.fillStyle = '#f8f9fa'
      context.fillRect(0, 0, canvas.width || 400, canvas.height || 300)
      context.fillStyle = '#dc3545'
      context.font = `${16 * devicePixelRatio}px Arial`
      context.textAlign = 'center'
      context.fillText(`页面 ${pageNum} 加载失败`, (canvas.width || 400) / 2, (canvas.height || 300) / 2)
    }
    
    return false
  }
}

const rerenderPages = async () => {
  if (!pdfDocument.value) return
  for (let p = 1; p <= renderedPages.value; p++) {
    try { await renderPage(p) } catch(e){ console.warn('rerender fail', p, e) }
  }
}

// 加载更多页面
const loadMorePages = async () => {
  if (isLoadingMore.value || !pdfDocument.value) return
  
  const currentRendered = renderedPages.value
  const nextBatch = Math.min(totalPages.value, currentRendered + 5) // 每次加载5页
  
  if (currentRendered >= totalPages.value) {
    console.log('📋 所有页面已加载完成')
    return
  }
  
  isLoadingMore.value = true
  console.log(`🔄 加载更多页面: ${currentRendered + 1} 到 ${nextBatch}`)
  
  try {
    // 先更新renderedPages，让DOM创建新的canvas
    renderedPages.value = nextBatch
    
    // 等待DOM更新
    await nextTick()
    await nextTick()
    
    // 然后渲染新增的页面
    for (let pageNum = currentRendered + 1; pageNum <= nextBatch; pageNum++) {
      const success = await renderPage(pageNum)
      if (!success) {
        console.warn(`⚠️ 页面 ${pageNum} 渲染失败`)
      }
      
      // 每渲染一页后稍微延迟，避免阻塞UI
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`📊 加载完成: ${renderedPages.value}/${totalPages.value} 页`)
  } catch (error) {
    console.error('❌ 加载更多页面失败:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 滚动监听 - 自动加载更多
const handleScroll = () => {
  console.log('🔍 滚动事件触发')
  
  if (!scrollContainer.value) {
    console.log('❌ scrollContainer不存在')
    return
  }
  
  if (isLoadingMore.value) {
    console.log('⏳ 正在加载中，跳过')
    return
  }
  
  const currentRendered = renderedPages.value
  if (currentRendered >= totalPages.value) {
    console.log('✅ 所有页面已加载完成')
    return
  }
  
  const container = scrollContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  // 当滚动到距离底部300px时，自动加载更多
  const threshold = 300
  const distanceToBottom = scrollHeight - scrollTop - clientHeight
  
  console.log('📊 滚动信息:', {
    scrollTop,
    scrollHeight,
    clientHeight,
    distanceToBottom,
    threshold,
    shouldLoad: distanceToBottom <= threshold
  })
  
  if (distanceToBottom <= threshold) {
    console.log('📜 滚动接近底部，自动加载更多页面')
    loadMorePages()
  }
}

const setPageRef = (el, pageNum) => {
  if (el) {
    pageRefs.value.set(pageNum, el)
    console.log(`✅ Canvas ${pageNum} 已设置ref`)
  } else {
    pageRefs.value.delete(pageNum)
    console.log(`❌ Canvas ${pageNum} ref被删除`)
  }
}

// 缩放/控制（示例）
const zoomIn = async () => { scale.value = Math.min(3, scale.value + 0.25); await rerenderPages() }
const zoomOut = async () => { scale.value = Math.max(0.5, scale.value - 0.25); await rerenderPages() }
const fitToWidth = async () => { scale.value = 1.0; await rerenderPages() }

const closeViewer = () => {
  console.log('🔒 关闭PDF查看器')
  
  // 使用统一的清理函数
  cleanupPDFDocument()
  
  // 重置所有状态
  error.value = null
  isLoading.value = false
  scale.value = 1.2
  pageWidth.value = 800
  
  emit('close')
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (!props.isVisible) return
  
  switch (event.key) {
    case 'Escape':
      closeViewer()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
  }
}

watch(() => [props.document, props.isVisible], async ([doc, vis]) => {
  console.log('🔄 PDFViewer watch triggered:', { doc: !!doc, vis, docTitle: doc?.title })
  if (doc && vis) {
    console.log('✅ 条件满足，开始加载PDF')
    // 确保组件完全挂载后再加载PDF
    await nextTick()
    loadPDF()
  } else {
    console.log('❌ 条件不满足:', { hasDoc: !!doc, isVisible: vis })
    // 如果不可见，清理资源
    if (!vis) {
      cleanupPDFDocument()
    }
  }
}, { immediate: true })

// 键盘事件监听
watch(() => props.isVisible, (visible) => {
  if (visible) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

// 组件挂载时设置滚动监听
onMounted(() => {
  console.log('🔧 组件挂载，准备设置滚动监听')
  
  // 延迟设置滚动监听，确保DOM完全渲染
  setTimeout(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
      console.log('✅ 滚动监听已设置到:', scrollContainer.value)
      
      // 测试滚动容器
      console.log('📊 滚动容器信息:', {
        exists: !!scrollContainer.value,
        scrollHeight: scrollContainer.value.scrollHeight,
        clientHeight: scrollContainer.value.clientHeight,
        hasScrollbar: scrollContainer.value.scrollHeight > scrollContainer.value.clientHeight
      })
    } else {
      console.error('❌ scrollContainer.value 为空，无法设置滚动监听')
    }
  }, 1000) // 延迟1秒确保PDF加载完成
})

onUnmounted(() => {
  console.log('🧹 PDFViewer组件卸载，清理资源')
  document.removeEventListener('keydown', handleKeydown)
  
  // 清理滚动监听
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
  
  // 清理所有PDF相关资源
  cleanupPDFDocument()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 自定义滚动条 */
:deep(.overflow-auto::-webkit-scrollbar) {
  width: 8px;
}

:deep(.overflow-auto::-webkit-scrollbar-track) {
  background: #f3f4f6;
}

:deep(.overflow-auto::-webkit-scrollbar-thumb) {
  background: #d1d5db;
  border-radius: 4px;
}

:deep(.overflow-auto::-webkit-scrollbar-thumb:hover) {
  background: #9ca3af;
}
</style>
