<template>
  <div class="relative h-full w-full flex flex-col">
    <!-- Chat History 侧边栏 -->
    <ChatHistory
      :isVisible="showChatHistory"
      :currentChatId="currentChatId"
      @close="toggleChatHistory"
      @select-chat="handleSelectChat"
      @delete-chat="handleDeleteChat"
      @clear-all="handleClearAllHistory"
    />

    <!-- 高级拖拽区域 -->
    <div 
      class="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-16 cursor-col-resize z-50 flex items-center justify-center group"
      @mousedown="startResize"
      title="拖拽调整面板大小"
    >
      <!-- 优雅的拖拽手柄 -->
      <div class="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-2 group-hover:bg-white group-hover:border-gray-300/70">
        <!-- 拖拽纹理 -->
        <div class="flex flex-col items-center gap-0.5">
          <div class="w-3 h-0.5 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors duration-300"></div>
          <div class="w-3 h-0.5 bg-gray-300 rounded-full group-hover:bg-purple-400 transition-colors duration-300"></div>
          <div class="w-3 h-0.5 bg-gray-300 rounded-full group-hover:bg-indigo-400 transition-colors duration-300"></div>
        </div>
        
        <!-- 微妙的发光效果 -->
        <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>

    <!-- 聊天面板内容 -->
    <div class="flex flex-col h-full overflow-hidden">
      <!-- 顶部工具栏 -->
      <div class="flex items-center justify-between p-4 bg-white/50 rounded-t-2xl border-b border-gray-200/50">
        <h3 class="text-sm font-medium text-gray-700">Ninja AI</h3>
        <div class="flex items-center gap-2">
          <!-- Chat History按钮 -->
          <button 
            @click="toggleChatHistory"
            class="p-2 hover:bg-gray-200 rounded-lg transition-colors group" 
            title="聊天记录"
          >
            <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <!-- 新建对话按钮 -->
          <button @click="createNewChat" class="p-2 hover:bg-gray-200 rounded-lg transition-colors group" title="新建对话">
            <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 题目收集器组件 -->
      <QuestionCollector 
        :selectedQuestions="selectedQuestions"
        :paperTitle="paperTitle"
        :totalScore="totalScore"
        :paperId="paperId"
        @toggle-collapsed="handleToggleCollapsed"
        @remove-question="handleRemoveQuestion"
        @remove-child-question="handleRemoveChildQuestion"
        @remove-grandchild-question="handleRemoveGrandChildQuestion"
        @clear-questions="handleClearQuestions"
        @analyze-questions="handleAnalyzeQuestions"
        @score-updated="handleScoreUpdated"
      />

      <!-- 聊天消息区域 -->
      <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center py-8">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">开始对话</h3>
          <p class="text-gray-500 text-sm max-w-xs">选择学科并输入您的问题开始智能对话</p>
        </div>

        <!-- 消息列表 -->
        <div v-else class="space-y-4">
          <div v-for="message in messages" :key="message.id">
            <!-- 用户消息 - 右对齐，带圆圈背景 -->
            <div v-if="message.role === 'user'" class="flex justify-end">
              <div class="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-sm">
                <p class="text-sm leading-relaxed">{{ message.content }}</p>
              </div>
            </div>
            
            <!-- AI回复 - 左对齐，无头像，无圆圈背景 -->
            <div v-else class="flex justify-start">
              <div class="max-w-sm">
                <p class="text-sm leading-relaxed text-gray-800">{{ message.content }}</p>
              </div>
            </div>
          </div>

          <!-- 正在输入指示器 -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="max-w-sm">
              <div class="flex items-center gap-2 text-gray-500 text-sm">
                <span>AI正在思考</span>
                <div class="flex space-x-1">
                  <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="p-4 bg-white rounded-b-2xl">
        <!-- 输入框和按钮 -->
        <div 
          class="relative transition-all duration-200"
          :class="currentMessage.trim() ? 'ring-2 ring-gray-300 rounded-2xl bg-white shadow-md' : 'ring-2 ring-blue-500/30 rounded-2xl bg-white/90 shadow-sm'"
        >
          <textarea
            v-model="currentMessage"
            @keydown.enter.prevent="sendMessage"
            placeholder="Ask Anything"
            class="w-full pl-12 pr-12 py-3 border-0 rounded-2xl focus:outline-none resize-none backdrop-blur-sm text-sm h-12 bg-transparent"
            rows="1"
            :disabled="isTyping"
            style="max-height: 120px;"
          ></textarea>
          <!-- 上传按钮 -->
          <button
            @click="handleFileUpload"
            class="absolute left-3 top-3 w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center"
            title="Upload file"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
          </button>
          <!-- 发送按钮 -->
          <button
            @click="sendMessage"
            :disabled="isTyping"
            class="absolute right-3 top-3 w-6 h-6 bg-black hover:bg-gray-800 text-white rounded-full transition-all duration-200 flex items-center justify-center"
          >
            <svg v-if="isTyping" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import QuestionCollector from './QuestionCollector.vue'
import ChatHistory from './ChatHistory.vue'
import { questionService } from '@/services'

const route = useRoute()

// Emits
const emit = defineEmits(['resize', 'resizing'])

// 响应式数据
const currentMessage = ref('')
const messages = ref([])
const isTyping = ref(false)
const messagesContainer = ref(null)
const showChatHistory = ref(false)
const currentChatId = ref(null)

// 面板大小控制
const minWidth = 300 // 最小宽度
const maxWidth = 800 // 最大宽度
const isResizing = ref(false)

// 题目收集器状态
const selectedQuestions = ref([])
const paperTitle = ref('')
const totalScore = ref(0)
const paperId = ref(null)
const currentSubject = ref('')
const curCreate = ref(null) // 当前组卷信息


// 方法
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isTyping.value) return

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: currentMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  currentMessage.value = ''
  
  await scrollToBottom()
  
  // 模拟AI回复
  await simulateAIResponse(userMessage.content)
}


const simulateAIResponse = async (userInput) => {
  isTyping.value = true
  
  // 模拟API调用延迟（首次延迟）
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 创建一个空的AI消息对象
  const aiMessage = {
    id: Date.now(),
    role: 'assistant',
    content: '',
    timestamp: new Date()
  }
  
  // 先将空消息添加到列表
  messages.value.push(aiMessage)
  isTyping.value = false
  
  // 要输出的完整内容
  const fullResponse = `我收到了您的问题："${userInput}"，让我来帮助您解答。`
  
  // 逐字输出（流式效果）
  for (let i = 0; i < fullResponse.length; i++) {
    // 先延迟，再添加字符（确保第一个字也有延迟）
    await new Promise(resolve => setTimeout(resolve, 30))
    
    aiMessage.content += fullResponse[i]
    
    // 强制 Vue 更新视图
    await nextTick()
    
    // 每添加一个字符后滚动到底部
    await scrollToBottom()
  }
  
  await scrollToBottom()
}



const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 拖拽调整大小功能 - 优化顺滑度
let animationFrame = null

const startResize = (e) => {
  isResizing.value = true
  emit('resizing', true) // 通知父组件开始拖拽
  document.body.style.userSelect = 'none' // 防止选中文本
  document.body.style.cursor = 'col-resize' // 全局光标
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

const handleResize = (e) => {
  if (!isResizing.value) return
  
  // 直接计算并更新，不使用 requestAnimationFrame 的嵌套取消
  // 这样可以确保每次都能及时响应
  const newWidth = window.innerWidth - e.clientX - 24 // 减去右侧 padding (right-6 = 24px)
  const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
  
  // 使用 requestAnimationFrame 优化性能
  if (animationFrame) {
    return // 如果已经有待处理的帧，跳过这次更新
  }
  
  animationFrame = requestAnimationFrame(() => {
    // 发出 resize 事件给父组件
    emit('resize', clampedWidth)
    animationFrame = null
  })
}

const stopResize = () => {
  isResizing.value = false
  emit('resizing', false) // 通知父组件结束拖拽
  document.body.style.userSelect = '' // 恢复文本选择
  document.body.style.cursor = '' // 恢复光标
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

const createNewChat = () => {
  // 保存当前聊天到历史记录
  if (messages.value.length > 0) {
    saveChatToHistory()
  }
  
  // 生成新的聊天ID
  currentChatId.value = Date.now()
  
  // 清空消息
  messages.value = []
  
  // 重新添加欢迎消息
  addWelcomeMessage()
}

const toggleChatHistory = () => {
  showChatHistory.value = !showChatHistory.value
}

const handleSelectChat = (chat) => {
  console.log('📖 Loading chat:', chat)
  // TODO: 从存储加载聊天消息
  currentChatId.value = chat.id
  messages.value = chat.messages || []
  if (messages.value.length === 0) {
    addWelcomeMessage()
  }
}

const handleDeleteChat = (chatId) => {
  console.log('🗑️ Deleted chat:', chatId)
  // 如果删除的是当前聊天，创建新聊天
  if (currentChatId.value === chatId) {
    createNewChat()
  }
}

const handleClearAllHistory = () => {
  console.log('🧹 Cleared all chat history')
  // 创建新聊天
  createNewChat()
}

const saveChatToHistory = () => {
  // TODO: 实现保存聊天到 localStorage 或 API
  console.log('💾 Saving chat to history')
}

const handleFileUpload = () => {
  // TODO: 实现文件上传功能
  console.log('File upload clicked')
}

// 题目收集器事件处理方法
const handleToggleCollapsed = (collapsed) => {
  // 可以在这里添加额外的逻辑
  console.log('Questions collapsed:', collapsed)
}

const handleRemoveQuestion = (questionId) => {
  const index = selectedQuestions.value.findIndex(q => q.id === questionId)
  if (index > -1) {
    selectedQuestions.value.splice(index, 1)
  }
}

const handleScoreUpdated = (newScore) => {
  if (newScore !== undefined) {
    totalScore.value = newScore
  }
}

const handleRemoveChildQuestion = ({ parentQuestionId, childIndex }) => {
  const parentQuestion = selectedQuestions.value.find(q => q.id === parentQuestionId)
  if (parentQuestion && parentQuestion.childList && parentQuestion.childList[childIndex]) {
    parentQuestion.childList.splice(childIndex, 1)
  }
}

const handleRemoveGrandChildQuestion = ({ parentQuestionId, childIndex, grandChildIndex }) => {
  const parentQuestion = selectedQuestions.value.find(q => q.id === parentQuestionId)
  if (parentQuestion && 
      parentQuestion.childList && 
      parentQuestion.childList[childIndex] && 
      parentQuestion.childList[childIndex].childList && 
      parentQuestion.childList[childIndex].childList[grandChildIndex]) {
    parentQuestion.childList[childIndex].childList.splice(grandChildIndex, 1)
  }
}

const handleClearQuestions = () => {
  selectedQuestions.value = []
}

const handleAnalyzeQuestions = async (questions) => {
  if (questions.length === 0) return
  
  // 构建分析提示
  const questionsText = questions.map((q, index) => {
    return `Question ${index + 1}: ${q.title || 'Image-based question'}
    Difficulty: ${q.difficulty || 'N/A'}
    Topic: ${q.knowledgePoint || 'N/A'}
    ${q.imageKey ? '[Contains image]' : ''}
    ${q.answerImageKey ? '[Answer available]' : ''}`
  }).join('\n\n')
  
  const analysisPrompt = `Please analyze these ${questions.length} questions:

${questionsText}

Please provide:
1. Common themes and topics
2. Difficulty analysis
3. Suggested study approach
4. Key concepts to focus on`

  // 发送分析请求
  currentMessage.value = analysisPrompt
  await sendMessage()
}


// 从路由参数获取当前学科信息
const getCurrentSubjectInfo = () => {
  return {
    subject: route.params.subject || route.query.subject || 'Mathematics',
    clazz: route.query.clazz || 'IGCSE',
    exam: route.query.exam || 'CIE',
    level: route.query.level || ''
  }
}


// 添加题目到收集器
const addSelectedQuestion = async (question) => {
  if (!selectedQuestions.value.find(q => q.id === question.id)) {
    try {
      // 确保有组卷ID
      await createPaperIfNeeded()
      
      // 保存到云端
      if (paperId.value) {
        const replaceNumber = selectedQuestions.value.length + 1
        const result = await questionService.addQuestionToCloud(question, paperId.value, replaceNumber)
        
        if (result) {
          // 添加到本地状态
          selectedQuestions.value.push(question)
          // 更新分数
          if (result.score) {
            totalScore.value = result.score
          }
        }
      }
    } catch (error) {
      console.error('❌ 添加题目失败:', error)
    }
  }
}

// 创建组卷（如果需要）
const createPaperIfNeeded = async () => {
  if (!paperId.value) {
    const info = getCurrentSubjectInfo()
    const result = await questionService.createPaperWithInfo(info)
    if (result) {
      paperId.value = result.paperId
      paperTitle.value = result.title || `${info.clazz} ${info.exam} ${info.subject}`
      totalScore.value = result.score || 0
      curCreate.value = result
    }
  }
}

const removeSelectedQuestion = (questionId) => {
  handleRemoveQuestion(questionId)
}

const clearSelectedQuestions = () => {
  handleClearQuestions()
}

const handleQuestionToggle = async (question) => {
  // 检查学科切换 - 基于paperName进行学科检测
  if (selectedQuestions.value.length > 0 && question.paperName) {
    const currentSubject = questionService.detectSubjectFromPaperName(question.paperName)
    const existingSubject = questionService.detectSubjectFromPaperName(selectedQuestions.value[0].paperName)
    
    if (existingSubject && currentSubject && existingSubject !== currentSubject) {
      console.log('⚠️ 检测到跨学科题目，清空现有组卷')
      clearCurrentState()
    }
  }
  
  // 添加或移除题目
  if (selectedQuestions.value.find(q => q.id === question.id)) {
    removeSelectedQuestion(question.id)
  } else {
    await addSelectedQuestion(question)
  }
}

// 清空当前状态
const clearCurrentState = () => {
  selectedQuestions.value = []
  paperTitle.value = ''
  totalScore.value = 0
  paperId.value = null
  currentSubject.value = ''
  curCreate.value = null
}

// 检查组卷详情
const checkComboDetail = async () => {
  const info = getCurrentSubjectInfo()
  const data = await questionService.getComboDetailWithInfo(info)
  
  curCreate.value = data
  
  if (data?.paperId) {
    paperId.value = data.paperId
    paperTitle.value = data.title || `${info.clazz} ${info.exam} ${info.subject}`
    totalScore.value = data.score || 0
    selectedQuestions.value = data.subjects || []
    return data
  } else {
    selectedQuestions.value = []
    return null
  }
}

// 监听路由变化，检查当前学科的组卷状态
watch([() => route.path, () => route.query], async () => {
  console.log('🔄 学科切换，重新加载该学科的组卷状态')
  
  // 重置状态并重新加载该学科的组卷
  clearCurrentState()
  await checkComboDetail()
})

const addWelcomeMessage = () => {
  messages.value.push({
    id: 0,
    role: 'assistant',
    content: `👋 您好！我是您的AI学习助手。有什么可以帮助您的吗？`,
    timestamp: new Date()
  })
}

// 暴露方法供父组件使用
defineExpose({
  handleQuestionToggle,
  addSelectedQuestion,
  removeSelectedQuestion,
  clearSelectedQuestions
})

onMounted(async () => {
  if (messages.value.length === 0) {
    addWelcomeMessage()
  }
  await checkComboDetail()
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 动画优化 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

</style>