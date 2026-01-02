<template>
  <div v-if="isVisible" class="w-full h-full bg-gray-100 transition-all duration-300 relative z-10">
    <!-- Progress Bar -->
    <div v-if="isLoading && loadingProgress < 100" class="absolute top-0 left-0 h-0.5 bg-blue-500 z-50 transition-all" :style="{ width: `${loadingProgress}%` }"></div>

    <div ref="viewerContainer" class="w-full h-full flex flex-col relative bg-gray-100" @click.stop>
      <!-- Close Button -->
      <button @click="closeViewer" class="absolute top-6 right-6 z-50 p-2.5 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow-sm border border-gray-200 transition-all active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="flex-1 flex overflow-hidden relative w-full">
        <!-- Sidebar -->
        <PDFSidebar 
          :is-open="showSidebar"
          :total-pages="totalPages"
          :current-page="inputPage"
          :pdf-document="pdfDocument"
          @page-click="handleJump" 
        />

        <!-- Main Content -->
        <div ref="scrollContainer" class="flex-1 overflow-auto custom-scrollbar flex justify-center p-4 sm:p-8 bg-gray-100" @click.self="closeViewer">
        <div v-if="pdfDocument" class="flex flex-col items-center py-4 w-full">
          <div 
            v-for="pageNum in renderedPages" 
            :key="pageNum" 
            class="bg-white shadow-lg relative mb-8 shrink-0"
            :style="{ width: pageWidth ? `${pageWidth}px` : 'auto', minHeight: '800px' }"
          >
            <canvas :ref="el => setPageRef(el, pageNum)" class="block w-full h-auto" />
            <div :ref="el => setTextLayerRef(el, pageNum)" class="absolute top-0 left-0 w-full h-full"></div>
          </div>
          
          <div v-if="renderedPages < totalPages && isLoadingMore" class="py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        </div>

          <div v-else-if="isLoading" class="self-center"><LoadingView text="Loading PDF..." /></div>

        <div v-else-if="error" class="self-center text-center text-gray-500">
            <h3 class="text-lg font-medium mb-2">Unable to load PDF</h3>
            <p class="mb-4">{{ error }}</p>
            <button @click="reload" class="px-6 py-2 bg-blue-500 text-white rounded-full">Retry</button>
        </div>
      </div>
      </div>

      <!-- Search -->
      <PDFSearch 
        :is-visible="showSearchBar" 
        :search-query="searchQuery"
        :current-match="currentSearchIndex"
        :total-matches="searchResults.length"
        :is-searching="isSearching"
        @update:searchQuery="handleSearch"
        @find-next="nextMatch"
        @find-prev="prevMatch"
        @close="showSearchBar = false"
      />

      <!-- Toolbar -->
      <component
        :is="isPastPaperMode ? PaperToolbar : PDFToolbar"
        v-if="pdfDocument && !error"
        :scale="scale"
        :current-page="inputPage"
        :total-pages="totalPages"
        :show-controls="showControls"
        :show-sidebar="showSidebar"
        :show-search="showSearchBar"
        :has-paper="!!document?.paperUrl"
        :has-answer="!!document?.answerUrl"
        :has-attachment="!!document?.attachmentUrl"
        :current-mode="activeMode"
        @update:currentPage="val => inputPage = val"
        @zoom-in="zoom(0.25)"
        @zoom-out="zoom(-0.25)"
        @jump-to-page="handleJump"
        @toggle-search="showSearchBar = !showSearchBar"
        @toggle-sidebar="showSidebar = !showSidebar"
        @download="download"
        @switch-mode="switchMode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed, onUnmounted } from 'vue'
import LoadingView from '@/components/LoadingView.vue'
import PDFSidebar from './PDFSidebar.vue'
import PDFToolbar from './PDFToolbar.vue'
import PaperToolbar from './PaperToolbar.vue'
import PDFSearch from './PDFSearch.vue'
import { usePDF } from './usePDF'

const props = defineProps({
  document: Object,
  isVisible: Boolean,
  rightOffset: { type: Number, default: 0 }
})
const emit = defineEmits(['close'])

// Core Logic from Composable
const { 
  pdfDocument, isLoading, loadingProgress, error,
  totalPages, renderedPages, scale, pageWidth,
  pageRefs, textLayerRefs,
  searchResults, currentSearchIndex, isSearching,
  loadPDF, renderPageRange, performSearch, highlightAllResults, clearHighlights, cleanup,
  initPDF // Import init function
} = usePDF()

// Eager load PDF.js immediately when component is mounted (even if not visible yet)
onMounted(() => {
  initPDF().catch(() => {}) 
})

// UI State
const inputPage = ref(1)
const showSidebar = ref(false)
const showSearchBar = ref(false)
const showControls = ref(true)
const isLoadingMore = ref(false)
const scrollContainer = ref(null)
const searchQuery = ref('')
const activeMode = ref('paper')
const activeFileUrl = ref(null)

const isPastPaperMode = computed(() => !!(props.document?.paperUrl || props.document?.answerUrl || props.document?.attachmentUrl))

// Helper to set refs in Map
const setPageRef = (el, n) => el ? pageRefs.value.set(n, el) : pageRefs.value.delete(n)
const setTextLayerRef = (el, n) => el ? textLayerRefs.value.set(n, el) : textLayerRefs.value.delete(n)

// Actions
const reload = () => loadPDF(activeFileUrl.value || getDocUrl())
const closeViewer = () => { cleanup(); emit('close') }

const getDocUrl = () => props.document?.fileUrl || props.document?.url || (props.document?.ossKey ? `https://cheese-test-public.oss-accelerate.aliyuncs.com/${props.document.ossKey}` : null)

const handleJump = async (page) => {
  const target = Math.min(Math.max(1, parseInt(page) || 1), totalPages.value)
  inputPage.value = target
  if (target > renderedPages.value) {
    isLoadingMore.value = true
    const start = renderedPages.value + 1
    renderedPages.value = target
    await nextTick()
    await renderPageRange(start, target)
    isLoadingMore.value = false
  }
  await nextTick()
  pageRefs.value.get(target)?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

const zoom = async (delta) => {
  scale.value = Math.max(0.5, Math.min(3, scale.value + delta))
  clearHighlights()
  await renderPageRange(1, renderedPages.value)
  if (searchResults.value.length) highlightAllResults()
}

const switchMode = (mode) => {
  const map = { paper: 'paperUrl', answer: 'answerUrl', attachment: 'attachmentUrl' }
  const url = props.document?.[map[mode]]
  if (url) {
    activeMode.value = mode
    activeFileUrl.value = url
    loadPDF(url)
  }
}

const download = () => {
  const url = activeFileUrl.value || getDocUrl()
  if (url) window.open(url, '_blank')
}

// Search UI Binding
let searchTimer = null
const handleSearch = (q) => {
  searchQuery.value = q
  clearTimeout(searchTimer)
  if (!q) { searchResults.value = []; clearHighlights(); return }
  searchTimer = setTimeout(() => performSearch(q), 300)
}
const nextMatch = () => {
  if (!searchResults.value.length) return
  currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length
  scrollToResult(currentSearchIndex.value)
}
const prevMatch = () => {
  if (!searchResults.value.length) return
  currentSearchIndex.value = (currentSearchIndex.value - 1 + searchResults.value.length) % searchResults.value.length
  scrollToResult(currentSearchIndex.value)
}
const scrollToResult = async (idx) => {
  const res = searchResults.value[idx]
  if (res.pageNum > renderedPages.value) {
    await handleJump(res.pageNum)
      } else {
    pageRefs.value.get(res.pageNum)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  highlightAllResults()
}

// Infinite Scroll
const onScroll = () => {
  if (!scrollContainer.value || isLoadingMore.value || renderedPages.value >= totalPages.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  
  // Page detection
  let bestPage = inputPage.value, minDiff = Infinity
  for (const [p, el] of pageRefs.value) {
    const diff = Math.abs(el.getBoundingClientRect().top - 50)
    if (diff < minDiff) { minDiff = diff; bestPage = p }
  }
  if (bestPage !== inputPage.value) inputPage.value = bestPage

  // Load more
  if (scrollHeight - scrollTop - clientHeight < 500) {
    isLoadingMore.value = true
    const next = Math.min(totalPages.value, renderedPages.value + 2)
    const start = renderedPages.value + 1
    renderedPages.value = next
    nextTick().then(() => renderPageRange(start, next)).then(() => isLoadingMore.value = false)
  }
}

// Lifecycle & Init
const init = (doc) => {
  if (!doc) return
  
  // Determine initial mode
  let mode = 'paper', url = doc.paperUrl
  if (doc.initMode === 'answer' && doc.answerUrl) { mode = 'answer'; url = doc.answerUrl }
  else if (doc.initMode === 'attachment' && doc.attachmentUrl) { mode = 'attachment'; url = doc.attachmentUrl }
  else if (!url) {
    if (doc.answerUrl) { mode = 'answer'; url = doc.answerUrl }
    else if (doc.attachmentUrl) { mode = 'attachment'; url = doc.attachmentUrl }
     }
     
     activeMode.value = mode
  activeFileUrl.value = url || getDocUrl()
  loadPDF(activeFileUrl.value)
}

watch(() => [props.document, props.isVisible], ([doc, vis]) => {
  if (doc && vis) init(doc)
  else if (!vis) cleanup()
}, { immediate: true })

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', onScroll, { passive: true })
  // Add keyboard shortcuts
  window.addEventListener('keydown', e => {
    if (!props.isVisible) return
    if (e.key === 'Escape') closeViewer()
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); showSearchBar.value = !showSearchBar.value }
  })
})
onUnmounted(() => cleanup())
</script>

<style scoped>
/* No scoped styles needed if global utils used */
</style>
