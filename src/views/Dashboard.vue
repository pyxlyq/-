<template>
  <div class="dashboard">
    <el-container>
      <el-header>
        <h1>电商数据可视化分析平台</h1>
        <el-menu mode="horizontal" router>
          <el-menu-item index="/">仪表盘</el-menu-item>
          <el-menu-item index="/user-analysis">用户分析</el-menu-item>
          <el-menu-item index="/product-analysis">商品分析</el-menu-item>
          <el-menu-item index="/sales-trend">销售趋势</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card>
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
            <el-card>
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
            <el-card>
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
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>用户转化漏斗</span>
                </div>
              </template>
              <div ref="funnelChart" class="chart"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>商品热度分布</span>
                </div>
              </template>
              <div ref="heatmapChart" class="chart"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as echarts from 'echarts'
  import { useDashboardStore } from '@/stores/dashboard'
  import type { DashboardData } from '@/api/dashboard'

  const store = useDashboardStore()
  const dashboardData = ref<DashboardData | null>(null)
  const funnelChart = ref<HTMLElement>()
  const heatmapChart = ref<HTMLElement>()
  let funnelChartInstance: echarts.ECharts | null = null
  let heatmapChartInstance: echarts.ECharts | null = null

  const initFunnelChart = (data: DashboardData['userConversion']) => {
    if (!funnelChart.value) return
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

  watch(
    () => store.dashboardData,
    newData => {
      if (newData) {
        dashboardData.value = newData
        initFunnelChart(newData.userConversion)
        initHeatmapChart(newData.productHeatmap)
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    await store.fetchDashboardData()
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

  .mt-20 {
    margin-top: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-content {
    text-align: center;
  }

  .card-content h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }

  .chart {
    height: 400px;
  }
</style>
