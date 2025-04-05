<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>用户注册</h2>
        </div>
      </template>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-width="80px"
        @submit.prevent="handleRegister"
        class="register-form"
        size="large"
      >
        <el-form-item label="用户名" prop="username" class="form-item">
          <div class="custom-input">
            <i class="el-icon-user"></i>
            <input
              v-model="registerForm.username"
              type="text"
              placeholder="请输入用户名"
              @keyup.enter="handleRegister"
            />
            <i
              class="el-icon-close"
              v-if="registerForm.username"
              @click="registerForm.username = ''"
            ></i>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="form-item">
          <div class="custom-input">
            <i class="el-icon-lock"></i>
            <input
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              @keyup.enter="handleRegister"
            />
            <i
              :class="showPassword ? 'el-icon-view' : 'el-icon-hide'"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" class="form-item">
          <div class="custom-input">
            <i class="el-icon-lock"></i>
            <input
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              @keyup.enter="handleRegister"
            />
            <i
              :class="showConfirmPassword ? 'el-icon-view' : 'el-icon-hide'"
              @click="showConfirmPassword = !showConfirmPassword"
            ></i>
          </div>
        </el-form-item>
        <el-form-item class="button-container">
          <el-button
            type="primary"
            @click="handleRegister"
            :loading="loading"
            class="register-button"
          >
            注册
          </el-button>
          <el-button @click="goToLogin" class="login-link">返回登录</el-button>
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
  const registerFormRef = ref<FormInstance>()
  const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loading = ref(false)

  // 表单验证规则
  const validatePass = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      if (registerForm.confirmPassword !== '') {
        registerFormRef.value?.validateField('confirmPassword')
      }
      callback()
    }
  }

  const validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== registerForm.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, validator: validatePass, trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
  })

  const handleRegister = async () => {
    if (!registerFormRef.value) return

    try {
      await registerFormRef.value.validate()
      loading.value = true

      // 模拟注册延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 保存用户信息到本地存储
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.push({
        username: registerForm.username,
        password: registerForm.password
      })
      localStorage.setItem('users', JSON.stringify(users))

      ElMessage.success('注册成功')
      router.push('/login')
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('请检查输入是否正确')
    } finally {
      loading.value = false
    }
  }

  const goToLogin = () => {
    router.push('/login')
  }
</script>

<style scoped>
  .register-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
  }

  .register-card {
    width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .card-header {
    text-align: center;
  }

  .card-header h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }

  .register-form {
    padding: 20px;
  }

  .form-item {
    margin-bottom: 20px;
  }

  .custom-input {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 10px;
    transition: all 0.3s;
  }

  .custom-input:hover {
    border-color: #c0c4cc;
  }

  .custom-input:focus-within {
    border-color: #409eff;
  }

  .custom-input i {
    color: #909399;
    font-size: 16px;
    margin-right: 8px;
  }

  .custom-input input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    background: transparent;
  }

  .custom-input .el-icon-close {
    cursor: pointer;
    margin-left: 8px;
  }

  .button-container {
    margin-top: 30px;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .register-button {
    width: 120px;
    height: 36px;
  }

  .login-link {
    width: 120px;
    height: 36px;
  }
</style>
