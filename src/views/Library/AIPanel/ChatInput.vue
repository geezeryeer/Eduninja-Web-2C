<template>
  <div class="px-3 pb-4 pt-2 relative group">
    <!-- Mention Menu -->
    <MentionMenu
      ref="mentionMenuRef"
      :visible="showMentionMenu"
      :filter-text="mentionFilter"
      :subject-info="subjectInfo"
      @select="selectMention"
      @close="showMentionMenu = false"
    />

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*,.pdf,.doc,.docx,.txt"
      class="hidden"
      @change="handleFileChange"
    />
    
    <div class="bg-gray-200/70 rounded-[24px] px-1 py-1 transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-500/20">
      <div class="px-3 pt-2">
      <!-- 输入框区域 -->
        <div class="max-h-[200px] overflow-y-auto custom-scrollbar mb-1.5">
        <textarea
          ref="textareaRef"
          :value="modelValue"
          :disabled="isTyping"
            placeholder="Send a message..."
          rows="1"
            class="w-full bg-transparent border-0 focus:outline-none resize-none text-[15px] text-gray-900 placeholder-gray-500 leading-[24px]"
            style="height: 24px; overflow: hidden;"
          @input="handleInput"
            @keydown="handleKeydown"
        />
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex items-center justify-between px-2 pb-1">
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200/80 flex items-center justify-center transition-all active:scale-95 text-gray-500 hover:text-gray-700"
            title="@ mention"
            @click="handleAtClick"
          >
            <div 
              class="w-5 h-5 icon-mask bg-current"
              :style="iconStyle(atIcon)"
            />
          </button>
          
          <button
            class="w-8 h-8 rounded-full hover:bg-gray-200/80 flex items-center justify-center transition-all active:scale-95 text-gray-500 hover:text-gray-700"
            title="Attach file"
            @click="triggerFileInput"
          >
            <div 
              class="w-5 h-5 icon-mask bg-current"
              :style="iconStyle(uploadIcon)"
            />
          </button>
        </div>
        
        <button
          :disabled="isSendDisabled"
          :class="sendButtonClass"
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm duration-200"
          @click="handleSend"
        >
          <div 
            class="w-4 h-4 text-white icon-mask bg-current"
            :class="{ 'animate-spin': isTyping }"
            :style="iconStyle(isTyping ? loadingIcon : sendIcon)"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import MentionMenu from './MentionMenu.vue'
import atIcon from '@/assets/Icon/at.svg'
import uploadIcon from '@/assets/Icon/paperclip.svg'
import sendIcon from '@/assets/Icon/arrow.up.svg'
import loadingIcon from '@/assets/Icon/arrow.down.right.and.arrow.up.left.svg'

// ==================== Props & Emits ====================
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isTyping: {
    type: Boolean,
    default: false
  },
  subjectInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'send', 'file-upload', 'mention-click'])

// ==================== Constants ====================
const MIN_HEIGHT = 24
const MAX_HEIGHT = 176

// ==================== Refs ====================
const textareaRef = ref(null)
const fileInputRef = ref(null)
const mentionMenuRef = ref(null)
const showMentionMenu = ref(false)
const mentionTriggerIdx = ref(-1)
const mentionFilter = ref('')

// ==================== Computed ====================
const hasContent = computed(() => props.modelValue.trim().length > 0)

const isSendDisabled = computed(() => !props.modelValue.trim() || props.isTyping)

const sendButtonClass = computed(() => 
  props.modelValue.trim() && !props.isTyping
    ? 'bg-black hover:bg-gray-800 scale-100 opacity-100'
    : 'bg-gray-200 cursor-not-allowed text-gray-400'
)

// ==================== Methods ====================
const iconStyle = (icon) => ({
  '-webkit-mask-image': `url(${icon})`
})

const adjustHeight = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  textarea.style.height = `${MIN_HEIGHT}px`
  
  if (textarea.scrollHeight > MIN_HEIGHT) {
    const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT)
    textarea.style.height = `${newHeight}px`
  }
}

const handleInput = (e) => {
  const val = e.target.value
  emit('update:modelValue', val)
  nextTick(adjustHeight)
  
  const cursor = e.target.selectionStart
  const textBeforeCursor = val.slice(0, cursor)
  
  // Detect @ trigger
  if (textBeforeCursor.endsWith('@')) {
    showMentionMenu.value = true
    mentionTriggerIdx.value = cursor // Start of filter text
    mentionFilter.value = ''
  } else if (showMentionMenu.value) {
    // Check if we should close
    if (cursor < mentionTriggerIdx.value) {
      showMentionMenu.value = false
      return
    }
    
    // Get filter text
    const query = val.slice(mentionTriggerIdx.value, cursor)
    
    // Close if space typed
    if (query.includes(' ')) {
       showMentionMenu.value = false
       return
    }
    
    mentionFilter.value = query
  }
}

const handleKeydown = (e) => {
  // Delegate to MentionMenu first
  if (showMentionMenu.value && mentionMenuRef.value) {
    const handled = mentionMenuRef.value.handleKeydown(e)
    if (handled) return
  }
  
  // Normal send on Enter
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const selectMention = (item) => {
  if (!item) return
  
  const val = props.modelValue
  const before = val.slice(0, mentionTriggerIdx.value - 1) // Remove the @
  const after = val.slice(textareaRef.value.selectionStart)
  
  // Insert format: @ItemLabel + space
  const mentionText = `@${item.label} `
  const newVal = before + mentionText + after
  
  emit('update:modelValue', newVal)
  showMentionMenu.value = false
  
  nextTick(() => {
    adjustHeight()
    // Set cursor position after the inserted mention
    const newCursorPos = before.length + mentionText.length
    if (textareaRef.value) {
      textareaRef.value.focus()
      textareaRef.value.setSelectionRange(newCursorPos, newCursorPos)
    }
  })
}

const handleAtClick = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  const cursor = textarea.selectionStart
  const val = props.modelValue
  const before = val.slice(0, cursor)
  const after = val.slice(cursor)
  
  // Insert @ at current cursor
  const newVal = before + '@' + after
  emit('update:modelValue', newVal)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(cursor + 1, cursor + 1)
    
    // Trigger menu
    showMentionMenu.value = true
    mentionTriggerIdx.value = cursor + 1
    mentionFilter.value = ''
  })
}

const handleSend = () => {
  if (isSendDisabled.value) return
  emit('send')
  showMentionMenu.value = false // Ensure menu closed
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = `${MIN_HEIGHT}px`
    }
  })
}

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    emit('file-upload', file)
    event.target.value = ''
  }
}
</script>

