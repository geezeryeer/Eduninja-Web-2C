<template>
  <div class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Trusted by the Best
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Join elite students from world-renowned international schools who choose EduNinja for their academic excellence
        </p>
      </div>

      <!-- Statistics Cards - simplified -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div class="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 hover:bg-blue-100">
          <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">30,000+</div>
          <div class="text-gray-600 font-medium">Active Students</div>
        </div>
        
        <div class="bg-purple-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 hover:bg-purple-100">
          <div class="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">50+</div>
          <div class="text-gray-600 font-medium">Subjects Covered</div>
        </div>
        
        <div class="bg-green-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 hover:bg-green-100">
          <div class="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
          <div class="text-gray-600 font-medium">Practice Questions</div>
        </div>
        
        <div class="bg-orange-50 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 hover:bg-orange-100">
          <div class="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">4</div>
          <div class="text-gray-600 font-medium">Major Curricula</div>
        </div>
      </div>

      <!-- Trusted Schools Section -->
      <div class="text-center">
        <p class="text-lg text-gray-600 mb-8 font-medium">Trusted by students from leading international schools</p>
        
        <!-- Scrolling schools section -->
        <div class="relative overflow-hidden bg-gray-50 rounded-2xl py-8">
          <div class="flex animate-scroll-infinite">
            <!-- 第一组 -->
            <div class="flex items-center space-x-12 px-6">
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Hong Kong International School</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Singapore American School</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Dulwich College Shanghai</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">International School of Geneva</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Wellington College International</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">United World College SEA</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">International School of Beijing</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Harrow International School</div>
            </div>
            <!-- 第二组（重复，用于无缝循环） -->
            <div class="flex items-center space-x-12 px-6">
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Hong Kong International School</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Singapore American School</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Dulwich College Shanghai</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">International School of Geneva</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Wellington College International</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">United World College SEA</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">International School of Beijing</div>
              <div class="text-2xl font-bold text-gray-400 whitespace-nowrap">Harrow International School</div>
            </div>
          </div>
          
          <!-- 渐变遮罩效果 -->
          <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Trust & Security Section 组件
</script>

<style scoped>
@keyframes scroll-infinite {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll-infinite {
  animation: scroll-infinite 30s linear infinite;
}

.animate-scroll-infinite:hover {
  animation-play-state: paused;
}
</style>
