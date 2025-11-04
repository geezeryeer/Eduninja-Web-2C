import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

// 导入样式
import './styles/main.css'

// 导入服务
import { filterService } from './services'

// 导入页面组件
import LandingPage from './views/Landing/LandingPage.vue'
import MainLayout from './layouts/MainLayout.vue'
import LibraryLayout from './layouts/LibraryLayout.vue'

// 路由配置
const routes = [
  // 首页布局 - 未登录用户看到的页面
  {
    path: '/',
    component: MainLayout,
    children: [
          {
            path: '',
            name: 'Home',
            component: LandingPage,
            meta: {
              title: 'EduNinja - Your Your Second Brain',
              requiresAuth: false
            }
          },
          {
            path: 'pricing',
            name: 'Pricing',
            component: () => import('./views/Mainpage/Pricing.vue'),
            meta: {
              title: 'Pricing',
              requiresAuth: false
            }
          }
    ]
  },
  
  // 应用布局 - 登录后的功能页面（带侧边栏）
  {
    path: '/library',
    component: LibraryLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Library',
        component: () => import('./views/Library/LibraryPage.vue'),
        meta: {
          title: 'Library',
          requiresAuth: true
        }
      },
      {
        path: 'library',
        name: 'LibraryPage',
        component: () => import('./views/Library/LibraryPage.vue'),
        meta: {
          title: 'Library',
          requiresAuth: true
        }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('./views/Library/AIChatPanel.vue'),
        meta: {
          title: 'AI Assistant',
          requiresAuth: true
        }
      },
      {
        path: 'flashcards',
        name: 'Flashcards',
        component: () => import('./views/Library/Flashcards.vue'),
        meta: {
          title: 'Flashcards',
          requiresAuth: true
        }
      }
    ]
  },
  
  // 独立页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Mainpage/Login.vue'),
    meta: {
      title: 'Sign In'
    }
  },
  {
    path: '/upgrade',
    name: 'Upgrade',
    component: () => import('./views/Upgrade.vue'),
    meta: {
      title: 'Upgrade Pro'
    }
  },
  {
    path: '/terms-of-use',
    name: 'TermsOfUse',
    component: () => import('./views/Mainpage/TermsOfUse.vue'),
    meta: {
      title: 'Terms of Use'
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('./views/Mainpage/PrivacyPolicy.vue'),
    meta: {
      title: 'Privacy Policy'
    }
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: () => import('./views/Mainpage/ContactUs.vue'),
    meta: {
      title: 'Contact Us'
    }
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: () => import('./views/Mainpage/AboutUs.vue'),
    meta: {
      title: 'About Us'
    }
  },
  {
    path: '/copyright-claims',
    name: 'CopyrightClaims',
    component: () => import('./views/Mainpage/CopyrightClaims.vue'),
    meta: {
      title: 'Copyright Claims & Takedown Requests'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - EduNinja`
  } else {
    document.title = 'EduNinja - AI学习助手'
  }
  
  // 如果进入应用页面，检查是否需要加载筛选数据
  if (to.path.startsWith('/library')) {
    const curriculum = to.query.curriculum
    const subject = to.query.subject
    
    // 如果URL中有课程和学科参数，加载对应的筛选数据
    if (curriculum && subject) {
      try {
        // 将curriculum和subject转换为对应的ID（这里需要根据实际情况映射）
        // 暂时使用query参数作为ID
        const filterData = await filterService.getFormattedFilterData({
          clazzId: curriculum,
          subjectId: subject
        })
        
        if (filterData.success) {
          // 将筛选数据存储到sessionStorage供应用使用
          sessionStorage.setItem('filterData', JSON.stringify(filterData))
          sessionStorage.setItem('currentCurriculum', curriculum)
          sessionStorage.setItem('currentSubject', subject)
          
          console.log('✅ 筛选数据已加载:', filterData)
        } else {
          console.warn('⚠️ 加载筛选数据失败:', filterData.message)
        }
      } catch (error) {
        console.error('❌ 加载筛选数据出错:', error)
      }
    }
  }
  
  // 认证检查（暂时跳过）
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  next()
})

// 创建状态管理
const pinia = createPinia()

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia)

// 全局属性
app.config.globalProperties.$router = router

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
  // 这里可以添加错误上报逻辑
}

// 挂载应用
app.mount('#app')

// 开发环境下的调试信息
if (import.meta.env.DEV) {
  console.log('🚀 EduNinja Web 应用已启动')
  console.log('📍 当前路由:', router.currentRoute.value.path)
  console.log('🎨 当前主题:', document.documentElement.classList.contains('dark') ? '暗色' : '亮色')
}

// PWA 支持
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
