<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Prediction Exams</h3>
      <p class="text-gray-600">AI-powered predictions for upcoming exams based on past patterns and trends.</p>
    </div>

    <!-- AI 预测展示 -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900">AI Prediction Model</h4>
          <p class="text-sm text-gray-600">85% accuracy rate</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 border shadow-sm">
          <h5 class="font-semibold text-gray-900 mb-3">Likely Topics (2024)</h5>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Calculus Applications</span>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">95%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Statistics & Probability</span>
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">87%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Complex Numbers</span>
              <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">72%</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border shadow-sm">
          <h5 class="font-semibold text-gray-900 mb-3">Predicted Difficulty</h5>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700">Easy Questions</span>
                <span class="text-gray-600">30%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 30%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700">Medium Questions</span>
                <span class="text-gray-600">50%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 50%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-700">Hard Questions</span>
                <span class="text-gray-600">20%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" style="width: 20%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>
