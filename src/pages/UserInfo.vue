<template>
  <el-container>
    <el-header>
      <h2>个人中心</h2>
      <div class="header-buttons">
        <template v-if="!userStore.isLoggedIn">
          <el-button type="primary" @click="showLoginDialog">用户登录</el-button>
          <el-button type="success" @click="showRegisterDialog">注册</el-button>
          <el-button type="warning" @click="showAdminLoginDialog">管理员登录</el-button>
        </template>
        <template v-else>
          <el-button type="danger" @click="userStore.handleLogout">退出登录</el-button>
        </template>
      </div>
    </el-header>

    <el-main v-if="!userStore.isLoggedIn" class="empty-main">
      <el-empty description="请登录后查看个人信息">
        <div class="empty-buttons">
          <el-button type="primary" @click="showLoginDialog">立即登录</el-button>
          <el-button type="success" @click="showRegisterDialog">注册账号</el-button>
        </div>
      </el-empty>
    </el-main>

    <el-main v-else>
      <!-- 个人信息卡片 -->
      <el-card class="profile-card">
        <div class="profile-header">
          <el-avatar 
            :size="100" 
            :src="userStore.userInfo?.avatar" 
            :alt="userStore.userInfo?.name"
            @error="handleImageError"
            :fallback="DEFAULT_AVATAR"
          />
          <div class="profile-info">
            <h3>{{ userStore.userInfo?.name }}</h3>
            <p class="bio">{{ userStore.userInfo?.bio || '这个人很懒，什么都没写~' }}</p>
          </div>
        </div>
      </el-card>

      <!-- 基本信息卡片 -->
      <el-card class="user-info">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户名">{{ userStore.userInfo?.name }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userStore.userInfo?.nickname }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userStore.userInfo?.email }}</el-descriptions-item>
          <el-descriptions-item label="角色">
            {{ userStore.userInfo?.role === 'user' ? '普通用户' : '管理员' }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="userStore.userInfo?.status === 'active' ? 'success' : 'info'" class="status-tag">
              {{ userStore.userInfo?.status === 'active' ? '正常' : '已禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="积分">{{ userStore.userInfo?.points }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ userStore.userInfo?.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ userStore.userInfo?.lastLogin }}</el-descriptions-item>
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
        :model="loginForm"
        label-width="80px"
        status-icon
      >
        <el-form-item label="账号" prop="identifier">
          <el-input 
            v-model="loginForm.identifier"
            placeholder="请输入用户名或邮箱"
          ></el-input>
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
          <el-button type="primary" @click="handleLogin">登录</el-button>
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
        :model="registerForm"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="registerForm.nickname" 
            placeholder="请输入昵称（选填，默认同用户名）"
          ></el-input>
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
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加管理员登录对话框 -->
    <el-dialog
      v-model="adminLoginDialogVisible"
      title="管理员登录"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="adminLoginForm"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="adminLoginForm.username"
            placeholder="请输入管理员用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="adminLoginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adminLoginDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdminLogin">登录</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import '../css/UserInfo.css'

const userStore = useUserStore()
// 使用 storeToRefs 保持响应性
const { isLoggedIn, userInfo } = storeToRefs(userStore)

const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 登录表单数据
const loginForm = ref({
  identifier: '',
  password: ''
})

// 注册表单数据
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

// 管理员登录表单数据
const adminLoginForm = ref({
  username: '',
  password: ''
})

// 对话框显示状态
const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)
const adminLoginDialogVisible = ref(false)

// 显示对话框的方法
const showLoginDialog = () => {
  loginDialogVisible.value = true
}

const showRegisterDialog = () => {
  registerDialogVisible.value = true
}

const showAdminLoginDialog = () => {
  adminLoginDialogVisible.value = true
}

// 处理登录
const handleLogin = async () => {
  const success = await userStore.handleLogin({
    account: loginForm.value.identifier,
    password: loginForm.value.password
  })
  
  if (success) {
    loginDialogVisible.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  const success = await userStore.handleRegister(registerForm.value)
  if (success) {
    registerDialogVisible.value = false
    loginForm.value.identifier = registerForm.value.email
    showLoginDialog()
  }
}

// 处理管理员登录
const handleAdminLogin = async () => {
  const success = await userStore.handleAdminLogin({
    username: adminLoginForm.value.username,
    password: adminLoginForm.value.password
  })
  
  if (success) {
    adminLoginDialogVisible.value = false
    // 如果是管理员，跳转到管理页面
    if (userStore.isAdmin) {
      window.location.href = '/admin'
    }
  }
}

// 处理图片加载错误
const handleImageError = () => {
  if (userStore.userInfo) {
    userStore.userInfo.avatar = DEFAULT_AVATAR
  }
}
</script> 