import { mockKnowledgePoints } from '@/views/Library/Navigation/mockData.js'
import { questionService } from './QuestionService.js'

/**
 * 教学大纲服务
 * 获取特定学科的知识点树
 */
class SyllabusService {
  /**
   * 获取学科的教学大纲
   * @param {Object} params - 学科参数
   * @param {string} params.subject - 学科名称
   * @param {string} params.clazz - 课程体系
   * @param {string} params.exam - 考试局
   * @param {string} params.level - 等级
   * @returns {Promise<Array>} 返回知识点层级数组
   */
  async getSyllabus(params = {}) {
    try {
      // 调用 QuestionService 获取该学科的知识点
      const filterOptions = await questionService.getAllFilterOptions(params)
      
      // 如果有知识点数据，转换为树形结构
      if (filterOptions.knowledgePoints && filterOptions.knowledgePoints.length > 0) {
        return this.transformKnowledgePointsToTree(filterOptions.knowledgePoints)
      }
      
      // 否则返回 mockData
      console.log('⚠️ No knowledge points from API, using mockData')
      return this.transformToSyllabusFormat(mockKnowledgePoints)
    } catch (error) {
      console.error('❌ Failed to fetch syllabus:', error)
      // 出错时返回 mockData
      return this.transformToSyllabusFormat(mockKnowledgePoints)
    }
  }

  /**
   * 将知识点数组转换为树形结构
   */
  transformKnowledgePointsToTree(knowledgePoints) {
    // 按照知识点分组
    const grouped = {}
    
    knowledgePoints.forEach(point => {
      // 假设知识点格式为 "Topic 1: Cell Biology" 或 "1.1 Introduction to cells"
      const parts = point.split(':')
      let topicName, subtopicName
      
      if (parts.length > 1) {
        // 格式: "Topic 1: Cell Biology"
        topicName = parts[0].trim()
        subtopicName = parts[1].trim()
      } else {
        // 格式: "1.1 Introduction to cells"
        const match = point.match(/^(\d+)\./)
        if (match) {
          topicName = `Topic ${match[1]}`
          subtopicName = point
        } else {
          topicName = 'General'
          subtopicName = point
        }
      }
      
      if (!grouped[topicName]) {
        grouped[topicName] = []
      }
      grouped[topicName].push(subtopicName)
    })
    
    // 转换为数组格式
    return Object.entries(grouped).map(([topicName, subtopics], index) => ({
      id: `topic-${index + 1}`,
      title: topicName,
      subtopics: subtopics.map((subtopic, subIndex) => ({
        id: `${index + 1}.${subIndex + 1}`,
        title: subtopic,
        description: `Learn about ${subtopic}`,
        learningObjectives: [],
        keyConcepts: []
      }))
    }))
  }

  /**
   * 将 mockData 转换为 Syllabus 格式
   */
  transformToSyllabusFormat(knowledgePoints) {
    return knowledgePoints.map(topic => ({
      id: topic.id,
      title: topic.name,
      pdfSource: topic.pdfSource || null,
      subtopics: (topic.children || []).map(subtopic => ({
        id: subtopic.id,
        title: subtopic.name,
        description: subtopic.description || `Learn about ${subtopic.name}`,
        learningObjectives: subtopic.learningObjectives || [],
        keyConcepts: subtopic.keyConcepts || []
      }))
    }))
  }
}

// 创建单例实例
const syllabusService = new SyllabusService()

export { syllabusService, SyllabusService }
export default syllabusService

