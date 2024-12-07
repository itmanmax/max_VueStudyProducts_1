<template>
  <el-container>
    <el-header>
      <h2>个人资料</h2>
    </el-header>

    <el-main>
      <div v-if="isLoggedIn" class="user-info">
        <img :src="userInfo.avatar" alt="用户头像" />
        <div>
          <h3>{{ userInfo.username }}</h3>
          <p>{{ userInfo.email }}</p>
          <el-button type="primary" class="edit-button" @click="editDialogVisible = true">编辑资料</el-button>
        </div>
      </div>

      <el-card>
        <h3>基本信息</h3>
        <el-descriptions :column="1">
          <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ userInfo.createdAt }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-main>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="30%"
    >
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditProfile">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { useUserProfile } from '../js/UserProfile' // 引入新的 JS 文件
import '../css/UserProfile.css'  // 引入新的 CSS 文件

const {
  userInfo,
  isLoggedIn,
  editDialogVisible,
  userForm,
  handleEditProfile
} = useUserProfile() // 使用自定义组合函数
</script> 