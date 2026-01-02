/**
 * 题目服务
 */

import Config from './config.js'
import { getCurrentUserId, getAuthToken } from './AuthService.js'

class QuestionService {
  constructor() {
    this.baseURL = Config.APIURL
    
    this.API = {
      questionList: '/api/wx/paper-cut-record/list-page',
      filterSelector: '/api/wx/question-filter-selector/list',
      combCreate: '/api/wx/combo/create',
      combGenerate: '/api/wx/combo/generate',
      combSubjectAdd: '/api/wx/combo/subject/add',
      combSubjectDelete: '/api/wx/combo/subject/delete',
      combDetail: '/api/wx/combo/detail'
    }
  }
  
  /**
   * 通用请求方法
   */
  async makeRequest(endpoint, data, allowNullData = false) {
    const url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const requestData = {
      ...data,
      accountId: data.accountId || getCurrentUserId()
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(60000)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const responseData = await response.json()
      
      // combDetail API 可能返回 null
      if (allowNullData && responseData.successful && responseData.data === null) {
        throw new Error('没有现有组卷')
      }
      
      // 检查响应是否成功
      if (!responseData.successful) {
        throw new Error(responseData.message || '请求失败')
      }
      
      // 返回 data（可能是对象、数组、boolean 等任何类型）
      return responseData.data
      
    } catch (error) {
      console.error(`❌ [${endpoint}]:`, error.message || error)
      throw error
    }
  }
  
  /**
   * 创建组卷 - 返回完整响应（包含 successful 字段）
   */
  async createCombPaper(data) {
    const url = `${this.baseURL}${this.API.combCreate}`
    const headers = { 'Content-Type': 'application/json' }
    
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const requestData = {
      ...data,
      accountId: data.accountId || getCurrentUserId()
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json() // 返回完整响应
    } catch (error) {
      console.error('❌ 创建组卷失败:', error.message)
      throw error
    }
  }
  
  // ==================== 基础 API 方法 ====================
  
  async getList(data) {
    return await this.makeRequest(this.API.questionList, data)
  }
  
  async getFilterOptions(type, subjectParams = {}) {
    try {
      return await this.makeRequest(this.API.filterSelector, {
        ...subjectParams,
        type
      })
    } catch (error) {
      console.warn(`[QuestionService] Filter options fetch failed for ${type}, using fallback.`)
      // 降级策略：返回默认选项，防止页面崩溃
      if (type === 'difficulty') return ['Easy', 'Medium', 'Hard']
      if (type === 'questionType') return ['Multiple Choice', 'Structured', 'Essay']
      if (type === 'knowledgePoint') return []
      return []
    }
  }
  
  async getCombDetail(data) {
    return await this.makeRequest(this.API.combDetail, data, true)
  }
  
  async addCombSubjects(data) {
    return await this.makeRequest(this.API.combSubjectAdd, data)
  }
  
  async removeCombSubjects(data) {
    return await this.makeRequest(this.API.combSubjectDelete, data)
  }
  
  // ==================== 高层业务方法 ====================
  
  /**
   * 添加题目到组卷
   */
  async addQuestionToCloud(question, paperId, replaceNumber) {
    const questionWithNumber = {
      ...question,
      replaceNumber,
      paperId
    }
    
    // 处理子题目
    if (questionWithNumber.childList) {
      questionWithNumber.childList.forEach(child => {
        child.replaceNumber = replaceNumber
        child.paperId = paperId
        if (child.childList) {
          child.childList.forEach(grandChild => {
            grandChild.replaceNumber = replaceNumber
            grandChild.paperId = paperId
          })
        }
      })
    }
    
    return await this.addCombSubjects({
      accountId: getCurrentUserId(),
      paperId,
      subjectVO: [questionWithNumber]
    })
  }

  /**
   * 从组卷中删除题目
   */
  async removeQuestionFromCloud(questionId, paperId) {
    // 重要：subjectIds 必须是字符串数组，不能转为整数（会丢失精度）
    return await this.removeCombSubjects({
      accountId: getCurrentUserId(),
      paperId: parseInt(paperId),
      subjectIds: [String(questionId)]
    })
  }

  /**
   * 创建组卷
   */
  async createPaperWithInfo(subjectInfo) {
    const response = await this.createCombPaper({ 
      accountId: getCurrentUserId(), 
      clazz: subjectInfo.clazz, 
      exam: subjectInfo.exam, 
      subject: subjectInfo.subject, 
      level: subjectInfo.level || '' 
    })
    
    if (response.successful === true || response.code === "200" || response.code === 200) {
      return response.data
    }
    return null
  }

  /**
   * 获取组卷详情
   */
  async getComboDetailWithInfo(subjectInfo) {
    try {
      const data = await this.getCombDetail({
        accountId: getCurrentUserId(),
        pageIndex: 1,
        pageSize: 20,
        clazz: subjectInfo.clazz,
        exam: subjectInfo.exam,
        subject: subjectInfo.subject
      })
      
      return data?.paperId ? data : null
    } catch (error) {
      return null // 找不到组卷是正常情况
    }
  }

  /**
   * 从 paperName 检测学科
   */
  detectSubjectFromPaperName(paperName) {
    if (!paperName || !this._subjectMappings) return null
    
    const name = paperName.toLowerCase()
    
    for (const [key, value] of Object.entries(this._subjectMappings)) {
      if (name.includes(key)) return value
    }
    return null
  }

  /**
   * 初始化学科映射
   */
  async initializeSubjectMappings() {
    try {
      const { subjectService } = await import('./index.js')
      const response = await subjectService.getCollectSubjectList()
      
      if (response.successful && response.data?.length > 0) {
        const mappings = {}
        response.data.forEach(subject => {
          if (subject.subject) {
            mappings[subject.subject.toLowerCase()] = subject.subject
          }
        })
        
        this._subjectMappings = mappings
      }
    } catch (error) {
      this._subjectMappings = null
    }
  }

  /**
   * 获取所有筛选选项
   */
  async getAllFilterOptions(subjectParams = {}) {
    const [questionTypes, difficulties, knowledgePoints] = await Promise.all([
      this.getFilterOptions('questionType', subjectParams),
      this.getFilterOptions('difficulty', subjectParams),
      this.getFilterOptions('knowledgePoint', subjectParams)
    ])
    
    return {
      questionTypes,
      difficulties,
      knowledgePoints
    }
  }
}

export const questionService = new QuestionService()
export default questionService