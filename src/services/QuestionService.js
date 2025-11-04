/**
 * 题目服务 - 对应 Swift QuestionService.swift
 */

import Config from './config.js'

// Token获取函数 - 从localStorage获取真实token
const getSimpleToken = () => localStorage.getItem('token') || ''
const getSimpleUserId = () => "123"
const getSimpleUserIdInt = () => 123

class QuestionService {
  constructor() {
    this.baseURL = Config.APIURL
    
    // API端点 - 对应 Swift API enum
    this.API = {
      questionList: '/api/wx/paper-cut-record/list-page',
      filterSelector: '/api/wx/question-filter-selector/list', // 修改为专门的 question filter API
      combCreate: '/api/wx/combo/create',
      combGenerate: '/api/wx/combo/generate',
      combSubjectAdd: '/api/wx/combo/subject/add',
      combSubjectDelete: '/api/wx/combo/subject/delete',
      combSubjectUpdate: '/api/wx/combo/subject/update',
      combList: '/api/wx/combo/list',
      combDetail: '/api/wx/combo/detail'
    }
  }
  
  // MARK: - 网络请求方法
  
  /**
   * 通用请求方法 - 对应 Swift makeRequest
   * @param {string} endpoint API端点
   * @param {Object} data 请求数据
   * @param {boolean} allowNullData 是否允许null数据
   * @returns {Promise<any>} 响应数据
   */
  async makeRequest(endpoint, data, allowNullData = false) {
    const url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    const token = getSimpleToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    let requestData = { ...data }
    if (!data.accountId) {
      requestData.accountId = getSimpleUserId()
    }
    
    console.log('🌐 发送网络请求到:', url)
    const startTime = Date.now()
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(60000) // 设置60秒超时
      })
      
      const duration = (Date.now() - startTime) / 1000
      console.log(`📡 网络请求完成，耗时: ${duration.toFixed(2)}秒`)
      
      if (!response.ok) {
        throw new Error(`无效的HTTP响应: ${response.status}`)
      }
      
      console.log('📊 HTTP状态码:', response.status)
      
      const responseData = await response.json()
      console.log(`📋 API响应: success=${responseData.successful}, message=${responseData.message}`)
      
      // 处理特殊情况：combDetail API可能返回null data
      if (allowNullData && responseData.successful && responseData.data === null) {
        throw new Error('没有现有组卷')
      }
      
      if (!responseData.successful || responseData.data === undefined) {
        throw new Error(responseData.message || '请求失败')
      }
      
      return responseData.data
      
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000
      console.error(`❌ 网络请求失败，耗时: ${duration.toFixed(2)}秒, 错误:`, error)
      throw error
    }
  }
  
  // MARK: - 基础API方法
  
  /**
   * 获取题目列表 - 对应 Swift getList
   * @param {Object} data 请求数据
   * @returns {Promise<Array>} 题目列表
   */
  async getList(data) {
    return await this.makeRequest(this.API.questionList, data)
  }
  
  /**
   * 获取筛选选项 - 对应 Swift getFilterOptions
   * @param {string} type 筛选类型
   * @param {Object} subjectParams 学科参数
   * @returns {Promise<Array>} 筛选选项列表
   */
  async getFilterOptions(type, subjectParams = {}) {
    const data = {
      ...subjectParams,
      type: type
    }
    return await this.makeRequest(this.API.filterSelector, data)
  }
  
  /**
   * 获取组卷列表 - 对应 Swift getCombList
   * @param {Object} data 请求数据
   * @returns {Promise<Object>} 组卷分页列表
   */
  async getCombList(data) {
    return await this.makeRequest(this.API.combList, data)
  }
  
  /**
   * 获取组卷详情 - 对应 Swift getCombDetail
   * @param {Object} data 请求数据
   * @returns {Promise<Object>} 组卷详情
   */
  async getCombDetail(data) {
    return await this.makeRequest(this.API.combDetail, data, true)
  }
  
  /**
   * 根据paperId获取组卷详情 - 对应 Swift getCombDetailById
   * @param {number} paperId 试卷ID
   * @returns {Promise<Object>} 组卷详情
   */
  async getCombDetailById(paperId) {
    const data = {
      accountId: getSimpleUserIdInt(),
      paperId: paperId,
      pageIndex: 1,
      pageSize: 20
    }
    return await this.getCombDetail(data)
  }
  
  /**
   * 为PDF生成获取组卷详情（容错版本） - 对应 Swift getCombDetailForGenerate
   * @param {number} paperId 试卷ID
   * @returns {Promise<Object>} 组卷详情
   */
  async getCombDetailForGenerate(paperId) {
    try {
      return await this.getCombDetailById(paperId)
    } catch (error) {
      console.warn('⚠️ Service: 获取组卷详情失败，使用空数组直接生成PDF:', error)
      // 如果获取详情失败，创建一个最小的CombPaperVO
      return {
        paperId: paperId,
        accountId: null,
        title: null,
        type: 'collection',
        level: null,
        subject: null,
        clazz: null,
        exam: null,
        paperKey: null,
        answerKey: null,
        score: null,
        status: null,
        subjectCount: 0,
        subjects: []
      }
    }
  }
  
  /**
   * 创建组卷 - 对应 Swift createCombPaper
   * @param {Object} data 创建数据
   * @returns {Promise<Object>} 创建结果
   */
  async createCombPaper(data) {
    console.log('🌐 QuestionService.createCombPaper: 发送请求', this.API.combCreate)
    console.log('📤 请求数据:', data)
    
    // 直接调用底层方法获取完整响应
    const url = `${this.baseURL}${this.API.combCreate}`
    const headers = { 'Content-Type': 'application/json' }
    
    const token = getSimpleToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    let requestData = { ...data }
    if (!data.accountId) {
      requestData.accountId = getSimpleUserId()
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }
      
      const responseData = await response.json()
      console.log('📥 创建组卷完整响应:', responseData)
      console.log('📥 创建组卷响应: paperId=', responseData.data?.paperId || 'nil')
      
      return responseData // 返回完整响应
    } catch (error) {
      console.error('❌ 创建组卷请求失败:', error)
      throw error
    }
  }
  
  /**
   * 添加组卷题目 - 对应 Swift addCombSubjects
   * @param {Object} data 添加数据
   * @returns {Promise<Object>} 添加结果
   */
  async addCombSubjects(data) {
    return await this.makeRequest(this.API.combSubjectAdd, data)
  }
  
  /**
   * 删除组卷题目 - 对应 Swift removeCombSubjects
   * @param {Object} data 删除数据
   * @returns {Promise<Object>} 删除结果
   */
  async removeCombSubjects(data) {
    return await this.makeRequest(this.API.combSubjectDelete, data)
  }
  
  /**
   * 更新组卷题目 - 对应 Swift updateCombSubjects
   * @param {Object} data 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateCombSubjects(data) {
    console.log('🌐 QuestionService.updateCombSubjects: 发送请求', this.API.combSubjectUpdate)
    console.log('📤 请求数据: paperId=', data.paperId || 'nil', ', 题目数=', (data.subjectVO || []).length)
    const result = await this.makeRequest(this.API.combSubjectUpdate, data)
    console.log('📥 更新题目响应: paperId=', result.paperId || 'nil')
    return result
  }
  
  /**
   * 生成PDF - 简化版本 - 对应 Swift generatePaperSimple
   * @param {number} paperId 试卷ID
   * @param {string} title 标题
   * @param {number} accountId 账户ID
   * @returns {Promise<Object>} 生成结果
   */
  async generatePaperSimple(paperId, title, accountId) {
    const requestData = {
      accountId: accountId,
      paperId: paperId,
      title: title
    }
    console.log('🌐 QuestionService.generatePaperSimple: 发送请求', this.API.combGenerate)
    console.log('📤 请求数据:', requestData)
    
    try {
      const result = await this.makeRequest(this.API.combGenerate, requestData)
      console.log('📥 生成PDF响应: paperId=', result.paperId || 'nil', ', paperKey=', result.paperKey || 'nil')
      return result
    } catch (error) {
      console.error('❌ 生成PDF失败:', error)
      throw error
    }
  }
  
  // MARK: - 题目管理方法
  
  /**
   * 添加题目到组卷（带完整逻辑）
   * @param {Object} question 题目对象
   * @param {number} paperId 组卷ID
   * @param {number} replaceNumber 题目序号
   * @returns {Promise<Object>} 添加结果
   */
  async addQuestionToCloud(question, paperId, replaceNumber) {
    try {
      // 按照小程序的逻辑，给题目添加replaceNumber
      const questionWithNumber = {
        ...question,
        replaceNumber: replaceNumber,
        paperId: paperId
      }
      
      // 处理子题目的replaceNumber
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
      
      const params = {
        accountId: getSimpleUserIdInt(),
        paperId: paperId,
        subjectVO: [questionWithNumber]
      }
      
      console.log('💾 QuestionService: 保存题目到云端:', questionWithNumber.id)
      const result = await this.addCombSubjects(params)
      
      if (result) {
        console.log('✅ QuestionService: 题目保存成功')
        return result
      }
      return null
    } catch (error) {
      console.error('❌ QuestionService: 保存题目到云端失败:', error)
      throw error
    }
  }

  /**
   * 从组卷中删除题目（带完整逻辑）
   * @param {string} questionId 题目ID
   * @param {number} paperId 组卷ID
   * @returns {Promise<Object>} 删除结果
   */
  async removeQuestionFromCloud(questionId, paperId) {
    try {
      const params = {
        accountId: getSimpleUserIdInt(),
        paperId: paperId,
        subjectId: questionId
      }
      
      console.log('🗑️ QuestionService: 从云端删除题目:', questionId)
      const result = await this.removeCombSubjects(params)
      
      if (result) {
        console.log('✅ QuestionService: 题目删除成功')
        return result
      }
      return null
    } catch (error) {
      console.error('❌ QuestionService: 从云端删除题目失败:', error)
      throw error
    }
  }

  /**
   * 创建组卷（带完整逻辑）
   * @param {Object} subjectInfo 学科信息
   * @returns {Promise<Object>} 创建结果
   */
  async createPaperWithInfo(subjectInfo) {
    try {
      const params = { 
        accountId: getSimpleUserIdInt(), 
        clazz: subjectInfo.clazz, 
        exam: subjectInfo.exam, 
        subject: subjectInfo.subject, 
        level: subjectInfo.level || '' 
      }
      
      console.log('🔨 QuestionService: 创建组卷:', params)
      const response = await this.createCombPaper(params)
      
      if (response.successful === true || response.code === "200" || response.code === 200) {
        console.log('✅ QuestionService: 组卷创建成功，paperId:', response.data.paperId)
        return response.data
      }
      return null
    } catch (error) {
      console.error('❌ QuestionService: 创建组卷异常:', error)
      throw error
    }
  }

  /**
   * 获取组卷详情（带完整逻辑）
   * @param {Object} subjectInfo 学科信息
   * @returns {Promise<Object>} 组卷详情
   */
  async getComboDetailWithInfo(subjectInfo) {
    try {
      const params = {
        accountId: getSimpleUserIdInt(),
        pageIndex: 1,
        pageSize: 20,
        clazz: subjectInfo.clazz,
        exam: subjectInfo.exam,
        subject: subjectInfo.subject
      }
      
      const data = await this.getCombDetail(params)
      
      if (data?.paperId) {
        console.log('✅ QuestionService: 找到现有组卷，包含', (data.subjects || []).length, '个题目')
        return data
      } else {
        return null
      }
    } catch (error) {
      console.log('📝 QuestionService: 该学科没有现有组卷')
      return null
    }
  }

  /**
   * 从paperName检测学科
   * @param {string} paperName 试卷名称
   * @returns {string|null} 学科名称
   */
  detectSubjectFromPaperName(paperName) {
    if (!paperName) return null
    
    const name = paperName.toLowerCase()
    
    // 使用从API获取的学科映射
    if (!this._subjectMappings) {
      console.warn('⚠️ QuestionService: 学科映射未初始化，无法检测学科')
      return null
    }
    
    for (const [key, value] of Object.entries(this._subjectMappings)) {
      if (name.includes(key)) return value
    }
    return null
  }

  /**
   * 初始化学科映射（从收藏学科API获取）
   * @returns {Promise<void>}
   */
  async initializeSubjectMappings() {
    try {
      // 从SubjectService获取收藏的学科列表
      const { subjectService } = await import('./index.js')
      const response = await subjectService.getCollectSubjectList()
      
      if (response.successful && response.data && response.data.length > 0) {
        // 构建学科映射
        const mappings = {}
        response.data.forEach(subject => {
          if (subject.subject) {
            // 添加学科名称映射
            mappings[subject.subject.toLowerCase()] = subject.subject
            
            // 尝试从学科名称推断试卷编号
            const code = this._inferSubjectCode(subject.subject)
            if (code) {
              mappings[code] = subject.subject
            }
          }
        })
        
        this._subjectMappings = mappings
        console.log('✅ QuestionService: 学科映射已从收藏学科API初始化:', mappings)
      }
    } catch (error) {
      console.warn('⚠️ QuestionService: 无法从收藏学科API获取学科映射:', error)
      // 不设置映射，让系统知道映射未初始化
      this._subjectMappings = null
    }
  }

  /**
   * 从学科名称推断试卷编号（私有方法）
   * 注意：这个方法现在主要用于构建映射时的辅助，实际的映射关系应该从API获取
   * @param {string} subjectName 学科名称
   * @returns {string|null} 试卷编号
   */
  _inferSubjectCode(subjectName) {
    // 这里可以实现更智能的推断逻辑，比如从学科名称中提取编号
    // 或者从其他API获取学科编号映射关系
    // 目前返回null，让系统完全依赖API数据
    console.log('📝 QuestionService: 尝试推断学科编号:', subjectName)
    return null
  }

  /**
   * 获取所有支持的学科
   * @returns {Promise<string[]>} 学科名称数组
   */
  async getSupportedSubjects() {
    try {
      // 从SubjectService获取收藏的学科列表
      const { subjectService } = await import('./index.js')
      const response = await subjectService.getCollectSubjectList()
      
      if (response.successful && response.data && response.data.length > 0) {
        return response.data.map(item => item.subject).filter(Boolean)
      }
      
      // 如果没有收藏学科，返回空数组
      console.warn('⚠️ QuestionService: 用户没有收藏任何学科')
      return []
    } catch (error) {
      console.warn('⚠️ QuestionService: 无法获取支持的学科列表:', error)
      return []
    }
  }

  // MARK: - 筛选方法
  
  /**
   * 获取所有筛选选项 - 对应 Swift getAllFilterOptions
   * @param {Object} subjectParams 学科参数
   * @returns {Promise<{questionTypes: string[], difficulties: string[], knowledgePoints: string[]}>} 所有筛选选项
   */
  async getAllFilterOptions(subjectParams = {}) {
    try {
      // 并行请求所有筛选选项
      const [questionTypes, difficulties, knowledgePoints] = await Promise.all([
        this.getFilterOptions('questionType', subjectParams),
        this.getFilterOptions('difficulty', subjectParams),
        this.getFilterOptions('knowledgePoint', subjectParams)
      ])
      
      return {
        questionTypes: questionTypes,
        difficulties: difficulties,
        knowledgePoints: knowledgePoints
      }
    } catch (error) {
      console.error('❌ 获取筛选选项失败:', error)
      throw error
    }
  }
}

// 创建单例实例 - 对应 Swift static let shared
export const questionService = new QuestionService()

export default questionService
