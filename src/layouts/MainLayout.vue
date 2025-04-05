<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="logo">电商数据分析平台</div>
      <el-menu :default-active="route.path" mode="horizontal" router class="nav-menu">
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          仪表盘
        </el-menu-item>
        <el-menu-item index="/user-analysis">
          <el-icon><User /></el-icon>
          用户分析
        </el-menu-item>
        <el-menu-item index="/product-analysis">
          <el-icon><Goods /></el-icon>
          商品分析
        </el-menu-item>
        <el-menu-item index="/sales-trend">
          <el-icon><TrendCharts /></el-icon>
          销售趋势
        </el-menu-item>
      </el-menu>
      <div class="user-actions">
        <el-dropdown @command="handleCommand">
          <span class="user-dropdown">
            <el-icon><User /></el-icon>
            {{ username }}
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { DataLine, User, Goods, TrendCharts, CaretBottom } from '@element-plus/icons-vue'

  const route = useRoute()
  const router = useRouter()
  const username = ref('')

  // 获取当前用户信息
  const getCurrentUser = () => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      username.value = user.username
    } else {
      // 如果没有存储的用户信息，检查是否是管理员账号
      const token = localStorage.getItem('token')
      if (token === 'mock-token') {
        username.value = 'admin'
      }
    }
  }

  const handleCommand = (command: string) => {
    if (command === 'logout') {
      // 清除登录状态
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
      // 跳转到登录页
      router.push('/login')
      ElMessage.success('已退出登录')
    }
  }

  // 在组件挂载时获取用户信息
  onMounted(() => {
    getCurrentUser()
  })
</script>

<style scoped>
  .layout-container {
    min-height: 100vh;
  }

  .header {
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 20px;
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #409eff;
    margin-right: 40px;
  }

  .nav-menu {
    flex: 1;
    border-bottom: none;
  }

  .user-actions {
    margin-left: 20px;
  }

  .user-dropdown {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #606266;
  }

  .user-dropdown .el-icon {
    margin: 0 4px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
