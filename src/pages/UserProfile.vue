<template>
  <el-container>
    <el-header>
      <h2>个人资料</h2>
    </el-header>

    <el-main>
      <div v-if="isLoggedIn" class="user-info">
        <div class="avatar-uploader">
          <el-avatar 
            :size="100" 
            :src="userInfo.avatar" 
            :alt="userInfo.name"
          />
        </div>
        <div class="user-details">
          <h3>{{ userInfo.name }}</h3>
          <p class="email">{{ userInfo.email }}</p>
          <p class="bio">{{ userInfo.bio || '这个人很懒，什么都没写~' }}</p>
          <el-button type="primary" @click="editDialogVisible = true">
            编辑资料
          </el-button>
        </div>
      </div>

      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>详细信息</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户ID">{{ userInfo.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ userInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userInfo.nickname || '未设置' }}</el-descriptions-item>
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
          <el-descriptions-item label="注册时间">{{ formatDateTime(userInfo.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ userInfo.lastLogin ? formatDateTime(userInfo.lastLogin) : '暂无记录' }}</el-descriptions-item>
          <el-descriptions-item label="最后更新">{{ formatDateTime(userInfo.updatedAt) }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-main>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="500px"
    >
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="userForm.bio"
            type="textarea"
            :rows="4"
            placeholder="写点什么介绍一下自己吧..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { useUserProfile } from '../js/UserProfile'
import '../css/UserProfile.css'

const {
  userInfo,
  isLoggedIn,
  editDialogVisible,
  userForm,
  handleEditProfile,
  formatDateTime
} = useUserProfile()
</script> 