import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

// 启用 CORS
app.use(cors())
// 解析 JSON 请求体
app.use(express.json())

// 模拟数据
const mockData = {
  userCount: 1000,
  productCount: 500,
  todaySales: 50000,
  userConversion: {
    visit: 100,
    register: 80,
    order: 60,
    payment: 40
  },
  productHeatmap: {
    data: [
      [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0],
      [1, 0, 0], [1, 1, 0], [1, 2, 0], [1, 3, 1], [1, 4, 0],
      [2, 0, 0], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0],
      [3, 0, 0], [3, 1, 0], [3, 2, 0], [3, 3, 0], [3, 4, 1],
      [4, 0, 1], [4, 1, 0], [4, 2, 0], [4, 3, 0], [4, 4, 0],
      [5, 0, 0], [5, 1, 0], [5, 2, 1], [5, 3, 0], [5, 4, 0],
      [6, 0, 0], [6, 1, 0], [6, 2, 0], [6, 3, 1], [6, 4, 0]
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    yAxis: ['商品A', '商品B', '商品C', '商品D', '商品E']
  }
}

// 用户分析相关模拟数据
const userAnalysisData = {
  stats: {
    total: 100000,
    dailyIncrease: 150,
    growthRate: 2.5,
    activeUsers: 45000,
    activeRate: 45,
    newUsers: 1200,
    conversionRate: 3.2,
    paidUsers: 20000,
    paymentRate: 20
  },
  growth: {
    '7days': [
      { date: '2024-04-01', newUsers: 120, activeUsers: 450 },
      { date: '2024-04-02', newUsers: 132, activeUsers: 480 },
      { date: '2024-04-03', newUsers: 101, activeUsers: 420 },
      { date: '2024-04-04', newUsers: 134, activeUsers: 490 },
      { date: '2024-04-05', newUsers: 90, activeUsers: 380 },
      { date: '2024-04-06', newUsers: 230, activeUsers: 520 },
      { date: '2024-04-07', newUsers: 210, activeUsers: 500 }
    ],
    '30days': Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      newUsers: Math.floor(Math.random() * 100) + 50,
      activeUsers: Math.floor(Math.random() * 500) + 200
    })),
    '12months': Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      newUsers: Math.floor(Math.random() * 3000) + 1000,
      activeUsers: Math.floor(Math.random() * 15000) + 5000
    }))
  },
  region: [
    { value: 8000, name: '北京' },
    { value: 7000, name: '上海' },
    { value: 6000, name: '广州' },
    { value: 5500, name: '深圳' },
    { value: 4500, name: '杭州' },
    { value: 4000, name: '成都' }
  ],
  behavior: [
    { value: 40, name: '浏览商品' },
    { value: 25, name: '加入购物车' },
    { value: 20, name: '提交订单' },
    { value: 15, name: '完成支付' }
  ]
}

// 销售趋势数据
const salesTrendData = {
  // 近7天数据
  '7days': Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString(),
      sales: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 1000) + 500,
      customers: Math.floor(Math.random() * 500) + 200
    }
  }),
  // 近30天数据
  '30days': Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toLocaleDateString(),
      sales: Math.floor(Math.random() * 10000) + 5000,
      orders: Math.floor(Math.random() * 1000) + 500,
      customers: Math.floor(Math.random() * 500) + 200
    }
  }),
  // 近12个月数据
  '12months': Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    return {
      date: date.toLocaleDateString(),
      sales: Math.floor(Math.random() * 100000) + 50000,
      orders: Math.floor(Math.random() * 10000) + 5000,
      customers: Math.floor(Math.random() * 5000) + 2000
    }
  })
}

// 销售统计数据
const salesStats = {
  todaySales: 126800,
  todayGrowth: 12.5,
  monthSales: 368,
  monthTargetRate: 85,
  orderCount: 1250,
  conversionRate: 3.2,
  averageOrder: 320,
  avgOrderGrowth: 5.8
}

// API 路由
// 获取仪表盘数据
app.get('/api/dashboard', (req, res) => {
  res.json(mockData)
})

// 获取用户分析数据
app.get('/api/user-analysis', (req, res) => {
  res.json(userAnalysisData)
})

// 获取用户增长趋势数据
app.get('/api/user-growth', (req, res) => {
  const { timeRange = '7days' } = req.query
  res.json(userAnalysisData.growth[timeRange as keyof typeof userAnalysisData.growth])
})

// 获取用户地域分布数据
app.get('/api/user-region', (req, res) => {
  res.json(userAnalysisData.region)
})

// 获取用户行为分析数据
app.get('/api/user-behavior', (req, res) => {
  res.json(userAnalysisData.behavior)
})

// 获取用户统计数据
app.get('/api/user-stats', (req, res) => {
  res.json(userAnalysisData.stats)
})

// 获取用户数据
app.get('/api/users', (req, res) => {
  res.json([])
})
// 获取商品数据
app.get('/api/products', (req, res) => {
  res.json([])
})
// 获取销售数据
app.get('/api/sales', (req, res) => {
  res.json([])
})

// 获取销售趋势数据
app.get('/api/sales-trend', (req, res) => {
  const timeRange = req.query.timeRange as string || '7days'
  res.json(salesTrendData[timeRange as keyof typeof salesTrendData] || salesTrendData['7days'])
})

// 获取销售统计数据
app.get('/api/sales-stats', (req, res) => {
  res.json(salesStats)
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
}) 