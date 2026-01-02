<template>
  <div class="space-y-0.5 select-none">
    <!-- 节点行 -->
    <div
      @click="handleClick"
      class="group relative flex items-center gap-0.5 rounded-lg cursor-pointer transition-all duration-200 min-h-[36px] py-1.5"
      :class="[
        isActive ? 'bg-gray-200/60 text-gray-900 font-medium' : 'hover:bg-gray-100/60 text-gray-600 hover:text-gray-900'
      ]"
      :style="{ paddingRight: '6px' }"
    >
      <!-- Objective 圆点 (绝对定位在线上) -->
      <div 
        v-if="node.isObjective" 
        class="absolute w-1.5 h-1.5 rounded-full border border-link bg-white transition-colors z-20 top-1/2 -translate-y-1/2"
        :style="objectiveDotStyle"
        :class="[
          isActive ? 'bg-link' : 'group-hover:bg-link'
        ]"
      ></div>

      <!-- 展开箭头 (绝对定位) -->
      <div 
         v-if="hasChildren"
         class="absolute w-4 h-4 flex items-center justify-center transition-transform duration-200 z-10 top-1/2 -translate-y-1/2"
         :class="[
           isExpanded ? 'rotate-90' : '',
           (isActive || isActiveRoot) ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
         ]"
         :style="{ left: `${indentPadding}px` }" 
      >
          <svg
            class="w-3 h-3 bg-white/0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
      </div>

      <!-- 内容区域 -->
      <div class="flex flex-1 min-w-0" :style="{ paddingLeft: `${indentPadding + (node.isObjective ? 8 : 20)}px` }">
        <span 
          class="font-medium leading-normal"
          :class="[
            (isActive || isActiveRoot) ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900',
            level === 0 ? 'text-[13px]' : 'text-[13px]',
            level === 0 && !isActive && !isActiveRoot ? 'text-gray-700' : '',
            node.isObjective ? 'text-[12px] font-normal text-gray-500 hover:text-gray-900 whitespace-normal line-clamp-2 break-words leading-tight' : 'truncate'
          ]"
          :title="node.name"
        >
          {{ getDisplayName(node) }}
        </span>
      </div>
    </div>

    <!-- 子节点区域 -->
    <Transition name="slide-down">
      <div v-if="hasChildren && isExpanded" class="relative space-y-0.5 group/tree">
        <!-- 树形连接线 (垂直线) - 智能显示 -->
        <div 
          class="absolute w-px transition-all duration-300"
          :class="[
            isDeepestVisibleLevel ? 'bg-gray-300 opacity-100' : 'bg-gray-200 opacity-0 group-hover/tree:opacity-100'
          ]"
          :style="{ 
            left: `${indentPadding + 7}px`, // 动态位置：始终对齐当前层级的图标中心
            top: '0', 
            bottom: '14px' // 留出一点空间，不要到底
          }"
        ></div>

        <SubjectTree
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          :active-id="activeId"
          :expanded-ids="expandedIds"
          @select="handleChildSelect"
          @toggle="handleChildToggle"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, defineOptions } from 'vue'

defineOptions({ name: 'SubjectTree' }) 

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  // 当前选中的节点ID（全局唯一）
  activeId: {
    type: [String, Number],
    default: null
  },
  // 展开的节点ID集合
  expandedIds: {
    type: Set,
    default: () => new Set()
  },
  // 是否是当前激活路径的根节点（用于子节点选中时，父节点保持高亮）
  isActiveRoot: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'toggle'])

// 计算属性
const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

const isExpanded = computed(() => props.expandedIds.has(props.node.id))

const isActive = computed(() => props.activeId === props.node.id)

// 动态缩进：恢复阶梯式缩进，但更紧凑
// 基础缩进 4px，每层增加 10px
const indentPadding = computed(() => {
  return 4 + (props.level * 10)
})

// Objective 圆点样式：绝对定位到父级的垂直线上
const objectiveDotStyle = computed(() => {
  if (!props.node.isObjective) return {}
  // 父级 Indent = 4 + (level-1)*10
  // 线的位置 = 父级 Indent + 7
  // 圆点 left = 线的位置 - 3 (圆点半径)
  const left = (4 + ((props.level - 1) * 10)) + 7 - 3
  return { left: `${left}px` }
})

// 智能连线显示逻辑：
// 如果当前节点的子节点中，没有任何一个被展开，说明当前这层就是用户看到的“最后一层”
// 此时应该高亮显示这条连接线。
// 反之，如果有子节点被展开了，说明焦点在更深层，这条线就应该作为“背景线”隐藏/变淡。
const isDeepestVisibleLevel = computed(() => {
  if (!props.node.children) return true
  // 检查是否有任何子节点在 expandedIds 中
  // 注意：Objective 节点永远不会在 expandedIds 中，所以连接 Objective 的线永远是 deepest (true)
  return !props.node.children.some(child => props.expandedIds.has(child.id))
})

// 显示逻辑
const getDisplayName = (node) => {
  if (props.level === 0) {
    // Level 0: 拼接 clazz | exam | name
    const parts = []
    if (node.clazz?.trim()) parts.push(node.clazz)
    if (node.exam?.trim()) parts.push(node.exam)
    if (node.name?.trim()) parts.push(node.name)
    return parts.join(' | ')
  }
  // Level 1+: 知识点直接显示 name
  return node.name
}

const handleClick = () => {
  emit('select', { node: props.node, level: props.level })
  if (hasChildren.value) emit('toggle', props.node)
}

const handleChildSelect = (event) => emit('select', event)
const handleChildToggle = (node) => emit('toggle', node)
</script>

<style scoped>
.slide-down-enter-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.slide-down-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
