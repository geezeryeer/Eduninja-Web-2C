/**
 * 试卷服务
 */
import Config from './config.js'

const getSimpleUserId = () => "123"

class PastPaperService {
  constructor() {
    this.baseURL = Config.APIURL
  }
  
  /**
   * 通用请求方法
   */
  async request(endpoint, data = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('token') || ''
    
    // 自动添加 accountId
    if (!data.accountId) {
      data.accountId = getSimpleUserId()
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(Config.TIMEOUT.DEFAULT)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error(`[PastPaperService] ${endpoint}:`, error)
      throw error
    }
  }
  
  /**
   * 带自动解包的请求方法
   */
  async requestData(endpoint, data = {}) {
    const result = await this.request(endpoint, data)
    
    if (!result.successful || result.data === undefined) {
      throw new Error(result.message || '请求失败')
    }
    
    return result.data
  }
  
  /**
   * 获取试卷列表
   */
  async getPastPaperList(data) {
    return await this.request('/api/wx/paper/list', data)
  }
  
  /**
   * 获取试卷详情
   */
  async getPastPaperDetail(data) {
    return await this.requestData('/api/wx/paper/detail', data)
  }
  
  /**
   * 切换试卷收藏状态
   */
  async togglePaperCollection(paperId, isCollected) {
    const endpoint = isCollected ? '/api/wx/paper/uncollect' : '/api/wx/paper/collect'
    const result = await this.request(endpoint, { id: paperId })
    return result.data || false
  }
  
  /**
   * 报告试卷活动（浏览/下载）
   */
  async reportPaperActivity(paperId, activityType) {
    const endpoint = activityType === 'view' 
      ? '/api/wx/paper/view-report' 
      : '/api/wx/paper/download-report'
    const result = await this.request(endpoint, { id: paperId })
    return result.data || false
  }
  
  /**
   * 获取试卷筛选器选项
   */
  async getPastPaperFilters(data) {
    return await this.requestData('/api/wx/paper-filter/list', data)
  }
  
  /**
   * 获取试卷筛选选择器选项
   */
  async getPastPaperFilterSelector(query = {}) {
    const data = {
      clazz: query.clazz || '',
      exam: query.exam || '',
      level: query.level || '',
      subject: query.subject || ''
    }
    
    try {
      const result = await this.requestData('/api/wx/paper-filter-selector/list', data)
      
      // 年份降序排序
      const years = (result.yearList || []).sort((a, b) => b.localeCompare(a))
      
      return {
        years,
        seasons: result.seasonList || [],
        types: result.paperTypeList || []
      }
    } catch (error) {
      console.error('[PastPaperService] 筛选器API失败:', error)
      throw error
    }
  }
  
  /**
   * 获取所有试卷筛选选项（带备选方案）
   */
  async getAllPastPaperFilterOptions(data = {}) {
    try {
      return await this.getPastPaperFilterSelector(data)
    } catch (error) {
      // 备选方案：从试卷列表提取
      console.warn('[PastPaperService] 使用备选方案获取筛选选项')
      return await this.extractFilterOptionsFromPaperList(data)
    }
  }
  
  /**
   * 从试卷列表提取筛选选项（备选方案）
   */
  async extractFilterOptionsFromPaperList(data) {
    const response = await this.getPastPaperList({
      ...data,
      current: 1,
      size: 100
    })
    
    if (!response.data?.list) {
      throw new Error('无法获取试卷列表')
    }
    
    const papers = response.data.list
    const yearsSet = new Set()
    const seasonsSet = new Set()
    const typesSet = new Set()
    
    papers.forEach(paper => {
      if (paper.year) yearsSet.add(paper.year)
      if (paper.season) seasonsSet.add(paper.season)
      if (paper.type) typesSet.add(paper.type)
    })
    
    return {
      years: Array.from(yearsSet).sort((a, b) => b.localeCompare(a)),
      seasons: Array.from(seasonsSet),
      types: Array.from(typesSet)
    }
  }
  
  /**
   * 下载试卷文件
   */
  async downloadPaperFile(url) {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(Config.TIMEOUT.DEFAULT)
    })
    
    if (!response.ok) throw new Error('下载失败')
    return await response.blob()
  }
  
  /**
   * 获取试卷统计信息
   */
  async getPastPaperStats(data) {
    return await this.requestData('/api/wx/paper/stats', data)
  }
  
  /**
   * 构建试卷列表查询参数
   */
  buildListQuery({
    current,
    size,
    subject = null,
    examBoard = null,
    year = null,
    session = null,
    paperType = null,
    keyword = null
  }) {
    const params = {
      pageIndex: current,
      pageSize: size,
      clazz: "",
      exam: "",
      level: "",
      sortType: "",
      type: ""
    }
    
    if (subject) params.subject = subject
    if (examBoard) params.exam = examBoard
    if (year) params.year = year
    if (session) params.season = session
    if (paperType) params.type = paperType
    if (keyword) params.keyword = keyword
    
    return params
  }
}

// 创建单例实例
export const pastPaperService = new PastPaperService()

export default pastPaperService
