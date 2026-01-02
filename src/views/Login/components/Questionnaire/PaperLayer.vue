<template>
  <div 
    class="relative w-full rounded-lg overflow-hidden h-full flex flex-col select-none transition-shadow duration-300"
    :class="[
      isActive ? 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]' : 'shadow-md',
      isDone ? 'brightness-[0.98] grayscale-[0.1]' : ''
    ]"
    style="background-color: #fdfdfc;"
  >
    <!-- Realistic Paper Texture Background -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <!-- Base Texture -->
      <div class="absolute inset-0 opacity-[0.6]"
        style="background-image: url('https://www.transparenttextures.com/patterns/cardboard-flat.png'); background-size: 300px;"
      ></div>
      
      <!-- Subtle Gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent"></div>
      
      <!-- Noise -->
      <div class="absolute inset-0 opacity-[0.03]"
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E');"
      ></div>
    </div>

    <!-- Header Info -->
    <div class="relative z-10 px-8 sm:px-12 pt-8 pb-2 flex justify-between items-center opacity-40 border-b border-black/5 mx-8">
      <div class="text-[10px] font-bold tracking-[0.2em] uppercase font-sans text-gray-900">
        Eduninja
      </div>
    </div>

    <!-- Paper Content -->
    <div class="relative z-10 flex-1 px-8 sm:px-12 py-8 flex flex-col min-h-0">
      <!-- Main Content Slot -->
      <div class="flex-1 overflow-y-auto custom-scrollbar relative">
        <slot></slot>
      </div>
    </div>

    <!-- Done Overlay (Subtle) -->
    <div 
      v-if="isDone" 
      class="absolute inset-0 bg-[#fdfdfc]/60 z-20 transition-opacity duration-500 backdrop-blur-[0.5px]"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  isActive: { type: Boolean, default: false },
  isDone: { type: Boolean, default: false },
  sceneNumber: { type: [Number, String], default: 1 }
})
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
