<template>
  <el-container>
    <el-header>
      <h2>个人中心</h2>
      <div class="header-buttons">
        <template v-if="!isLoggedIn">
          <el-button type="primary" @click="showLoginDialog">用户登录</el-button>
          <el-button type="success" @click="showRegisterDialog">注册</el-button>
        </template>
        <template v-else>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </template>
      </div>
    </el-header>

    <el-main v-if="!isLoggedIn" class="empty-main">
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
            :src="userInfo.avatar" 
            :alt="userInfo.username"
          />
          <div class="profile-info">
            <h3>{{ userInfo.username }}</h3>
            <p class="bio">{{ userInfo.bio || '这个人很懒，什么都没写~' }}</p>
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
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="角色">
            {{ userInfo.role === 'user' ? '普通用户' : '管理员' }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="userInfo.status === 'active' ? 'success' : 'info'" class="status-tag">
              {{ userInfo.status === 'active' ? '正常' : '已禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="积分">{{ userInfo.points }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ userInfo.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ userInfo.lastLogin || '暂无记录' }}</el-descriptions-item>
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
  loginForm,
  registerForm,
  handleLogin,
  handleRegister,
  showLoginDialog,
  showRegisterDialog,
  handleLogout
} = useUserInfo()
</script> 