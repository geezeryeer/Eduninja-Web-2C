<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/60 border-b border-gray-200/30 transition-all duration-300" style="backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <div class="flex items-center justify-between h-20">
        <!-- 左侧：Logo 和应用名称 -->
        <div class="flex items-center space-x-3">
          <div 
            @click="handleHome"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <img 
              :src="appIcon" 
              alt="EduNinja Logo" 
              class="w-12 h-12 rounded-lg"
            />
            <h1 class="text-2xl font-bold text-gray-900">
              EduNinja
            </h1>
          </div>
        </div>
        
        <!-- 中央：导航菜单 -->
        <nav class="hidden lg:flex items-center space-x-10">
          <a 
            href="#"
            @click.prevent="handleHome"
            class="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            Home
          </a>
          <a 
            href="#"
            @click.prevent="handlePricing"
            class="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            Pricing
          </a>
          <a 
            href="#"
            @click.prevent="handleDownloadApp"
            class="flex items-center space-x-1 text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            <span>Download App</span>
          </a>
        </nav>
        
        <!-- 右侧：操作按钮 -->
        <div class="flex items-center space-x-4">
          <!-- 登录按钮 -->
          <button 
            @click="handleLogin"
            class="hidden sm:inline-flex items-center px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            Log in
          </button>
          
          <!-- Start for free 按钮 - 空心框框 -->
          <button 
            @click="handleStartFree"
            class="inline-flex items-center px-6 py-2.5 bg-white text-black text-base font-medium rounded-full border-2 border-solid border-black hover:bg-black hover:text-white transition-all duration-200"
            style="border: 2px solid #000000;"
          >
            Start for free
          </button>
          
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            aria-label="菜单"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="showMobileMenu"
        class="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200"
      >
        <div class="max-w-7xl mx-auto px-4 py-6 space-y-4">
          <!-- 移动端导航 -->
          <div class="space-y-2">
            <a 
              href="#"
              @click.prevent="handleHome"
              class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Home
            </a>
            <a 
              href="#"
              @click.prevent="handlePricing"
              class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Pricing
            </a>
            <a 
              href="#"
              @click.prevent="handleDownloadApp"
              class="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Download App
            </a>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <!-- 移动端登录 -->
            <button 
              @click="handleLogin"
              class="w-full flex items-center justify-center space-x-2 px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <span>Log in</span>
            </button>
            
            <!-- 移动端 Start for free -->
            <button 
              @click="handleStartFree"
              class="w-full mt-3 px-6 py-3 bg-white text-black text-base font-medium rounded-full border-2 border-solid border-black hover:bg-black hover:text-white transition-all duration-200"
              style="border: 2px solid #000000;"
            >
              Start for free
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 登录弹窗 -->
    <LoginModal 
      :isVisible="showLoginModal" 
      @close="closeLoginModal"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import appIcon from '@/assets/images/app_icon_tight_1024.png'
import LoginModal from '@/components/LoginModal.vue'

// 路由
const router = useRouter()

// 响应式数据
const showMobileMenu = ref(false)
const showLoginModal = ref(false)

// 方法
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleHome = () => {
  console.log('Home clicked')
  closeMobileMenu()
  router.push('/')
}

const handleLogin = () => {
  console.log('Login button clicked')
  closeMobileMenu()
  
  // 显示登录弹窗
  showLoginModal.value = true
}

const closeLoginModal = () => {
  showLoginModal.value = false
}

const handleStartFree = () => {
  console.log('Start for free button clicked')
  closeMobileMenu()
  
  // 显示登录弹窗
  showLoginModal.value = true
}

const handlePricing = () => {
  console.log('Pricing clicked')
  closeMobileMenu()
  // 跳转到定价页面
  router.push('/pricing')
}

const handleDownloadApp = () => {
  console.log('Download App clicked')
  closeMobileMenu()
  // 跳转到 App Store
  window.open('https://apps.apple.com/app/eduninja/id6738283836', '_blank')
}


</script>

<style scoped>
/* Header 样式已使用 Tailwind CSS 实现，无需额外样式 */
</style>
