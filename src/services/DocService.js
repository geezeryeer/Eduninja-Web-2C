/**
 * 文档服务 - 对应 Swift DocService.swift
 */

import Config from './config.js'

// 简化的用户数据
const getSimpleUserData = () => ({
  id: 123,
  userId: 123,
  accountId: "123"
})

// 活动类型枚举 - 对应 Swift ActivityType
export const ActivityType = {
  VIEW: 'view',
  DOWNLOAD: 'download'
}

class DocService {
  constructor() {
    this.baseURL = Config.APIURL
    
    // 配置缓存选项
    this.cacheOptions = {
      timeout: Config.TIMEOUT.DEFAULT,
      cache: 'default'
    }
  }
  
  // MARK: - 辅助方法
  
  /**
   * 获取用户数据 - 简化版本
   * @returns {Object} 用户数据
   */
  getUserData() {
    return getSimpleUserData()
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
    
    // Token获取函数 - 从localStorage获取真实token
    const token = localStorage.getItem('token') || ''
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    let requestData = { ...data }
    if (!data.accountId && !data.userId) {
      requestData.accountId = "123"
    }
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(this.cacheOptions.timeout)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error(`[DocService] 请求失败 ${endpoint}:`, error)
      throw error
    }
  }
  
  /**
   * 带通用响应包装的请求方法 - 对应 Swift makeRequestWithCommonResponse
   * @param {string} endpoint API端点
   * @param {string} method HTTP方法
   * @param {Object} data 请求数据
   * @returns {Promise<any>} 解包后的响应数据
   */
  async makeRequestWithCommonResponse(endpoint, method = 'POST', data = {}) {
    const response = await this.makeRequest(endpoint, method, data)
    
    if (!response.successful || response.data === undefined) {
      throw new Error(response.message || '请求失败')
    }
    
    return response.data
  }
  
  // MARK: - 基础 API 方法
  
  /**
   * 获取文档列表 - 对应 Swift getDocList
   * @param {Object} data 查询参数
   * @returns {Promise<Object>} 文档列表响应
   */
  async getDocList(data) {
    return await this.makeRequest('/api/wx/material/list', 'POST', data)
  }
  
  /**
   * 获取文档详情 - 对应 Swift getDocDetail
   * @param {Object} data 查询参数
   * @returns {Promise<Object>} 文档详情
   */
  async getDocDetail(data) {
    return await this.makeRequestWithCommonResponse('/api/wx/material/detail', 'POST', data)
  }
  
  // MARK: - 文档删除方法
  
  /**
   * 删除文档 - 对应 Swift deleteDocument
   * @param {string} materialId 文档ID
   * @returns {Promise<boolean>} 删除是否成功
   */
  async deleteDocument(materialId) {
    const materialIdInt = parseInt(materialId)
    if (!materialIdInt || materialIdInt <= 0) {
      throw new Error('文档ID无效')
    }
    
    const requestData = {
      ...this.getUserData(),
      materialId: materialIdInt
    }
    
    try {
      const response = await this.makeRequest('/api/wx/material/delete', 'POST', requestData)
      
      if (!response.successful) {
        throw new Error(response.message || '删除失败')
      }
      
      return true
      
    } catch (error) {
      throw new Error(`删除文档失败: ${error.message}`)
    }
  }
  
  // MARK: - 收藏相关方法（合并为一个方法）
  
  /**
   * 切换文档收藏状态 - 对应 Swift toggleDocCollection
   * @param {string} materialId 文档ID
   * @param {boolean} isCollected 当前是否已收藏
   * @returns {Promise<boolean>} 操作是否成功
   */
  async toggleDocCollection(materialId, isCollected) {
    const endpoint = isCollected ? '/api/wx/material/uncollect' : '/api/wx/material/collect'
    const data = {
      ...this.getUserData(),
      id: parseInt(materialId) || 0
    }
    
    const response = await this.makeRequest(endpoint, 'POST', data)
    return response.successful
  }
  
  // MARK: - 更新方法（统一的更新方法）
  
  /**
   * 更新文档信息 - 对应 Swift updateMaterial
   * @param {Object} material 文档对象
   * @param {string[]|null} newTags 新标签列表
   * @param {string|null} newTitle 新标题
   * @returns {Promise<boolean>} 更新是否成功
   */
  async updateMaterial(material, newTags = null, newTitle = null) {
    const materialId = parseInt(material.id)
    if (!materialId || materialId <= 0) {
      throw new Error('无效的资料ID')
    }
    
    const requestData = {
      id: materialId,
      title: newTitle || material.title,
      type: material.type || 'Document',
      updatedBy: 123,
      updatedName: '用户',
      clazz: material.clazz,
      exam: material.exam,
      subject: material.subject,
      labelList: newTags || material.labelList,
      levelList: material.levelList
    }
    
    try {
      const response = await this.makeRequest('/api/wx/material/update', 'POST', requestData)
      
      if (!response.successful) {
        throw new Error(response.message || '更新失败')
      }
      
      // 清除文档缓存（如果有缓存服务的话）
      // CacheService.clearDocumentCache(material.id)
      
      return true
      
    } catch (error) {
      throw new Error(`更新文档失败: ${error.message}`)
    }
  }
  
  /**
   * 更新文档学科信息 - 对应 Swift updateDocumentSubject
   * @param {Object} material 文档对象
   * @param {string|null} newClazz 新体系
   * @param {string|null} newExam 新考试局
   * @param {string|null} newSubject 新学科
   * @returns {Promise<boolean>} 更新是否成功
   */
  async updateDocumentSubject(material, newClazz, newExam, newSubject) {
    const materialId = parseInt(material.id)
    if (!materialId || materialId <= 0) {
      throw new Error('无效的资料ID')
    }
    
    const requestData = {
      id: materialId,
      title: material.title,
      type: material.type || 'Document',
      updatedBy: 123,
      updatedName: '用户',
      clazz: newClazz,
      exam: newExam,
      subject: newSubject,
      labelList: material.labelList,
      levelList: material.levelList
    }
    
    try {
      const response = await this.makeRequest('/api/wx/material/update', 'POST', requestData)
      
      if (!response.successful) {
        throw new Error(response.message || '更新失败')
      }
      
      // 清除文档缓存（如果有缓存服务的话）
      // CacheService.clearDocumentCache(material.id)
      
      return true
      
    } catch (error) {
      throw new Error(`更新文档学科失败: ${error.message}`)
    }
  }
  
  // MARK: - 报告方法（合并为一个方法）
  
  /**
   * 报告活动 - 对应 Swift reportActivity
   * @param {string} materialId 文档ID
   * @param {string} activityType 活动类型 (ActivityType.VIEW 或 ActivityType.DOWNLOAD)
   * @returns {Promise<boolean>} 报告是否成功
   */
  async reportActivity(materialId, activityType) {
    const endpoint = activityType === ActivityType.VIEW 
      ? '/api/wx/material/view-report' 
      : '/api/wx/material/download-report'
    
    const data = {
      ...this.getUserData(),
      id: parseInt(materialId) || 0
    }
    
    const response = await this.makeRequest(endpoint, 'POST', data)
    return response.data || false
  }
  
  // MARK: - VIP权限检查
  
  /**
   * 检查用户是否有权限下载文档 - 对应 Swift checkDownloadPermission
   * @param {Object} material 文档对象
   * @throws {Error} 如果没有权限则抛出错误
   */
  checkDownloadPermission(material) {
    // 免费资料直接通过
    if (!material.isVip) {
      return
    }
    
    // 简化：假设用户有VIP权限
    // if (!userIsVip) {
    //   throw new Error('此资料需要VIP会员才能下载，请先开通VIP会员')
    // }
  }
  
  // MARK: - 文件下载
  
  /**
   * 下载文件 - 对应 Swift downloadFile
   * @param {string} url 文件URL
   * @returns {Promise<Blob>} 文件数据
   */
  async downloadFile(url) {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }
      
      return await response.blob()
      
    } catch (error) {
      throw new Error(`下载文件失败: ${error.message}`)
    }
  }
  
  /**
   * 下载并保存文档到本地 - 对应 Swift downloadAndSaveDocument
   * @param {Object} material 文档对象
   * @returns {Promise<void>}
   */
  async downloadAndSaveDocument(material) {
    // VIP权限检查
    this.checkDownloadPermission(material)
    
    // 获取文件URL
    if (!material.fileUrl) {
      throw new Error('无效的文件链接')
    }
    
    // 下载文件
    const fileBlob = await this.downloadFile(material.fileUrl)
    
    // 创建下载链接并触发下载
    const fileName = material.fileName || '下载文件.pdf'
    const downloadUrl = window.URL.createObjectURL(fileBlob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理URL对象
    window.URL.revokeObjectURL(downloadUrl)
    
    // 后台上报统计（不影响用户体验）
    setTimeout(() => {
      this.reportActivity(material.id, ActivityType.DOWNLOAD).catch(console.warn)
    }, 0)
  }
  
  /**
   * 安全下载方法 - 对应 Swift attemptDocumentDownload
   * @param {Object} material 文档对象
   * @returns {Promise<{success: boolean, message: string}>} 下载结果
   */
  async attemptDocumentDownload(material) {
    try {
      await this.downloadAndSaveDocument(material)
      return { success: true, message: '文档下载成功' }
    } catch (error) {
      const message = error.message.includes('VIP') 
        ? error.message 
        : `下载失败: ${error.message}`
      return { success: false, message }
    }
  }
  
  // MARK: - 图片加载服务
  
  /**
   * 加载文档封面图片 - 对应 Swift loadDocumentCoverImage
   * @param {Object} material 文档对象
   * @returns {Promise<string>} 图片URL（可用于img src）
   */
  async loadDocumentCoverImage(material) {
    if (!material.coverUrl) {
      throw new Error('没有图片链接')
    }
    
    let urlString = material.coverUrl
    if (!urlString.startsWith('http')) {
      urlString = `https://cheese-test-public.oss-accelerate.aliyuncs.com/${urlString}`
    }
    
    // 检查缓存（如果有缓存服务的话）
    // const cachedImage = CacheService.getCachedImage(urlString)
    // if (cachedImage) return cachedImage
    
    try {
      const response = await fetch(urlString)
      
      if (!response.ok) {
        throw new Error('图片加载失败')
      }
      
      const blob = await response.blob()
      const imageUrl = window.URL.createObjectURL(blob)
      
      // 缓存图片（如果有缓存服务的话）
      // CacheService.cacheImage(imageUrl, urlString)
      
      return imageUrl
      
    } catch (error) {
      throw new Error(`图片加载失败: ${error.message}`)
    }
  }
  
  // MARK: - PDF相关服务
  
  /**
   * 下载PDF并缓存 - 对应 Swift downloadPDFWithCache
   * @param {Object} material 文档对象
   * @returns {Promise<{blob: Blob, url: string}>} PDF数据和URL
   */
  async downloadPDFWithCache(material) {
    const cacheKey = material.id
    
    // 检查缓存（如果有缓存服务的话）
    // const cachedPDF = CacheService.getCachedPDF(cacheKey)
    // if (cachedPDF) return cachedPDF
    
    // 验证URL
    if (!material.fileUrl) {
      throw new Error('文档链接无效')
    }
    
    try {
      // 直接下载
      const response = await fetch(material.fileUrl)
      
      if (!response.ok) {
        throw new Error(`PDF下载失败: ${response.status}`)
      }
      
      const blob = await response.blob()
      
      // 验证是否为PDF格式
      if (!blob.type.includes('pdf')) {
        throw new Error('PDF 格式错误')
      }
      
      const url = window.URL.createObjectURL(blob)
      
      const result = { blob, url }
      
      // 缓存PDF（如果有缓存服务的话）
      // CacheService.cachePDF(result, cacheKey)
      
      return result
      
    } catch (error) {
      throw new Error(`PDF处理失败: ${error.message}`)
    }
  }
}

// 创建单例实例 - 对应 Swift static let shared
export const docService = new DocService()

export default docService
