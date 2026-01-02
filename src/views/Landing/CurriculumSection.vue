<template>
  <div class="bg-white py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Built for Your Exact Curriculum
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlike generic study tools, EduNinja is specifically designed for international curricula with subject-specific content and exam formats.
        </p>
      </div>

      <!-- 课程体系卡片 -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- A-Level -->
        <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300">
          <div class="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <span class="text-white font-bold text-xl">IAL</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">A-Level</h3>
          <p class="text-gray-600 text-sm leading-relaxed">Past papers and resources for CIE, Edexcel & AQA exam boards</p>
        </div>

        <!-- IB -->
        <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300">
          <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm overflow-hidden p-3">
            <img :src="IBLogo" alt="IB Logo" class="w-full h-full object-contain">
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">IB Diploma</h3>
          <p class="text-gray-600 text-sm leading-relaxed">HL & SL subjects with IA support and exam preparation</p>
        </div>

        <!-- IGCSE -->
        <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300">
          <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm overflow-hidden">
            <img :src="IGCSELogo" alt="IGCSE Logo" class="w-full h-full object-cover">
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">IGCSE</h3>
          <p class="text-gray-600 text-sm leading-relaxed">Foundation-level past papers and comprehensive exam resources</p>
        </div>

        <!-- AP -->
        <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300">
          <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm overflow-hidden">
            <img :src="APLogo" alt="AP Logo" class="w-full h-full object-cover">
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">AP Courses</h3>
          <p class="text-gray-600 text-sm leading-relaxed">FRQ & MCQ practice with detailed exam strategies</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入logo
import ALevelLogo from '@/assets/images/ALevel-logo.png'
import IBLogo from '@/assets/images/IB_Logo.svg'
import IGCSELogo from '@/assets/images/IGCSE-logo.png'
import APLogo from '@/assets/images/AP_logo.svg'
</script>
