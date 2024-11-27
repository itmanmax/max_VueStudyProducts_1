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

      <!-- 用户活动日志 -->
      <el-card class="activity-log mt-20">
        <template #header>
          <div class="card-header">
            <span>活动日志</span>
          </div>
        </template>

        <el-timeline>
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :timestamp="activity.time"
            :type="activity.type"
          >
            <div class="activity-content">
              <span class="username">{{ activity.username }}</span>
              <span class="action">{{ activity.action }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
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
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索
const searchQuery = ref('')

// 用户数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-25 10:30:00'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-03-24 15:20:00'
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-03-23 09:15:00'
  }
])

// 活动日志
const recentActivities = ref([
  {
    id: 1,
    username: 'admin',
    action: '创建了新用户 user3',
    time: '2024-03-25 10:30:00',
    type: 'success'
  },
  {
    id: 2,
    username: 'user1',
    action: '更新了个人信息',
    time: '2024-03-24 15:20:00',
    type: 'warning'
  },
  {
    id: 3,
    username: 'admin',
    action: '禁用了用户 user2',
    time: '2024-03-23 09:15:00',
    type: 'danger'
  }
])

// 过滤用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const userForm = ref({
  username: '',
  email: '',
  role: 'user'
})
const editingUserId = ref(null)

// 方法
const showCreateUserDialog = () => {
  dialogTitle.value = '创建用户'
  userForm.value = {
    username: '',
    email: '',
    role: 'user'
  }
  editingUserId.value = null
  dialogVisible.value = true
}

const editUser = (user) => {
  dialogTitle.value = '编辑用户'
  userForm.value = { ...user }
  editingUserId.value = user.id
  dialogVisible.value = true
}

const handleUserSubmit = () => {
  if (editingUserId.value) {
    // 更新用户
    const index = users.value.findIndex(u => u.id === editingUserId.value)
    if (index > -1) {
      users.value[index] = { ...users.value[index], ...userForm.value }
      ElMessage.success('用户更新成功')
    }
  } else {
    // 创建用户
    const newUser = {
      id: users.value.length + 1,
      ...userForm.value,
      status: 'active',
      lastLogin: '从未登录'
    }
    users.value.push(newUser)
    ElMessage.success('用户创建成功')
  }
  dialogVisible.value = false
}

const showUserDetails = (user) => {
  ElMessageBox.alert(
    `用户详细信息：
    ID: ${user.id}
    用户名: ${user.username}
    邮箱: ${user.email}
    角色: ${user.role}
    状态: ${user.status}
    最后登录: ${user.lastLogin}`,
    '用户详情',
    { confirmButtonText: '确定' }
  )
}

const toggleUserStatus = (user) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  ElMessageBox.confirm(
    `确定要${newStatus === 'active' ? '启用' : '禁用'}该用户吗？`,
    '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消' }
  ).then(() => {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value[index].status = newStatus
      ElMessage.success(`用户状态更新为${newStatus === 'active' ? '活跃' : '禁用'}`)
    }
  }).catch(() => {
    ElMessage.info('操作已取消')
  })
}
</script> 