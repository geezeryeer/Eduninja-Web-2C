import { Config } from './config.js'

/**
 * 生成UUID用于state参数
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 获取第三方授权URL
 * @param {string} source - 第三方平台来源：wechatOpen、google、APPLE
 * @param {string} state - 状态参数，可选
 * @returns {Promise<string>} 授权URL
 */
export const getAuthRedirectUrl = async (source, state = null) => {
  try {
    const stateParam = state || generateUUID()
    const response = await fetch(
      `${Config.APIURL}/api/web/auth/redirect/${source}?state=${stateParam}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 检查API响应是否成功
    if (data.code !== "200" && data.code !== 200) {
      throw new Error(data.message || data.msg || '获取授权URL失败')
    }

    if (!data.successful) {
      throw new Error(data.message || '获取授权URL失败')
    }

    return data.data
  } catch (error) {
    console.error('获取授权URL失败:', error)
    throw error
  }
}

/**
 * 跳转到第三方授权页面
 * @param {string} source - 第三方平台来源
 * @param {string} state - 状态参数，可选
 */
export const redirectToAuth = async (source, state = null) => {
  try {
    const authUrl = await getAuthRedirectUrl(source, state)
    window.location.href = authUrl
  } catch (error) {
    console.error('跳转授权页面失败:', error)
    throw error
  }
}

/**
 * 保存认证token到localStorage
 * @param {string} token - JWT token
 * @param {number} expire - 过期时间（秒）
 */
export const saveAuthToken = (token, expire = 43200) => {
  localStorage.setItem('token', token)
  localStorage.setItem('token_expire', (Date.now() + expire * 1000).toString())
}

/**
 * 检查token是否有效
 * @returns {boolean} token是否有效
 */
export const isTokenValid = () => {
  const token = localStorage.getItem('token')
  const expireTime = localStorage.getItem('token_expire')
  
  if (!token || !expireTime) {
    return false
  }
  
  return Date.now() < parseInt(expireTime)
}

/**
 * 清除认证信息
 */
export const clearAuthToken = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('token_expire')
}

/**
 * 获取当前token
 * @returns {string|null} 当前token
 */
export const getAuthToken = () => {
  if (isTokenValid()) {
    return localStorage.getItem('token')
  }
  return null
}

/**
 * 获取用户信息详情
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async (userId) => {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('未找到有效的认证token')
    }

    const response = await fetch(`${Config.APIURL}/api/wx/mine/info-detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: userId })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // 检查API响应是否成功
    if (data.code !== "200" && data.code !== 200) {
      throw new Error(data.message || data.msg || '获取用户信息失败')
    }

    if (!data.successful) {
      throw new Error(data.message || '获取用户信息失败')
    }

    return data.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

/**
 * 保存用户信息到localStorage
 * @param {Object} userInfo - 用户信息对象
 */
export const saveUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

/**
 * 从localStorage获取用户信息
 * @returns {Object|null} 用户信息对象
 */
export const getStoredUserInfo = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
}

/**
 * 清除用户信息
 */
export const clearUserInfo = () => {
  localStorage.removeItem('userInfo')
}

/**
 * 获取当前用户ID (统一入口)
 * @returns {number|string} 用户ID
 */
export const getCurrentUserId = () => {
  const userInfo = getStoredUserInfo()
  // 如果有登录信息，返回真实ID
  if (userInfo && userInfo.id) {
    return userInfo.id
  }
  
  // 否则返回测试用的固定ID (统一在这里修改)
  return 726
}

/**
 * 退出登录，清除所有认证信息
 */
export const logout = () => {
  // 清除认证token
  clearAuthToken()
  // 清除用户信息
  clearUserInfo()
  // 清除userId（如果单独存储的话）
  localStorage.removeItem('userId')
}
