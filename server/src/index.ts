import express, { Request, Response, NextFunction, Application } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

// 扩展 Express 的 Request 类型
interface CustomRequest extends Request {
  user?: {
    username: string
    role: string
  }
}

const app: Application = express()
const port = 3000

// JWT 密钥
const JWT_SECRET = 'your-secret-key'

// 初始化用户数据
const users = [
  {
    username: 'admin',
    password: '123456',
    role: 'admin'
  }
]

// 启用 CORS
app.use(cors())

// 添加请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  // 不记录认证头部的具体内容
  const headers = { ...req.headers }
  if (headers.authorization) {
    headers.authorization = 'Bearer [REDACTED]'
  }

  console.log(`${req.method} ${req.url}`, {
    headers,
    body: req.body,
    query: req.query
  })
  next()
})

// 解析 JSON 请求体
app.use(express.json())

// 认证中间件
const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  console.log('收到请求头:', authHeader)

  // 清理 token 中的特殊字符
  const token = authHeader && authHeader.split(' ')[1]?.replace(/[<>]/g, '')
  console.log('清理后的 token:', token)

  if (!token) {
    console.log('未提供 token')
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌'
    })
  }

  try {
    console.log('开始验证 token...')
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string }
    console.log('Token 解码成功:', decoded)

    // 验证用户是否存在于用户列表中
    const user = users.find(u => u.username === decoded.username)
    if (!user) {
      console.log('用户不存在:', decoded.username)
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      })
    }

    console.log('用户验证成功:', user)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Token 验证失败:', error)
    return res.status(403).json({
      code: 403,
      message: '无效的认证令牌'
    })
  }
}

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
      [4, 0, 1], [4, 1, 0], [4, 2, 0], [4, 3, 0], [4, 4, 0]
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五'],
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
  trend: {
    '7d': {
      dates: ['2024-04-01', '2024-04-02', '2024-04-03', '2024-04-04', '2024-04-05', '2024-04-06', '2024-04-07'],
      newUsers: [120, 132, 101, 134, 90, 230, 210],
      activeUsers: [450, 480, 420, 490, 380, 520, 500],
      paidUsers: [200, 220, 180, 240, 160, 280, 260]
    },
    '30d': {
      dates: Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return date.toISOString().split('T')[0]
      }),
      newUsers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
      activeUsers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500) + 200),
      paidUsers: Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 100)
    },
    '12m': {
      dates: Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (11 - i))
        return date.toISOString().split('T')[0]
      }),
      newUsers: Array.from({ length: 12 }, () => Math.floor(Math.random() * 3000) + 1000),
      activeUsers: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15000) + 5000),
      paidUsers: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5000) + 2000)
    }
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
  todaySales: 126800,    // 今日销售额
  monthSales: 3680000,   // 本月销售额
  orderCount: 1250,      // 订单数量
  averageOrder: 320,     // 平均订单金额
  growthRate: 12.5       // 增长率
}

// API 路由
// 获取仪表盘数据
app.get('/api/dashboard', (req: Request, res: Response): void => {
  res.json(mockData)
})

// 获取仪表盘统计数据
app.get('/api/dashboard/stats', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json({
    userCount: mockData.userCount,
    productCount: mockData.productCount,
    totalUsers: mockData.userCount,
    totalProducts: mockData.productCount,
    todaySales: mockData.todaySales,
    orderCount: 1250,
    averageOrder: 320,
    conversionRate: 3.2,
    userConversion: mockData.userConversion,
    productHeatmap: mockData.productHeatmap
  })
})

// 获取用户分析数据
app.get('/api/user-analysis', authenticateToken, (req: CustomRequest, res: Response) => {
  res.json(userAnalysisData)
})

// 获取用户分析统计数据
app.get('/api/user-analysis/stats', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json({
    code: 200,
    data: {
      totalUsers: userAnalysisData.stats.total,
      activeUsers: userAnalysisData.stats.activeUsers,
      newUsers: userAnalysisData.stats.newUsers,
      paidUsers: userAnalysisData.stats.paidUsers,
      userGrowth: userAnalysisData.stats.growthRate
    }
  })
})

// 获取用户增长趋势数据
app.get('/api/user-growth', authenticateToken, (req: CustomRequest, res: Response) => {
  const { timeRange = '7days' } = req.query
  res.json(userAnalysisData.growth[timeRange as keyof typeof userAnalysisData.growth])
})

// 获取用户地域分布数据
app.get('/api/user-region', authenticateToken, (req: CustomRequest, res: Response) => {
  res.json(userAnalysisData.region)
})

// 获取用户行为分析数据
app.get('/api/user-behavior', authenticateToken, (req: CustomRequest, res: Response) => {
  res.json(userAnalysisData.behavior)
})

// 获取用户统计数据
app.get('/api/user-stats', authenticateToken, (req: CustomRequest, res: Response) => {
  res.json(userAnalysisData.stats)
})

// 获取用户数据
app.get('/api/users', (req: Request, res: Response) => {
  res.json([])
})

// 获取商品数据
app.get('/api/products', (req: Request, res: Response) => {
  res.json([])
})

// 获取销售数据
app.get('/api/sales', (req: Request, res: Response) => {
  res.json([])
})

// 获取销售趋势数据
app.get('/api/sales-trend', authenticateToken, (req: CustomRequest, res: Response) => {
  const timeRange = req.query.timeRange as string || '7days'
  res.json(salesTrendData[timeRange as keyof typeof salesTrendData] || salesTrendData['7days'])
})

// 获取销售统计数据
app.get('/api/sales-trend/stats', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json({
    code: 200,
    data: {
      todaySales: salesStats.todaySales,
      monthSales: salesStats.monthSales,
      orderCount: salesStats.orderCount,
      averageOrder: salesStats.averageOrder,
      growthRate: salesStats.growthRate
    }
  })
})

// 登录接口
app.post('/api/login', (req: Request, res: Response) => {
  console.log('收到登录请求:', req.body)
  const { username, password } = req.body

  // 查找用户
  const user = users.find(u => u.username === username && u.password === password)

  if (user) {
    // 生成 JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log('登录成功，生成的 token:', token)

    res.json({
      code: 200,
      data: {
        token,
        username: user.username,
        role: user.role
      },
      message: '登录成功'
    })
  } else {
    console.log('登录失败: 用户名或密码错误')
    res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    })
  }
})

// 注册接口
app.post('/api/register', (req: Request, res: Response): void => {
  try {
    console.log('收到注册请求:', req.body)

    // 检查请求体格式
    if (!req.body || typeof req.body !== 'object') {
      console.error('无效的请求体:', req.body)
      res.status(400).json({
        code: 400,
        message: '无效的请求格式'
      })
      return
    }

    const { username, password } = req.body

    // 参数验证
    if (!username || !password) {
      console.error('缺少必要参数:', { username, password })
      res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      })
      return
    }

    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
      console.error('用户名已存在:', username)
      res.status(400).json({
        code: 400,
        message: '用户名已存在'
      })
      return
    }

    // 添加新用户
    const newUser = {
      username,
      password,
      role: 'user'
    }
    users.push(newUser)
    console.log('用户注册成功:', newUser)

    res.json({
      code: 200,
      message: '注册成功'
    })
  } catch (error) {
    console.error('注册失败:', error)
    if (error instanceof Error) {
      console.error('错误详情:', error.message)
      console.error('错误堆栈:', error.stack)
    }
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
})

// 获取用户转化漏斗数据
app.get('/api/dashboard/funnel', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json({
    code: 200,
    data: {
      visits: mockData.userConversion.visit,
      registrations: mockData.userConversion.register,
      orders: mockData.userConversion.order,
      payments: mockData.userConversion.payment
    }
  })
})

// 获取商品热度分布数据
app.get('/api/dashboard/heatmap', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json({
    code: 200,
    data: mockData.productHeatmap
  })
})

// 商品分析相关模拟数据
const productAnalysisData = {
  stats: {
    total: 5,                // 总商品数（根据排名数据中的商品数量）
    totalSales: 31988,       // 总销量（所有商品销售量的总和：9656+7996+7082+5241+2013）
    averageRating: 4.7,      // 平均评分保持不变
    lowStock: 1,             // 低库存商品数（假设销量低于3000的商品为低库存）
    outOfStock: 0            // 缺货商品数（暂时没有缺货商品）
  },
  ranking: {
    sales: [
      { id: '1', name: '男士休闲西装', value: 9656, category: '服装' },
      { id: '2', name: '女士连衣裙', value: 7996, category: '服装' },
      { id: '3', name: 'AirPods Pro', value: 7082, category: '电子产品' },
      { id: '4', name: 'iPhone 15 Pro', value: 5241, category: '电子产品' },
      { id: '5', name: 'MacBook Pro', value: 2013, category: '电子产品' }
    ],
    favorite: [
      { id: '1', name: 'iPhone 15 Pro', value: 10000, category: '电子产品' },
      { id: '2', name: '女士连衣裙', value: 7523, category: '服装' },
      { id: '3', name: '男士休闲西装', value: 5862, category: '服装' },
      { id: '4', name: 'AirPods Pro', value: 3521, category: '电子产品' },
      { id: '5', name: 'MacBook Pro', value: 2871, category: '电子产品' }
    ],
    rating: [
      { id: '1', name: 'iPhone 15 Pro', value: 4.9, category: '电子产品' },
      { id: '2', name: '女士连衣裙', value: 4.8, category: '服装' },
      { id: '3', name: '男士休闲西装', value: 4.7, category: '服装' },
      { id: '4', name: 'AirPods Pro', value: 4.6, category: '电子产品' },
      { id: '5', name: 'MacBook Pro', value: 4.5, category: '电子产品' }
    ]
  },
  category: [
    { value: 200, name: '电子产品' },
    { value: 150, name: '服装' },
    { value: 100, name: '食品' },
    { value: 50, name: '家居' }
  ],
  inventory: [
    { value: 300, name: '充足' },
    { value: 50, name: '低库存' },
    { value: 10, name: '缺货' }
  ],
  price: [
    { value: 100, name: '0-100元' },
    { value: 200, name: '100-500元' },
    { value: 150, name: '500-1000元' },
    { value: 50, name: '1000元以上' }
  ]
}

// 获取商品统计数据
app.get('/api/product-analysis/stats', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json({
    code: 200,
    data: {
      totalProducts: productAnalysisData.stats.total,
      totalSales: productAnalysisData.stats.totalSales,
      averageRating: productAnalysisData.stats.averageRating,
      lowStock: productAnalysisData.stats.lowStock,
      outOfStock: productAnalysisData.stats.outOfStock
    }
  })
})

// 获取商品销售排名
app.get('/api/product-analysis/ranking', authenticateToken, (req: CustomRequest, res: Response): void => {
  const { type = 'sales' } = req.query
  const rankingData = productAnalysisData.ranking[type as keyof typeof productAnalysisData.ranking]

  res.json({
    code: 200,
    data: {
      products: rankingData
    }
  })
})

// 获取商品分类分布
app.get('/api/product-analysis/category', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json(productAnalysisData.category)
})

// 获取库存状态分析
app.get('/api/product-analysis/inventory', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json(productAnalysisData.inventory)
})

// 获取商品价格分布
app.get('/api/product-analysis/price', authenticateToken, (req: CustomRequest, res: Response): void => {
  res.json(productAnalysisData.price)
})

// 获取用户增长趋势数据
app.get('/api/user-analysis/trend', authenticateToken, (req: CustomRequest, res: Response): void => {
  const { timeRange = '7d' } = req.query
  const trendData = userAnalysisData.trend[timeRange as keyof typeof userAnalysisData.trend] || userAnalysisData.trend['7d']

  res.json({
    code: 200,
    data: trendData
  })
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
}) 