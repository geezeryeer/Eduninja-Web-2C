<template>
  <div class="h-full bg-[#F9F9F9]/90 backdrop-blur-xl">
    <AIChatPanel 
      :initialMessages="currentMessages" 
      :title="title"
      :key="mode" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AIChatPanel from '@/views/Library/AIPanel/AIChatPanel.vue'
import { convertToMessages } from './aiDemoMessages'

const props = defineProps({
  mode: {
    type: String,
    default: 'prediction'
  },
  title: {
    type: String,
    default: 'Ninja AI'
  }
})

// 从配置文件加载所有示例对话
const messagesByMode = convertToMessages()

// 根据当前模式返回对应的消息
const currentMessages = computed(() => {
  return messagesByMode[props.mode] || messagesByMode.prediction
})
</script>

<style scoped>
/* 隐藏 AIChatPanel 中不需要在 demo 中显示的元素 */
:deep(.absolute.-left-2) {
  /* 隐藏拖拽手柄 */
  display: none;
}
</style>
