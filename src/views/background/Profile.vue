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
        <p class="text-sm font-medium text-gray-900 truncate leading-tight">{{ displayUserName }}</p>
        <p class="text-xs text-gray-500 truncate leading-tight">{{ displayUserPhone }}</p>
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

    <!-- 点击外部关闭国家下拉菜单的遮罩 -->
    <div
      v-show="isCountryDropdownOpen"
      @click="isCountryDropdownOpen = false"
      class="fixed inset-0 z-25"
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
            class="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-purple-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 z-[10000]"
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



              <!-- 昵称输入框 -->
              <div class="mb-6">
                <div class="relative">
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="userProfile.name"
                    type="text"
                    placeholder="Enter your nickname"
                    class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>
              </div>

              <!-- 手机号输入框 -->
              <div class="mb-8">
                <div class="relative">
                  <!-- 自定义区号选择器 -->
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
                    <div class="relative">
                      <!-- 区号显示按钮 -->
                      <button
                        @click="toggleCountryDropdown($event)"
                        class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 min-w-[80px]"
                      >
                        <span>{{ selectedCountry.flag }}</span>
                        <span>{{ selectedCountry.code }}</span>
                        <svg
                          class="w-3 h-3 transition-transform duration-200"
                          :class="{ 'rotate-180': isCountryDropdownOpen }"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>

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
                          v-show="isCountryDropdownOpen"
                          class="absolute bottom-full left-0 mb-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
                        >
                          <!-- 搜索框 -->
                          <div class="p-3 border-b border-gray-200/50">
                            <div class="relative">
                              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                              </svg>
                              <input
                                v-model="countrySearchQuery"
                                type="text"
                                placeholder="搜索国家或区号..."
                                class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                              />
                            </div>
                          </div>

                          <!-- 国家列表 -->
                          <div class="max-h-60 overflow-y-auto">
                            <div
                              v-for="country in filteredCountries"
                              :key="country.code"
                              @click="selectCountry(country)"
                              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            >
                              <span class="text-lg">{{ country.flag }}</span>
                              <div class="flex-1">
                                <span class="text-sm font-medium text-gray-900">{{ country.name }}</span>
                              </div>
                              <span class="text-sm text-gray-500">{{ country.code }}</span>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>

                  <!-- 手机号输入框 -->
                  <input
                    v-model="userProfile.phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    class="w-full pl-28 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import MiniCalendar from './MiniCalendar.vue'
import StorageWidget from './StorageWidget.vue'
import { getStoredUserInfo } from '@/services/AuthService.js'

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

// 获取真实用户信息
const storedUserInfo = computed(() => {
  return getStoredUserInfo() || {}
})

// 计算显示的用户名和手机号
const displayUserName = computed(() => {
  return storedUserInfo.value.title || storedUserInfo.value.accountName || props.userName
})

// 过滤国家列表
const filteredCountries = computed(() => {
  if (!countrySearchQuery.value.trim()) {
    return countries.value
  }
  const query = countrySearchQuery.value.toLowerCase()
  return countries.value.filter(country =>
    country.name.toLowerCase().includes(query) ||
    country.code.includes(query)
  )
})

const displayUserPhone = computed(() => {
  // API返回的数据中没有手机号字段，如果手机号为空则显示提示文字
  const phone = storedUserInfo.value.phone
  return phone || '暂未绑定手机号'
})

// 国家数据
const countries = ref([
  { name: '中国', code: '86', flag: '🇨🇳' },
  { name: '美国', code: '1', flag: '🇺🇸' },
  { name: '英国', code: '44', flag: '🇬🇧' },
  { name: '日本', code: '81', flag: '🇯🇵' },
  { name: '韩国', code: '82', flag: '🇰🇷' },
  { name: '新加坡', code: '65', flag: '🇸🇬' },
  { name: '中国香港', code: '852', flag: '🇭🇰' },
  { name: '中国澳门', code: '853', flag: '🇲🇴' },
  { name: '中国台湾', code: '886', flag: '🇹🇼' },
  { name: '马来西亚', code: '60', flag: '🇲🇾' },
  { name: '泰国', code: '66', flag: '🇹🇭' },
  { name: '越南', code: '84', flag: '🇻🇳' },
  { name: '印度', code: '91', flag: '🇮🇳' },
  { name: '俄罗斯', code: '7', flag: '🇷🇺' },
  { name: '德国', code: '49', flag: '🇩🇪' },
  { name: '法国', code: '33', flag: '🇫🇷' },
  { name: '意大利', code: '39', flag: '🇮🇹' },
  { name: '西班牙', code: '34', flag: '🇪🇸' },
  { name: '荷兰', code: '31', flag: '🇳🇱' },
  { name: '瑞典', code: '46', flag: '🇸🇪' },
  { name: '挪威', code: '47', flag: '🇳🇴' },
  { name: '丹麦', code: '45', flag: '🇩🇰' },
  { name: '芬兰', code: '358', flag: '🇫🇮' },
  { name: '瑞士', code: '41', flag: '🇨🇭' },
  { name: '奥地利', code: '43', flag: '🇦🇹' },
  { name: '比利时', code: '32', flag: '🇧🇪' },
  { name: '葡萄牙', code: '351', flag: '🇵🇹' },
  { name: '希腊', code: '30', flag: '🇬🇷' },
  { name: '波兰', code: '48', flag: '🇵🇱' },
  { name: '捷克', code: '420', flag: '🇨🇿' },
  { name: '匈牙利', code: '36', flag: '🇭🇺' },
  { name: '罗马尼亚', code: '40', flag: '🇷🇴' },
  { name: '土耳其', code: '90', flag: '🇹🇷' },
  { name: '阿联酋', code: '971', flag: '🇦🇪' },
  { name: '沙特阿拉伯', code: '966', flag: '🇸🇦' },
  { name: '埃及', code: '20', flag: '🇪🇬' },
  { name: '南非', code: '27', flag: '🇿🇦' },
  { name: '尼日利亚', code: '234', flag: '🇳🇬' },
  { name: '肯尼亚', code: '254', flag: '🇰🇪' },
  { name: '坦桑尼亚', code: '255', flag: '🇹🇿' },
  { name: '乌干达', code: '256', flag: '🇺🇬' },
  { name: '加纳', code: '233', flag: '🇬🇭' },
  { name: '科特迪瓦', code: '225', flag: '🇨🇮' },
  { name: '喀麦隆', code: '237', flag: '🇨🇲' },
  { name: '刚果民主共和国', code: '243', flag: '🇨🇩' },
  { name: '突尼斯', code: '216', flag: '🇹🇳' },
  { name: '阿尔及利亚', code: '213', flag: '🇩🇿' },
  { name: '摩洛哥', code: '212', flag: '🇲🇦' },
  { name: '利比亚', code: '218', flag: '🇱🇾' },
  { name: '约旦', code: '962', flag: '🇯🇴' },
  { name: '黎巴嫩', code: '961', flag: '🇱🇧' },
  { name: '叙利亚', code: '963', flag: '🇸🇾' },
  { name: '伊拉克', code: '964', flag: '🇮🇶' },
  { name: '伊朗', code: '98', flag: '🇮🇷' },
  { name: '阿塞拜疆', code: '994', flag: '🇦🇿' },
  { name: '格鲁吉亚', code: '995', flag: '🇬🇪' },
  { name: '亚美尼亚', code: '374', flag: '🇦🇲' },
  { name: '土库曼斯坦', code: '993', flag: '🇹🇲' },
  { name: '塔吉克斯坦', code: '992', flag: '🇹🇯' },
  { name: '吉尔吉斯斯坦', code: '996', flag: '🇰🇬' },
  { name: '尼泊尔', code: '977', flag: '🇳🇵' },
  { name: '孟加拉国', code: '880', flag: '🇧🇩' },
  { name: '缅甸', code: '95', flag: '🇲🇲' },
  { name: '柬埔寨', code: '855', flag: '🇰🇭' },
  { name: '老挝', code: '856', flag: '🇱🇦' },
  { name: '印度尼西亚', code: '62', flag: '🇮🇩' },
  { name: '菲律宾', code: '63', flag: '🇵🇭' },
  { name: '巴基斯坦', code: '92', flag: '🇵🇰' },
  { name: '斯里兰卡', code: '94', flag: '🇱🇰' },
  { name: '阿富汗', code: '93', flag: '🇦🇫' },
  { name: '阿曼', code: '968', flag: '🇴🇲' },
  { name: '卡塔尔', code: '974', flag: '🇶🇦' },
  { name: '巴林', code: '973', flag: '🇧🇭' },
  { name: '科威特', code: '965', flag: '🇰🇼' },
  { name: '也门', code: '967', flag: '🇾🇪' },
  { name: '巴勒斯坦', code: '970', flag: '🇵🇸' },
  { name: '以色列', code: '972', flag: '🇮🇱' },
  { name: '不丹', code: '975', flag: '🇧🇹' },
  { name: '蒙古', code: '976', flag: '🇲🇳' },
  { name: '乌兹别克斯坦', code: '998', flag: '🇺🇿' }
])

// 响应式数据
const isDropdownOpen = ref(false)
const showEditProfileModal = ref(false)
const isCountryDropdownOpen = ref(false)
const countrySearchQuery = ref('')
const selectedCountry = ref(countries.value.find(c => c.code === '86') || countries.value[0])
const dropdownPosition = ref({ top: 0, left: 0 })
const userProfile = ref({
  name: '',
  phone: '',
  userId: ''
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

const toggleCountryDropdown = (event) => {
  isCountryDropdownOpen.value = !isCountryDropdownOpen.value
  if (isCountryDropdownOpen.value) {
    countrySearchQuery.value = ''
    // 计算下拉框位置
    const button = event.target.closest('button')
    const rect = button.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX
    }
  }
}

const selectCountry = (country) => {
  selectedCountry.value = country
  isCountryDropdownOpen.value = false
  countrySearchQuery.value = ''
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

  // 初始化用户信息
  const userInfo = storedUserInfo.value
  if (userInfo) {
    userProfile.value = {
      name: userInfo.title || userInfo.accountName || '',
      phone: userInfo.phone || '', // API中没有手机号字段，暂时为空
      userId: userInfo.id || ''
    }
  }
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
