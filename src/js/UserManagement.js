import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export function useUserManagement() {
  const searchQuery = ref('')
  const filteredUsers = ref([])
  const dialogVisible = ref(false)
  const dialogTitle = ref('创建用户')
  const userForm = ref({
    username: '',
    email: '',
    role: 'user'
  })

  // 模拟用户数据
  const mockUsers = [
    {
      id: 1,
      username: '测试用户1',
      email: 'test1@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-01 12:00:00'
    },
    {
      id: 2,
      username: '管理员',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-02 13:00:00'
    }
  ]

  const fetchUsers = () => {
    // 模拟API调用
    filteredUsers.value = mockUsers
  }

  const showCreateUserDialog = () => {
    dialogTitle.value = '创建用户'
    userForm.value = {
      username: '',
      email: '',
      role: 'user'
    }
    dialogVisible.value = true
  }

  const editUser = (user) => {
    dialogTitle.value = '编辑用户'
    userForm.value = { ...user }
    dialogVisible.value = true
  }

  const handleUserSubmit = () => {
    // 模拟提交
    ElMessage.success(dialogTitle.value === '创建用户' ? '创建成功' : '更新成功')
    dialogVisible.value = false
    fetchUsers()
  }

  const toggleUserStatus = (user) => {
    user.status = user.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`用户状态已${user.status === 'active' ? '启用' : '禁用'}`)
  }

  const showUserDetails = (user) => {
    ElMessage.info('查看用户详情：' + user.username)
  }

  return {
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
  }
} 