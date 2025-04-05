<template>
  <div class="dashboard">
    <el-row v-loading="store.loading" :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ dashboardData?.userCount || 0 }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总商品数</span>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ dashboardData?.productCount || 0 }}</h2>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
            </div>
          </template>
          <div class="card-content">
            <h2>¥{{ dashboardData?.todaySales || 0 }}</h2>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户转化漏斗</span>
            </div>
          </template>
          <div ref="funnelChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品热度分布</span>
            </div>
          </template>
          <div ref="heatmapChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as echarts from 'echarts'
  import { useDashboardStore } from '@/stores/dashboard'
  import type { DashboardData } from '@/api/dashboard'
  import { ElMessage } from 'element-plus'

  const store = useDashboardStore()
  const dashboardData = ref<DashboardData | null>(null)
  const funnelChart = ref<HTMLElement>()
  const heatmapChart = ref<HTMLElement>()
  let funnelChartInstance: echarts.ECharts | null = null
  let heatmapChartInstance: echarts.ECharts | null = null

  const initFunnelChart = (data: DashboardData['userConversion']) => {
    if (!funnelChart.value) return
    if (funnelChartInstance) {
      funnelChartInstance.dispose()
    }
    funnelChartInstance = echarts.init(funnelChart.value)
    const option = {
      title: {
        text: '用户转化漏斗',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      legend: {
        data: ['访问', '注册', '下单', '支付'],
        bottom: 0
      },
      series: [
        {
          name: '转化率',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: [
            { value: data.visit, name: '访问' },
            { value: data.register, name: '注册' },
            { value: data.order, name: '下单' },
            { value: data.payment, name: '支付' }
          ]
        }
      ]
    }
    funnelChartInstance.setOption(option)
  }

  const initHeatmapChart = (data: DashboardData['productHeatmap']) => {
    if (!heatmapChart.value) return
    if (heatmapChartInstance) {
      heatmapChartInstance.dispose()
    }
    heatmapChartInstance = echarts.init(heatmapChart.value)
    const option = {
      title: {
        text: '商品热度分布',
        left: 'center'
      },
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: data.xAxis,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: data.yAxis,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [
        {
          name: '热度',
          type: 'heatmap',
          data: data.data,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    heatmapChartInstance.setOption(option)
  }

  const handleResize = () => {
    funnelChartInstance?.resize()
    heatmapChartInstance?.resize()
  }

  const initData = async () => {
    try {
      await store.fetchDashboardData()
      dashboardData.value = store.dashboardData
      if (dashboardData.value) {
        initFunnelChart(dashboardData.value.userConversion)
        initHeatmapChart(dashboardData.value.productHeatmap)
      } else {
        ElMessage.warning('没有获取到数据')
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      ElMessage.error('获取数据失败，请稍后重试')
    }
  }

  onMounted(async () => {
    await initData()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    funnelChartInstance?.dispose()
    heatmapChartInstance?.dispose()
  })
</script>

<style scoped>
  .dashboard {
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-content {
    text-align: center;
    padding: 20px 0;
  }

  .card-content h2 {
    margin: 0;
    font-size: 28px;
    color: #303133;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .chart {
    height: 400px;
    width: 100%;
  }

  .el-card {
    margin-bottom: 20px;
  }
</style>
