import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { publicUserApi, adminAuthApi } from '../api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 定义默认头像常量
const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const isAdmin = ref(false)
  const userInfo = ref(null)
  const router = useRouter()

  // 初始化状态
  const initializeState = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await publicUserApi.checkRole()
        if (response.data.code === 200) {
          isLoggedIn.value = true
          isAdmin.value = response.data.data.includes('ADMIN')
          localStorage.setItem('isAdmin', isAdmin.value.toString())
          
          // 根据角色获取不同的用户信息
          if (isAdmin.value) {
            await getAdminInfo()
          } else {
            await getUserInfo()
          }
        } else {
          handleLogout()
        }
      } catch (error) {
        handleLogout()
      }
    } else {
      handleLogout()
    }
  }

  // 获取普通用户信息
  const getUserInfo = async () => {
    try {
      const response = await publicUserApi.getProfileDetail()
      if (response.data.code === 200) {
        userInfo.value = {
          ...response.data.data,
          avatar: response.data.data.avatar || DEFAULT_AVATAR,
          bio: response.data.data.bio || '这个人很懒，什么都没写~',
          nickname: response.data.data.nickname || response.data.data.name,
          status: response.data.data.status || 'active',
          lastLogin: response.data.data.lastLogin,
          createdAt: response.data.data.createdAt,
          updatedAt: response.data.data.updatedAt
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 获取管理员信息
  const getAdminInfo = async () => {
    try {
      const response = await adminAuthApi.getInfo()
      if (response.data.code === 200) {
        userInfo.value = {
          ...response.data.data,
          role: 'ADMIN',
          avatar: DEFAULT_AVATAR,
          bio: '系统管理员',
          // 映射字段名
          name: response.data.data.name || '系统管理员',
          email: response.data.data.email,
          status: response.data.data.status === 1 ? 'active' : 'inactive',
          lastLogin: response.data.data.lastLogin,
          createdAt: response.data.data.createdAt
        }
      }
    } catch (error) {
      console.error('获取管理员信息失败:', error)
      userInfo.value = {
        name: '系统管理员',
        role: 'ADMIN',
        avatar: DEFAULT_AVATAR,
        bio: '系统管理员',
        email: 'admin@example.com',
        status: 'active'
      }
    }
  }

  // 处理登录
  const handleLogin = async (loginData) => {
    try {
      const response = await publicUserApi.login(loginData)
      if (response.data.code === 200) {
        localStorage.setItem('token', response.data.data)
        isLoggedIn.value = true
        
        await getUserInfo()
        
        await initializeState()
        ElMessage.success('登录成功')
        return true
      } else {
        ElMessage.error(response.data.message || '登录失败')
        return false
      }
    } catch (error) {
      ElMessage.error('登录失败：' + (error.response?.data?.message || '未知错误'))
      return false
    }
  }

  // 处理登
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    isLoggedIn.value = false
    isAdmin.value = false
    userInfo.value = null
    ElMessage.success('已退出登录')
  }

  // 处理注册
  const handleRegister = async (registerData) => {
    try {
      const response = await publicUserApi.register(registerData);
      if (response.data.code === 200) {
        ElMessage.success('注册成功');
        return true;
      } else {
        ElMessage.error(response.data.message || '注册失败');
        return false;
      }
    } catch (error) {
      ElMessage.error('注册失败：' + (error.response?.data?.message || '未知错误'));
      return false;
    }
  };

  // 处理管理员登录
  const handleAdminLogin = async (loginData) => {
    try {
      const response = await adminAuthApi.login({
        username: loginData.username,
        password: loginData.password
      })

      if (response.data.code === 200) {
        localStorage.setItem('token', response.data.data)
        isLoggedIn.value = true
        isAdmin.value = true
        localStorage.setItem('isAdmin', 'true')

        // 获取管理员信息
        await getAdminInfo()
        ElMessage.success('管理员登录成功')
        
        // 登录成功后跳转到管理员页面
        router.push('/admin')
        return true
      } else {
        ElMessage.error(response.data.message || '登录失败')
        return false
      }
    } catch (error) {
      console.error('管理员登录失败:', error)
      ElMessage.error('登录失败：' + (error.response?.data?.message || '未知错误'))
      return false
    }
  }

  // 使用 computed 来派生状态
  const isLoggedInComputed = computed(() => isLoggedIn.value)
  const isAdminComputed = computed(() => isAdmin.value)

  return {
    isLoggedIn: isLoggedInComputed,
    isAdmin: isAdminComputed,
    userInfo,
    initializeState,
    handleLogin,
    handleLogout,
    getUserInfo,
    handleRegister,
    handleAdminLogin,
    DEFAULT_AVATAR,  // 导出默认头像常量
    getAdminInfo,  // 如果需要在其他地方使用
  }
}) 