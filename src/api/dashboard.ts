import request from '@/utils/request'
import type { AxiosResponse } from 'axios'

export interface DashboardData {
  userCount: number
  productCount: number
  todaySales: number
  userConversion: {
    visit: number
    register: number
    order: number
    payment: number
  }
  productHeatmap: {
    data: [number, number, number][]
    xAxis: string[]
    yAxis: string[]
  }
}

export interface UserData {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface ProductData {
  id: number
  name: string
  price: number
  stock: number
  createdAt: string
}

export interface SalesData {
  id: number
  productId: number
  amount: number
  price: number
  createdAt: string
}

export const getDashboardData = () => {
  return request.get<DashboardData>('/dashboard').then(res => res.data)
}

export const getUserData = () => {
  return request.get<UserData[]>('/users').then(res => res.data)
}

export const getProductData = () => {
  return request.get<ProductData[]>('/products').then(res => res.data)
}

export const getSalesData = () => {
  return request.get<SalesData[]>('/sales').then(res => res.data)
} 