<template>
  <section class="w-full bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden h-[330px]">
    <!-- 温暖柔和的背景装饰 -->
    <div class="absolute inset-0">
      <div class="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full filter blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-100/10 to-orange-100/10 rounded-full filter blur-3xl"></div>
    </div>

    <div class="relative w-full h-full">
      <div class="grid lg:grid-cols-2 gap-0 h-full">
        
        <!-- 左侧iPhone展示 - 填满整个左半部分 -->
        <div class="relative order-1 lg:order-1 overflow-hidden h-full">
          <!-- iPhone Demo 图片 - 完全填满容器 -->
          <img 
            :src="iphoneImage" 
            alt="iPhone App Demo" 
            class="w-full h-full object-contain drop-shadow-2xl scale-130"
          />
        </div>

        <!-- 右侧内容 -->
        <div class="relative order-2 lg:order-2 flex flex-col justify-center text-center lg:text-left px-8 lg:px-20">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Take Your Studies 
            <span class="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">On the Go</span>
          </h2>

          <p class="text-base text-gray-600 mb-8 leading-relaxed max-w-md">
            Access your personalized study materials anywhere with our iOS app.
          </p>

          <!-- 下载按钮 -->
          <div class="flex justify-center lg:justify-start">
            <!-- App Store 按钮 -->
            <a 
              href="#" 
              class="group inline-flex items-center justify-center px-5 py-2.5 bg-black hover:bg-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              @click="trackDownload('app-store')"
            >
              <div class="flex items-center space-x-2.5">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                <div class="text-left">
                  <div class="text-[10px] text-gray-300 uppercase tracking-wider font-medium">Download on the</div>
                  <div class="text-base font-semibold text-white -mt-0.5">App Store</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import iphoneImageUrl from '@/assets/images/iphone_demo.png'

// 图片引用
const iphoneImage = iphoneImageUrl

// iOS下载跟踪
const trackDownload = (platform) => {
  // 这里可以添加分析跟踪代码
  console.log(`Download tracked: ${platform}`)
  
  // iOS App Store链接
  const appStoreLink = 'https://apps.apple.com/app/your-app-id'
  
  // 打开App Store链接
  if (platform === 'app-store') {
    window.open(appStoreLink, '_blank')
  }
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 按钮悬停效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
