<template>
  <div class="relative">
    <!-- 用户头像区域 - 可点击 -->
    <div 
      @click="toggleDropdown"
      class="flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10"
      :class="{ 'bg-white/10': isDropdownOpen }"
    >
      <div class="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate leading-tight">{{ userName }}</p>
        <p class="text-xs text-gray-500 truncate leading-tight">{{ userEmail }}</p>
      </div>
    </div>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div 
        v-show="isDropdownOpen"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden z-50"
      >
        <!-- MiniCalendar 和 StorageWidget -->
        <div class="p-4 space-y-3">
          <MiniCalendar />
          <StorageWidget />
        </div>
        
        <!-- 分割线 -->
        <div class="border-t border-gray-200/50"></div>
        
        <!-- Edit Profile -->
        <button
          @click="handleEditProfile"
          class="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50/80 transition-colors duration-150 flex items-center gap-3"
        >
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit Profile
        </button>
        
        <!-- 分割线 -->
        <div class="border-t border-gray-200/50"></div>
        
        <!-- Sign Out -->
        <button
          @click="handleSignOut"
          class="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50/80 transition-colors duration-150 flex items-center gap-3"
        >
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sign Out
        </button>
      </div>
    </Transition>

    <!-- 点击外部关闭下拉菜单的遮罩 -->
    <div 
      v-show="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
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
        <!-- 背景遮罩 - 磨砂效果 -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
        
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
            class="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-purple-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-[10000]"
          >
            <!-- 关闭按钮 -->
            <button
              @click="closeEditProfileModal"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-10"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- 弹窗内容 -->
            <div class="p-8 pt-12">
              <!-- 用户头像 -->
              <div class="flex flex-col items-center mb-6">
                <div class="relative mb-4">
                  <div class="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <span class="text-2xl font-semibold text-white">{{ userProfile.name.charAt(0).toLowerCase() }}</span>
                  </div>
                </div>
                
                <!-- 更换头像按钮 -->
                <button class="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors duration-200">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Change photo
                </button>
              </div>

              <!-- 用户信息 -->
              <div class="space-y-4 mb-6">
                <!-- 邮箱 -->
                <div class="text-center">
                  <p class="text-white/60 text-sm mb-1">Email:</p>
                  <p class="text-white text-base">{{ userProfile.email }}</p>
                </div>

                <!-- 用户ID -->
                <div class="text-center">
                  <p class="text-white/60 text-sm mb-1">User ID:</p>
                  <div class="flex items-center justify-center gap-2">
                    <p class="text-white/80 text-sm font-mono">{{ userProfile.userId }}</p>
                    <button 
                      @click="copyUserId"
                      class="text-white/60 hover:text-white transition-colors duration-200"
                      title="Copy User ID"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 姓名输入框 -->
              <div class="mb-8">
                <div class="relative">
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="userProfile.name"
                    type="text"
                    placeholder="Enter your name"
                    class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>
              </div>

              <!-- 保存按钮 -->
              <button
                @click="saveProfile"
                class="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Save
              </button>
            </div>
          </div>
        </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MiniCalendar from './MiniCalendar.vue'
import StorageWidget from './StorageWidget.vue'

// Props
const props = defineProps({
  userName: {
    type: String,
    default: 'Andrew Krauf'
  },
  userEmail: {
    type: String,
    default: 'krauf@acniel.com'
  }
})

// 响应式数据
const isDropdownOpen = ref(false)
const showEditProfileModal = ref(false)
const userProfile = ref({
  name: 'hao yang',
  email: 'geezer.yang@gmail.com',
  userId: '97233659822081'
})

// 方法
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleEditProfile = () => {
  closeDropdown()
  showEditProfileModal.value = true
}

const handleSignOut = () => {
  closeDropdown()
  console.log('Sign Out clicked')
  // TODO: 实现登出功能
  // 清除用户数据，跳转到登录页面
  // router.push('/login')
}

// 编辑个人资料弹窗方法
const closeEditProfileModal = () => {
  showEditProfileModal.value = false
}

const copyUserId = async () => {
  try {
    await navigator.clipboard.writeText(userProfile.value.userId)
    console.log('User ID copied to clipboard')
    // 这里可以添加一个toast提示
  } catch (err) {
    console.error('Failed to copy user ID:', err)
  }
}

const saveProfile = () => {
  console.log('Saving profile:', userProfile.value)
  // TODO: 实现保存个人资料到服务器的逻辑
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

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
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
