import Config from './config.js'
import { getStoredUserInfo, getAuthToken, getCurrentUserId } from './AuthService.js'

/**
 * MineService - 对应 iOS Eduninja IOS/Eduninja/Services/MineService.swift
 * 处理用户私有内容、收藏、个人信息等
 */
class MineService {
  constructor() {
    this.baseURL = Config.APIURL
  }

  /**
   * 获取当前用户ID
   */
  getCurrentUserId() {
    return getCurrentUserId()
  }

  /**
   * 获取当前用户ID (Int)
   */
  getCurrentUserIdAsInt() {
    const id = this.getCurrentUserId()
    return parseInt(id) || 0
  }

  /**
   * 获取当前用户名
   */
  getCurrentUserName() {
    const userInfo = getStoredUserInfo()
    return userInfo ? (userInfo.accountName || userInfo.title || '用户') : '用户'
  }

  /**
   * 统一请求方法
   * @param {string} endpoint 
   * @param {string} method 
   * @param {Object} data 
   * @returns 
   */
  async makeRequest(endpoint, method = 'POST', data = {}) {
    let url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Content-Type': 'application/json'
    }

    const token = getAuthToken()
    if (token) {
      // Web端保持使用 Bearer 前缀
      headers['Authorization'] = `Bearer ${token}`
    }

    let requestData = { ...data }
    
    // 自动添加 accountId
    if (!requestData.accountId && !requestData.userId && !requestData.materialId) {
      const userId = this.getCurrentUserIdAsInt()
      if (userId) {
        requestData.accountId = userId
      }
    }

    // 缓存控制
    if (requestData._t) {
       // Web fetch cache busting usually handled via query param or header
    }

    const fetchOptions = {
      method,
      headers
    }

    if (method.toUpperCase() === 'GET') {
      const queryParams = new URLSearchParams()
      Object.keys(requestData).forEach(key => {
        queryParams.append(key, requestData[key])
      })
      if (queryParams.toString()) {
        url = `${url}?${queryParams.toString()}`
      }
    } else {
      fetchOptions.body = JSON.stringify(requestData)
    }

    try {
      const response = await fetch(url, fetchOptions)

      if (!response.ok) {
        let errorMsg = `Network request failed (Status: ${response.status})`
        switch (response.status) {
            case 401: errorMsg = "Login expired, please login again"; break;
            case 403: errorMsg = "Access denied"; break;
            case 404: errorMsg = "Resource not found"; break;
            case 500: errorMsg = "Server internal error"; break;
        }
        throw new Error(errorMsg)
      }

      const responseData = await response.json()

      // 处理 CommonResponse
      if (responseData.successful === false) {
        throw new Error(responseData.message || 'Request failed')
      }

      // 这里的 behavior 应该和 iOS makeRequestWithCommonResponse 一致
      // 返回 responseData.data
      // 注意：有些接口可能返回 null data 是合法的（如 void 返回），需要根据具体情况处理
      // iOS: guard response.successful, let responseData = response.data else throw...
      
      if (responseData.data === undefined || responseData.data === null) {
          // 如果 data 为 null，但 successful 为 true，返回 null 或空对象？
          // iOS 这里会抛错 "无效的响应数据" (in makeRequestWithCommonResponse)
          // 但某些 boolean 返回值接口可能 data 就是 true/false
          return responseData.data
      }

      return responseData.data

    } catch (error) {
      console.error(`[MineService] Request failed: ${endpoint}`, error)
      throw error
    }
  }

  // MARK: - Public APIs

  /**
   * 获取用户的私有内容列表（包括收藏和上传的内容）
   * @param {number} contentType 内容类型
   * @param {string} subject 学科
   * @param {string} clazz 课程体系
   * @param {string} exam 考试局
   * @param {number} pageIndex 页码
   * @param {number} pageSize 每页数量
   * @param {number|null} timestamp 时间戳
   */
  async getCollectedContentList(contentType, subject = "", clazz = "", exam = "", pageIndex = 1, pageSize = 20, timestamp = null) {
    const requestData = {
      accountId: this.getCurrentUserIdAsInt(),
      contentType: contentType,
      subject: subject,
      clazz: clazz,
      pageIndex: pageIndex,
      pageSize: pageSize
    }

    if (exam) {
      requestData.exam = exam
    }

    if (timestamp) {
      requestData._t = timestamp
    }

    return await this.makeRequest('/api/wx/mine/list-item-by-subject-type', 'POST', requestData)
  }

  /**
   * 通用收藏列表获取方法
   */
  async getCollectedList(endpoint, pageIndex = 1, pageSize = 20, keyword = null) {
    const requestData = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      userId: this.getCurrentUserIdAsInt()
    }

    if (keyword) {
      requestData.keyword = keyword
    }

    try {
      return await this.makeRequest(endpoint, 'POST', requestData)
    } catch (error) {
      // 容错处理
      return { total: 0, pages: 0, current: pageIndex, size: pageSize, list: [] }
    }
  }

  /**
   * 获取用户收藏的文档列表
   */
  async getCollectedDocuments(pageIndex = 1, pageSize = 20, keyword = null) {
    return await this.getCollectedList('/api/wx/mine/collect-material-list', pageIndex, pageSize, keyword)
  }

  /**
   * 获取用户收藏的试卷列表
   */
  async getCollectedPastPapers(pageIndex = 1, pageSize = 20, keyword = null) {
    return await this.getCollectedList('/api/wx/mine/collect-paper-list', pageIndex, pageSize, keyword)
  }

  /**
   * 获取用户收藏的题目列表
   */
  async getCollectedQuestions(pageIndex = 1, pageSize = 20, keyword = null) {
    return await this.getCollectedList('/api/wx/mine/collect-question-list', pageIndex, pageSize, keyword)
  }

  /**
   * 获取用户收藏的闪卡列表
   */
  async getCollectedFlashcards(pageIndex = 1, pageSize = 20, keyword = null) {
    return await this.getCollectedList('/api/wx/mine/collect-flashcard-list', pageIndex, pageSize, keyword)
  }

  /**
   * 获取收藏学科列表
   * @param {number} userId 
   */
  async getCollectSubjectList(userId) {
    const id = userId || this.getCurrentUserIdAsInt()
    return await this.makeRequest('/api/wx/mine/list-collect-subject', 'POST', { id })
  }

  /**
   * 获取当前用户收藏学科列表
   */
  async getCurrentUserCollectSubjectList() {
    return await this.getCollectSubjectList(this.getCurrentUserIdAsInt())
  }

  /**
   * 获取学科内容类型列表
   */
  async getContentTypesBySubject(clazz, exam = null, subject) {
    const requestData = {
      accountId: this.getCurrentUserIdAsInt(),
      clazz: clazz,
      subject: subject
    }
    
    if (exam) {
      requestData.exam = exam
    }

    return await this.makeRequest('/api/wx/mine/list-type-by-subject', 'POST', requestData)
  }

  /**
   * 获取用户详细信息
   */
  async getUserProfile(userId = null) {
    const id = userId || this.getCurrentUserIdAsInt()
    return await this.makeRequest('/api/wx/mine/info-detail', 'POST', { id })
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(data) {
    // data 包含 role, school, subscribeClazz 等
    const requestData = {
      accountId: this.getCurrentUserIdAsInt(),
      ...data
    }
    
    // 确保 subscribeLevelList 是数组
    if (!requestData.subscribeLevelList) {
        requestData.subscribeLevelList = []
    }

    const response = await this.makeRequest('/api/wx/mine/info-update', 'POST', requestData)
    // iOS 返回 successful boolean (implicitly via makeRequestWithCommonResponse check) or string? 
    // iOS: returns response.successful which is boolean. 
    // makeRequest here returns data. If data is null/string, we assume success if no error thrown.
    return true
  }

  /**
   * 获取头像列表
   */
  async getAvatarList(pageIndex = 1, pageSize = 20, sex) {
    const requestData = {
      pageIndex,
      pageSize,
      sex
    }
    return await this.makeRequest('/api/wx/mine/avatar-list', 'POST', requestData)
  }
}

export default new MineService()

