import Config from './config.js'

/**
 * 学科相关服务
 */
class SubjectService {
  constructor() {
    this.baseURL = Config.APIURL
  }

  /**
   * 获取收藏学科列表
   * @param {Object} params - 请求参数
   * @param {number} params.id - 用户ID
   * @returns {Promise} API响应
   */
  async getCollectSubjectList(params = {}) {
    try {
      // 写死用户ID为123
      const userId = 123
      console.log('📤 Calling getCollectSubjectList for user:', userId)
      
      const response = await fetch(`${this.baseURL}/api/wx/mine/list-collect-subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          id: userId
        })
      })
      
      const result = await response.json()
      console.log('📥 getCollectSubjectList response for user 123:', result)
      return result
    } catch (error) {
      console.error('❌ getCollectSubjectList error:', error)
      throw error
    }
  }
}

export default new SubjectService()
