/**
 * 试卷服务 - 对应 Swift PastPaperService.swift
 */

import Config from './config.js'

// Token获取函数 - 从localStorage获取真实token
const getSimpleToken = () => localStorage.getItem('token') || ''
const getSimpleUserId = () => "123"

class PastPaperService {
  constructor() {
    this.baseURL = Config.APIURL
    
    // 优化的网络配置
    this.requestOptions = {
      timeout: Config.TIMEOUT.DEFAULT, // 15秒
      cache: 'default'
    }
  }
  
  // MARK: - 统一的请求方法
  
  /**
   * 通用请求方法 - 对应 Swift makeRequest
   * @param {string} endpoint API端点
   * @param {string} method HTTP方法
   * @param {Object} data 请求数据
   * @returns {Promise<any>} 响应数据
   */
  async makeRequest(endpoint, method = 'POST', data = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    // 简化：添加固定token
    const token = getSimpleToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // 准备请求数据
    let requestData = { ...data }
    if (!data.accountId) {
      requestData.accountId = getSimpleUserId()
    }
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(this.requestOptions.timeout)
      })
      
      // 检查HTTP状态码
      if (!response.ok) {
        throw new Error(`网络请求失败: HTTP ${response.status}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error(`[PastPaperService] 请求失败 ${endpoint}:`, error)
      throw error
    }
  }
  
  /**
   * 用于需要解包 CommonResponse 的请求 - 对应 Swift makeRequestWithCommonResponse
   * @param {string} endpoint API端点
   * @param {string} method HTTP方法
   * @param {Object} data 请求数据
   * @returns {Promise<any>} 解包后的响应数据
   */
  async makeRequestWithCommonResponse(endpoint, method = 'POST', data = {}) {
    const response = await this.makeRequest(endpoint, method, data)
    
    if (!response.successful) {
      throw new Error(response.message || '请求失败')
    }
    
    if (response.data === undefined) {
      throw new Error('无效的响应数据')
    }
    
    return response.data
  }
  
  /**
   * 用于返回 Bool 的请求 - 对应 Swift makeBoolRequest
   * @param {string} endpoint API端点
   * @param {string} method HTTP方法
   * @param {Object} data 请求数据
   * @returns {Promise<boolean>} 布尔结果
   */
  async makeBoolRequest(endpoint, method = 'POST', data = {}) {
    const response = await this.makeRequest(endpoint, method, data)
    return response.data || false
  }
  
  // MARK: - API方法
  
  /**
   * 获取试卷列表 - 对应 Swift getPastPaperList
   * @param {Object} data 请求参数，包含分页信息和筛选条件
   * @returns {Promise<Object>} 试卷列表的分页响应
   */
  async getPastPaperList(data) {
    return await this.makeRequest('/api/wx/paper/list', 'POST', data)
  }
  
  /**
   * 获取试卷详情 - 对应 Swift getPastPaperDetail
   * @param {Object} data 请求参数，包含试卷ID
   * @returns {Promise<Object>} 试卷详情
   */
  async getPastPaperDetail(data) {
    return await this.makeRequestWithCommonResponse('/api/wx/paper/detail', 'POST', data)
  }
  
  /**
   * 收藏试卷 - 对应 Swift collectPastPaper
   * @param {Object} data 请求参数，包含试卷ID
   * @returns {Promise<boolean>} 收藏结果
   */
  async collectPastPaper(data) {
    return await this.makeBoolRequest('/api/wx/paper/collect', 'POST', data)
  }
  
  /**
   * 取消收藏试卷 - 对应 Swift uncollectPastPaper
   * @param {Object} data 请求参数，包含试卷ID
   * @returns {Promise<boolean>} 取消收藏结果
   */
  async uncollectPastPaper(data) {
    return await this.makeBoolRequest('/api/wx/paper/uncollect', 'POST', data)
  }
  
  /**
   * 报告试卷浏览 - 对应 Swift reportPastPaperView
   * @param {Object} data 请求参数，包含试卷ID和浏览信息
   * @returns {Promise<boolean>} 报告结果
   */
  async reportPastPaperView(data) {
    return await this.makeBoolRequest('/api/wx/paper/view-report', 'POST', data)
  }
  
  /**
   * 报告试卷下载 - 对应 Swift reportPastPaperDownload
   * @param {Object} data 请求参数，包含试卷ID和下载信息
   * @returns {Promise<boolean>} 报告结果
   */
  async reportPastPaperDownload(data) {
    return await this.makeBoolRequest('/api/wx/paper/download-report', 'POST', data)
  }
  
  /**
   * 获取试卷筛选器选项 - 对应 Swift getPastPaperFilters
   * @param {Object} data 请求参数
   * @returns {Promise<Array>} 筛选器选项列表
   */
  async getPastPaperFilters(data) {
    return await this.makeRequestWithCommonResponse('/api/wx/paper-filter/list', 'POST', data)
  }
  
  /**
   * 获取试卷筛选选择器选项 - 对应 Swift getPastPaperFilterSelector
   * @param {Object} query 筛选查询参数
   * @returns {Promise<{years: string[], seasons: string[], types: string[]}>} 筛选选项元组
   */
  async getPastPaperFilterSelector(query = {}) {
    const data = {
      clazz: query.clazz || '',
      exam: query.exam || '',
      level: query.level || '',
      subject: query.subject || ''
    }
    
    const requestStartTime = Date.now()
    console.log('🌐 [PastPaperService] 调用试卷筛选选择器API')
    console.log('📤 [PastPaperService] 请求端点: /api/wx/paper-filter-selector/list')
    console.log('📊 [PastPaperService] 请求参数:', data)
    console.log('⏰ [PastPaperService] 网络请求开始时间:', new Date(requestStartTime))
    
    try {
      const result = await this.makeRequestWithCommonResponse('/api/wx/paper-filter-selector/list', 'POST', data)
      
      const requestEndTime = Date.now()
      const networkTime = (requestEndTime - requestStartTime) / 1000
      console.log(`📥 [PastPaperService] API响应成功，网络耗时: ${networkTime.toFixed(2)}秒`)
      console.log('📅 [PastPaperService] 原始年份列表:', result.yearList || [])
      console.log('🌍 [PastPaperService] 原始季节列表:', result.seasonList || [])
      console.log('📝 [PastPaperService] 原始试卷类型列表:', result.paperTypeList || [])
      
      // 处理年份排序（降序）
      const safeYearList = result.yearList || []
      const sortedYears = safeYearList.sort((a, b) => b.localeCompare(a))
      
      console.log('📅 排序后年份列表:', sortedYears)
      
      return {
        years: sortedYears,
        seasons: result.seasonList || [],
        types: result.paperTypeList || []
      }
      
    } catch (error) {
      const requestEndTime = Date.now()
      const networkTime = (requestEndTime - requestStartTime) / 1000
      console.error(`❌ [PastPaperService] API请求失败，耗时: ${networkTime.toFixed(2)}秒, 错误:`, error)
      throw error
    }
  }
  
  /**
   * 获取所有试卷筛选选项 - 对应 Swift getAllPastPaperFilterOptions
   * @param {Object} data 请求参数
   * @returns {Promise<{years: string[], seasons: string[], types: string[]}>} 筛选选项元组
   */
  async getAllPastPaperFilterOptions(data = {}) {
    const startTime = Date.now()
    console.log('🌐 [PastPaperService] 开始获取筛选选项 -', new Date(startTime))
    
    // 构建查询参数
    const queryStartTime = Date.now()
    const query = {
      clazz: data.clazz,
      exam: data.exam,
      level: data.level,
      subject: data.subject
    }
    const queryTime = (Date.now() - queryStartTime) / 1000
    console.log(`📝 [PastPaperService] 构建查询对象耗时: ${queryTime.toFixed(3)}秒`)
    
    try {
      const primaryApiStartTime = Date.now()
      console.log('🎯 [PastPaperService] 尝试主API: /api/wx/paper-filter-selector/list')
      const result = await this.getPastPaperFilterSelector(query)
      const primaryApiTime = (Date.now() - primaryApiStartTime) / 1000
      const totalTime = (Date.now() - startTime) / 1000
      console.log(`✅ [PastPaperService] 主API成功，耗时: ${primaryApiTime.toFixed(2)}秒, 总耗时: ${totalTime.toFixed(2)}秒`)
      return result
    } catch (error) {
      const fallbackStartTime = Date.now()
      console.log('⚠️ [PastPaperService] 主API失败:', error, ', 尝试备选方案...')
      try {
        const fallbackResult = await this.extractFilterOptionsFromPaperList(data)
        const fallbackTime = (Date.now() - fallbackStartTime) / 1000
        const totalTime = (Date.now() - startTime) / 1000
        console.log(`✅ [PastPaperService] 备选方案成功，耗时: ${fallbackTime.toFixed(2)}秒, 总耗时: ${totalTime.toFixed(2)}秒`)
        return fallbackResult
      } catch (fallbackError) {
        const totalTime = (Date.now() - startTime) / 1000
        console.error(`❌ [PastPaperService] 备选方案也失败: ${fallbackError}, 总耗时: ${totalTime.toFixed(2)}秒`)
        throw fallbackError
      }
    }
  }
  
  /**
   * 从试卷列表中提取筛选选项的备选方案 - 对应 Swift extractFilterOptionsFromPaperList
   * @param {Object} data 请求参数
   * @returns {Promise<{years: string[], seasons: string[], types: string[]}>} 从实际试卷数据中提取的筛选选项
   */
  async extractFilterOptionsFromPaperList(data) {
    const params = {
      ...data,
      current: 1,
      size: 100 // 获取足够多的数据来提取选项
    }
    
    const response = await this.getPastPaperList(params)
    
    if (!response.data?.list) {
      throw new Error('无法获取试卷列表数据')
    }
    
    const papers = response.data.list
    
    // 从实际数据中提取选项
    const yearsSet = new Set()
    const seasonsSet = new Set()
    const typesSet = new Set()
    
    papers.forEach(paper => {
      if (paper.year) yearsSet.add(paper.year)
      if (paper.season) seasonsSet.add(paper.season)
      if (paper.type) typesSet.add(paper.type)
    })
    
    const years = Array.from(yearsSet).sort((a, b) => b.localeCompare(a))
    
    return {
      years: years,
      seasons: Array.from(seasonsSet),
      types: Array.from(typesSet)
    }
  }
  
  /**
   * 下载试卷文件 - 对应 Swift downloadPastPaperFile
   * @param {string} url 文件URL
   * @returns {Promise<Blob>} 文件数据
   */
  async downloadPastPaperFile(url) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(this.requestOptions.timeout)
      })
      
      if (!response.ok) {
        throw new Error(`下载失败: HTTP ${response.status}`)
      }
      
      return await response.blob()
      
    } catch (error) {
      throw new Error(`下载文件失败: ${error.message}`)
    }
  }
  
  /**
   * 获取试卷统计信息 - 对应 Swift getPastPaperStats
   * @param {Object} data 请求参数
   * @returns {Promise<Object>} 统计信息
   */
  async getPastPaperStats(data) {
    return await this.makeRequestWithCommonResponse('/api/wx/paper/stats', 'POST', data)
  }
  
  // MARK: - 试卷查询参数构建器
  
  /**
   * 构建试卷列表查询参数 - 对应 Swift buildListQuery
   * @param {Object} params 查询参数
   * @returns {Object} 查询参数字典
   */
  buildListQuery({
    current,
    size,
    subject = null,
    examBoard = null,
    year = null,
    session = null,
    paperType = null,
    difficulty = null,
    keyword = null
  }) {
    const params = {
      pageIndex: current, // API使用pageIndex而不是current
      pageSize: size,     // API使用pageSize而不是size
      clazz: "",          // 课程体系名称
      exam: "",           // 考试局名称
      level: "",          // 等级名称
      sortType: "",       // 排序方式
      type: ""            // Paper类型
    }
    
    if (subject) params.subject = subject
    if (examBoard) params.exam = examBoard
    if (year) params.year = year
    if (session) params.season = session  // API使用season而不是session
    if (paperType) params.type = paperType
    if (keyword) params.keyword = keyword
    
    return params
  }
  
  /**
   * 构建试卷详情查询参数 - 对应 Swift buildDetailQuery
   * @param {string} paperId 试卷ID
   * @returns {Object} 查询参数字典
   */
  buildDetailQuery(paperId) {
    return { id: paperId }
  }
  
  /**
   * 构建收藏/取消收藏参数 - 对应 Swift buildCollectionQuery
   * @param {string} paperId 试卷ID
   * @returns {Object} 参数字典
   */
  buildCollectionQuery(paperId) {
    return { id: paperId }
  }
  
  /**
   * 构建浏览报告参数 - 对应 Swift buildViewReportQuery
   * @param {string} paperId 试卷ID
   * @param {number|null} duration 浏览时长（秒）
   * @returns {Object} 参数字典
   */
  buildViewReportQuery(paperId, duration = null) {
    const params = { id: paperId }
    if (duration !== null) {
      params.duration = duration
    }
    return params
  }
  
  /**
   * 构建下载报告参数 - 对应 Swift buildDownloadReportQuery
   * @param {string} paperId 试卷ID
   * @param {string} fileType 文件类型 ("paper", "answer", "attachment")
   * @returns {Object} 参数字典
   */
  buildDownloadReportQuery(paperId, fileType) {
    return {
      id: paperId,
      fileType: fileType
    }
  }
  
  // MARK: - API端点检查和替代方案
  
  /**
   * 检查报告API端点是否可用 - 对应 Swift checkReportEndpointsAvailability
   * @returns {Promise<boolean>} API端点是否可用
   */
  async checkReportEndpointsAvailability() {
    // TODO: 实现API端点健康检查
    // 可以通过发送简单的OPTIONS请求或者健康检查端点来验证
    return false
  }
  
  /**
   * 使用替代方案报告试卷活动 - 对应 Swift reportAlternative
   * @param {string} paperId 试卷ID
   * @param {string} activityType 活动类型
   * @returns {Promise<boolean>} 报告是否成功
   */
  async reportAlternative(paperId, activityType) {
    // TODO: 如果后端提供了替代的报告端点，可以在这里实现
    // 例如使用类似DocService的端点格式
    console.log(`ℹ️ 替代报告方案待实现 (试卷ID: ${paperId}, 活动: ${activityType})`)
    return false
  }
}

// 创建单例实例 - 对应 Swift static let shared
export const pastPaperService = new PastPaperService()

export default pastPaperService
