import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '../api'

export function useUserProfile() {
  const router = useRouter()
  const userInfo = ref({})
  const isLoggedIn = ref(false)
  const editDialogVisible = ref(false)
  const userForm = ref({
    username: '',
    email: ''
  })

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }
      
      const data = await userApi.getUserProfile()
      userInfo.value = data
      isLoggedIn.value = true
      userForm.value = {
        username: data.username,
        email: data.email
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
      ElMessage.error('获取用户资料失败')
      router.push('/')
    }
  }

  const handleEditProfile = async () => {
    try {
      await userApi.updateUserProfile(userForm.value)
      ElMessage.success('更新成功')
      editDialogVisible.value = false
      await fetchUserProfile()
    } catch (error) {
      ElMessage.error('更新失败')
    }
  }

  onMounted(() => {
    fetchUserProfile()
  })

  return {
    userInfo,
    isLoggedIn,
    editDialogVisible,
    userForm,
    handleEditProfile
  }
} 