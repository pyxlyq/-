# 电商数据分析面板 (E-commerce Dashboard)

基于 Vue 3 + TypeScript + Vite 构建的现代化电商数据分析面板，提供销售趋势、用户分析、产品分析等多维度的数据可视化展示。

## 🚀 技术栈

- **前端框架：** Vue 3 + TypeScript
- **构建工具：** Vite
- **状态管理：** Pinia
- **路由管理：** Vue Router
- **UI 组件库：** Element Plus
- **数据可视化：** ECharts
- **HTTP 客户端：** Axios
- **日期处理：** Day.js

## ✨ 功能特性

- 📊 销售趋势分析

  - 销售额统计
  - 订单量趋势
  - 销售环比分析

- 👥 用户分析

  - 用户增长趋势
  - 用户行为分析
  - 用户地域分布

- 🛍️ 产品分析
  - 热销产品排行
  - 产品类别分析
  - 库存状态监控

## 🔧 安装部署

### 前端项目

```bash
# 克隆项目
git clone https://github.com/pyxlyq/-.git
cd ecommerce-dashboard

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 后端服务

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 启动服务
npm start
```

## 🌐 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 📦 项目结构

```
ecommerce-dashboard/
├── src/
│   ├── api/          # API 接口
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── stores/       # 状态管理
│   ├── utils/        # 工具函数
│   └── views/        # 页面视图
├── server/           # 后端服务
├── public/           # 公共资源
└── package.json      # 项目配置
```

## 🔐 环境变量配置

创建 `.env` 文件在项目根目录：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📝 开发指南

1. 组件开发规范

   - 使用 Vue 3 组合式 API
   - TypeScript 类型定义
   - 组件命名采用大驼峰命名法

2. 代码风格
   - 遵循 ESLint 配置
   - 使用 Prettier 进行代码格式化

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 👥 作者

- 作者名字 - [@pyxlyq](https://github.com/pyxlyq)

## 📮 联系方式

如有任何问题或建议，欢迎提交 Issue 或通过以下方式联系：

- GitHub Issues: [提交 Issue](https://github.com/pyxlyq/-/issues)

## 🧪 测试指南

### 测试环境准备

**前端环境：**

- Node.js
- Vue 3
- Element Plus
- ECharts

**后端环境：**

- Node.js
- Express
- TypeScript

**测试工具：**

- Postman（接口测试）
- Chrome DevTools（前端测试）
- JMeter（性能测试）

### 功能测试

#### 1. 仪表盘数据展示测试 (TC001)

- **测试内容：** 核心指标数据显示
- **前置条件：** 系统正常运行
- **测试步骤：**
  1. 访问系统首页
  2. 观察核心指标卡片数据
- **预期结果：**
  1. 显示总用户数（数字类型）
  2. 显示总商品数（数字类型）
  3. 显示今日销售额（数字类型）

#### 2. 用户转化漏斗图测试 (TC002)

- **测试内容：** 漏斗图交互功能
- **测试步骤：**
  1. 查看漏斗图显示
  2. 鼠标悬停在各个层级
  3. 检查数据显示
- **预期结果：**
  - 显示完整的转化漏斗
  - 悬停时显示详细数据
  - 数据包含：访问、注册、下单、支付

### 接口测试 (Postman)

```javascript
// 仪表盘接口测试示例
pm.test('仪表盘数据格式验证', function () {
  const jsonData = pm.response.json()

  // 核心指标验证
  pm.expect(jsonData).to.have.property('userCount')
  pm.expect(jsonData.userCount).to.be.a('number')

  // 转化数据验证
  pm.expect(jsonData.userConversion).to.have.all.keys('visit', 'register', 'order', 'payment')

  // 热力图数据验证
  pm.expect(jsonData.productHeatmap.xAxis).to.have.lengthOf(7)
  pm.expect(jsonData.productHeatmap.yAxis).to.have.lengthOf(5)
})
```

### 性能测试 (JMeter)

#### 1. 仪表盘接口性能测试 (PT001)

1. **配置线程组：**

   - Number of Threads: 100（模拟用户数）
   - Ramp-up Period: 10（启动时间）
   - Loop Count: 1

2. **HTTP 请求配置：**

   - Protocol: http
   - Server Name: localhost
   - Port: 3000
   - Path: /api/dashboard

3. **性能指标：**
   - 响应时间 < 1000ms
   - 错误率 < 1%
   - 并发用户数：500

### 测试执行步骤

1. **启动测试环境**

```bash
# 启动后端服务
cd server
npm run dev

# 启动前端服务
cd ../
npm run dev
```

2. **执行接口测试**

   - 使用 Postman 导入测试集合
   - 运行测试脚本
   - 验证返回结果

3. **执行性能测试**
   - 使用 Chrome DevTools 进行性能分析
   - 使用 Lighthouse 生成性能报告
   - 记录并分析性能指标

### 测试报告模板

```markdown
# 测试报告

## 1. 测试概述

- 测试时间：[开始日期] - [结束日期]
- 测试环境：[环境详情]
- 测试范围：[功能列表]

## 2. 测试结果统计

- 测试用例总数：
- 通过用例数：
- 失败用例数：
- 发现缺陷数：

## 3. 性能测试结果

- 平均响应时间：
- 并发用户数：
- CPU 使用率：
- 内存使用情况：

## 4. 测试结论

[总体评估和建议]
```
