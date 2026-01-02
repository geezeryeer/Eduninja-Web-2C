<template>
  <div class="min-h-screen flex flex-col bg-white relative">
    <!-- 背景组件 -->
    <CleanGradientBackground />

    <!-- 使用现有的 Header 组件 -->
    <Header />

    <!-- Questionnaire Modal -->
    <Questionnaire 
      v-if="showQuestionnaire"
      @complete="handleQuestionnaireComplete"
      @skip="handleQuestionnaireSkip"
    />

    <!-- 主内容区 - 添加顶部边距以避免被 header 遮挡 -->
    <div class="flex-1 flex pt-16 w-full relative z-10">
      <div class="max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-24 flex">
        <!-- 左侧：登录表单区 -->
        <div class="w-full lg:w-1/2 flex items-center justify-center lg:justify-start p-6 lg:p-12 lg:pl-0">
          <div class="w-full max-w-[480px] space-y-8">
      <!-- 标题文本 -->
        <div class="space-y-3">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Your AI-Powered<br />Learning Assistant
          </h1>
      </div>

      <!-- 登录按钮组 -->
        <div class="space-y-3">
        <!-- Google 登录 -->
        <button
          @click="handleGoogleLogin"
          :disabled="isLoading"
            class="relative w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 hover:border-gray-900 rounded-xl text-gray-900 font-medium transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
        >
          <div v-if="isGoogleLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <template v-else>
              <div class="absolute left-6 flex items-center justify-center">
              <div class="w-5 h-5">
                <svg viewBox="0 0 24 24" class="w-full h-full">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
            </div>
              <span class="text-base">Continue with Google</span>
            </template>
          </button>

          <!-- WeChat 登录 -->
          <button
            @click="handleWeChatLogin"
            :disabled="isLoading"
            class="relative w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 hover:border-gray-900 rounded-xl text-gray-900 font-medium transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            <div v-if="isWeChatLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <template v-else>
              <div class="absolute left-6 flex items-center justify-center">
                <svg class="w-5 h-5 text-[#07C160]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
              </div>
              <span class="text-base">Continue with WeChat</span>
          </template>
        </button>

        <!-- Apple 登录 -->
        <button
          @click="handleAppleLogin"
          :disabled="isLoading"
            class="relative w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 hover:border-gray-900 rounded-xl text-gray-900 font-medium transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
        >
          <div v-if="isAppleLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <template v-else>
              <div class="absolute left-6 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </div>
              <span class="text-base">Continue with Apple</span>
          </template>
        </button>
      </div>

        <!-- 底部链接 -->
        <div class="space-y-4">
      <!-- 服务条款 -->
      <div class="text-center">
            <p class="text-xs text-gray-500">
              By continuing, you agree to EduNinja's 
              <a href="/terms-of-use" class="text-gray-900 hover:underline font-medium">Terms of Service</a>
          and 
              <a href="/privacy-policy" class="text-gray-900 hover:underline font-medium">Privacy Policy</a>
        </p>
          </div>
        </div>
      </div>
      </div>

    <!-- 右侧：展示区 -->
    <div class="hidden lg:flex lg:w-1/2 items-center justify-center lg:justify-end relative overflow-visible">
      <!-- 剧本纸张组件 -->
      <div class="relative z-10 transform scale-90 xl:scale-100 transition-transform duration-500 origin-right">
        <StudyPlanPaper />
      </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { redirectToAuth } from '@/services/AuthService.js'
import Questionnaire from './Questionnaire.vue'
import Header from '@/views/Landing/Header.vue'
import StudyPlanPaper from './components/StudyPlanPaper.vue'
import CleanGradientBackground from '@/components/CleanGradientBackground.vue'

// Router
const router = useRouter()

// State
const isGoogleLoading = ref(false)
const isAppleLoading = ref(false)
const isWeChatLoading = ref(false)
const showQuestionnaire = ref(false)

// Computed
const isLoading = computed(() => 
  isGoogleLoading.value || isAppleLoading.value || isWeChatLoading.value
)

// Methods
const handleGoogleLogin = async () => {
  if (isLoading.value) return
  
  try {
    isGoogleLoading.value = true
    console.log('Starting Google login')
    
    // 暂时使用模拟登录以便测试
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 设置虚拟 token 以通过路由守卫
    localStorage.setItem('token', 'mock-token-' + Date.now())
    localStorage.setItem('user', JSON.stringify({ name: 'Demo User', email: 'demo@eduninja.com' }))
    
    // 显示问卷
    console.log('Setting showQuestionnaire to true')
    showQuestionnaire.value = true
    console.log('showQuestionnaire value:', showQuestionnaire.value)
    
    // 生产环境使用真实的 Google OAuth
    // await redirectToAuth('google')
  } catch (error) {
    console.error('Google login failed:', error)
    alert('Unable to connect to Google. Please try again later.')
  } finally {
    isGoogleLoading.value = false
  }
}

const handleAppleLogin = async () => {
  if (isLoading.value) return
  
  try {
    isAppleLoading.value = true
    console.log('Starting Apple login')
    await redirectToAuth('APPLE')
  } catch (error) {
    console.error('Apple login failed:', error)
    alert('Unable to connect to Apple. Please try again later.')
  } finally {
    isAppleLoading.value = false
  }
}

const handleWeChatLogin = async () => {
  if (isLoading.value) return
  
  try {
    isWeChatLoading.value = true
    console.log('Starting WeChat login')
    await redirectToAuth('wechatOpen')
  } catch (error) {
    console.error('WeChat login failed:', error)
    alert('Unable to connect to WeChat. Please try again later.')
  } finally {
    isWeChatLoading.value = false
  }
}

// Questionnaire handlers
const handleQuestionnaireComplete = (data) => {
  console.log('Questionnaire completed:', data)
  showQuestionnaire.value = false
  // TODO: Save questionnaire data to backend
  router.push('/library')
}

const handleQuestionnaireSkip = () => {
  console.log('Questionnaire skipped')
  showQuestionnaire.value = false
  router.push('/library')
}
</script>

