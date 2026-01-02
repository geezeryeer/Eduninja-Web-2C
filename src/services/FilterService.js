import axios from 'axios'
import config from './config'

// Token获取函数 - 从localStorage获取真实token
const getSimpleToken = () => {
  return localStorage.getItem('token') || ''
}

/**
 * FilterService - 处理字典和筛选相关的API调用
 */
class FilterService {
  /**
   * 获取字典列表
   * @param {number} type - 字典类型 1-课程体系 2-考试局 3-学科 4-等级 8-Paper名称
   * @param {Object} options - 其他选项
   * @returns {Promise<Object>} 返回字典列表
   */
  async getDictList(type, options = {}) {
    try {
      const requestData = {
        keyword: options.keyword || "",
        pageIndex: options.pageIndex || 1,
        pageSize: options.pageSize || 100,
        status: 1, // 只获取启用状态的
        type: type
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getSimpleToken()}`
      }

      const response = await axios.post(
        `${config.APIURL}/api/wx/dict/list`,
        requestData,
        { headers }
      )

      if (response.data && response.data.successful) {
        return {
          success: true,
          data: response.data.data.list.map(item => ({
            id: item.id,
            name: item.name,
            descName: item.descName || item.name
          })),
          total: response.data.data.total
        }
      } else {
        return {
          success: false,
          data: [],
          message: response.data?.message || '获取字典列表失败'
        }
      }
    } catch (error) {
      console.error('获取字典列表失败:', error)
      return {
        success: false,
        data: [],
        message: error.message || '网络请求失败'
      }
    }
  }

  /**
   * 获取课程体系列表
   */
  async getClazzList() {
    return await this.getDictList(1)
  }

  /**
   * 获取考试局列表
   * @param {number} clazzId - 可选的课程体系ID，用于筛选
   */
  async getExamBoardList(clazzId = null) {
    if (clazzId) {
      return await this.getDictMappingList(clazzId, 2)
    }
    return await this.getDictList(2)
  }

  /**
   * 获取学科列表
   * @param {number} clazzId - 可选的课程体系ID，用于筛选
   */
  async getSubjectList(clazzId = null) {
    if (clazzId) {
      return await this.getDictMappingList(clazzId, 3)
    }
    return await this.getDictList(3)
  }

  /**
   * 获取字典关联列表 - 根据课程体系获取筛选后的考试局或学科
   * @param {number} dictId - 课程体系字典ID
   * @param {number} type - 类别 2-考试局 3-学科
   * @param {Object} options - 其他选项
   * @returns {Promise<Object>} 返回筛选后的字典列表
   */
  async getDictMappingList(dictId, type, options = {}) {
    try {
      const requestData = {
        dictId: parseInt(dictId),
        type: parseInt(type),
        keyword: options.keyword || "",
        pageIndex: options.pageIndex || 1,
        pageSize: options.pageSize || 100
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getSimpleToken()}`
      }

      const apiUrl = `${config.APIURL}/api/wx/dict-mapping/list`

      console.log('📤 调用dict-mapping API:', apiUrl, requestData)
      
      const response = await axios.post(
        apiUrl,
        requestData,
        { headers }
      )
      
      console.log('📥 dict-mapping API响应:', response.data)

      // 根据文档，检查 successful 字段
      if (response.data && response.data.successful && response.data.data && response.data.data.list) {
        const mappedData = response.data.data.list.map(item => ({
          id: item.dictId,
          code: item.dictName, // 使用dictName作为code
          name: item.dictName,
          // 保留额外的字段用于后续使用
          subjectLevelMappingList: item.subjectLevelMappingList || [],
          subjectPaperMappingList: item.subjectPaperMappingList || []
        }))
        
        console.log('✅ dict-mapping API成功返回:', mappedData.length, '条数据')
        
        return {
          success: true,
          data: mappedData,
          total: response.data.data.total
        }
      } else {
        console.warn('⚠️ dict-mapping API返回失败:', response.data?.message)
        return {
          success: false,
          data: [],
          message: response.data?.message || 'API返回失败'
        }
      }
    } catch (error) {
      console.error('❌ 获取字典关联列表失败:', error)
      return {
        success: false,
        data: [],
        message: error.message || '网络请求失败'
      }
    }
  }

  /**
   * 获取等级列表
   */
  async getLevelList() {
    return await this.getDictList(4)
  }

  /**
   * 获取Paper名称列表
   */
  async getPaperNameList() {
    return await this.getDictList(8)
  }

  /**
   * 获取所有筛选数据
   */
  async getAllFilterData() {
    const [clazz, subjects, levels, papers] = await Promise.all([
      this.getClazzList(),
      this.getSubjectList(),
      this.getLevelList(),
      this.getPaperNameList()
    ])

    return {
      clazz: clazz.success ? clazz.data : [],
      subjects: subjects.success ? subjects.data : [],
      levels: levels.success ? levels.data : [],
      papers: papers.success ? papers.data : []
    }
  }

  /**
   * 获取学科、等级和Paper类型的关联列表
   * 用于根据课程体系动态筛选学科
   * @param {Object} params - 查询参数
   * @param {number} params.clazzId - 体系id
   * @param {number} params.subjectId - 学科id (传0获取所有学科)
   * @returns {Promise<Object>} 返回subjectMappingList, levelMappingList和paperMappingList
   */
  async getSubjectLevelPaperMapping(params) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getSimpleToken()}`
      }

      const response = await axios.post(
        `${config.APIURL}/api/web/sys/subject-level-paper-mapping/list`,
        {
          clazzId: params.clazzId,
          subjectId: params.subjectId || 0
        },
        { headers }
      )

      if (response.data && response.data.successful) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        }
      } else {
        return {
          success: false,
          data: null,
          message: response.data?.message || '获取筛选数据失败'
        }
      }
    } catch (error) {
      console.error('获取学科等级Paper映射失败:', error)
      return {
        success: false,
        data: null,
        message: error.message || '网络请求失败'
      }
    }
  }
}

// 创建单例实例
const filterService = new FilterService()

export default filterService
