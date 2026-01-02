<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">E</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          登录到 EduNinja
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          AI驱动的学习助手
        </p>
      </div>
      <div class="mt-8 space-y-6">
        <p class="text-center text-gray-600">登录功能正在开发中...</p>
        <div class="text-center">
          <button
            @click="$router.push('/')"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 临时的登录页面
</script>
