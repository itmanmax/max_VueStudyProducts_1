import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export function useUserInfo() {
  const router = useRouter()
  const isLoggedIn = ref(localStorage.getItem('token') !== null)
  const userInfo = ref({
    username: '测试用户',
    email: 'test@example.com',
    createdAt: '2024-01-01'
  })
  
  // 对话框显示状态
  const loginDialogVisible = ref(false)
  const registerDialogVisible = ref(false)
  const adminLoginDialogVisible = ref(false)

  // 表单数据
  const loginForm = ref({
    email: '',
    password: ''
  })

  const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const adminLoginForm = ref({
    username: '',
    password: ''
  })

  // 处理登录
  const handleLogin = async () => {
    try {
      // 模拟登录成功
      localStorage.setItem('token', 'user-token')
      localStorage.setItem('isAdmin', 'false')
      isLoggedIn.value = true
      loginDialogVisible.value = false
      ElMessage.success('登录成功')
      router.push('/user')
    } catch (error) {
      ElMessage.error('登录失败')
    }
  }

  // 处理管理员登录
  const handleAdminLogin = async () => {
    try {
      if (adminLoginForm.value.username === 'admin' && 
          adminLoginForm.value.password === 'admin') {
        localStorage.setItem('token', 'admin-token')
        localStorage.setItem('isAdmin', 'true')
        isLoggedIn.value = true
        adminLoginDialogVisible.value = false
        ElMessage.success('管理员登录成功')
        router.push('/admin/restaurants')
      } else {
        ElMessage.error('管理员账号或密码错误')
      }
    } catch (error) {
      ElMessage.error('管理员登录失败')
    }
  }

  // 处理注册
  const handleRegister = async () => {
    try {
      // 模拟注册成功
      registerDialogVisible.value = false
      ElMessage.success('注册成功，请登录')
      loginDialogVisible.value = true
    } catch (error) {
      ElMessage.error('注册失败')
    }
  }

  const showLoginDialog = () => {
    loginDialogVisible.value = true
  }

  const showRegisterDialog = () => {
    registerDialogVisible.value = true
  }

  const showAdminLoginDialog = () => {
    adminLoginDialogVisible.value = true
  }

  // 添加退出登录方法
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    isLoggedIn.value = false
    ElMessage.success('已退出登录')
    router.push('/')
  }

  return {
    isLoggedIn,
    userInfo,
    loginDialogVisible,
    registerDialogVisible,
    adminLoginDialogVisible,
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
  }
} 
