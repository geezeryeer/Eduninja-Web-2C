<template>
  <div class="min-h-screen bg-white">
    <!-- 顶部导航栏 -->
    <Header />
    
    <!-- 主内容区 -->
    <main class="w-full pt-16">
      <router-view />
    </main>
    
    <!-- 全局加载状态 -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../views/Landing/Header.vue'

// 响应式数据
const sidebarCollapsed = ref(false)
const isLoading = ref(false)

// 路由信息
const route = useRoute()

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    name: item.meta.title,
    to: item.path === route.path ? null : item.path
  }))
})

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  // 保存到本地存储
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value)
}

// 从本地存储恢复侧边栏状态
const restoreSidebarState = () => {
  const saved = localStorage.getItem('sidebarCollapsed')
  if (saved !== null) {
    sidebarCollapsed.value = JSON.parse(saved)
  }
}

// 监听屏幕尺寸变化
const handleResize = () => {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
}

// 组件挂载时
onMounted(() => {
  restoreSidebarState()
  window.addEventListener('resize', handleResize)
  handleResize() // 初始检查
})

// 组件卸载时
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听路由变化，在移动端自动收起侧边栏
watch(route, () => {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
})
</script>

<style scoped>
/* 自定义样式 */
.router-link-active {
  @apply text-primary-600;
}
</style>