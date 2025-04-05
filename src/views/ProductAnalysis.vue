<template>
  <div class="product-analysis">
    <!-- 商品概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品总数</span>
              <el-tag type="success">+{{ productStats.dailyNew }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ productStats.total }}</h2>
            <p>在售商品数 {{ productStats.onSale }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品销量</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ productStats.totalSales }}</h2>
            <p>日均销量 {{ productStats.avgDailySales }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品评分</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ productStats.avgRating }}</h2>
            <p>评价数 {{ productStats.totalReviews }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>库存状态</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ productStats.stockValue }}万</h2>
            <p>库存商品数 {{ productStats.stockCount }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品销售排名 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>商品销售排名</span>
              <el-radio-group v-model="rankingType" size="small">
                <el-radio-button label="sales">销量</el-radio-button>
                <el-radio-button label="favorites">收藏</el-radio-button>
                <el-radio-button label="rating">评分</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="rankingChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品分类和库存分析 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>商品分类分布</span>
            </div>
          </template>
          <div ref="categoryChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>库存状态分析</span>
            </div>
          </template>
          <div ref="stockChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品价格分布 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>商品价格分布</span>
            </div>
          </template>
          <div ref="priceChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品销售趋势 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>商品销售趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="7days">最近7天</el-radio-button>
                <el-radio-button label="30days">最近30天</el-radio-button>
                <el-radio-button label="12months">最近12个月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import * as echarts from 'echarts'
  import { useRouter, onBeforeRouteUpdate } from 'vue-router'

  // 商品统计数据
  const productStats = ref({
    total: 5000,
    dailyNew: 25,
    onSale: 4800,
    totalSales: 15000,
    avgDailySales: 500,
    avgRating: 4.5,
    totalReviews: 25000,
    stockValue: 850,
    stockCount: 12000
  })

  // 排行榜类型
  const rankingType = ref('sales')

  // 图表引用
  const rankingChart = ref<HTMLElement>()
  const categoryChart = ref<HTMLElement>()
  const stockChart = ref<HTMLElement>()
  const priceChart = ref<HTMLElement>()
  const salesChart = ref<HTMLElement>()

  // 图表实例
  let rankingChartInstance: echarts.ECharts | null = null
  let categoryChartInstance: echarts.ECharts | null = null
  let stockChartInstance: echarts.ECharts | null = null
  let priceChartInstance: echarts.ECharts | null = null
  let salesChartInstance: echarts.ECharts | null = null

  // 时间范围
  const timeRange = ref('7days')

  // 生成模拟数据
  const generateProductData = (days: number) => {
    const data = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString(),
        sales: Math.floor(Math.random() * 1000) + 500,
        views: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 200) + 100
      })
    }
    return data
  }

  // 更新排行榜图表
  const updateRankingChart = () => {
    if (!rankingChartInstance) return

    let data: number[] = []
    let title = ''

    switch (rankingType.value) {
      case 'sales':
        data = [1500, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400]
        title = '热销商品TOP10'
        break
      case 'favorites':
        data = [800, 750, 700, 650, 600, 550, 500, 450, 400, 350]
        title = '收藏商品TOP10'
        break
      case 'rating':
        data = [4.9, 4.8, 4.8, 4.7, 4.7, 4.6, 4.6, 4.5, 4.5, 4.4]
        title = '评分商品TOP10'
        break
    }

    rankingChartInstance.setOption({
      title: {
        text: title
      },
      series: [
        {
          name:
            rankingType.value === 'sales'
              ? '销量'
              : rankingType.value === 'favorites'
              ? '收藏数'
              : '评分',
          data: data
        }
      ]
    })
  }

  // 更新图表数据
  const updateChartData = () => {
    if (!salesChartInstance) return

    let days = 7
    switch (timeRange.value) {
      case '7days':
        days = 7
        break
      case '30days':
        days = 30
        break
      case '12months':
        days = 365
        break
    }
    const data = generateProductData(days)
    salesChartInstance.setOption({
      xAxis: {
        data: data.map(item => item.date)
      },
      series: [
        {
          data: data.map(item => item.sales)
        },
        {
          data: data.map(item => item.views)
        },
        {
          data: data.map(item => item.orders)
        }
      ]
    })
  }

  // 监听时间范围变化
  watch(
    timeRange,
    newValue => {
      console.log('时间范围变化:', newValue)
      updateChartData()
    },
    { immediate: true }
  )

  // 监听排行榜类型变化
  watch(
    rankingType,
    newValue => {
      console.log('排行榜类型变化:', newValue)
      updateRankingChart()
    },
    { immediate: true }
  )

  // 生命周期钩子
  onMounted(() => {
    // 确保DOM已经渲染完成
    nextTick(() => {
      // 初始化所有图表
      if (rankingChart.value) {
        rankingChartInstance = echarts.init(rankingChart.value)
        const rankingOption = {
          title: {
            text: '热销商品TOP10'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: [
              '商品1',
              '商品2',
              '商品3',
              '商品4',
              '商品5',
              '商品6',
              '商品7',
              '商品8',
              '商品9',
              '商品10'
            ]
          },
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [1500, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400]
            }
          ]
        }
        rankingChartInstance.setOption(rankingOption)
      }

      if (categoryChart.value) {
        categoryChartInstance = echarts.init(categoryChart.value)
        const categoryOption = {
          title: {
            text: '商品类别分布',
            left: 'center',
            top: 10
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top: 'middle',
            data: ['电子产品', '服装', '食品', '家居', '美妆', '其他']
          },
          series: [
            {
              name: '商品类别',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['60%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 1500, name: '电子产品' },
                { value: 1200, name: '服装' },
                { value: 800, name: '食品' },
                { value: 600, name: '家居' },
                { value: 500, name: '美妆' },
                { value: 400, name: '其他' }
              ]
            }
          ]
        }
        categoryChartInstance.setOption(categoryOption)
      }

      if (stockChart.value) {
        stockChartInstance = echarts.init(stockChart.value)
        const stockOption = {
          title: {
            text: '库存状态分析',
            left: 'center',
            top: 10
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'horizontal',
            top: 40,
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 20
          },
          series: [
            {
              name: '库存状态',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '60%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                position: 'outside'
              },
              labelLine: {
                show: true
              },
              data: [
                { value: 6000, name: '充足' },
                { value: 4000, name: '正常' },
                { value: 1500, name: '偏低' },
                { value: 500, name: '告急' }
              ]
            }
          ]
        }
        stockChartInstance.setOption(stockOption)
      }

      if (priceChart.value) {
        priceChartInstance = echarts.init(priceChart.value)
        const priceOption = {
          title: {
            text: '商品价格分布'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['0-50', '51-100', '101-200', '201-500', '501-1000', '1000+']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '商品数量',
              type: 'bar',
              data: [1200, 1500, 1000, 800, 300, 200],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ])
              }
            }
          ]
        }
        priceChartInstance.setOption(priceOption)
      }

      if (salesChart.value) {
        salesChartInstance = echarts.init(salesChart.value)
        const data = generateProductData(7)
        const salesOption = {
          title: {
            text: '商品销售趋势',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['销售额', '浏览量', '订单量'],
            top: 30
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.map(item => item.date),
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '销售额',
              type: 'line',
              data: data.map(item => item.sales),
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 3
              },
              areaStyle: {
                opacity: 0.1
              }
            },
            {
              name: '浏览量',
              type: 'line',
              data: data.map(item => item.views),
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 3
              },
              areaStyle: {
                opacity: 0.1
              }
            },
            {
              name: '订单量',
              type: 'line',
              data: data.map(item => item.orders),
              smooth: true,
              showSymbol: false,
              lineStyle: {
                width: 3
              },
              areaStyle: {
                opacity: 0.1
              }
            }
          ]
        }
        salesChartInstance.setOption(salesOption)
      }
    })

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    disposeCharts()
  })

  // 销毁所有图表
  const disposeCharts = () => {
    if (rankingChartInstance) {
      rankingChartInstance.dispose()
      rankingChartInstance = null
    }
    if (categoryChartInstance) {
      categoryChartInstance.dispose()
      categoryChartInstance = null
    }
    if (stockChartInstance) {
      stockChartInstance.dispose()
      stockChartInstance = null
    }
    if (priceChartInstance) {
      priceChartInstance.dispose()
      priceChartInstance = null
    }
    if (salesChartInstance) {
      salesChartInstance.dispose()
      salesChartInstance = null
    }
  }

  // 处理窗口大小变化
  const handleResize = () => {
    if (rankingChartInstance) rankingChartInstance.resize()
    if (categoryChartInstance) categoryChartInstance.resize()
    if (stockChartInstance) stockChartInstance.resize()
    if (priceChartInstance) priceChartInstance.resize()
    if (salesChartInstance) salesChartInstance.resize()
  }
</script>

<style scoped>
  .product-analysis {
    height: 100%;
    padding: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .chart {
    height: 400px;
    width: 100%;
    min-height: 400px;
    position: relative;
  }

  .card-content {
    text-align: center;
  }

  .card-content h2 {
    margin: 10px 0;
    font-size: 24px;
    color: #303133;
  }

  .card-content p {
    margin: 0;
    font-size: 14px;
    color: #909399;
  }

  :deep(.el-card__body) {
    padding: 20px;
    height: calc(100% - 55px);
  }

  :deep(.el-card) {
    height: 100%;
    margin-bottom: 20px;
  }
</style>
