<template>
  <div class="py-24 relative z-10 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
      
      <!-- 1. Header Section -->
      <!-- 使用更现代的排版：大标题 + 细致的副标题 -->
      <div class="text-center max-w-3xl mx-auto mb-20">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
          Trusted by students worldwide
        </h2>
        <p class="text-lg md:text-xl text-gray-500 font-light">
          Join a global community of high achievers mastering their exams
        </p>
      </div>

      <!-- 2. Statistics Grid -->
      <!-- 采用 Bento Grid 风格布局，增加视觉趣味和高级感 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        <!-- Card 1: Students -->
        <div class="relative group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <!-- 背景装饰 -->
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="relative z-10">
            <div class="text-5xl font-bold text-gray-900 tracking-tight mb-2">30k+</div>
            <div class="text-base font-medium text-gray-500">Active Students</div>
          </div>
        </div>
        
        <!-- Card 2: Subjects -->
        <div class="relative group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
          </div>
          <div class="relative z-10">
            <div class="text-5xl font-bold text-gray-900 tracking-tight mb-2">50+</div>
            <div class="text-base font-medium text-gray-500">Subjects Covered</div>
          </div>
        </div>
        
        <!-- Card 3: Questions -->
        <div class="relative group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-24 h-24 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>
          <div class="relative z-10">
            <div class="text-5xl font-bold text-gray-900 tracking-tight mb-2">10k+</div>
            <div class="text-base font-medium text-gray-500">Practice Questions</div>
          </div>
        </div>
        
        <!-- Card 4: Curricula -->
        <div class="relative group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
           <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg class="w-24 h-24 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z"/></svg>
          </div>
          <div class="relative z-10">
            <div class="text-5xl font-bold text-gray-900 tracking-tight mb-2">4</div>
            <div class="text-base font-medium text-gray-500">Major Curricula</div>
          </div>
        </div>
      </div>

      <!-- 3. Trusted Schools Section -->
      <!-- 使用更优雅的 Marquee 效果，让校名看起来更像 LOGO 墙 -->
      <div class="relative">
        <p class="text-center text-sm font-medium text-gray-400 uppercase tracking-widest mb-10">
          Trusted by students from leading schools
        </p>
        
        <div class="relative w-full overflow-hidden">
          <!-- 渐变遮罩 (左右淡出) -->
          <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-20"></div>
          <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-20"></div>
          
          <div class="flex animate-scroll-infinite hover:pause">
            <!-- 第一组 -->
             <div class="flex items-center gap-16 px-8">
               <span class="school-logo">Hong Kong International School</span>
               <span class="school-logo">Singapore American School</span>
               <span class="school-logo">Dulwich College</span>
               <span class="school-logo">UWC South East Asia</span>
               <span class="school-logo">Wellington College</span>
               <span class="school-logo">ISB Beijing</span>
               <span class="school-logo">Harrow International</span>
               <span class="school-logo">Shanghai American School</span>
            </div>
             <!-- 第二组 (无缝循环) -->
             <div class="flex items-center gap-16 px-8">
               <span class="school-logo">Hong Kong International School</span>
               <span class="school-logo">Singapore American School</span>
               <span class="school-logo">Dulwich College</span>
               <span class="school-logo">UWC South East Asia</span>
               <span class="school-logo">Wellington College</span>
               <span class="school-logo">ISB Beijing</span>
               <span class="school-logo">Harrow International</span>
               <span class="school-logo">Shanghai American School</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Trust Section
</script>

<style scoped>
.school-logo {
  @apply text-xl md:text-2xl font-serif text-gray-400 whitespace-nowrap opacity-80 hover:opacity-100 hover:text-gray-900 transition-all duration-300 cursor-default select-none;
}

/* 暂停动画 */
.hover\:pause:hover {
  animation-play-state: paused;
}

@keyframes scroll-infinite {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll-infinite {
  animation: scroll-infinite 40s linear infinite;
  width: max-content; /* 确保宽度足够容纳所有内容 */
}
</style>
