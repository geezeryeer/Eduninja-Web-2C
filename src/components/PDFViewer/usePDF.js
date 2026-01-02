import { ref, shallowRef, nextTick } from 'vue'

// Singleton promise for PDF.js loading
let pdfJsPromise = null
const initPDF = () => {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib)
  if (pdfJsPromise) return pdfJsPromise

  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js'
  const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js'

  pdfJsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = CDN
    s.onload = () => {
      if (!window.pdfjsLib) return reject('PDF.js failed')
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER
      resolve(window.pdfjsLib)
    }
    s.onerror = (e) => {
      pdfJsPromise = null // Reset on failure so we can retry
      reject(e)
    }
    document.head.appendChild(s)
  })
  return pdfJsPromise
}

export function usePDF() {
  const pdfDocument = shallowRef(null)
  const isLoading = ref(false)
  const loadingProgress = ref(0)
  const error = ref(null)
  const totalPages = ref(0)
  const renderedPages = ref(0)
  const scale = ref(1.0)
  const pageWidth = ref(800)
  
  // Refs for DOM elements
  const pageRefs = shallowRef(new Map())
  const textLayerRefs = shallowRef(new Map())
  
  // Search State
  const searchResults = ref([])
  const currentSearchIndex = ref(0)
  const isSearching = ref(false)

  let pdfJSInstance = null
  let currentLoadingTask = null

  // 1. Load Logic
  const loadPDF = async (url) => {
    if (!url) return
    isLoading.value = true; error.value = null; loadingProgress.value = 0
    cleanup()

    try {
      // Start fetching PDF.js immediately (if not already)
      const pdfJsPromise = initPDF()
      
      pdfJSInstance = await pdfJsPromise
      currentLoadingTask = pdfJSInstance.getDocument(url)
      currentLoadingTask.onProgress = p => {
        if (p.total > 0) loadingProgress.value = Math.round((p.loaded / p.total) * 100)
      }
      
      const pdf = await currentLoadingTask.promise
      pdfDocument.value = pdf
      totalPages.value = pdf.numPages
      
      // Optimization: Render first page ASAP
      renderedPages.value = 1
      await nextTick()
      await renderPage(1)
      isLoading.value = false // Hide loader early
      
      // Render next few pages in background
      if (pdf.numPages > 1) {
        requestAnimationFrame(async () => {
           const nextBatch = Math.min(pdf.numPages, 5)
           if (nextBatch > 1) {
             renderedPages.value = nextBatch
             await nextTick()
             await renderPageRange(2, nextBatch)
           }
        })
      }
      return true
    } catch (e) {
      console.error(e)
      error.value = 'Failed to load PDF'
      isLoading.value = false
      return false
    }
  }

  const cleanup = () => {
    if (currentLoadingTask) { currentLoadingTask.destroy(); currentLoadingTask = null }
    if (pdfDocument.value) { pdfDocument.value.destroy(); pdfDocument.value = null }
    searchResults.value = []
    currentSearchIndex.value = 0
    clearHighlights()
  }

  // 2. Render Logic
  const renderPage = async (pageNum) => {
    const canvas = pageRefs.value.get(pageNum)
    if (!canvas || !pdfDocument.value) return
    
    // Check if already rendered (optional optimization if canvas has content)
    // For now, simple re-render
    
    try {
      const page = await pdfDocument.value.getPage(pageNum)
      const dpr = window.devicePixelRatio || 1
      const viewport = page.getViewport({ scale: scale.value * dpr })
      
      if (canvas.width !== viewport.width || canvas.height !== viewport.height) {
        canvas.width = viewport.width
        canvas.height = viewport.height
        canvas.style.width = `${viewport.width / dpr}px`
        canvas.style.height = `${viewport.height / dpr}px`
      }
      
      if (pageNum === 1) pageWidth.value = viewport.width / dpr
      
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
    } catch (e) { 
       // Start rendering cancelled exception is common if scrolling fast, ignore it
       if (e?.name !== 'RenderingCancelledException') console.warn(`Render error ${pageNum}`, e) 
    }
  }

  const renderPageRange = async (start, end) => {
    for (let i = start; i <= end; i++) await renderPage(i)
  }

  // 3. Search Logic
  const performSearch = async (query) => {
    if (!query?.trim() || !pdfDocument.value) return
    isSearching.value = true
    searchResults.value = []
    clearHighlights()

    try {
      // Search only rendered pages first? Or all? 
      // User expects full document search usually.
      // Searching all pages might be slow for large docs. 
      // But let's stick to searching rendered pages for now to match old behavior/performance profile 
      // or search up to a limit. Old code searched up to `renderedPages`.
      // Let's improve by searching a bit more or all if small.
      const searchLimit = Math.min(totalPages.value, 20) // Search first 20 pages or rendered pages?
      const limit = Math.max(renderedPages.value, searchLimit)
      
      for (let i = 1; i <= limit; i++) {
        const page = await pdfDocument.value.getPage(i)
        const { items } = await page.getTextContent()
        const text = items.map(item => item.str).join('')
        const fullStr = text.toLowerCase()
        const q = query.toLowerCase()
        
        let matchIndex = -1
        let startIndex = 0
        
        // Map char index to item index
        const charMap = []
        items.forEach((item, itemIdx) => {
          for(let c=0; c<item.str.length; c++) {
            charMap.push({ itemIdx, charIdx: c, item })
          }
        })
        
        while ((matchIndex = fullStr.indexOf(q, startIndex)) !== -1) {
          const start = charMap[matchIndex]
          const end = charMap[matchIndex + q.length - 1]
          if (start && end) {
            searchResults.value.push({
              pageNum: i,
              startItemIndex: start.itemIdx,
              startCharIndex: start.charIdx,
              endItemIndex: end.itemIdx,
              endCharIndex: end.charIdx
            })
          }
          startIndex = matchIndex + 1
        }
      }
      
      if (searchResults.value.length > 0) {
        currentSearchIndex.value = 0
        await highlightAllResults()
      }
    } finally {
      isSearching.value = false
    }
  }

  const highlightAllResults = async () => {
    clearHighlights()
    for (let i = 0; i < searchResults.value.length; i++) {
      await highlightResult(searchResults.value[i], i === currentSearchIndex.value)
    }
  }

  const highlightResult = async (result, isCurrent) => {
    const { pageNum, startItemIndex, endItemIndex, startCharIndex, endCharIndex } = result
    
    // Only highlight if page is rendered
    if (pageNum > renderedPages.value) return 

    const container = textLayerRefs.value.get(pageNum)
    if (!container) return

    const page = await pdfDocument.value.getPage(pageNum)
    const { items } = await page.getTextContent()
    const viewport = page.getViewport({ scale: scale.value })

    for (let i = startItemIndex; i <= endItemIndex; i++) {
      const item = items[i]
      if (!item?.str) continue
      
      const start = (i === startItemIndex) ? startCharIndex : 0
      const len = (i === endItemIndex) ? (endCharIndex + 1) : item.str.length
      if (i === endItemIndex && i === startItemIndex) {
         createHighlight(container, item, viewport, start, endCharIndex - start + 1, isCurrent)
      } else if (i === startItemIndex) {
         createHighlight(container, item, viewport, start, item.str.length - start, isCurrent)
      } else if (i === endItemIndex) {
         createHighlight(container, item, viewport, 0, endCharIndex + 1, isCurrent)
      } else {
         createHighlight(container, item, viewport, 0, item.str.length, isCurrent)
      }
    }
  }

  const createHighlight = (container, item, viewport, charStart, charLength, isCurrent) => {
    const div = document.createElement('div')
    const tx = item.transform
    const fontSize = Math.sqrt(tx[2]*tx[2] + tx[3]*tx[3])
    const avgWidth = (item.width / item.str.length) || (fontSize * 0.5)
    
    const x = tx[4] + (charStart * avgWidth)
    const y = tx[5]
    const w = charLength * avgWidth
    const h = fontSize

    div.style.position = 'absolute'
    div.style.left = `${x * viewport.scale}px`
    div.style.top = `${(viewport.height - y * viewport.scale - h * viewport.scale)}px`
    div.style.width = `${w * viewport.scale}px`
    div.style.height = `${h * viewport.scale}px`
    div.style.backgroundColor = isCurrent ? 'rgba(255, 152, 0, 0.6)' : 'rgba(255, 235, 59, 0.4)'
    div.style.mixBlendMode = 'multiply'
    
    container.appendChild(div)
  }

  const clearHighlights = () => {
    textLayerRefs.value.forEach(div => { if (div) div.innerHTML = '' })
  }

  return {
    pdfDocument, isLoading, loadingProgress, error,
    totalPages, renderedPages, scale, pageWidth,
    pageRefs, textLayerRefs,
    searchResults, currentSearchIndex, isSearching,
    loadPDF, renderPage, renderPageRange, 
    performSearch, highlightAllResults, clearHighlights,
    cleanup,
    initPDF // Export for eager loading
  }
}
