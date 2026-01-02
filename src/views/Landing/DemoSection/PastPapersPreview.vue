<template>
  <div class="h-full flex flex-col bg-slate-50">
    <!-- 文件列表头部 -->
    <div class="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
       <h4 class="text-sm font-bold text-slate-700">Mathematics (9709)</h4>
       <div class="flex gap-2">
          <div class="w-6 h-6 rounded bg-slate-100"></div>
          <div class="w-6 h-6 rounded bg-slate-100"></div>
       </div>
    </div>

    <!-- 文件夹网格 -->
    <div class="p-6 grid grid-cols-3 gap-4">
       <div v-for="year in ['2023', '2022', '2021', '2020', '2019', '2018']" :key="year" class="group cursor-pointer">
          <div class="aspect-[4/3] bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-blue-400 group-hover:shadow-md transition-all relative overflow-hidden">
             <div class="absolute top-0 right-0 w-8 h-8 bg-slate-50 rounded-bl-xl border-b border-l border-slate-100"></div>
             <svg class="w-10 h-10 text-blue-200 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
          </div>
          <p class="text-center text-xs font-medium text-slate-600 mt-2 group-hover:text-link">{{ year }}</p>
       </div>
    </div>
    
    <!-- 最近访问 -->
    <div class="px-6 mt-auto pb-6">
       <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Files</p>
       <div class="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
          <div class="w-8 h-10 bg-red-100 rounded flex items-center justify-center">
             <span class="text-[10px] font-bold text-red-500">PDF</span>
          </div>
          <div>
             <p class="text-sm font-medium text-slate-700">9709_s23_qp_12.pdf</p>
             <p class="text-xs text-slate-400">Opened 2 hours ago</p>
          </div>
       </div>
    </div>
  </div>
</template>
