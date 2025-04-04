import { defineStore } from 'pinia'
import { getDashboardData, getUserData, getProductData, getSalesData } from '@/api/dashboard'
import type { DashboardData, UserData, ProductData, SalesData } from '@/api/dashboard'

interface DashboardState {
  loading: boolean
  userData: UserData[]
  productData: ProductData[]
  salesData: SalesData[]
  dashboardData: DashboardData | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    loading: false,
    userData: [],
    productData: [],
    salesData: [],
    dashboardData: null
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true
      try {
        const data = await getDashboardData()
        this.dashboardData = data
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchUserData() {
      this.loading = true
      try {
        const data = await getUserData()
        this.userData = data
      } catch (error) {
        console.error('获取用户数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProductData() {
      this.loading = true
      try {
        const data = await getProductData()
        this.productData = data
      } catch (error) {
        console.error('获取商品数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSalesData() {
      this.loading = true
      try {
        const data = await getSalesData()
        this.salesData = data
      } catch (error) {
        console.error('获取销售数据失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}) 