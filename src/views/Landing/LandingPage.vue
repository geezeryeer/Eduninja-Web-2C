<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
    <!-- Header -->
    <Header />
    
    <!-- Hero Section -->
    <HeroSection 
      @navigate="navigateTo"
      @scroll-to-features="scrollToFeatures"
    />

    <!-- Curriculum Section -->
    <CurriculumSection />

    <!-- Demo Section -->
    <DemoSection @navigate="navigateTo" />

    <!-- Trust Section - moved after Demo Section -->
    <TrustSection />

    <!-- Trustpilot Section -->
    <TrustpilotSection />

    <!-- App Download Section -->
    <AppDownloadSection />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import HeroSection from './HeroSection.vue'
import CurriculumSection from './CurriculumSection.vue'
import DemoSection from './DemoSection.vue'
import AppDownloadSection from './AppDownloadSection.vue'
import TrustpilotSection from './TrustpilotSection.vue'
import TrustSection from './TrustSection.vue'
import Footer from './Footer.vue'

// 路由
const router = useRouter()

// 功能区域引用
const featuresSection = ref(null)


// 方法
const navigateTo = (path) => {
  router.push(path)
}

const scrollToFeatures = () => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style scoped>
/* 自定义样式 */
.router-link-active {
  @apply text-primary-600;
}
</style>
