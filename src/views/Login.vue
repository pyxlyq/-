<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>电商数据可视化分析平台</h2>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="40px"
        @submit.prevent="handleLogin"
        class="login-form"
        size="large"
      >
        <el-form-item label="用户名" prop="username" class="form-item">
          <div class="custom-input">
            <i class="el-icon-user"></i>
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              @keyup.enter="handleLogin"
            />
            <i class="el-icon-close" v-if="loginForm.username" @click="loginForm.username = ''"></i>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="form-item">
          <div class="custom-input">
            <i class="el-icon-lock"></i>
            <input
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              @keyup.enter="handleLogin"
            />
            <i
              :class="showPassword ? 'el-icon-view' : 'el-icon-hide'"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </el-form-item>
        <el-form-item class="button-container">
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">
            登录
          </el-button>
          <el-button @click="goToRegister" class="register-link">注册账号</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'

  const router = useRouter()
  const loginFormRef = ref<FormInstance>()
  const loginForm = reactive({
    username: '',
    password: ''
  })

  const showPassword = ref(false)
  const loading = ref(false)

  // 模拟的用户数据
  const MOCK_USER = {
    username: 'admin',
    password: '123456'
  }

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
  })

  const handleLogin = async () => {
    if (!loginFormRef.value) return

    try {
      await loginFormRef.value.validate()
      loading.value = true

      // 获取所有用户
      const users = JSON.parse(localStorage.getItem('users') || '[]')

      // 验证用户名和密码
      const user = users.find(
        (u: any) => u.username === loginForm.username && u.password === loginForm.password
      )

      if (loginForm.username === MOCK_USER.username && loginForm.password === MOCK_USER.password) {
        // 默认管理员账号
        await new Promise(resolve => setTimeout(resolve, 1000))
        localStorage.setItem('token', 'mock-token')
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else if (user) {
        // 注册用户账号
        await new Promise(resolve => setTimeout(resolve, 1000))
        localStorage.setItem('token', 'user-token')
        localStorage.setItem('currentUser', JSON.stringify(user))
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('请检查输入是否正确')
    } finally {
      loading.value = false
    }
  }

  const goToRegister = () => {
    router.push('/register')
  }
</script>

<style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
  }

  .login-card {
    width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .card-header {
    text-align: center;
    padding: 10px 0;
  }

  .card-header h2 {
    margin: 0;
    color: #303133;
    font-size: 22px;
  }

  .login-form {
    margin-top: 10px;
    padding: 0 15px;
  }

  :deep(.el-form-item) {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    padding-right: 0;
    line-height: 36px;
    white-space: nowrap;
    text-align: left;
  }

  :deep(.el-form-item__content) {
    margin-left: 40px !important;
    flex: 1;
  }

  .form-item {
    margin-bottom: 15px;
  }

  .custom-input {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s;
    width: 100%;
    height: 36px;
  }

  .custom-input:hover {
    border-color: #c0c4cc;
  }

  .custom-input:focus-within {
    border-color: #409eff;
  }

  .custom-input i {
    padding: 0 10px;
    color: #909399;
    font-size: 16px;
  }

  .custom-input i.el-icon-close,
  .custom-input i.el-icon-view,
  .custom-input i.el-icon-hide {
    cursor: pointer;
  }

  .custom-input i.el-icon-close:hover,
  .custom-input i.el-icon-view:hover,
  .custom-input i.el-icon-hide:hover {
    color: #409eff;
  }

  .custom-input input {
    flex: 1;
    height: 36px;
    padding: 0 8px;
    border: none;
    outline: none;
    font-size: 14px;
    color: #606266;
    background: transparent;
  }

  .button-container {
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .login-button {
    width: 120px;
    height: 36px;
    font-size: 15px;
  }

  .register-link {
    width: 120px;
    margin-left: 10px;
  }
</style>
