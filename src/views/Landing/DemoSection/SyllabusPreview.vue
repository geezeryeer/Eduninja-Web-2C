<template>
  <div class="h-full flex bg-white overflow-hidden">
    <!-- 左侧：Navigation -->
    <aside class="w-52 flex-shrink-0 bg-[#F9F9F9]/90 backdrop-blur-xl border-r border-gray-200/80 flex flex-col">
      <div class="flex flex-col h-full overflow-hidden pt-2">
    
        <!-- Subjects Section -->
        <div class="flex-1 flex flex-col min-h-0">
          <!-- Subjects List -->
          <div class="overflow-y-auto space-y-1 flex-1 px-3 custom-scrollbar">
            <SubjectTree
              v-for="subject in previewSubjects"
              :key="subject.id"
              :node="subject"
              :active-id="'a1.2'"
              :expanded-ids="expandedNodeIds"
              :is-active-root="subject.id === previewSubjects[0].id"
              @select="() => {}"
              @toggle="() => {}"
            />
        </div>
      </div>
    </div>
  </aside>

    <!-- 右侧内容区域 -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Filter - 直接调用 LibraryFilter 组件 -->
      <div class="px-4 pb-0 pt-3">
        <LibraryFilter 
          activeContentType="document"
        />
      </div>

      <!-- 文档列表 -->
      <div class="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
        <DocumentList 
          :documents="mockDocuments" 
          :filters="mockFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SubjectTree from '@/views/Library/Navigation/SubjectTree.vue'
import LibraryFilter from '@/views/Library/Page/LibraryFilter.vue'
import DocumentList from '@/views/Library/Page/DocumentList.vue'

// Images
import nucleicAcidImg from '@/assets/images/Nucleic-Acids-Doodle-Notes.png'
import guide2025Img from '@/assets/images/guide 2025.jpg'
import ibStudyGuideImg from '@/assets/images/IB study guide.jpg'

// Mock 文档数据
const mockDocuments = ref([
  {
    id: 'doc1',
    title: 'IB Biology - Nucleic Acids Study Guide',
    description: 'DNA is a double helix structure composed of nucleotides. Each nucleotide contains a phosphate group, deoxyribose sugar, and one of four nitrogenous bases (adenine, thymine, guanine, cytosine).',
    authorName: 'Sarah Chen',
    type: 'NOTES',
    labelList: ['Nucleic acids', 'DNA Structure'],
    createdTime: '2024-01-15',
    coverUrl: nucleicAcidImg
  },
  {
    id: 'doc2',
    title: 'Complete Guide to RNA and Transcription',
    description: 'Messenger RNA (mRNA) carries genetic information from DNA to ribosomes for protein synthesis.',
    authorName: 'Michael Zhang',
    type: 'GUIDE',
    labelList: ['RNA', 'Transcription'],
    createdTime: '2024-01-10',
    coverUrl: guide2025Img
  },
  {
    id: 'doc3',
    title: 'Cell Structure and Function Overview',
    description: 'Understanding prokaryotic and eukaryotic cells, their organelles and specialized functions.',
    authorName: 'Emma Wilson',
    type: 'NOTES',
    labelList: ['Cell Biology', 'Organelles'],
    createdTime: '2024-01-05',
    coverUrl: ibStudyGuideImg
  }
])

// Mock filters for knowledgePoint mode
const mockFilters = ref({
  knowledgePoint: 'DNA Structure'
})

// IB Biology 真实 Syllabus 数据
const ibBiologySyllabus = [
  {
    id: 'theme-a',
    name: 'Theme A: Unity and diversity',
    children: [
      { id: 'a1.1', name: 'A1.1 Water' },
      { id: 'a1.2', name: 'A1.2 Nucleic acids' },
      { id: 'a2.1', name: 'A2.1 Origins of cells (HL only)' },
      { id: 'a2.2', name: 'A2.2 Cell structure' },
      { id: 'a2.3', name: 'A2.3 Viruses (HL only)' },
      { id: 'a3.1', name: 'A3.1 Diversity of organisms' },
      { id: 'a3.2', name: 'A3.2 Classification and cladistics (HL only)' },
      { id: 'a4.1', name: 'A4.1 Evolution and speciation' },
      { id: 'a4.2', name: 'A4.2 Conservation of biodiversity' }
    ]
  },
  {
    id: 'theme-b',
    name: 'Theme B: Form and function',
    children: [
      { id: 'b1.1', name: 'B1.1 Carbohydrates and lipids' },
      { id: 'b1.2', name: 'B1.2 Proteins' },
      { id: 'b2.1', name: 'B2.1 Membranes and membrane transport' },
      { id: 'b2.2', name: 'B2.2 Organelles and compartmentalization' },
      { id: 'b2.3', name: 'B2.3 Cell specialization' },
      { id: 'b3.1', name: 'B3.1 Gas exchange' },
      { id: 'b3.2', name: 'B3.2 Transport' },
      { id: 'b3.3', name: 'B3.3 Muscle and motility (HL only)' },
      { id: 'b4.1', name: 'B4.1 Adaptation to environment' },
      { id: 'b4.2', name: 'B4.2 Ecological niches' }
    ]
  },
  {
    id: 'theme-c',
    name: 'Theme C: Interaction and interdependence',
    children: [
      { id: 'c1.1', name: 'C1.1 Enzymes and metabolism' },
      { id: 'c1.2', name: 'C1.2 Cell respiration' },
      { id: 'c1.3', name: 'C1.3 Photosynthesis' },
      { id: 'c2.1', name: 'C2.1 Chemical signalling (HL only)' },
      { id: 'c2.2', name: 'C2.2 Neural signalling' },
      { id: 'c3.1', name: 'C3.1 Integration of body systems' },
      { id: 'c3.2', name: 'C3.2 Defence against disease' },
      { id: 'c4.1', name: 'C4.1 Populations and communities' },
      { id: 'c4.2', name: 'C4.2 Transfers of energy and matter' }
    ]
  },
  {
    id: 'theme-d',
    name: 'Theme D: Continuity and change',
    children: [
      { id: 'd1.1', name: 'D1.1 DNA replication' },
      { id: 'd1.2', name: 'D1.2 Protein synthesis' },
      { id: 'd1.3', name: 'D1.3 Mutation and gene editing' },
      { id: 'd2.1', name: 'D2.1 Cell and nuclear division' },
      { id: 'd2.2', name: 'D2.2 Gene expression (HL only)' },
      { id: 'd2.3', name: 'D2.3 Water potential' },
      { id: 'd3.1', name: 'D3.1 Reproduction' },
      { id: 'd3.2', name: 'D3.2 Inheritance' },
      { id: 'd3.3', name: 'D3.3 Homeostasis' },
      { id: 'd4.1', name: 'D4.1 Natural selection' },
      { id: 'd4.2', name: 'D4.2 Stability and change' },
      { id: 'd4.3', name: 'D4.3 Climate change' }
    ]
  }
]

// 展开的节点 ID（展开到第三层）
const expandedNodeIds = new Set([
  'ib-biology',     // 第一层：Biology 学科
  'theme-a'         // 第二层：Theme A（第三层的节点会显示但不展开）
])

// 预览数据（静态）- 只显示 IB Biology
const previewSubjects = ref([
  {
    id: 'ib-biology',
    name: 'Biology',
    clazz: 'IB',
    exam: '',
    level: '',
    space: 'public',
    children: ibBiologySyllabus
  }
])
</script>

<style scoped>
.icon-mask {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

/* 滚动条样式已在 main.css 中全局定义 (.custom-scrollbar) */
</style>
