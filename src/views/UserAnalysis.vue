<template>
  <div class="user-analysis">
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

    <!-- 用户概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-tag type="success">+{{ userStats.dailyIncrease }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ userStats.total }}</h2>
            <p>较昨日 {{ userStats.growthRate }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>活跃用户</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ userStats.activeUsers }}</h2>
            <p>活跃率 {{ userStats.activeRate }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>新增用户</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ userStats.newUsers }}</h2>
            <p>转化率 {{ userStats.conversionRate }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>付费用户</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ userStats.paidUsers }}</h2>
            <p>付费率 {{ userStats.paymentRate }}%</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户增长趋势 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="7days">近7天</el-radio-button>
                <el-radio-button label="30days">近30天</el-radio-button>
                <el-radio-button label="12months">近12个月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="growthChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户地域分布和行为分析 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户地域分布</span>
            </div>
          </template>
          <div ref="regionChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户行为分析</span>
            </div>
          </template>
          <div ref="behaviorChart" class="chart"></div>
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

  // 用户统计数据
  const userStats = ref({
    total: 0,
    dailyIncrease: 0,
    growthRate: 0,
    activeUsers: 0,
    activeRate: 0,
    newUsers: 0,
    conversionRate: 0,
    paidUsers: 0,
    paymentRate: 0
  })

  // 时间范围选择
  const timeRange = ref('7days')

  // 图表引用
  const growthChart = ref<HTMLElement>()
  const regionChart = ref<HTMLElement>()
  const behaviorChart = ref<HTMLElement>()

  // 图表实例
  let growthChartInstance: echarts.ECharts | null = null
  let regionChartInstance: echarts.ECharts | null = null
  let behaviorChartInstance: echarts.ECharts | null = null

  // 获取用户统计数据
  const fetchUserStats = async () => {
    try {
      console.log('正在获取用户统计数据...')
      const response = await axios.get('http://localhost:3000/api/user-stats')
      console.log('用户统计数据:', response.data)
      userStats.value = response.data
    } catch (err: any) {
      console.error('获取用户统计数据失败:', err)
      error.value = '获取用户统计数据失败，请检查服务器是否正常运行'
    }
  }

  // 获取用户增长趋势数据
  const fetchUserGrowth = async () => {
    try {
      console.log('正在获取用户增长趋势数据...')
      const response = await axios.get(
        `http://localhost:3000/api/user-growth?timeRange=${timeRange.value}`
      )
      console.log('用户增长趋势数据:', response.data)
      updateGrowthChart(response.data)
    } catch (err: any) {
      console.error('获取用户增长趋势数据失败:', err)
      error.value = '获取用户增长趋势数据失败，请检查服务器是否正常运行'
    }
  }

  // 获取用户地域分布数据
  const fetchUserRegion = async () => {
    try {
      console.log('正在获取用户地域分布数据...')
      const response = await axios.get('http://localhost:3000/api/user-region')
      console.log('用户地域分布数据:', response.data)
      updateRegionChart(response.data)
    } catch (err: any) {
      console.error('获取用户地域分布数据失败:', err)
      error.value = '获取用户地域分布数据失败，请检查服务器是否正常运行'
    }
  }

  // 获取用户行为分析数据
  const fetchUserBehavior = async () => {
    try {
      console.log('正在获取用户行为分析数据...')
      const response = await axios.get('http://localhost:3000/api/user-behavior')
      console.log('用户行为分析数据:', response.data)
      updateBehaviorChart(response.data)
    } catch (err: any) {
      console.error('获取用户行为分析数据失败:', err)
      error.value = '获取用户行为分析数据失败，请检查服务器是否正常运行'
    }
  }

  // 加载所有数据
  const loadAllData = async () => {
    loading.value = true
    error.value = ''

    try {
      await Promise.all([
        fetchUserStats(),
        fetchUserGrowth(),
        fetchUserRegion(),
        fetchUserBehavior()
      ])
    } catch (err) {
      console.error('加载数据失败:', err)
      error.value = '加载数据失败，请检查服务器是否正常运行'
    } finally {
      loading.value = false
    }
  }

  // 更新用户增长趋势图
  const updateGrowthChart = (data: any[]) => {
    if (!growthChartInstance) return

    growthChartInstance.setOption({
      xAxis: {
        data: data.map(item => item.date)
      },
      series: [
        {
          data: data.map(item => item.newUsers)
        },
        {
          data: data.map(item => item.activeUsers)
        }
      ]
    })
  }

  // 更新用户地域分布图
  const updateRegionChart = (data: any[]) => {
    if (!regionChartInstance) return

    regionChartInstance.setOption({
      series: [
        {
          data: data
        }
      ]
    })
  }

  // 更新用户行为分析图
  const updateBehaviorChart = (data: any[]) => {
    if (!behaviorChartInstance) return

    behaviorChartInstance.setOption({
      series: [
        {
          data: data
        }
      ]
    })
  }

  // 监听时间范围变化
  watch(timeRange, () => {
    fetchUserGrowth()
  })

  // 初始化用户增长趋势图
  const initGrowthChart = () => {
    if (!growthChart.value) return
    growthChartInstance = echarts.init(growthChart.value)
    const option = {
      title: {
        text: '用户增长趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['新增用户', '活跃用户'],
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
          name: '新增用户',
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
          name: '活跃用户',
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
    growthChartInstance.setOption(option)
  }

  // 初始化地域分布图
  const initRegionChart = () => {
    if (!regionChart.value) return
    regionChartInstance = echarts.init(regionChart.value)
    const option = {
      title: {
        text: '用户地域分布',
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        textStyle: {
          fontSize: 14
        }
      },
      series: [
        {
          name: '用户数量',
          type: 'pie',
          radius: ['40%', '70%'],
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
          }
        }
      ]
    }
    regionChartInstance.setOption(option)
  }

  // 初始化用户行为分析图
  const initBehaviorChart = () => {
    if (!behaviorChart.value) return
    behaviorChartInstance = echarts.init(behaviorChart.value)
    const option = {
      title: {
        text: '用户行为分析',
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        textStyle: {
          fontSize: 14
        }
      },
      series: [
        {
          name: '用户行为',
          type: 'pie',
          radius: ['40%', '70%'],
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
          }
        }
      ]
    }
    behaviorChartInstance.setOption(option)
  }

  // 处理窗口大小变化
  const handleResize = () => {
    growthChartInstance?.resize()
    regionChartInstance?.resize()
    behaviorChartInstance?.resize()
  }

  // 生命周期钩子
  onMounted(async () => {
    initGrowthChart()
    initRegionChart()
    initBehaviorChart()

    await loadAllData()

    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    growthChartInstance?.dispose()
    regionChartInstance?.dispose()
    behaviorChartInstance?.dispose()
  })
</script>

<style scoped>
  .user-analysis {
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
