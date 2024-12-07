<template>
  <el-container>
    <el-header>
      <h2>个人中心</h2>
      <div class="header-buttons">
        <template v-if="!isLoggedIn">
          <el-button type="primary" @click="showLoginDialog">用户登录</el-button>
          <el-button type="danger" @click="showAdminLoginDialog">管理员登录</el-button>
          <el-button type="success" @click="showRegisterDialog">注册</el-button>
        </template>
        <template v-else>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </template>
      </div>
    </el-header>

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

    <el-main v-else>
      <el-card>
        <h3>基本信息</h3>
        <el-descriptions :column="1">
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
          <el-button type="primary" @click="handleLogin">
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
          <el-button type="primary" @click="handleRegister">
            注册
          </el-button>
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
        ref="adminLoginFormRef"
        :model="adminLoginForm"
        label-width="80px"
        status-icon
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="adminLoginForm.username" placeholder="请输入管理员账号"></el-input>
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
          <el-button type="primary" @click="handleAdminLogin">
            登录
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { useUserInfo } from '../js/UserInfo'
import '../css/UserInfo.css'

const {
  isLoggedIn,
  userInfo,
  loginDialogVisible,
  registerDialogVisible,
  adminLoginDialogVisible,
  loginFormRef,
  registerFormRef,
  adminLoginFormRef,
  loginForm,
  registerForm,
  adminLoginForm,
  handleLogin,
  handleRegister,
  handleAdminLogin,
  showLoginDialog,
  showRegisterDialog,
  showAdminLoginDialog,
  handleLogout
} = useUserInfo()
</script>

<style scoped>
.header-buttons {
  display: flex;
  gap: 10px;
}
</style> 