<template>
  <el-container class="user-management">
    <el-header>
      <h2>用户管理</h2>
      <el-button type="primary" @click="showCreateUserDialog">
        创建用户
      </el-button>
    </el-header>

    <el-main>
      <!-- 用户列表 -->
      <el-card class="user-list">
        <template #header>
          <div class="card-header">
            <span>用户列表</span>
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户..."
              class="search-input"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </template>

        <el-table :data="filteredUsers" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="role" label="角色" width="100">
            <template #default="{ row }">
              <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
                {{ row.role }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '活跃' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastLogin" label="最后登录" width="180" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" size="small" @click="showUserDetails(row)">
                  详情
                </el-button>
                <el-button type="warning" size="small" @click="editUser(row)">
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="toggleUserStatus(row)"
                >
                  {{ row.status === 'active' ? '禁用' : '启用' }}
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>

    <!-- 创建/编辑用户对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUserSubmit">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useUserManagement } from '../js/UserManagement'
import '../css/UserManagement.css'

const {
  searchQuery,
  filteredUsers,
  dialogVisible,
  dialogTitle,
  userForm,
  fetchUsers,
  showCreateUserDialog,
  editUser,
  handleUserSubmit,
  toggleUserStatus,
  showUserDetails
} = useUserManagement()

onMounted(() => {
  fetchUsers()
})
</script> 