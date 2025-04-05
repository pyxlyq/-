import { createRouter, createWebHistory } from 'vue-router'
import { beforeEach, onError } from './guards'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: {
            title: '仪表盘',
            requiresAuth: true,
            icon: 'el-icon-data-line'
          }
        },
        {
          path: 'user-analysis',
          name: 'UserAnalysis',
          component: () => import('../views/UserAnalysis.vue'),
          meta: {
            title: '用户分析',
            requiresAuth: true,
            icon: 'el-icon-user'
          }
        },
        {
          path: 'product-analysis',
          name: 'ProductAnalysis',
          component: () => import('../views/ProductAnalysis.vue'),
          meta: {
            title: '商品分析',
            requiresAuth: true,
            icon: 'el-icon-goods'
          }
        },
        {
          path: 'sales-trend',
          name: 'SalesTrend',
          component: () => import('../views/SalesTrend.vue'),
          meta: {
            title: '销售趋势',
            requiresAuth: true,
            icon: 'el-icon-trend-charts'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: '404'
      }
    }
  ]
})

// 注册路由守卫
router.beforeEach(beforeEach)
router.onError(onError)

export default router 