<template>
  <div class="sales-trend">
    <el-container>
      <el-header>
        <h1>销售趋势</h1>
      </el-header>
      <el-main>
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
                  <div class="header-right">
                    <el-radio-group v-model="timeRange" size="small">
                      <el-radio-button label="week">近7天</el-radio-button>
                      <el-radio-button label="month">近30天</el-radio-button>
                      <el-radio-button label="year">近12个月</el-radio-button>
                    </el-radio-group>
                    <el-select
                      v-model="dataType"
                      size="small"
                      style="margin-left: 10px; width: 100px"
                    >
                      <el-option label="销售额" value="sales" />
                      <el-option label="订单量" value="orders" />
                    </el-select>
                  </div>
                </div>
              </template>
              <div ref="trendChart" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 销售分析图表 -->
        <el-row :gutter="20" class="mt-20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>销售环比分析</span>
                </div>
              </template>
              <div ref="compareChart" class="chart"></div>
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
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as echarts from 'echarts'

  // 销售统计数据
  const salesStats = ref({
    todaySales: 126800,
    todayGrowth: 12.5,
    monthSales: 368,
    monthTargetRate: 85,
    orderCount: 1250,
    conversionRate: 3.2,
    averageOrder: 320,
    avgOrderGrowth: 5.8
  })

  // 时间范围和数据类型选择
  const timeRange = ref('week')
  const dataType = ref('sales')

  // 图表引用
  const trendChart = ref<HTMLElement>()
  const compareChart = ref<HTMLElement>()
  const paymentChart = ref<HTMLElement>()

  // 图表实例
  let trendChartInstance: echarts.ECharts | null = null
  let compareChartInstance: echarts.ECharts | null = null
  let paymentChartInstance: echarts.ECharts | null = null

  // 初始化销售趋势图
  const initTrendChart = () => {
    if (!trendChart.value) return
    trendChartInstance = echarts.init(trendChart.value)
    const option = {
      title: {
        text: '销售趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['销售额', '订单量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
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
          name: '订单量',
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: '销售额',
          type: 'line',
          smooth: true,
          data: [45, 52, 48, 55, 60, 65, 58],
          itemStyle: {
            color: '#409EFF'
          }
        },
        {
          name: '订单量',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: [150, 180, 160, 190, 200, 220, 180],
          itemStyle: {
            color: '#67C23A'
          }
        }
      ]
    }
    trendChartInstance.setOption(option)
  }

  // 初始化销售环比分析图
  const initCompareChart = () => {
    if (!compareChart.value) return
    compareChartInstance = echarts.init(compareChart.value)
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
    compareChartInstance.setOption(option)
  }

  // 初始化支付方式分布图
  const initPaymentChart = () => {
    if (!paymentChart.value) return
    paymentChartInstance = echarts.init(paymentChart.value)
    const option = {
      title: {
        text: '支付方式分布'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['支付宝', '微信支付', '银行卡', '其他']
      },
      series: [
        {
          name: '支付方式',
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
    compareChartInstance?.resize()
    paymentChartInstance?.resize()
  }

  // 生命周期钩子
  onMounted(() => {
    initTrendChart()
    initCompareChart()
    initPaymentChart()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    trendChartInstance?.dispose()
    compareChartInstance?.dispose()
    paymentChartInstance?.dispose()
  })
</script>

<style scoped>
  .sales-trend {
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

  .header-right {
    display: flex;
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
