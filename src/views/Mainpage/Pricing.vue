<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
    <!-- Hero Section with Title -->
    <div class="relative pt-16 pb-8 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Main Title -->
        <div class="flex items-center justify-center gap-3 mb-3">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">EduNinja</h1>
          <span class="text-xl md:text-2xl font-semibold text-white bg-gradient-to-r from-slate-500 to-slate-600 px-4 py-1.5 rounded-lg shadow-lg">Pro</span>
        </div>
        
        <!-- Subtitle -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="w-0.5 h-5 bg-gray-500 dark:bg-gray-400"></div>
          <p class="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300">AI Companion build for your curriculum</p>
        </div>

        <p class="text-base text-gray-600 dark:text-gray-400">
          Choose the plan that works best for you
        </p>
      </div>
    </div>

    <!-- Pricing Cards Section -->
    <div class="max-w-6xl mx-auto px-6 pb-12">
      <div class="grid md:grid-cols-3 gap-6 mb-12">
          
        <!-- Monthly Plan -->
        <div 
          @click="selectedPlan = 'monthly'"
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl',
            selectedPlan === 'monthly' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-lg scale-[1.02]' : 'ring-1 ring-gray-200 dark:ring-gray-700'
          ]"
        >
          <div class="text-center mb-4">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly</h3>
            <div class="mb-2">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">¥68</span>
              <span class="text-gray-500 dark:text-gray-400 text-base">/month</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Perfect for short-term use
            </p>
          </div>
        </div>

        <!-- Yearly Plan (Most Popular) -->
        <div 
          @click="selectedPlan = 'yearly'"
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl',
            selectedPlan === 'yearly' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-lg scale-[1.02]' : 'ring-1 ring-gray-200 dark:ring-gray-700'
          ]"
        >
          <!-- Popular Badge -->
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Save More
            </span>
          </div>

          <div class="text-center mb-4 mt-2">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Yearly</h3>
            <div class="mb-1">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">¥198</span>
              <span class="text-gray-500 dark:text-gray-400 text-base">/year</span>
            </div>
            <div class="mb-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
              Save 51% · Just ¥16.5/month
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Best value · Free trial included
            </p>
          </div>
        </div>

        <!-- Quarterly Plan -->
        <div 
          @click="selectedPlan = 'quarterly'"
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl',
            selectedPlan === 'quarterly' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-lg scale-[1.02]' : 'ring-1 ring-gray-200 dark:ring-gray-700'
          ]"
        >
          <div class="text-center mb-4">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quarterly</h3>
            <div class="mb-2">
              <span class="text-4xl font-bold text-gray-900 dark:text-white">¥128</span>
              <span class="text-gray-500 dark:text-gray-400 text-base">/3 months</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Great balance of value
            </p>
          </div>
        </div>
      </div>

      <!-- Features List -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Everything Included in All Plans</h2>
          
          <div class="space-y-1">
            <!-- 1. AI功能 - 核心功能合并 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">AI-Powered Learning Assistant</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Unlimited photo search for instant answers + 300 AI calls/month for explanations and practice questions</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-8"></div>

            <!-- 2. 访问完整题库 - 学习基础 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">Access to Full Question Bank</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Browse and practice with thousands of past exam questions</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-8"></div>

            <!-- 3. 自定义组题 - 练习核心 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">Custom Question Paper Generator</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Create your own practice papers by selecting questions</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-8"></div>

            <!-- 4. 下载资料 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">Download 4 Resources per Month</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Access past papers, mark schemes, and study materials</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-8"></div>

            <!-- 5. 云存储 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">5GB Cloud Storage</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Store your study materials, notes, and resources securely</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-8"></div>

            <!-- 6. Flashcard学习 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">Flashcard Creation & Study</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Create and review flashcards for efficient learning</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 ml-8"></div>

            <!-- 7. 导出PDF - 放到最后 -->
            <div class="flex items-start gap-3 py-3">
              <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-base font-medium text-gray-900 dark:text-white">Export to PDF</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Convert AI responses and study notes into PDF format for easy review</p>
              </div>
            </div>
          </div>

      </div>

      <!-- Subscribe Button -->
      <div class="max-w-2xl mx-auto">
        <button 
          @click="handleSubscribe(selectedPlan)"
          :disabled="isPurchasing"
          :class="[
            'w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-200 shadow-lg mb-4',
            isPurchasing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 hover:shadow-xl transform hover:scale-[1.02]'
          ]"
        >
          <span v-if="isPurchasing" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>{{ getPriceForPlan(selectedPlan) }} Subscribe Now</span>
        </button>

        <!-- Trust Badge -->
        <div class="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">7-day money-back guarantee</span>
        </div>

        <!-- Additional Links -->
        <div class="text-center">
          <div class="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <a href="https://www.eduninja.com/terms" target="_blank" class="underline hover:text-gray-700 dark:hover:text-gray-300">Terms Of Service</a>
            <span>and</span>
            <a href="https://www.eduninja.com/privacy" target="_blank" class="underline hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
