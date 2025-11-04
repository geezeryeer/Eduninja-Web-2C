<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-8">
        <!-- Main Title -->
        <div class="mb-4">
          <h1 class="text-7xl font-semibold text-gray-900 tracking-wider">Contact Us</h1>
        </div>
        
        <!-- Description and EduNinja -->
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600 text-lg">
            Email us directly at <a href="mailto:service@eduninja.net" class="text-blue-600 font-medium hover:text-blue-800 hover:underline">service@eduninja.net</a> or use the form below.
          </p>
          <h2 class="text-2xl font-bold text-gray-900 ml-8">EduNinja</h2>
        </div>
        
        <!-- Full width divider line -->
        <div class="w-full h-0.5 bg-gray-900"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <div class="max-w-2xl">
        <!-- Contact Form -->
        <form @submit.prevent="submitForm" class="space-y-12">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-lg font-bold text-gray-900 mb-4">
            Your email <span class="text-red-500">*</span>
          </label>
          <textarea
            id="email"
            v-model="form.email"
            rows="1"
            required
            class="w-full px-0 py-2 bg-transparent border-0 border-b-2 text-black text-lg placeholder-gray-400 focus:outline-none transition-colors duration-300 resize-none overflow-hidden"
            :class="form.email ? 'border-black' : 'border-gray-300 focus:border-black'"
            placeholder="your.email@example.com"
            @input="autoResize"
          ></textarea>
        </div>

        <!-- About Yourself Field -->
        <div>
          <label for="about" class="block text-lg font-bold text-gray-900 mb-4">
            Tell us about yourself! (optional)
          </label>
          <textarea
            id="about"
            v-model="form.about"
            rows="1"
            class="w-full px-0 py-2 bg-transparent border-0 border-b-2 text-black text-lg placeholder-gray-400 focus:outline-none transition-colors duration-300 resize-none overflow-hidden"
            :class="form.about ? 'border-black' : 'border-gray-300 focus:border-black'"
            placeholder="Your school, name, year, subjects you take..."
            @input="autoResize"
          ></textarea>
        </div>

        <!-- Message Field -->
        <div>
          <label for="message" class="block text-lg font-bold text-gray-900 mb-4">
            What's up? <span class="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            v-model="form.message"
            rows="1"
            required
            class="w-full px-0 py-2 bg-transparent border-0 border-b-2 text-black text-lg placeholder-gray-400 focus:outline-none transition-colors duration-300 resize-none overflow-hidden"
            :class="form.message ? 'border-black' : 'border-gray-300 focus:border-black'"
            placeholder="Report a bug, give a feature suggestion etc"
            @input="autoResize"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="pt-1">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center px-8 py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            <span v-if="!isSubmitting" class="flex items-center">
              Submit
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          </button>
        </div>
        </form>

        <!-- Success Message -->
      <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Thank you for your message! We'll get back to you soon.
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="showError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Config } from '@/services/config.js'

// Form data
const form = reactive({
  email: '',
  about: '',
  message: ''
})

// API endpoint - 使用统一的配置文件
const API_BASE_URL = Config.APIURL
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' // 默认使用真实API，除非明确设置为模拟模式

// Form state
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Auto resize textarea
const autoResize = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// Submit form
const submitForm = async () => {
  isSubmitting.value = true
  showSuccess.value = false
  showError.value = false
  errorMessage.value = ''

  try {
    // Prepare request data according to API specification
    const requestData = {
      content: {
        imageList: [], // No image upload for now
        text: form.message
      },
      email: form.email,
      userId: 0, // Default user ID for anonymous feedback
      userName: form.about || 'Anonymous' // Use about field as userName, fallback to Anonymous
    }

    console.log('Submitting feedback:', requestData)

    if (USE_MOCK_API) {
      // 模拟API调用 - 用于开发和测试
      console.log('Using mock API mode')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟成功响应
      const mockResult = {
        code: "200",
        data: Date.now(),
        message: "Feedback submitted successfully",
        successful: true
      }
      
      console.log('Mock API response:', mockResult)
      
      // Show success message
      showSuccess.value = true
      
      // Reset form
      form.email = ''
      form.about = ''
      form.message = ''
      
      // Reset textarea heights
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea')
        textareas.forEach(textarea => {
          textarea.style.height = 'auto'
        })
      }, 100)
      
    } else {
      // 真实API调用
      const apiUrl = `${API_BASE_URL}/api/wx/sys/feedback/add`
      console.log('Making real API call to:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        mode: 'cors', // 明确指定CORS模式
        timeout: Config.TIMEOUT.DEFAULT
      })

      const result = await response.json()
      console.log('API response:', result)

      if (result.successful) {
        // Show success message
        showSuccess.value = true
        
        // Reset form
        form.email = ''
        form.about = ''
        form.message = ''
        
        // Reset textarea heights
        setTimeout(() => {
          const textareas = document.querySelectorAll('textarea')
          textareas.forEach(textarea => {
            textarea.style.height = 'auto'
          })
        }, 100)
      } else {
        throw new Error(result.message || 'Failed to submit feedback')
      }
    }
    
  } catch (error) {
    console.error('Error submitting form:', error)
    showError.value = true
    
    // 提供更友好的错误信息
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage.value = 'Unable to connect to server. Please check your internet connection and try again.'
    } else if (error.message.includes('ERR_CONNECTION_CLOSED')) {
      errorMessage.value = 'Connection to server was lost. Please try again later.'
    } else {
      errorMessage.value = error.message || 'Something went wrong. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
