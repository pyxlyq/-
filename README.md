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
