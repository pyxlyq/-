<template>
  <div class="product-analysis">
    <el-container>
      <el-header>
        <h1>商品分析</h1>
      </el-header>
      <el-main>
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

        <!-- 商品销售排行和类别分布 -->
        <el-row :gutter="20" class="mt-20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>热销商品排行</span>
                  <el-select v-model="rankingType" size="small" style="width: 120px">
                    <el-option label="销量排行" value="sales" />
                    <el-option label="收藏排行" value="favorites" />
                    <el-option label="评分排行" value="rating" />
                  </el-select>
                </div>
              </template>
              <div ref="rankingChart" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>商品类别分布</span>
                </div>
              </template>
              <div ref="categoryChart" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 库存分析和价格分布 -->
        <el-row :gutter="20" class="mt-20">
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
          <el-col :span="12">
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
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as echarts from 'echarts'

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

  // 图表实例
  let rankingChartInstance: echarts.ECharts | null = null
  let categoryChartInstance: echarts.ECharts | null = null
  let stockChartInstance: echarts.ECharts | null = null
  let priceChartInstance: echarts.ECharts | null = null

  // 初始化热销商品排行图
  const initRankingChart = () => {
    if (!rankingChart.value) return
    rankingChartInstance = echarts.init(rankingChart.value)
    const option = {
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
    rankingChartInstance.setOption(option)
  }

  // 初始化商品类别分布图
  const initCategoryChart = () => {
    if (!categoryChart.value) return
    categoryChartInstance = echarts.init(categoryChart.value)
    const option = {
      title: {
        text: '商品类别分布'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['电子产品', '服装', '食品', '家居', '美妆', '其他']
      },
      series: [
        {
          name: '商品类别',
          type: 'pie',
          radius: ['50%', '70%'],
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
    categoryChartInstance.setOption(option)
  }

  // 初始化库存状态分析图
  const initStockChart = () => {
    if (!stockChart.value) return
    stockChartInstance = echarts.init(stockChart.value)
    const option = {
      title: {
        text: '库存状态分析'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '库存状态',
          type: 'pie',
          radius: ['40%', '70%'],
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
    stockChartInstance.setOption(option)
  }

  // 初始化商品价格分布图
  const initPriceChart = () => {
    if (!priceChart.value) return
    priceChartInstance = echarts.init(priceChart.value)
    const option = {
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
    priceChartInstance.setOption(option)
  }

  // 处理窗口大小变化
  const handleResize = () => {
    rankingChartInstance?.resize()
    categoryChartInstance?.resize()
    stockChartInstance?.resize()
    priceChartInstance?.resize()
  }

  // 生命周期钩子
  onMounted(() => {
    initRankingChart()
    initCategoryChart()
    initStockChart()
    initPriceChart()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    rankingChartInstance?.dispose()
    categoryChartInstance?.dispose()
    stockChartInstance?.dispose()
    priceChartInstance?.dispose()
  })
</script>

<style scoped>
  .product-analysis {
    height: 100vh;
  }

  .el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 20px;
  }

  .el-header h1 {
    margin: 0;
    line-height: 60px;
    font-size: 20px;
    color: #303133;
  }

  .el-main {
    background-color: #f5f7fa;
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
</style>
