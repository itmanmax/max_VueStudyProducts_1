import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '../api'

export function useUserInfo() {
  const router = useRouter()
  const isLoggedIn = ref(localStorage.getItem('token') !== null)
  const userInfo = ref({})
  
  // 对话框显示状态
  const loginDialogVisible = ref(false)
  const registerDialogVisible = ref(false)
  
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
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getProfile()
      const { code, data } = response.data
      if (code === 200) {
        userInfo.value = {
          username: data.name,
          email: data.email,
          createdAt: data.createdAt,
          role: data.role,
          status: data.status,
          points: data.points,
          lastLogin: data.lastLogin,
          avatar: data.avatar,
          bio: data.bio
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  }

  // 处理登录
  const handleLogin = async () => {
    try {
      const response = await userApi.login(loginForm.value)
      const { code, message, data } = response.data
      if (code === 200) {
        localStorage.setItem('token', data)
        isLoggedIn.value = true
        loginDialogVisible.value = false
        ElMessage.success('登录成功')
        await fetchUserInfo()
        router.push('/user')
      } else {
        ElMessage.error(message || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      ElMessage.error('登录失败：' + (error.response?.data?.message || '未知错误'))
    }
  }
  
  // 处理注册
  const handleRegister = async () => {
    try {
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return
      }
      await userApi.register(registerForm.value)
      registerDialogVisible.value = false
      ElMessage.success('注册成功，请登录')
      loginDialogVisible.value = true
    } catch (error) {
      ElMessage.error('注册失败：' + error.message)
    }
  }
  
  const showLoginDialog = () => {
    loginDialogVisible.value = true
  }
  
  const showRegisterDialog = () => {
    registerDialogVisible.value = true
  }
  
  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    userInfo.value = {}
    ElMessage.success('已退出登录')
    router.push('/')
  }

  // 在组件挂载时获取用户信息
  onMounted(() => {
    if (isLoggedIn.value) {
      fetchUserInfo()
    }
  })
  
  return {
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
  }
} 
