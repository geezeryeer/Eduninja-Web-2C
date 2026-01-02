<template>
  <div class="h-full flex flex-col font-serif">
    <!-- Header -->
    <div class="mb-10 mt-2 text-center border-b border-gray-200 pb-6">
      <div class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
        From the Founders
      </div>
      <h2 class="text-2xl font-medium text-gray-900 tracking-tight">
        Welcome to Eduninja
      </h2>
    </div>

    <!-- Body Content -->
    <div class="mb-12 space-y-6 text-[17px] leading-relaxed text-gray-800">
      <p>
        <span class="font-bold text-black bg-yellow-100/50 px-1">We built Eduninja with a simple mission.</span>
      </p>
      
      <p>
        Founded by students from <span class="font-semibold">UCL, Harvard, and Princeton</span>, we know exactly what it takes to excel in top-tier academics. We've combined our experience with advanced AI to create the ultimate learning companion.
      </p>

      <p>
        Whether you're tackling A-Levels, IB, or preparing for university applications, we're here to guide you through every step of the journey.
      </p>
    </div>

    <!-- Call to Action -->
    <div class="mt-auto flex flex-col items-center pb-8 space-y-6">
      <p class="text-sm text-gray-500 italic font-medium">
        Let's customize your personal AI tutor.
      </p>
      
      <button 
        @click="$emit('next')"
        class="group relative px-10 py-3.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
      >
        <div class="flex items-center justify-center gap-3">
          <span class="text-[15px] font-semibold tracking-wide">Start Setup</span>
          <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['next'])
</script>
