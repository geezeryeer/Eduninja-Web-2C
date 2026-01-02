/**
 * 文档服务
 */
import Config from './config.js'
import { getCurrentUserId } from './AuthService.js'

// 活动类型枚举
export const ActivityType = {
  VIEW: 'view',
  DOWNLOAD: 'download'
}

class DocService {
  constructor() {
    this.baseURL = Config.APIURL
  }
  
  /**
   * 通用请求方法
   */
  async request(endpoint, data = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('token') || ''
    
    // 自动添加 accountId（如果没有 userId 和 accountId）
    if (!data.accountId && !data.userId) {
      data.accountId = getCurrentUserId()
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
      
      // 返回完整的响应对象（保持原有行为）
      return await response.json()
      
    } catch (error) {
      console.error(`[DocService] ${endpoint}:`, error)
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
   * 获取文档列表
   */
  async getDocList(data) {
    return await this.request('/api/wx/material/list', data)
  }
  
  /**
   * 获取文档详情（自动解包）
   */
  async getDocDetail(data) {
    return await this.requestData('/api/wx/material/detail', data)
  }
  
  /**
   * 删除文档
   */
  async deleteDocument(materialId) {
    return await this.request('/api/wx/material/delete', {
      materialId: parseInt(materialId)
    })
  }
  
  /**
   * 切换文档收藏状态
   */
  async toggleDocCollection(materialId, isCollected) {
    const endpoint = isCollected ? '/api/wx/material/uncollect' : '/api/wx/material/collect'
    
    // 注意：收藏接口需要 userId，不是 accountId
    const result = await this.request(endpoint, { 
      id: parseInt(materialId),
      userId: getCurrentUserId()
    })
    
    // 如果 API 返回失败，抛出错误
    if (!result.successful) {
      throw new Error(result.message || '收藏操作失败')
    }
    
    return true
  }
  
  /**
   * 更新文档信息（合并 updateMaterial 和 updateDocumentSubject）
   */
  async updateMaterial(material, updates = {}) {
    const data = {
      id: parseInt(material.id),
      title: updates.title || material.title,
      type: material.type || 'Document',
      updatedBy: getCurrentUserId(),
      updatedName: '用户',
      clazz: updates.clazz || material.clazz,
      exam: updates.exam || material.exam,
      subject: updates.subject || material.subject,
      labelList: updates.labelList || material.labelList,
      levelList: material.levelList
    }
    
    const result = await this.request('/api/wx/material/update', data)
    return result.successful
  }
  
  /**
   * 报告活动（浏览/下载统计）
   */
  async reportActivity(materialId, activityType) {
    const endpoint = activityType === ActivityType.VIEW 
      ? '/api/wx/material/view-report' 
      : '/api/wx/material/download-report'
    
    const result = await this.request(endpoint, { id: parseInt(materialId) })
    return result.successful || result.data || false
  }
  
  /**
   * 下载文档
   */
  async downloadDocument(material) {
    if (!material.fileUrl) throw new Error('无效的文件链接')
    
    // 下载文件
    const response = await fetch(material.fileUrl)
    if (!response.ok) throw new Error('下载失败')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    
    // 触发下载
    const link = document.createElement('a')
    link.href = url
    link.download = material.fileName || '下载文件.pdf'
    link.click()
    
    window.URL.revokeObjectURL(url)
    
    // 后台上报
    setTimeout(() => {
      this.reportActivity(material.id, ActivityType.DOWNLOAD).catch(console.warn)
    }, 0)
  }
  
  /**
   * 加载封面图片
   */
  async loadCoverImage(material) {
    if (!material.coverUrl) return null
    
    let url = material.coverUrl
    if (!url.startsWith('http')) {
      url = `https://cheese-test-public.oss-accelerate.aliyuncs.com/${url}`
    }
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('图片加载失败')
    
    const blob = await response.blob()
    return window.URL.createObjectURL(blob)
  }
  
  /**
   * 下载PDF
   */
  async downloadPDF(material) {
    if (!material.fileUrl) throw new Error('文档链接无效')
    
    const response = await fetch(material.fileUrl)
    if (!response.ok) throw new Error('PDF下载失败')
    
    const blob = await response.blob()
    if (!blob.type.includes('pdf')) throw new Error('PDF格式错误')
    
    return {
      blob,
      url: window.URL.createObjectURL(blob)
    }
  }
}

// 创建单例实例 - 对应 Swift static let shared
export const docService = new DocService()

export default docService
