<template>
  <el-container>
    <el-header>
      <h2>个人中心</h2>
      <div class="header-buttons" v-if="!isLoggedIn">
        <el-button type="primary" @click="showLoginDialog">登录</el-button>
        <el-button type="success" @click="showRegisterDialog">注册</el-button>
      </div>
    </el-header>

    <!-- 未登录状态显示 -->
    <el-main v-if="!isLoggedIn" class="empty-main">
      <el-empty description="请登录后查看个人信息">
        <template #image>
          <img src="https://pic.imgdb.cn/item/65a0d1f9871b83018a9b1c41.png" style="width: 180px" />
        </template>
        <div class="empty-buttons">
          <el-button type="primary" @click="showLoginDialog">立即登录</el-button>
          <el-button type="success" @click="showRegisterDialog">注册账号</el-button>
        </div>
      </el-empty>
    </el-main>

    <!-- 已登录状态显示 -->
    <el-main v-else>
      <el-card>
        <h3>基本信息</h3>
        <el-descriptions column="1">
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ userInfo.createdAt }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-main>

    <!-- 登录对话框 -->
    <el-dialog
      v-model="loginDialogVisible"
      title="用户登录"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleLogin" :loading="loggingIn">
            登录
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 注册对话框 -->
    <el-dialog
      v-model="registerDialogVisible"
      title="用户注册"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRegister" :loading="registering">
            注册
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 注册相关
const registerDialogVisible = ref(false)
const registerFormRef = ref(null)
const registering = ref(false)
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 登录相关
const loginDialogVisible = ref(false)
const loginFormRef = ref(null)
const loggingIn = ref(false)
const loginForm = reactive({
  email: '',
  password: ''
})

// 用户状态
const isLoggedIn = ref(false)
const userInfo = ref({})

// 表单验证规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.confirmPassword !== '') {
      registerFormRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
}

const loginRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 显示对话框
const showRegisterDialog = () => {
  registerDialogVisible.value = true
}

const showLoginDialog = () => {
  loginDialogVisible.value = true
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('注册成功')
      registerDialogVisible.value = false
      // 清空表单
      registerFormRef.value.resetFields()
      // 显示登录框
      showLoginDialog()
    }
  })
}

// ��理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('登录成功')
      loginDialogVisible.value = false
      // 清空表单
      loginFormRef.value.resetFields()
    }
  })
}
</script>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  background-color: #f5f7fa;
}

.empty-buttons {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.el-card {
  border: 1px solid rgba(42, 157, 143, 0.1);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 8px 20px rgba(29, 61, 50, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary);
}

:deep(.el-empty__description) {
  margin-top: 20px;
  font-size: 16px;
  color: #606266;
}
</style> 