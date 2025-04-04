import axios, { type AxiosResponse } from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/api', // 替换为实际的后端API地址
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default request 