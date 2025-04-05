<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>页面未找到</h2>
    <el-button type="primary" @click="router.push('/dashboard')">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<style scoped>
  .not-found {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
  }

  h1 {
    font-size: 72px;
    color: #409eff;
    margin: 0;
  }

  h2 {
    font-size: 24px;
    color: #606266;
    margin: 20px 0;
  }
</style>
