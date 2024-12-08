import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userApi } from '../api'

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export function useUserProfile() {
  const router = useRouter()
  const userProfile = ref({})
  const loading = ref(false)

  const fetchUserProfile = async () => {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      
      const response = await userApi.getProfile()
      if (response.data.code === 200) {
        userProfile.value = response.data.data
      } else {
        ElMessage.error(response.data.message || '获取用户资料失败')
      }
    } catch (error) {
      console.error('获取用户资料失败:', error)
      ElMessage.error('获取用户资料失败')
    } finally {
      loading.value = false
    }
  }

  const navigateToEdit = () => {
    router.push('/user/edit')
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  onMounted(() => {
    fetchUserProfile()
  })

  return {
    userProfile,
    loading,
    navigateToEdit,
    formatDate
  }
} 