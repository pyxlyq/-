import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/user-analysis',
      name: 'UserAnalysis',
      component: () => import('@/views/UserAnalysis.vue')
    },
    {
      path: '/product-analysis',
      name: 'ProductAnalysis',
      component: () => import('@/views/ProductAnalysis.vue')
    },
    {
      path: '/sales-trend',
      name: 'SalesTrend',
      component: () => import('@/views/SalesTrend.vue')
    }
  ]
})

export default router 