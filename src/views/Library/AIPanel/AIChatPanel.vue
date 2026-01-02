<template>
  <div class="relative h-full w-full flex flex-col bg-transparent">
    <!-- Chat History 侧边栏 -->
    <ChatHistory
      :isVisible="showChatHistory"
      :currentChatId="currentChatId"
      @close="toggleChatHistory"
      @select-chat="handleSelectChat"
      @delete-chat="handleDeleteChat"
    />

    <!-- 拖拽调整区域 -->
    <div 
      class="absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-50 flex items-center justify-center group"
      @mousedown="startResize"
      title="Drag to resize"
    >
      <!-- Apple 风格极简手柄 -->
      <div class="w-1 h-8 bg-gray-300 rounded-full group-hover:bg-gray-400 group-hover:w-1.5 transition-all duration-200"></div>
    </div>

    <!-- 聊天面板内容 -->
    <div class="flex flex-col h-full overflow-hidden bg-transparent">
      <!-- 顶部工具栏 -->
      <div class="flex items-center justify-between px-4 border-b border-gray-200/60 bg-white/50 backdrop-blur-md flex-shrink-0" style="height: 52px;">
        <h3 class="text-[15px] font-semibold text-gray-900 truncate max-w-[200px] tracking-tight" :title="title">
          {{ title }}
        </h3>
        <div class="flex gap-2">
          <button 
            @click="toggleChatHistory"
            class="p-2 hover:bg-gray-200/60 rounded-lg transition-all active:scale-95 group" 
            title="Chat History"
          >
            <div 
              class="w-[18px] h-[18px] bg-gray-500 group-hover:bg-gray-800 transition-colors icon-mask"
              :style="{ '-webkit-mask-image': `url(${historyIcon})` }"
            ></div>
          </button>
          <button 
            @click="createNewChat" 
            class="p-2 hover:bg-gray-200/60 rounded-lg transition-all active:scale-95 group" 
            title="New Chat"
          >
            <div 
              class="w-[18px] h-[18px] bg-gray-500 group-hover:bg-gray-800 transition-colors icon-mask"
              :style="{ '-webkit-mask-image': `url(${newChatIcon})` }"
            ></div>
          </button>
        </div>
      </div>

      <!-- 题目收集器组件 - 只在有题目时显示 -->
      <div v-if="selectedQuestions.length > 0" class="px-3 pt-3">
      <QuestionCollector 
        :selectedQuestions="selectedQuestions"
        :paperTitle="paperTitle"
        :totalScore="totalScore"
        :paperId="paperId"
        @questions-changed="checkComboDetail"
        @analyze-questions="handleAnalyzeQuestions"
        @update-title="handleUpdateTitle"
      />
      </div>

      <!-- 聊天消息区域 -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-3" ref="messagesContainer">
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">开始对话</h3>
          <p class="text-gray-500 text-sm max-w-xs">选择学科并输入您的问题开始智能对话</p>
        </div>

        <!-- 消息列表 -->
        <div v-else class="space-y-4">
          <div v-for="message in messages" :key="message.id">
            <!-- 用户消息 -->
            <UserMessage 
              v-if="message.role === 'user'"
              :content="message.content"
              :imageUrl="message.imageUrl"
              :fileUrl="message.fileUrl"
              :fileName="message.fileName"
              :fileSize="message.fileSize"
              @open-image="handleOpenImage"
            />
            
            <!-- AI回复 - Swift Playgrounds 风格 -->
            <div v-else class="flex justify-start w-full">
              <div class="flex-1 max-w-full">
                <AIResponse 
                  :content="message.content"
                  :questions="message.questions"
                  @open-image="handleOpenImage"
                />
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
      <ChatInput
        v-model="currentMessage"
        :is-typing="isTyping"
        :subject-info="subjectInfo"
        @send="sendMessage"
        @file-upload="handleFileUpload"
        @mention-click="handleMentionClick"
      />
    </div>

    <!-- 图片查看器 -->
    <ImageViewer ref="imageViewerRef" />
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import QuestionCollector from './QuestionCollector.vue'
import ChatHistory from './ChatHistory.vue'
import ChatInput from './ChatInput.vue'
import AIResponse from './AIResponse.vue'
import UserMessage from './UserMessage.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import { questionService } from '@/services'
import historyIcon from '@/assets/Icon/clock.arrow.trianglehead.counterclockwise.rotate.90.svg'
import newChatIcon from '@/assets/Icon/square.and.pencil.svg'

const route = useRoute()

// Props
const props = defineProps({
  initialMessages: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Ninja AI'
  },
  rightOffset: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['resize', 'resizing'])

// 响应式数据
const currentMessage = ref('')
const messages = ref(props.initialMessages.length > 0 ? [...props.initialMessages] : [])
const isTyping = ref(false)
const messagesContainer = ref(null)
const showChatHistory = ref(false)
const currentChatId = ref(null)
const imageViewerRef = ref(null)

// Debug: 打印初始消息
if (props.initialMessages.length > 0) {
  console.log('AIChatPanel - initialMessages:', props.initialMessages)
  const assistantMsg = props.initialMessages.find(m => m.role === 'assistant')
  if (assistantMsg) {
    console.log('AIChatPanel - assistant questions:', assistantMsg.questions)
  }
}

// 面板大小控制
const minWidth = 300 // 最小宽度
const maxWidth = 800 // 最大宽度
const isResizing = ref(false)

// 题目收集器状态
const selectedQuestions = ref([])
const paperTitle = ref('')
const totalScore = ref(0)
const paperId = ref(null)
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
  
  // 要输出的完整内容（展示所有支持的 markdown 样式）
  const fullResponse = `收到您的问题：**"${userInput}"**

### 要点说明
1. 使用 \`代码\` 标记重要内容
2. **加粗** 表示重点，*斜体* 用于强调

### 功能支持
| 功能 | 状态 |
|------|------|
| Markdown | ✅ 支持 |
| 表格 | ✅ 支持 |
| 代码块 | ✅ 支持 |

### 代码示例
\`\`\`swift
let message = "Hello, Swift!"
print(message)
\`\`\`

希望这些信息对您有帮助！`
  
  // 逐字输出（流式效果）- 优化：检查用户是否在底部再决定是否自动滚动
  for (let i = 0; i < fullResponse.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 20))
    
    aiMessage.content += fullResponse[i]
    
    // 强制 Vue 更新视图
    await nextTick()
    
    // 只在每 5 个字符或换行时滚动一次，减少滚动频率
    if (i % 5 === 0 || fullResponse[i] === '\n') {
      scrollToBottomIfNearBottom()
    }
  }
  
  // 最后确保滚动到底部
  await scrollToBottom()
}



const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 只在用户在底部附近时才自动滚动（避免打断用户查看历史消息）
const scrollToBottomIfNearBottom = () => {
  if (!messagesContainer.value) return
  
  const container = messagesContainer.value
  const threshold = 100 // 距离底部 100px 以内认为是"在底部"
  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
  
  // 如果用户在底部附近，才自动滚动
  if (distanceFromBottom < threshold) {
    container.scrollTop = container.scrollHeight
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
  const newWidth = window.innerWidth - e.clientX - props.rightOffset // 使用传入的 rightOffset
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

const saveChatToHistory = () => {
  // TODO: 实现保存聊天到 localStorage 或 API
  console.log('💾 Saving chat to history')
}

const handleFileUpload = (file) => {
  console.log('📎 File selected:', file)
  console.log('File name:', file.name)
  console.log('File size:', (file.size / 1024).toFixed(2) + ' KB')
  console.log('File type:', file.type)
  
  // TODO: 实现文件上传功能
  // 这里可以添加文件预览、上传到服务器等逻辑
}

const handleMentionClick = () => {
  console.log('@ Mention clicked')
  // TODO: 实现 @ 提及功能
  // 这里可以显示知识库列表或其他提及选项
}

const handleOpenImage = (imageUrl) => {
  if (imageViewerRef.value && imageUrl) {
    imageViewerRef.value.open(imageUrl)
  }
}

// 题目收集器事件处理方法
// 删除题目（用于 toggle 取消勾选）
const removeQuestionFromPaper = async (question) => {
  if (!paperId.value) return
  
  try {
    const deleteId = question.subjectId || question.id
    await questionService.removeQuestionFromCloud(deleteId, paperId.value)
    await checkComboDetail() // 刷新组卷详情
  } catch (error) {
    console.error('❌ 删除失败:', error)
  }
}

const handleUpdateTitle = (newTitle) => {
  paperTitle.value = newTitle
  console.log('📝 Paper title updated:', newTitle)
  // TODO: 如果需要同步到云端，在这里添加 API 调用
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

const subjectInfo = computed(() => getCurrentSubjectInfo())


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
    await removeQuestionFromPaper(question)
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
    content: `👋 您好！我是 Ninja AI 学习助手。

我可以帮助您：
- 📚 解答学习问题
- 📝 分析试题和知识点
- 💡 提供学习建议

请输入您的问题开始对话！`,
    timestamp: new Date()
  })
}

// 暴露方法供父组件使用
defineExpose({
  handleQuestionToggle,
  addSelectedQuestion
})

onMounted(async () => {
  if (messages.value.length === 0) {
    addWelcomeMessage()
  }
  await checkComboDetail()
})
</script>

<style scoped>
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