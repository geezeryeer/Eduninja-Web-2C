/**
 * 模拟RAG数据
 * 用于在知识点模式下显示文档相关内容
 */

// 模拟RAG内容数据
export const mockRagContents = [
  {
    id: 1,
    content: "This section discusses the fundamental principles of cellular respiration, including glycolysis, the Krebs cycle, and oxidative phosphorylation. The process involves the breakdown of glucose molecules to produce ATP, which is the primary energy currency of cells.",
    relevance: 0.95,
    pageNumber: 45
  },
  {
    id: 2,
    content: "The mitochondria, often referred to as the powerhouse of the cell, plays a crucial role in energy production. The electron transport chain located in the inner mitochondrial membrane is responsible for the majority of ATP synthesis during aerobic respiration.",
    relevance: 0.92,
    pageNumber: 47
  },
  {
    id: 3,
    content: "Key enzymes involved in cellular respiration include hexokinase, phosphofructokinase, and pyruvate dehydrogenase. These enzymes regulate the rate of metabolic pathways and ensure efficient energy production under various cellular conditions.",
    relevance: 0.88,
    pageNumber: 52
  },
  {
    id: 4,
    content: "Photosynthesis is the process by which plants convert light energy into chemical energy. This occurs in two main stages: light-dependent reactions in the thylakoid membranes and light-independent reactions (Calvin cycle) in the stroma of chloroplasts.",
    relevance: 0.89,
    pageNumber: 23
  },
  {
    id: 5,
    content: "The equilibrium constant K represents the ratio of product concentrations to reactant concentrations at equilibrium. A large K value indicates that products are favored, while a small K value suggests that reactants are predominant at equilibrium.",
    relevance: 0.91,
    pageNumber: 78
  }
]

/**
 * 获取文档的RAG内容
 * @param {Object} document - 文档对象
 * @param {string} knowledgePoint - 知识点名称
 * @returns {Array} RAG内容数组
 */
export function getDocumentRagContent(document, knowledgePoint) {
  // 为每个文档返回2-3条模拟RAG内容
  const numContents = 2 + Math.floor(Math.random() * 2) // 随机2-3条
  
  // 随机选择内容
  const shuffled = [...mockRagContents].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, numContents)
  
  // 根据知识点调整内容（如果需要）
  return selected.map(item => ({
    ...item,
    // 可以根据knowledgePoint动态调整内容
    content: item.content,
    // 添加高亮关键词（如果知识点在内容中）
    highlightedContent: highlightKeywords(item.content, knowledgePoint)
  }))
}

/**
 * 高亮关键词
 * @param {string} text - 原始文本
 * @param {string} keyword - 需要高亮的关键词
 * @returns {string} 包含HTML标记的文本
 */
function highlightKeywords(text, keyword) {
  if (!keyword) return text
  
  // 将知识点拆分成单词进行匹配
  const keywords = keyword.toLowerCase().split(/\s+/)
  let highlightedText = text
  
  keywords.forEach(kw => {
    const regex = new RegExp(`(${escapeRegExp(kw)})`, 'gi')
    highlightedText = highlightedText.replace(
      regex, 
      '<span class="text-blue-600 font-semibold bg-blue-50 px-0.5 rounded">$1</span>'
    )
  })
  
  return highlightedText
}

/**
 * 转义正则表达式特殊字符
 * @param {string} string - 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 获取单条RAG摘要（用于非展开状态）
 * @param {Object} document - 文档对象
 * @param {string} knowledgePoint - 知识点名称
 * @returns {Object|null} 单条RAG内容
 */
export function getDocumentRagSummary(document, knowledgePoint) {
  // 返回最相关的一条内容
  const allContents = getDocumentRagContent(document, knowledgePoint)
  if (allContents.length === 0) return null
  
  // 返回相关度最高的一条
  return allContents.reduce((prev, current) => 
    (current.relevance > prev.relevance) ? current : prev
  )
}

// 导出默认对象
export default {
  mockRagContents,
  getDocumentRagContent,
  getDocumentRagSummary
}

