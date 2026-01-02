<template>
  <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-white">
    <!-- 1. 基础波纹纹理 (SVG 等高线) -->
    <div class="absolute inset-0 opacity-[0.4]" 
         style="background-image: url('data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\' stroke=\'%23a3a3a3\' stroke-width=\'0.5\' fill=\'none\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\'/%3E%3C/svg%3E'); mask-image: linear-gradient(to bottom, transparent, black, transparent);">
    </div>

    <!-- 2. 细腻的摩尔纹 (Moiré) -->
    <div class="absolute inset-0 opacity-[0.03] mix-blend-multiply"
         style="background-image: repeating-radial-gradient( circle at 0 0, transparent 0, #000 1px, transparent 2px, transparent 10px); background-size: 100px 100px;">
    </div>

    <!-- 3. 核心极光光晕 (Aurora Gradients) -->
    <div class="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"
         style="background-color: #D1FAE5; margin-top: 60px;"></div>
    
    <div class="absolute top-[0%] -right-[10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"
         style="background-color: #F3E8FF; margin-top: 60px;"></div>
    
    <div class="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"
         style="background-color: #FEF3C7;"></div>

    <!-- 4. 顶部白色渐变遮罩 -->
    <!-- 这个遮罩用于让 Header 区域保持白色，然后向下平滑过渡到背景 -->
    <div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/60 to-transparent z-[1]"></div>

    <!-- 5. 整体柔光遮罩 (原有) -->
    <div class="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>

    <!-- 2.5 交互式点阵 (Interactive Canvas Dot Grid) -->
    <!-- 使用 Canvas 实现只有鼠标附近的点会动的效果 -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full opacity-60"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
let width = 0
let height = 0
let dpr = 1
const dots = []

// 鼠标位置初始化在屏幕外
const mouse = { x: -1000, y: -1000 }

// 配置参数
const DOT_SPACING = 20    // 点间距
const DOT_RADIUS = 1      // 点大小
const HOVER_RADIUS = 100  // 鼠标影响半径
const MAX_OFFSET = 15     // 最大移动距离
const EASE = 0.15         // 缓动系数

class Dot {
  constructor(x, y) {
    this.x = x          // 当前 x
    this.y = y          // 当前 y
    this.originX = x    // 原始 x
    this.originY = y    // 原始 y
  }

  update() {
    // 1. 计算与鼠标的距离
    const dx = mouse.x - this.originX
    const dy = mouse.y - this.originY
    const distance = Math.sqrt(dx * dx + dy * dy)

    let targetX = this.originX
    let targetY = this.originY

    // 2. 如果在影响范围内，计算排斥偏移
    if (distance < HOVER_RADIUS) {
      const angle = Math.atan2(dy, dx)
      // 距离越近，排斥力越大 (0到1)
      const force = (HOVER_RADIUS - distance) / HOVER_RADIUS 
      
      // 向反方向移动 (排斥效果)
      const moveDistance = force * MAX_OFFSET
      
      targetX -= Math.cos(angle) * moveDistance
      targetY -= Math.sin(angle) * moveDistance
    }

    // 3. 缓动动画 (Lerp) 平滑回到目标位置
    // 如果不在范围内，target 就是 origin，点会自动平滑归位
    this.x += (targetX - this.x) * EASE
    this.y += (targetY - this.y) * EASE
  }

  draw(context) {
    context.beginPath()
    context.arc(this.x, this.y, DOT_RADIUS, 0, Math.PI * 2)
    context.fillStyle = '#cbd5e1' // Slate-300
    context.fill()
  }
}

const createDots = () => {
  dots.length = 0
  
  const cols = Math.ceil(width / DOT_SPACING)
  const rows = Math.ceil(height / DOT_SPACING)

  // 使得点阵居中
  const offsetX = (width - (cols - 1) * DOT_SPACING) / 2
  const offsetY = (height - (rows - 1) * DOT_SPACING) / 2

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = offsetX + i * DOT_SPACING
      const y = offsetY + j * DOT_SPACING
      dots.push(new Dot(x, y))
    }
  }
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  // 获取父容器的完整尺寸（包含滚动区域）
  // 这样 Canvas 就会覆盖整个页面，随着页面滚动而滚动
  const parent = canvas.parentElement || document.body
  
  // 确保尺寸至少是视口大小
  width = Math.max(parent.scrollWidth, window.innerWidth)
  height = Math.max(parent.scrollHeight, window.innerHeight)
  
  dpr = window.devicePixelRatio || 1
  
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  
  ctx.scale(dpr, dpr)
  
  createDots()
}

const animate = () => {
  if (!ctx) return
  
  ctx.clearRect(0, 0, width, height)
  
  // 优化：只绘制视口范围内的点（View Culling）
  // 虽然有点复杂，但能显著提升长页面的性能
  const scrollY = window.scrollY
  const viewportHeight = window.innerHeight
  const buffer = 100 // 上下缓冲区
  
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i]
    
    // 简单的视口剔除：如果点在视口外，就不更新也不绘制
    // 注意：dot.y 是文档坐标
    if (dot.y < scrollY - buffer || dot.y > scrollY + viewportHeight + buffer) {
      continue
    }

    dot.update()
    dot.draw(ctx)
  }
  
  animationFrameId = requestAnimationFrame(animate)
}

const handleMouseMove = (e) => {
  // 使用 pageX/pageY 获取相对于文档的坐标
  // 这样在滚动页面时，鼠标位置才能正确对应到 Canvas 上的点
  mouse.x = e.pageX
  mouse.y = e.pageY
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  
  // 初始调用
  handleResize()
  
  // 监听内容变化导致的高度变化 (ResizeObserver)
  const resizeObserver = new ResizeObserver(() => handleResize())
  resizeObserver.observe(document.body)
  
  // 保存 observer 引用以便清理
  canvas._resizeObserver = resizeObserver
}

onMounted(() => {
  initCanvas()
  animate()
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  // window resize 仍然需要，因为横屏/缩放可能改变布局
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  
  const canvas = canvasRef.value
  if (canvas && canvas._resizeObserver) {
    canvas._resizeObserver.disconnect()
  }
  
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 15s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
