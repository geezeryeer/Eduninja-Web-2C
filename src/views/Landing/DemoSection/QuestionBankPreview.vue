<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Questionbank</h3>
      <p class="text-gray-600">Access thousands of categorized questions from past papers and practice materials.</p>
    </div>

    <!-- 问题分类展示 -->
    <div class="grid gap-4">
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 border shadow-sm">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Algebra</h4>
                <p class="text-sm text-gray-600">245 questions</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border shadow-sm">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Calculus</h4>
                <p class="text-sm text-gray-600">189 questions</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border shadow-sm">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Statistics</h4>
                <p class="text-sm text-gray-600">156 questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 示例问题 -->
    <div class="bg-white rounded-lg border shadow-sm p-6">
      <h4 class="font-semibold text-gray-900 mb-4">Sample Question</h4>
      <div class="space-y-3">
        <p class="text-gray-700">
          <strong>Q1.</strong> Find the value of x in the equation 2x + 5 = 13
        </p>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            <strong>Solution:</strong> 2x + 5 = 13 → 2x = 8 → x = 4
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>
