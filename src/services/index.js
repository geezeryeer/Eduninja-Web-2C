/**
 * 简化的服务层导出文件
 */

// 配置
export { default as Config } from './config.js'

// 导入服务类和实例
import DocServiceClass, { docService, ActivityType } from './DocService.js'
import PastPaperServiceClass, { pastPaperService } from './PastPaperService.js'
import QuestionServiceClass, { questionService } from './QuestionService.js'
import { default as subjectService } from './SubjectService.js'
import { default as filterService } from './FilterService.js'

// 导出服务类
export { DocServiceClass as DocService, PastPaperServiceClass as PastPaperService, QuestionServiceClass as QuestionService }
export { docService, pastPaperService, questionService, subjectService, filterService, ActivityType }

// 便捷导出所有服务实例
export const services = {
  doc: docService,
  pastPaper: pastPaperService,
  question: questionService,
  subject: subjectService,
  filter: filterService
}

// 默认导出服务集合
export default services
