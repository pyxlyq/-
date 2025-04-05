<template>
  <div class="sales-trend">
    <!-- 加载状态 -->
    <el-alert v-if="loading" title="正在加载数据..." type="info" :closable="false" show-icon />

    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      :closable="true"
      show-icon
      @close="error = ''"
    />

    <!-- 销售概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
              <el-tag type="success" v-if="salesStats.todayGrowth > 0"
                >+{{ salesStats.todayGrowth }}%</el-tag
              >
              <el-tag type="danger" v-else>{{ salesStats.todayGrowth }}%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>¥{{ salesStats.todaySales }}</h2>
            <p>
              较昨日 {{ salesStats.todayGrowth > 0 ? '增长' : '下降' }}
              {{ Math.abs(salesStats.todayGrowth) }}%
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月销售额</span>
            </div>
          </template>
          <div class="card-content">
            <h2>¥{{ salesStats.monthSales }}万</h2>
            <p>月目标完成率 {{ salesStats.monthTargetRate }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单数量</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ salesStats.orderCount }}</h2>
            <p>转化率 {{ salesStats.conversionRate }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>客单价</span>
            </div>
          </template>
          <div class="card-content">
            <h2>¥{{ salesStats.averageOrder }}</h2>
            <p>较上月 {{ salesStats.avgOrderGrowth }}%</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售趋势图 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="7days">近7天</el-radio-button>
                <el-radio-button label="30days">近30天</el-radio-button>
                <el-radio-button label="12months">近12个月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 环比分析和支付方式 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>环比分析</span>
            </div>
          </template>
          <div ref="comparisonChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>支付方式分布</span>
            </div>
          </template>
          <div ref="paymentChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as echarts from 'echarts'
  import axios from 'axios'

  // 加载状态和错误信息
  const loading = ref(false)
  const error = ref('')

  // 销售统计数据
  const salesStats = ref({
    todaySales: 0,
    todayGrowth: 0,
    monthSales: 0,
    monthTargetRate: 0,
    orderCount: 0,
    conversionRate: 0,
    averageOrder: 0,
    avgOrderGrowth: 0
  })

  // 图表引用
  const trendChart = ref<HTMLElement>()
  const comparisonChart = ref<HTMLElement>()
  const paymentChart = ref<HTMLElement>()

  // 图表实例
  let trendChartInstance: echarts.ECharts | null = null
  let comparisonChartInstance: echarts.ECharts | null = null
  let paymentChartInstance: echarts.ECharts | null = null

  // 时间范围
  const timeRange = ref('7days')

  // 获取销售统计数据
  const fetchSalesStats = async () => {
    try {
      loading.value = true
      error.value = ''
      console.log('正在获取销售统计数据...')
      const response = await axios.get('http://localhost:3000/api/sales-stats')
      console.log('销售统计数据:', response.data)
      salesStats.value = response.data
    } catch (err: any) {
      console.error('获取销售统计数据失败:', err)
      error.value = '获取销售统计数据失败，请检查服务器是否正常运行'
    } finally {
      loading.value = false
    }
  }

  // 获取销售趋势数据
  const fetchSalesTrend = async () => {
    try {
      loading.value = true
      error.value = ''
      console.log('正在获取销售趋势数据...')
      const response = await axios.get(
        `http://localhost:3000/api/sales-trend?timeRange=${timeRange.value}`
      )
      console.log('销售趋势数据:', response.data)
      updateChartData(response.data)
    } catch (err: any) {
      console.error('获取销售趋势数据失败:', err)
      error.value = '获取销售趋势数据失败，请检查服务器是否正常运行'
    } finally {
      loading.value = false
    }
  }

  // 加载所有数据
  const loadAllData = async () => {
    loading.value = true
    error.value = ''

    try {
      await Promise.all([fetchSalesStats(), fetchSalesTrend()])
    } catch (err) {
      console.error('加载数据失败:', err)
      error.value = '加载数据失败，请检查服务器是否正常运行'
    } finally {
      loading.value = false
    }
  }

  // 更新图表数据
  const updateChartData = (data: any[]) => {
    if (!trendChartInstance) return

    trendChartInstance.setOption({
      xAxis: {
        data: data.map(item => item.date)
      },
      series: [
        {
          data: data.map(item => item.sales)
        },
        {
          data: data.map(item => item.orders)
        },
        {
          data: data.map(item => item.customers)
        }
      ]
    })
  }

  // 监听时间范围变化
  watch(timeRange, () => {
    fetchSalesTrend()
  })

  // 初始化销售趋势图
  const initTrendChart = () => {
    if (!trendChart.value) return
    trendChartInstance = echarts.init(trendChart.value)
    const option = {
      title: {
        text: '销售趋势分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['销售额', '订单量', '客户数'],
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
          name: '客户数',
          type: 'line',
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
    trendChartInstance.setOption(option)
  }

  // 初始化销售环比分析图
  const initComparisonChart = () => {
    if (!comparisonChart.value) return
    comparisonChartInstance = echarts.init(comparisonChart.value)
    const option = {
      title: {
        text: '销售环比分析'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['上期', '本期', '环比']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '销售额',
          axisLabel: {
            formatter: '{value} 万'
          }
        },
        {
          type: 'value',
          name: '环比',
          axisLabel: {
            formatter: '{value} %'
          }
        }
      ],
      series: [
        {
          name: '上期',
          type: 'bar',
          data: [40, 45, 42, 48, 50]
        },
        {
          name: '本期',
          type: 'bar',
          data: [45, 52, 48, 55, 60]
        },
        {
          name: '环比',
          type: 'line',
          yAxisIndex: 1,
          data: [12.5, 15.6, 14.3, 14.6, 20],
          itemStyle: {
            color: '#E6A23C'
          }
        }
      ]
    }
    comparisonChartInstance.setOption(option)
  }

  // 初始化支付方式分布图
  const initPaymentChart = () => {
    if (!paymentChart.value) return
    paymentChartInstance = echarts.init(paymentChart.value)
    const option = {
      title: {
        text: '支付方式分布',
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
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        textStyle: {
          fontSize: 16
        }
      },
      series: [
        {
          name: '支付方式',
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
            { value: 45, name: '支付宝' },
            { value: 35, name: '微信支付' },
            { value: 15, name: '银行卡' },
            { value: 5, name: '其他' }
          ]
        }
      ]
    }
    paymentChartInstance.setOption(option)
  }

  // 处理窗口大小变化
  const handleResize = () => {
    trendChartInstance?.resize()
    comparisonChartInstance?.resize()
    paymentChartInstance?.resize()
  }

  // 生命周期钩子
  onMounted(async () => {
    initTrendChart()
    initComparisonChart()
    initPaymentChart()

    await loadAllData()

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    trendChartInstance?.dispose()
    comparisonChartInstance?.dispose()
    paymentChartInstance?.dispose()
  })
</script>

<style scoped>
  .sales-trend {
    height: 100%;
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
