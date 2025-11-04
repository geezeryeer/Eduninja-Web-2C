<template>
  <div class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Section with CTA -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Join Thousands of Students Who Trust EduNinja
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Start your journey to academic excellence with curriculum-specific resources trusted by students worldwide
        </p>
        <button 
          @click="handleTryFree"
          class="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Try Free
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>
      </div>
      
      <!-- Reviews Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
        >
          <!-- Star Rating -->
          <div class="flex items-center mb-3">
            <div class="flex space-x-1">
              <svg v-for="i in testimonial.rating" :key="i" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>

          <!-- Review Content -->
          <p class="text-gray-600 text-sm leading-relaxed mb-4">{{ testimonial.content }}</p>

          <!-- User Info -->
          <div class="flex items-center">
            <div class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-sm font-medium">
              {{ testimonial.name.charAt(0) }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ testimonial.name }}</p>
              <p class="text-xs text-gray-500">{{ testimonial.school }}</p>
            </div>
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

// 处理 Try Free 按钮点击
const handleTryFree = () => {
  router.push('/library')
}

// 用户评价数据
const testimonials = ref([
  {
    id: 1,
    name: 'Sarah L.',
    school: 'A-Level Student, UK',
    content: 'Been using this for A-Level Physics revision. The past paper solutions are really helpful, especially for Paper 4. AI explanations are pretty good but sometimes a bit too detailed. Overall solid resource though.',
    rating: 4,
    date: '3 days ago'
  },
  {
    id: 2,
    name: 'James Park',
    school: 'IB DP Year 2',
    content: 'The Math HL question bank is a lifesaver. Tons of practice questions organized by topic. Wish there were more video explanations, but the written solutions are clear enough. Helped me a lot with calculus.',
    rating: 5,
    date: '1 week ago'
  },
  {
    id: 3,
    name: 'Aisha M.',
    school: 'A-Level Student, Malaysia',
    content: 'Good for Economics 9708. The mark scheme breakdown is useful. Some questions are repeated from older papers but still good practice. Interface could be cleaner but it works.',
    rating: 4,
    date: '2 weeks ago'
  },
  {
    id: 4,
    name: 'Chen Wei',
    school: 'IGCSE Student',
    content: 'Using it for IGCSE Maths 0580 and Additional Maths 0606. Way better than just buying past paper books. Can filter by topic which saves so much time. Only complaint is some solutions load slowly.',
    rating: 4,
    date: '2 weeks ago'
  },
  {
    id: 5,
    name: 'Emma R.',
    school: 'IB Student, Singapore',
    content: 'The Biology HL resources helped me finally understand cellular respiration lol. Questions are similar to actual IB exam style. Not perfect but way more convenient than digging through my textbook.',
    rating: 4,
    date: '3 weeks ago'
  },
  {
    id: 6,
    name: 'Miguel S.',
    school: 'AP Student',
    content: 'AP Chem practice is decent. Good variety of FRQs. The AI feedback is hit or miss - sometimes really helpful, sometimes states the obvious. Still recommend it for the question collection alone.',
    rating: 3,
    date: '1 month ago'
  }
])
</script>
