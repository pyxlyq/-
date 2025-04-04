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

// API 路由
app.get('/api/dashboard', (req, res) => {
  res.json(mockData)
})

app.get('/api/users', (req, res) => {
  res.json([])
})

app.get('/api/products', (req, res) => {
  res.json([])
})

app.get('/api/sales', (req, res) => {
  res.json([])
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
}) 