import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由守卫
export const beforeEach = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // 设置页面标题
  document.title = `${to.meta.title || '电商数据可视化分析平台'}`

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.warning('请先登录')
      next('/login')
      return
    }
  }

  next()
}

// 路由错误处理
export const onError = (error: Error) => {
  console.error('路由错误:', error)
  ElMessage.error('页面加载失败，请刷新重试')
} 