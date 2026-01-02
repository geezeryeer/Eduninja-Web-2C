<template>
  <!-- AI Response - Swift Playgrounds 风格 -->
  <div class="ai-response-container">
    <!-- 题目卡片列表（放在上面） -->
    <div v-if="questions && questions.length > 0" class="mb-4 space-y-3">
      <QuestionCard
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :questionNumber="index + 1"
        :showQuestionNumber="true"
        baseImageUrl=""
        @open-image="handleOpenImage"
      />
    </div>

    <!-- AI 回复内容（解析放在下面） -->
    <div class="ai-response-content">
      <div v-html="formattedContent" class="prose"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import QuestionCard from '@/views/Library/Page/QuestionCard.vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  questions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['open-image'])

const handleOpenImage = (imageUrl) => {
  emit('open-image', imageUrl)
}

// 简化的 markdown 解析，只保留最基础的格式化，提升性能
const formattedContent = computed(() => {
  let html = props.content || ''
  
  // XSS 防护：转义 HTML 特殊字符
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // 1. 代码块 (简化处理)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code class="language-$1">$2</code></pre>')
  
  // 2. 表格 (简化处理)
  // 如果内容包含表格符号，进行简单表格渲染
  if (html.includes('|')) {
    // 匹配表格：| header | ... |\n|---|---|\n| row | ... |
    // 使用更灵活的正则来处理多列表格和空行
    html = html.replace(/\|(.+)\|\s*\n\s*\|[\s\-:|]+\|\s*\n\s*((?:\|.+\|\s*\n?)+)/g, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').map(h => h.trim()).filter(h => h)
      const rows = bodyRows.trim().split('\n').map(r => {
        return r.split('|').map(c => c.trim()).filter(c => c !== '')
      }).filter(r => r.length > 0)
      
      let tableHtml = '<div class="table-wrapper"><table class="markdown-table"><thead><tr>'
      headers.forEach(h => tableHtml += `<th>${h}</th>`)
      tableHtml += '</tr></thead><tbody>'
      rows.forEach(r => {
        tableHtml += '<tr>'
        r.forEach(c => tableHtml += `<td>${c}</td>`)
        tableHtml += '</tr>'
      })
      tableHtml += '</tbody></table></div>'
      return tableHtml
    })
  }
  
  // 3. 基础 Markdown 元素 (Block Level)
  html = html
    .replace(/^#### (.*$)/gm, '<h4 class="heading-4">$1</h4>') // h4 (用于 References 等)
    .replace(/^### (.*$)/gm, '<h3 class="heading-3">$1</h3>') // h3
    .replace(/^## (.*$)/gm, '<h2 class="heading-2">$1</h2>') // h2
    .replace(/^# (.*$)/gm, '<h1 class="heading-1">$1</h1>') // h1
    .replace(/^\d+\.\s+(.*$)/gm, (match, content) => {
      // 检测是否是参考文献格式（通常在 References 部分）
      if (html.includes('References') || html.includes('参考文献')) {
        const number = match.match(/^(\d+)\./)[1]
        return `<div class="reference-item"><span class="reference-number">[${number}]</span> ${content}</div>`
      }
      return `<div class="list-item-ordered"><span class="list-marker">1.</span> ${content}</div>`
    }) // 有序列表 / 参考文献
    .replace(/^[-*]\s+(.*$)/gm, '<div class="list-item-unordered"><span class="list-dot">•</span> $1</div>') // 简化无序列表
    .replace(/^>\s+(.*$)/gm, '<blockquote class="quote">$1</blockquote>') // 引用块
    .replace(/^---$/gm, '<hr class="divider">') // 分隔线

  // 4. Inline Elements
  html = html
    .replace(/\*\*([^\*]+)\*\*/g, '<strong class="bold">$1</strong>') // Bold
    .replace(/\*([^\*]+)\*/g, '<em class="italic">$1</em>') // Italic
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>') // Inline code
    .replace(/\[(\d+)\]/g, '<sup class="citation" data-ref="$1">[$1]</sup>') // Citations [1], [2], etc.
  
  // 5. 处理换行 (最后进行)
  // 将双换行转换为段落间距，单换行转换为 <br>
  // 注意：此时块级元素(h1-h3, div, table, pre)已经生成，需要避免在它们周围添加多余的 <br>
  
  // 临时替换 \n\n 为占位符
  html = html.replace(/\n\n/g, '___PARAGRAPH_BREAK___')
  
  // 替换剩余的 \n 为 <br>
  html = html.replace(/\n/g, '<br>')
  
  // 恢复段落间距
  html = html.replace(/___PARAGRAPH_BREAK___/g, '<br><br>')
  
  // 清理块级元素后的多余换行
  // 移除 </h1>, </h2>, </h3>, </h4>, </div>, </table>, </pre>, </blockquote>, <hr> 后面紧跟的 <br>
  html = html.replace(/(<\/h[1234]>|<\/div>|<\/table>|<\/pre>|<\/blockquote>|<hr class="divider">)(<br>)+/g, '$1')
  
  // 移除开头和结尾的 <br>
  html = html.replace(/^(<br>)+|(<br>)+$/g, '')
  
  return html
})
</script>

<style scoped>
/* Swift Playgrounds 风格的 AI 回复样式 */
.ai-response-container {
  @apply w-full;
}

.ai-response-content {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #1d1d1f;
}

/* Prose 样式 */
.prose {
  @apply text-gray-900;
}

.prose :deep(.heading-2) {
  @apply text-[17px] font-bold text-gray-900 mt-5 mb-3;
}

.prose :deep(.heading-3) {
  @apply text-[16px] font-bold text-gray-900 mt-4 mb-2;
}

.prose :deep(.bold) {
  @apply font-semibold text-gray-900;
}

.prose :deep(.italic) {
  font-style: italic;
  @apply text-gray-700;
}

/* 简化列表样式 */
.prose :deep(.list-item-ordered),
.prose :deep(.list-item-unordered) {
  @apply pl-4 relative mb-1 text-gray-800;
}

.prose :deep(.list-dot) {
  @apply absolute left-0 text-gray-400 font-bold;
}

.prose :deep(.list-marker) {
  @apply absolute left-0 text-gray-400 font-bold;
}

.prose :deep(.inline-code) {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-[13px] text-red-600 font-mono;
}

.prose :deep(.code-block) {
  @apply bg-[#F5F5F7] rounded-lg p-3 my-2 overflow-x-auto text-[13px] font-mono leading-relaxed text-gray-800;
}

/* 表格容器 - 只让表格横向滚动 */
.prose :deep(.table-wrapper) {
  @apply overflow-x-auto my-2;
  /* 自定义滚动条 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.prose :deep(.table-wrapper)::-webkit-scrollbar {
  height: 6px;
}

.prose :deep(.table-wrapper)::-webkit-scrollbar-track {
  background: transparent;
}

.prose :deep(.table-wrapper)::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.prose :deep(.table-wrapper)::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 表格样式 - ChatGPT 风格（无外框） */
.prose :deep(.markdown-table) {
  @apply w-full text-sm;
  min-width: 100%;
  border-collapse: collapse;
}

.prose :deep(.markdown-table th) {
  @apply px-3 py-2 text-left font-semibold text-gray-700;
  font-size: 13px;
  border-bottom: 1.5px solid #d1d5db;
}

.prose :deep(.markdown-table td) {
  @apply px-3 py-2.5 text-gray-700;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
  line-height: 1.5;
}

/* Hover 效果 */
.prose :deep(.markdown-table tbody tr) {
  @apply transition-colors duration-100;
}

.prose :deep(.markdown-table tbody tr:hover) {
  @apply bg-gray-50/60;
}

/* 第一列稍微加粗 */
.prose :deep(.markdown-table td:first-child) {
  @apply font-medium text-gray-900;
}

/* 最后一行不显示底部横线 */
.prose :deep(.markdown-table tbody tr:last-child td) {
  border-bottom: none;
}

/* 引用块样式 */
.prose :deep(.quote) {
  @apply pl-4 pr-3 py-2 my-2 border-l-4 border-blue-500 bg-blue-50/50 text-gray-700 text-[14px] rounded-r-md;
  font-style: italic;
}

/* 分隔线样式 */
.prose :deep(.divider) {
  @apply my-4 border-0 h-px bg-gray-200;
}

/* 学术引用样式 (Citations) */
.prose :deep(.citation) {
  @apply text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline transition-colors;
  font-size: 0.85em;
  vertical-align: super;
  line-height: 0;
  margin: 0 1px;
}

/* 参考文献标题样式 */
.prose :deep(.heading-4) {
  @apply text-[14px] font-semibold text-gray-900 mt-4 mb-2;
}

/* 参考文献列表样式 */
.prose :deep(.reference-item) {
  @apply text-[13px] text-gray-700 mb-2 pl-6 relative leading-relaxed;
}

.prose :deep(.reference-number) {
  @apply absolute left-0 top-0 text-blue-600 font-medium;
}
</style>
