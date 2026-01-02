<template>
  <div>
    <div class="grid grid-cols-7 gap-1 text-xs">
      <!-- 星期标题 -->
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">S</div>
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">M</div>
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">T</div>
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">W</div>
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">T</div>
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">F</div>
      <div class="text-center text-gray-400 py-1 text-[9px] font-medium">S</div>
      
      <!-- 日期 -->
      <div 
        v-for="day in calendarDays" 
        :key="day.date"
        :class="[
          'text-center py-1 rounded-[6px] cursor-pointer transition-colors text-[11px] font-medium',
          day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300',
          day.isToday ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm' : ''
        ]"
      >
        {{ day.day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 当前日期
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const currentDay = today.getDate()

const currentMonthName = computed(() => {
  return today.toLocaleString('default', { month: 'long' })
})

// 生成日历数据
const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  // 添加上个月的日期
  const prevMonth = new Date(currentYear, currentMonth - 1, 0)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonth.getDate() - i,
      date: `${currentYear}-${currentMonth}-${prevMonth.getDate() - i}`,
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  // 添加本月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      date: `${currentYear}-${currentMonth + 1}-${day}`,
      isCurrentMonth: true,
      isToday: day === currentDay
    })
  }
  
  // 添加下个月的日期（如果需要填满6周）
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      date: `${currentYear}-${currentMonth + 2}-${day}`,
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  return days.slice(0, 14) // 只显示前两周
})
</script>

<style scoped>
</style>
