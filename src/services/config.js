/**
 * API 配置文件 - 对应 Swift Config.swift
 */

export const Config = {
  // API 基础URL - 对应 Swift Config.APIURL "http://8.155.175.130:8080",
  APIURL: "http://8.155.175.130:8080",
  
  // 请求超时配置
  TIMEOUT: {
    DEFAULT: 15000,      // 默认15秒
    LONG: 60000,         // 长请求60秒
    STREAM: 120000       // 流式请求120秒
  },
  
  // 缓存配置
  CACHE: {
    MEMORY_SIZE: 20 * 1024 * 1024,  // 20MB 内存缓存
    DISK_SIZE: 100 * 1024 * 1024,   // 100MB 磁盘缓存
    TTL: 5 * 60 * 1000               // 5分钟过期时间
  }
}

export default Config
