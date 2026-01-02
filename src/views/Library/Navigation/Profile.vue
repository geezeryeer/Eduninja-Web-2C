<template>
  <div class="relative">
    <!-- 用户头像区域 - 可点击 -->
    <button
      ref="triggerButton"
      @click="toggleDropdown"
      class="flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 outline-none"
      :class="[
        isDropdownOpen ? 'opacity-100' : 'hover:opacity-80'
      ]"
    >
      <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-200">
        <div 
          class="w-full h-full bg-gray-600 icon-mask"
          :style="{ maskImage: `url(${personIcon})`, WebkitMaskImage: `url(${personIcon})` }"
        ></div>
      </div>
    </button>

    <!-- 下拉菜单 - 极致简洁风格 -->
    <Teleport to="body">
    <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
      <div 
          v-if="isDropdownOpen"
          ref="dropdownMenu"
          :style="dropdownStyle"
          class="fixed w-[280px] bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999] origin-top-right text-gray-800"
        >
          <!-- 头部：用户信息 + Upgrade -->
          <div class="px-4 py-2 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                <div 
                  class="w-6 h-6 bg-gray-500 icon-mask"
                  :style="{ maskImage: `url(${personIcon})`, WebkitMaskImage: `url(${personIcon})` }"
                ></div>
              </div>
              <div class="flex flex-col">
                <span class="text-[15px] font-medium text-gray-900 leading-tight">{{ displayUserName }}</span>
                <span class="text-[13px] text-gray-500">{{ displayUserRole }}</span>
              </div>
            </div>
            <button class="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full hover:bg-black transition-colors">
              Upgrade
            </button>
          </div>

          <div class="h-px bg-gray-100 my-2 mx-4"></div>

          <!-- Credits -->
          <div class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <span class="text-[14px] text-gray-700">Credits</span>
            <span class="text-[14px] font-semibold text-gray-900">160</span>
          </div>

          <!-- Storage (可折叠调用) -->
          <div class="group">
            <div 
              @click="toggleWidget('storage')"
              class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 select-none"
            >
              <span class="text-[14px] text-gray-700">Storage</span>
              <svg 
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': activeWidget === 'storage' }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div 
              v-if="activeWidget === 'storage'"
              class="px-4 py-2 bg-gray-50/50 border-t border-b border-gray-100"
            >
          <StorageWidget />
            </div>
          </div>

          <!-- Calendar (可折叠调用) -->
          <div class="group">
            <div 
              @click="toggleWidget('calendar')"
              class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 select-none"
            >
              <span class="text-[14px] text-gray-700">Calendar</span>
              <svg 
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': activeWidget === 'calendar' }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div 
              v-if="activeWidget === 'calendar'"
              class="px-4 py-2 bg-gray-50/50 border-t border-b border-gray-100"
            >
              <MiniCalendar />
            </div>
          </div>

          <!-- Subscription Plans -->
          <div class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <span class="text-[14px] text-gray-700">Subscription Plans</span>
        </div>
        
          <div class="h-px bg-gray-100 my-2 mx-4"></div>
        
          <!-- Settings (Trigger Profile Edit) -->
          <div 
          @click="handleEditProfile"
            class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
            <span class="text-[14px] text-gray-700">Settings</span>
          </div>

          <div class="h-px bg-gray-100 my-2 mx-4"></div>
        
          <!-- Log Out -->
          <div 
          @click="handleSignOut"
            class="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 mb-1"
        >
            <span class="text-[14px] text-gray-700">Log Out</span>
          </div>

      </div>
    </Transition>
    </Teleport>

    <!-- 点击外部关闭下拉菜单的遮罩 -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-[9998]"
    ></div>

    <!-- 编辑个人资料弹窗 -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-show="showEditProfileModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          @click="closeEditProfileModal"
        >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"></div>
        
        <!-- 弹窗内容 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-show="showEditProfileModal"
            @click.stop
            class="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl z-[10000] overflow-hidden"
          >
            <!-- 顶部装饰条 -->
            <div class="h-24 bg-gradient-to-r from-gray-100 to-gray-200 w-full relative overflow-hidden">
                <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <!-- 关闭按钮 -->
            <button
              @click="closeEditProfileModal"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white text-gray-500 hover:text-gray-900 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- 主要内容 -->
            <div class="px-8 pb-8 -mt-10 relative">
              <!-- 用户头像 -->
              <div class="flex flex-col items-center mb-6">
                <div class="relative group cursor-pointer">
                  <div class="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden transition-transform group-hover:scale-105">
                    <span class="text-2xl font-semibold text-white">{{ userProfile.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <!-- 悬停提示更换 -->
                  <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-transparent">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <h3 class="mt-3 text-lg font-semibold text-gray-900">Edit Profile</h3>
              </div>

              <!-- 表单区域 -->
              <div class="space-y-4">
              <!-- 昵称输入框 -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nickname</label>
                <div class="relative">
                    <div class="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="userProfile.name"
                    type="text"
                    placeholder="Enter your nickname"
                      class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-0 transition-all duration-200"
                  />
                </div>
              </div>

              <!-- School (Read-only) -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">School</label>
                  <div class="w-full pl-3.5 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent flex items-center gap-3">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                    <span class="text-sm text-gray-700 font-medium">{{ userProfile.school || 'Not Set' }}</span>
                </div>
              </div>

                <!-- Role & Membership Row -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- Role -->
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Role</label>
                    <div class="w-full pl-3.5 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent flex items-center gap-2">
                      <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                      <span class="text-sm text-gray-700 font-medium truncate">{{ userProfile.role || 'User' }}</span>
                </div>
              </div>

                  <!-- Membership -->
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Plan</label>
                    <div class="w-full pl-3.5 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent flex items-center justify-between">
                      <div class="flex items-center gap-2 overflow-hidden">
                        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                        <span class="text-sm text-gray-700 font-medium truncate">{{ userProfile.isMember ? 'Premium' : 'Standard' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="mt-8">
              <button
                @click="saveProfile"
                  class="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                  <span>Save Changes</span>
              </button>
              </div>
            </div>
          </div>
        </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, reactive } from 'vue'
import { useRouter } from 'vue-router'
import MiniCalendar from './MiniCalendar.vue'
import StorageWidget from './StorageWidget.vue'
import { getStoredUserInfo, logout } from '@/services/AuthService.js'
import personIcon from '@/assets/Icon/person.crop.circle.svg'

// 获取真实用户信息
const storedUserInfo = computed(() => {
  return getStoredUserInfo() || {}
})

// 计算显示的用户名
const displayUserName = computed(() => {
  return storedUserInfo.value.title || storedUserInfo.value.accountName || 'User'
})

// 计算显示的Subtitle (Role)
const displayUserRole = computed(() => {
  return storedUserInfo.value.role || storedUserInfo.value.roleName || 'Student'
})

// 响应式数据
const isDropdownOpen = ref(false)
const showEditProfileModal = ref(false)
const activeWidget = ref(null) // 'calendar' | 'storage' | null
const userProfile = ref({
  name: '',
  school: '',
  role: '',
  isMember: false,
  userId: ''
})

// 下拉菜单定位
const triggerButton = ref(null)
const dropdownStyle = reactive({
  top: '0px',
  right: '0px'
})

// 方法
const toggleWidget = (widgetName) => {
  if (activeWidget.value === widgetName) {
    activeWidget.value = null
  } else {
    activeWidget.value = widgetName
  }
}

const updateDropdownPosition = () => {
  if (triggerButton.value) {
    const rect = triggerButton.value.getBoundingClientRect()
    dropdownStyle.top = `${rect.bottom + 16}px` // 增加间距
    
    // 右对齐，保持距离屏幕边缘至少 24px
    const rightOffset = window.innerWidth - rect.right
    // 如果 trigger 太靠右，菜单就以 trigger 右边为基准
    // 这里我们希望菜单的右边和 trigger 的右边对齐（或者有一定的偏移）
    // 因为菜单宽度是 280px，我们需要确保它不会超出屏幕左边
    
    // 简单的右对齐逻辑：
    // right: (windowWidth - rect.right) px
    
    dropdownStyle.right = `${Math.max(24, rightOffset)}px`
  }
}

const toggleDropdown = async () => {
  isDropdownOpen.value = !isDropdownOpen.value
  
  if (isDropdownOpen.value) {
    await nextTick()
    updateDropdownPosition()
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleEditProfile = () => {
  closeDropdown()
  showEditProfileModal.value = true
}

// 获取路由实例
const router = useRouter()

const handleSignOut = () => {
  closeDropdown()
  console.log('Sign Out clicked')

  // 执行登出操作
  logout()

  // 跳转到首页
  router.push('/')
}

// 编辑个人资料弹窗方法
const closeEditProfileModal = () => {
  showEditProfileModal.value = false
}

const saveProfile = () => {
  console.log('Saving profile:', userProfile.value)
  // TODO: 实现保存个人资料到服务器的逻辑 (这里只保存nickname)
  closeEditProfileModal()
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (showEditProfileModal.value) {
      closeEditProfileModal()
    } else if (isDropdownOpen.value) {
      closeDropdown()
    }
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (isDropdownOpen.value) {
    updateDropdownPosition()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize, true)

  // 初始化用户信息
  const userInfo = storedUserInfo.value
  if (userInfo) {
    userProfile.value = {
      name: userInfo.title || userInfo.accountName || '',
      school: userInfo.school || userInfo.schoolName || '',
      role: userInfo.role || userInfo.roleName || 'Student',
      isMember: userInfo.isVip || userInfo.vip || false,
      userId: userInfo.id || ''
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize, true)
})
</script>

<style scoped>
/* 确保下拉菜单在正确的层级 */
.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

/* 确保弹窗在最顶层 */
.z-\[9999\] {
  z-index: 9999;
}

.z-\[10000\] {
  z-index: 10000;
}

/* 微妙的阴影效果 */
.shadow-lg {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 背景模糊效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 平滑的过渡效果 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬停效果 */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>