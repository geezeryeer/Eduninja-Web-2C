<template>
  <!-- 使用 teleport 将弹窗传送到 body 层级 -->
  <teleport to="body">
    <!-- 背景遮罩 -->
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[100] flex items-center justify-center"
      @click="handleBackdropClick"
    >
      <!-- 半透明背景 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <!-- 登录弹窗 -->
      <div
        class="relative bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-md w-full max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100"
        @click.stop
      >
      <!-- 关闭按钮 -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        aria-label="关闭"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- 标题 -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">登录 EduNinja</h2>
        <p class="text-gray-600">选择您喜欢的登录方式</p>
      </div>
      
      <!-- 登录方式按钮 -->
      <div class="space-y-3">
        <!-- 微信登录 -->
        <button
          @click="handleWeChatLogin"
          class="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
          </svg>
          <span class="font-medium">微信登录</span>
        </button>
        
        <!-- 谷歌登录（禁用） -->
        <button
          @click="handleDisabledAuth"
          disabled
          class="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed"
          title="该功能正在开发中"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span class="font-medium">谷歌登录（开发中）</span>
        </button>
        
        <!-- 苹果登录（禁用） -->
        <button
          @click="handleDisabledAuth"
          disabled
          class="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed"
          title="该功能正在开发中"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <span class="font-medium">苹果登录（开发中）</span>
        </button>
      </div>
      
      <!-- 提示信息 -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <div class="flex items-start space-x-2">
          <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-sm text-blue-700">
            <p class="font-medium mb-1">温馨提示</p>
            <p>目前仅支持微信登录，谷歌和苹果登录功能正在开发中，敬请期待！</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { redirectToAuth } from '@/services/AuthService.js'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// 方法
const closeModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  closeModal()
}

const handleWeChatLogin = async () => {
  try {
    console.log('开始微信登录')
    await redirectToAuth('wechatOpen')
  } catch (error) {
    console.error('微信登录失败:', error)
    // 这里可以添加错误提示，比如使用 toast 或 alert
    alert('微信登录失败，请稍后重试')
  }
}

const handleDisabledAuth = () => {
  // 这个函数实际上不会被调用，因为按钮是禁用的
  console.log('该功能正在开发中')
}
</script>

<style scoped>
/* 弹窗进入动画 */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.transform {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
