<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Past Papers</h3>
      <p class="text-gray-600">Official past papers with detailed solutions and marking schemes.</p>
    </div>

    <!-- 年份选择 -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
      <h4 class="font-semibold text-gray-900 mb-4">Available Years</h4>
      <div class="grid grid-cols-4 gap-3">
        <div v-for="year in years" :key="year" class="bg-white rounded-lg p-3 text-center border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div class="text-lg font-semibold text-gray-900">{{ year }}</div>
          <div class="text-xs text-gray-600">Papers</div>
        </div>
      </div>
    </div>

    <!-- 示例试卷 -->
    <div class="bg-white rounded-lg border shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-semibold text-gray-900">Mathematics A-Level 2023</h4>
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Available</span>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center text-sm">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Paper 1 - Pure Mathematics</span>
          </div>
          <div class="flex items-center text-sm">
            <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Paper 2 - Statistics & Mechanics</span>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center text-sm">
            <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Duration: 2 hours each</span>
          </div>
          <div class="flex items-center text-sm">
            <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Marking scheme included</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const years = [2023, 2022, 2021, 2020]
</script>
