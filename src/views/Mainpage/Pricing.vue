<template>
  <div class="min-h-screen relative">
    <CleanGradientBackground />
    
    <!-- Hero Section with Title -->
    <div class="relative z-10 pt-12 pb-4 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <!-- Main Title -->
        <div class="flex items-center justify-center gap-2.5 mb-2">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">EduNinja</h1>
          <span class="text-lg md:text-xl font-semibold text-white bg-gradient-to-r from-slate-500 to-slate-600 px-3 py-1 rounded-lg shadow-lg">Pro</span>
        </div>
        
        <!-- Subtitle -->
        <div class="flex items-center justify-center gap-2">
          <div class="w-0.5 h-4 bg-gray-500 dark:bg-gray-400"></div>
          <p class="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">AI Companion build for your curriculum</p>
        </div>
      </div>
    </div>

    <!-- Pricing Cards Section -->
    <div class="max-w-7xl mx-auto px-6 pb-6 relative z-10">
      <div class="grid md:grid-cols-3 gap-4 mb-6">
          
        <!-- Monthly Plan -->
        <div 
          @click="selectedPlan = 'monthly'"
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl',
            selectedPlan === 'monthly' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-lg scale-[1.02]' : 'ring-1 ring-gray-200 dark:ring-gray-700'
          ]"
        >
          <div class="text-center mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Monthly</h3>
            <div class="mb-1">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">¥68</span>
              <span class="text-gray-500 dark:text-gray-400 text-sm">/month</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Perfect for short-term use
            </p>
          </div>
        </div>

        <!-- Yearly Plan (Most Popular) -->
        <div 
          @click="selectedPlan = 'yearly'"
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl',
            selectedPlan === 'yearly' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-lg scale-[1.02]' : 'ring-1 ring-gray-200 dark:ring-gray-700'
          ]"
        >
          <div class="text-center mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Yearly</h3>
            <div class="mb-1">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">¥198</span>
              <span class="text-gray-500 dark:text-gray-400 text-sm">/year</span>
            </div>
            <div class="mb-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              Save 51% · Just ¥16.5/month
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Best value · Free trial included
            </p>
          </div>
        </div>

        <!-- Quarterly Plan -->
        <div 
          @click="selectedPlan = 'quarterly'"
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-xl',
            selectedPlan === 'quarterly' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-lg scale-[1.02]' : 'ring-1 ring-gray-200 dark:ring-gray-700'
          ]"
        >
          <div class="text-center mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Quarterly</h3>
            <div class="mb-1">
              <span class="text-3xl font-bold text-gray-900 dark:text-white">¥128</span>
              <span class="text-gray-500 dark:text-gray-400 text-sm">/3 months</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Great balance of value
            </p>
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-5 lg:p-6 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 mb-6">
        <div class="space-y-0">
            <!-- 1. AI功能 - 核心功能合并 -->
            <div class="flex items-start gap-2.5 py-2">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">AI-Powered Learning Assistant</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Unlimited photo search for instant answers + 300 AI calls/month for explanations and practice questions</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-7"></div>

            <!-- 2. 访问完整题库 - 学习基础 -->
            <div class="flex items-start gap-2.5 py-2">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Access to Full Question Bank</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Browse and practice with thousands of past exam questions</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-7"></div>

            <!-- 3. 自定义组题 - 练习核心 -->
            <div class="flex items-start gap-2.5 py-2">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Custom Question Paper Generator</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create your own practice papers by selecting questions</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-7"></div>

            <!-- 4. 下载资料 -->
            <div class="flex items-start gap-2.5 py-2">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Download 4 Resources per Month</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Access past papers, mark schemes, and study materials</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-7"></div>

            <!-- 5. 云存储 -->
            <div class="flex items-start gap-2.5 py-2">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">5GB Cloud Storage</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Store your study materials, notes, and resources securely</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-7"></div>

            <!-- 6. Flashcard学习 -->
            <div class="flex items-start gap-2.5 py-2">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Flashcard Creation & Study</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create and review flashcards for efficient learning</p>
              </div>
            </div>
          </div>

      </div>

      <!-- Subscribe Button -->
      <div class="max-w-xl mx-auto mb-16">
        <button 
          @click="handleSubscribe(selectedPlan)"
          :disabled="isPurchasing"
          :class="[
            'w-full py-3 px-6 rounded-xl font-semibold text-base text-white transition-all duration-200 shadow-lg mb-2',
            isPurchasing ? 'bg-slate-400 cursor-not-allowed' : 'btn-primary hover:shadow-xl transform hover:scale-[1.02]'
          ]"
        >
          <span v-if="isPurchasing" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>{{ getPriceForPlan(selectedPlan) }} Subscribe Now</span>
        </button>

        <!-- Additional Links -->
        <div class="text-center">
          <div class="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <a href="https://www.eduninja.com/terms" target="_blank" class="underline hover:text-gray-700 dark:hover:text-gray-300">Terms Of Service</a>
            <span>and</span>
            <a href="https://www.eduninja.com/privacy" target="_blank" class="underline hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CleanGradientBackground from '@/components/CleanGradientBackground.vue'
import Footer from '@/views/Landing/Footer.vue'

const router = useRouter()
const selectedPlan = ref('yearly')
const isPurchasing = ref(false)

const getPriceForPlan = (plan) => {
  const prices = {
    monthly: '¥68.00',
    yearly: '¥198.00',
    quarterly: '¥128.00'
  }
  return prices[plan] || '¥68.00'
}

const handleSubscribe = async (plan) => {
  isPurchasing.value = true
  try {
    console.log(`Subscribing to ${plan} plan`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(`Successfully subscribed to ${plan.toUpperCase()} plan!`)
    // Redirect to library or dashboard
    router.push('/library')
  } catch (error) {
    alert('Subscription failed. Please try again.')
  } finally {
    isPurchasing.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
</style>
