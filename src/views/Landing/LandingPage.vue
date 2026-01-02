<template>
  <div class="min-h-screen bg-white relative overflow-hidden">
    <!-- Clean Gradient Background Component -->
    <CleanGradientBackground />

    <!-- Hero Section -->
    <HeroSection 
      @navigate="navigateTo"
      @scroll-to-features="scrollToFeatures"
    />

    <!-- Demo Section -->
    <DemoSection @navigate="navigateTo" />

    <!-- Trust Section - moved after Demo Section -->
    <TrustSection />

    <!-- Trustpilot Section -->
    <TrustpilotSection />

    <!-- Complete Library Preview -->
    <CompleteLibraryPreview />

    <!-- App Download Section -->
    <AppDownloadSection />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from './HeroSection.vue'
import DemoSection from './DemoSection.vue'
import AppDownloadSection from './AppDownloadSection.vue'
import TrustpilotSection from './TrustpilotSection.vue'
import TrustSection from './TrustSection.vue'
import CompleteLibraryPreview from './CompleteLibraryPreview.vue'
import Footer from './Footer.vue'
import CleanGradientBackground from '@/components/CleanGradientBackground.vue'

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
