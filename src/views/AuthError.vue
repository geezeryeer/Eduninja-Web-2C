<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center p-8">
      <!-- 错误图标 -->
      <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      
      <!-- 错误标题 -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">登录失败</h1>
      
      <!-- 错误信息 -->
      <div class="space-y-4 mb-8">
        <p class="text-gray-600 text-lg">
          抱歉，登录过程中发生了错误
        </p>
        
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>
        
        <div class="text-gray-500 text-sm">
          <p>可能的原因：</p>
          <ul class="mt-2 space-y-1 text-left">
            <li>• 授权已过期或被取消</li>
            <li>• 网络连接不稳定</li>
            <li>• 服务器暂时不可用</li>
            <li>• 账号信息验证失败</li>
          </ul>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="space-y-3">
        <button
          @click="retryLogin"
          class="w-full px-6 py-3 bg-link text-white font-medium rounded-lg hover:bg-link-hover transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>重新登录</span>
        </button>
        
        <button
          @click="goHome"
          class="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          返回首页
        </button>
      </div>
      
      <!-- 帮助信息 -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-gray-500 text-sm">
          如果问题持续存在，请联系我们的客服团队
        </p>
        <a 
          href="mailto:service@eduninja.net" 
          class="inline-block mt-2 text-link hover:text-link-dark text-sm font-medium"
        >
          service@eduninja.net
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由
const router = useRouter()
const route = useRoute()

// 响应式数据
const errorMessage = ref('')

// 方法
const retryLogin = () => {
  router.push('/')
}

const goHome = () => {
  router.push('/')
}

// 生命周期
onMounted(() => {
  // 从URL参数中获取错误信息
  const message = route.query.message
  if (message) {
    errorMessage.value = decodeURIComponent(message)
  } else {
    errorMessage.value = '未知错误'
  }
  
  console.log('授权错误:', errorMessage.value)
})
</script>

<style scoped>
/* 额外样式（如果需要） */
</style>
