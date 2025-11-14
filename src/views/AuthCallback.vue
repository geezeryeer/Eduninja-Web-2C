<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center p-8">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="space-y-6">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">正在处理登录...</h2>
        <p class="text-gray-600">请稍候，我们正在完成您的登录流程</p>
      </div>

      <!-- 成功状态 -->
      <div v-else-if="isSuccess" class="space-y-6">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">登录成功！</h2>
        <p class="text-gray-600">欢迎回到 EduNinja</p>
        <p class="text-sm text-gray-500">即将跳转到主页面...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else class="space-y-6">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">登录失败</h2>
        <p class="text-gray-600">{{ errorMessage }}</p>
        <div class="space-y-3">
          <button
            @click="retryLogin"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            重新登录
          </button>
          <button
            @click="goHome"
            class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { saveAuthToken, getUserInfo, saveUserInfo } from '@/services/AuthService.js'

// 路由
const router = useRouter()
const route = useRoute()

// 响应式数据
const isLoading = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

// 方法
const processCallback = async () => {
  try {
    console.log('处理授权回调...')
    
    // 从URL参数中获取token、expire、userId
    const token = route.query.token
    const expire = route.query.expire || '43200'
    const userId = route.query.userId

    if (!token) {
      throw new Error('未获取到授权token')
    }

    if (!userId) {
      throw new Error('未获取到用户ID')
    }

    // 保存token
    saveAuthToken(token, parseInt(expire))
    // 保存用户id
    localStorage.setItem('userId', userId)

    console.log('Token保存成功')

    // 获取用户信息
    console.log('正在获取用户信息...')
    const userInfo = await getUserInfo(userId)
    saveUserInfo(userInfo)
    console.log('用户信息获取并保存成功:', userInfo)
    
    // 显示成功状态
    isLoading.value = false
    isSuccess.value = true
    
    // 延迟跳转到主页面
    setTimeout(() => {
      router.push('/library')
    }, 2000)
    
  } catch (error) {
    console.error('处理授权回调失败:', error)
    isLoading.value = false
    isSuccess.value = false
    errorMessage.value = error.message || '登录处理过程中发生错误'
  }
}

const retryLogin = () => {
  router.push('/')
}

const goHome = () => {
  router.push('/')
}

// 生命周期
onMounted(() => {
  processCallback()
})
</script>

<style scoped>
/* 动画效果 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
