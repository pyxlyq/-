<template>
  <div class="sales-trend">
    <el-container>
      <el-header>
        <h1>销售趋势</h1>
      </el-header>
      <el-main>
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div class="content">
            <p>销售趋势页面开发中...</p>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  // 销售趋势页面逻辑
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

  .content {
    text-align: center;
    padding: 20px;
  }
</style>
