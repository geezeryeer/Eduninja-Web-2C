<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
    <!-- Modal Container -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl relative overflow-hidden">
      
      <!-- Fixed Close Button -->
      <button 
        @click="closeModal"
        class="absolute top-4 right-6 z-20 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto">
        <div class="px-6">
          <!-- Top Spacing for Close Button -->
          <div class="h-10"></div>

          <!-- Title Section -->
          <div class="mb-1">
            <div class="flex items-center gap-2 mb-1.5">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white">EduNinja</h1>
              <span class="text-lg font-semibold text-white bg-gradient-to-r from-slate-500 to-slate-600 px-3.5 py-1.5 rounded-lg">Pro</span>
            </div>
            
            <div class="flex items-center gap-2 mb-4">
              <div class="w-0.5 h-5 bg-gray-500 dark:bg-gray-400"></div>
              <p class="text-base font-medium text-gray-600 dark:text-gray-300">AI Companion build for your curriculum</p>
            </div>
          </div>

          <!-- Subscription Cards (Horizontal Scroll) -->
          <div class="mb-4 -mx-6 px-6">
            <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
              <!-- Monthly Card -->
              <div 
                @click="selectedPlan = 'monthly'"
                :class="[
                  'flex-shrink-0 w-[56%] min-w-[280px] bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 cursor-pointer transition-all duration-200 snap-start',
                  selectedPlan === 'monthly' ? 'ring-2 ring-slate-500 dark:ring-slate-400' : 'ring-1 ring-gray-300 dark:ring-gray-600'
                ]"
              >
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Monthly</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-tight min-h-[40px]">Monthly subscription with full access to all features</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">¥68.00</p>
              </div>

              <!-- Yearly Card (with Badge) -->
              <div 
                @click="selectedPlan = 'yearly'"
                :class="[
                  'flex-shrink-0 w-[56%] min-w-[280px] bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 cursor-pointer transition-all duration-200 snap-start relative',
                  selectedPlan === 'yearly' ? 'ring-2 ring-slate-500 dark:ring-slate-400' : 'ring-1 ring-gray-300 dark:ring-gray-600'
                ]"
              >
                <div class="flex items-start justify-between mb-2">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Yearly</h3>
                  <span class="text-xs font-semibold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">Save more</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-tight min-h-[40px]">Save more! Yearly plan unlocks all premium features.<br>one week Free trial</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">¥198.00</p>
              </div>

              <!-- Quarterly Card -->
              <div 
                @click="selectedPlan = 'quarterly'"
                :class="[
                  'flex-shrink-0 w-[56%] min-w-[280px] bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 cursor-pointer transition-all duration-200 snap-start',
                  selectedPlan === 'quarterly' ? 'ring-2 ring-slate-500 dark:ring-slate-400' : 'ring-1 ring-gray-300 dark:ring-gray-600'
                ]"
              >
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Quarterly</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-tight min-h-[40px]">Quarterly plan with all features</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">¥128.00</p>
              </div>
            </div>
          </div>

          <!-- Features List -->
          <div class="px-1">
            <div class="space-y-0">
              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Unlimited block(Basic Version: up to 200 blocks)</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Magic Blocks: Weather, Health, Sketch, CountDown, Mood, Location, Link, Music, Media</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Block Studio</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Block Reference</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Bidirectional Link</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">16 Themes</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Export to TXT, PDF, Images, OPML</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Password lock for selected pages</p>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 ml-12"></div>

              <div class="flex items-start gap-3 py-3.5 px-1">
                <svg class="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-base text-gray-900 dark:text-white leading-relaxed">Attach Files and Images</p>
              </div>
            </div>
          </div>

          <!-- Bottom Spacing for Fixed Footer -->
          <div class="h-32"></div>
        </div>
      </div>

      <!-- Fixed Bottom Section -->
      <div class="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <!-- Main Subscribe Button -->
        <button 
          @click="handleSubscribe(selectedPlan)"
          :disabled="isPurchasing"
          :class="[
            'w-full py-4 px-4 rounded-xl font-semibold text-lg text-white transition-all duration-200 mb-2.5',
            isPurchasing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700'
          ]"
        >
          <span v-if="isPurchasing" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>{{ getPriceForPlan(selectedPlan) }} Upgrade Now</span>
        </button>

        <!-- Restore Purchases Button -->
        <button 
          @click="handleRestore"
          :disabled="isRestoring"
          class="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 mb-2"
        >
          <span v-if="isRestoring" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Restoring...
          </span>
          <span v-else>Restore Purchases</span>
        </button>

        <!-- Terms and Privacy -->
        <div class="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <a href="https://www.eduninja.com/terms" target="_blank" class="underline hover:text-gray-700 dark:hover:text-gray-300">Terms Of Service</a>
          <span>and</span>
          <a href="https://www.eduninja.com/privacy" target="_blank" class="underline hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
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
const isRestoring = ref(false)

const closeModal = () => {
  router.go(-1)
}

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
    closeModal()
  } catch (error) {
    alert('Subscription failed. Please try again.')
  } finally {
    isPurchasing.value = false
  }
}

const handleRestore = async () => {
  isRestoring.value = true
  try {
    console.log('Restoring purchases...')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('Purchases restored successfully!')
  } catch (error) {
    alert('Failed to restore purchases.')
  } finally {
    isRestoring.value = false
  }
}
</script>

<style scoped>
/* Hide scrollbar for horizontal scroll */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
