<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300"
  >
    <div class="w-full px-6 md:px-10 h-16 flex items-center justify-between">
      <!-- 左侧：Logo 和应用名称 -->
      <div class="flex items-center space-x-3">
        <div 
          @click="handleHome"
          class="flex items-center space-x-3 cursor-pointer"
        >
          <img 
            :src="appIcon" 
            alt="EduNinja Logo" 
            class="w-10 h-10 rounded-lg"
          />
          <h1 class="text-[26px] font-semibold text-gray-900 tracking-tight">
            EduNinja
          </h1>
        </div>
      </div>
      
      <!-- 右侧：导航菜单 + 操作按钮 -->
      <div class="flex items-center space-x-6 lg:space-x-8">
        <!-- 导航菜单 (桌面端) -->
        <nav class="hidden lg:flex items-center space-x-6 text-[16px]">
          <a 
            href="#"
            @click.prevent="handleHome"
            class="font-medium text-gray-900 transition-colors cursor-pointer"
          >
            Features
          </a>
          <a 
            href="#"
            @click.prevent="handlePricing"
            class="font-medium text-gray-900 transition-colors cursor-pointer"
          >
            Pricing
          </a>
          <a 
            href="#"
            @click.prevent="handleDownloadApp"
            class="font-medium text-gray-900 transition-colors cursor-pointer"
          >
            Download App
          </a>
        </nav>

        <!-- 分隔线 (桌面端) -->
        <div class="hidden lg:block w-px h-5 bg-gray-200"></div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-3">
          <!-- 登录状态判断 -->
          <template v-if="!isLoggedIn">
            <!-- 未登录：合并 Log in 和 Start for free -->
            <button
              @click="handleLogin"
              class="inline-flex items-center px-4 py-2 bg-white text-gray-900 border border-black border-solid text-[15px] font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              Try EduNinja
            </button>
          </template>

          <template v-else>
            <!-- 已登录：显示 Go to App 和 Log out -->
            <button
              @click="handleGoToApp"
              class="inline-flex items-center px-4 py-2 bg-white text-gray-900 border border-black border-solid text-[15px] font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              Go to App
            </button>
            
            <button
              @click="handleLogout"
              class="hidden sm:inline-flex items-center px-3 py-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log out
            </button>
          </template>

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
          <div class="space-y-1">
            <a 
              href="#"
              @click.prevent="handleHome"
              class="block px-4 py-2.5 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#"
              @click.prevent="handlePricing"
              class="block px-4 py-2.5 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a 
              href="#"
              @click.prevent="handleDownloadApp"
              class="block px-4 py-2.5 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Download App
            </a>
          </div>
          
          <div class="border-t border-gray-200 pt-4 mt-4">
            <template v-if="!isLoggedIn">
              <!-- 移动端登录 - 合并为 Try EduNinja -->
              <button
                @click="handleLogin"
                class="w-full px-4 py-2.5 bg-white text-gray-900 border border-black border-solid text-[15px] font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Try EduNinja
              </button>
            </template>
            <template v-else>
              <!-- 移动端 已登录显示 -->
              <button
                @click="handleGoToApp"
                class="w-full px-4 py-2.5 bg-white text-gray-900 border border-black border-solid text-[15px] font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                Go to App
              </button>

              <button
                @click="handleLogout"
                class="w-full mt-3 px-4 py-2.5 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </template>
          </div>
        </div>
      </div>
    </transition>
    
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import appIcon from '@/assets/images/app_icon_tight_1024.png'
import { isTokenValid, logout } from '@/services/AuthService.js'

// 路由
const router = useRouter()

// 响应式数据
const showMobileMenu = ref(false)

// 计算属性：检查用户是否已登录
const isLoggedIn = computed(() => {
  return isTokenValid()
})

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
  
  // 跳转到登录页面
  router.push('/login')
}

const handleStartFree = () => {
  console.log('Start for free button clicked')
  closeMobileMenu()
  
  // 跳转到登录页面
  router.push('/login')
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

// 新增：跳转到 App（Library）
const handleGoToApp = () => {
  closeMobileMenu()
  router.push('/library')
}

// 新增：退出登录
const handleLogout = () => {
  closeMobileMenu()
  logout()
  // 强制刷新页面以更新状态，或者使用 window.location.reload()
  // 也可以重新检查 isLoggedIn，但因为 computed 依赖于 localStorage，可能需要手动触发更新
  // 简单起见，刷新页面或跳转回首页
  window.location.reload()
}
</script>

<style scoped>
/* Header 样式已使用 Tailwind CSS 实现，无需额外样式 */
</style>