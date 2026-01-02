<template>
  <div class="font-serif pb-4">
    <!-- Question Header -->
    <div class="mb-12 text-center px-4 pt-4">
      <h2 class="text-3xl text-gray-900 leading-tight mb-4 font-semibold tracking-tight">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-gray-500 text-[17px] leading-relaxed italic max-w-lg mx-auto">
        {{ subtitle }}
      </p>
    </div>

    <!-- Options List -->
    <div class="px-4">
      <div class="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        <button
          v-for="option in options"
          :key="option.value"
          @click="$emit('select', option.value)"
          class="group relative block w-full text-left transition-all duration-300 transform active:scale-[0.99]"
        >
          <!-- Elegant Modern Card -->
          <div 
            class="relative flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300"
            :class="[
              modelValue === option.value
                ? 'bg-gray-900 border-gray-900 shadow-xl shadow-gray-200 translate-y-[-2px]'
                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100'
            ]"
          >
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <span v-if="option.icon" class="text-2xl transition-transform duration-300 group-hover:scale-110 origin-left">
                  {{ option.icon }}
                </span>
                <span class="text-[18px] font-semibold tracking-wide transition-colors duration-200"
                  :class="modelValue === option.value ? 'text-white' : 'text-gray-900'"
                >
                  {{ option.label }}
                </span>
              </div>
              
              <div v-if="option.description" class="text-[14px] font-sans leading-snug transition-colors pl-[calc(1.5rem+0.75rem)]"
                :class="modelValue === option.value ? 'text-gray-300' : 'text-gray-500'"
              >
                {{ option.description }}
              </div>
            </div>

            <!-- Indicator -->
            <div 
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0"
              :class="[
                modelValue === option.value
                  ? 'border-white bg-transparent'
                  : 'border-gray-200 group-hover:border-gray-400'
              ]"
            >
              <div 
                class="w-2.5 h-2.5 rounded-full bg-white transition-all duration-300"
                :class="modelValue === option.value ? 'scale-100' : 'scale-0'"
              ></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  options: Array,
  modelValue: String // Currently selected value
})

defineEmits(['select'])
</script>

<style scoped>
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
