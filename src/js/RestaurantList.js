import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { restaurantApi, publicUserApi } from '../api'

export function useRestaurantList() {
  const router = useRouter()
  const loading = ref(false)
  const restaurants = ref([])
  const searchQuery = ref('')
  const sortBy = ref('rating-desc')
  const defaultAvatar = '/images/default-restaurant.jpg'
  const deleteDialogVisible = ref(false)
  const restaurantToDelete = ref(null)
  const isAdmin = ref(false)

  // 检查用户权限
  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        isAdmin.value = false
        return
      }
      const response = await publicUserApi.checkRole()
      if (response.data.code === 200) {
        isAdmin.value = response.data.data.role === 'ADMIN'
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      isAdmin.value = false
    }
  }

  // 获取餐厅列表
  const fetchRestaurants = async () => {
    loading.value = true
    try {
      const response = await restaurantApi.getList()
      if (response.data.code === 200) {
        restaurants.value = response.data.data.map(restaurant => ({
          ...restaurant,
          restaurant_id: restaurant.restaurantId,
          rating: Number(restaurant.rating) || 0,
          description: restaurant.description || '暂无描述',
          phone: restaurant.phone || '暂无电话',
          business_hours: restaurant.businessHours || '暂无营业时间信息',
          image: restaurant.image || defaultAvatar,
          cuisine_type: restaurant.cuisineType || '暂无分类'
        }))
      } else {
        ElMessage.error(response.data.message || '获取餐厅列表失败')
      }
    } catch (error) {
      console.error('获取餐厅列表失败:', error)
      ElMessage.error('获取餐厅列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索餐厅
  const handleSearch = async () => {
    if (!searchQuery.value) {
      await fetchRestaurants()
      return
    }
    loading.value = true
    try {
      const response = await restaurantApi.search({ query: searchQuery.value })
      if (response.data.code === 200) {
        restaurants.value = response.data.data.map(restaurant => ({
          ...restaurant,
          restaurant_id: restaurant.restaurantId,
          rating: Number(restaurant.rating) || 0
        }))
      } else {
        ElMessage.error(response.data.message || '搜索失败')
      }
    } catch (error) {
      console.error('搜索餐厅失败:', error)
      ElMessage.error('搜索餐厅失败')
    } finally {
      loading.value = false
    }
  }

  // 排序处理
  const handleSort = () => {
    restaurants.value.sort((a, b) => {
      const ratingA = Number(a.rating) || 0
      const ratingB = Number(b.rating) || 0
      return sortBy.value === 'rating-desc' ? ratingB - ratingA : ratingA - ratingB
    })
  }

  // 导航到餐厅详情页面
  const navigateToDetail = (id) => {
    router.push(`/restaurant/${id}`)
  }

  // 导航到编辑餐厅页面
  const navigateToEdit = (id) => {
    if (!isAdmin.value) {
      ElMessage.warning('只有管理员可以编辑餐厅')
      return
    }
    router.push(`/restaurant/edit/${id}`)
  }

  // 处理删除餐厅
  const handleDelete = (id) => {
    if (!isAdmin.value) {
      ElMessage.warning('只有管理员可以删除餐厅')
      return
    }
    restaurantToDelete.value = id
    deleteDialogVisible.value = true
  }

  // 确认删除餐厅
  const confirmDelete = async () => {
    if (!isAdmin.value) {
      ElMessage.warning('只有管理员可以删除餐厅')
      return
    }
    try {
      const response = await restaurantApi.delete(restaurantToDelete.value)
      if (response.data.code === 200) {
        ElMessage.success('删除成功')
        await fetchRestaurants()
      } else {
        ElMessage.error(response.data.message || '删除失败')
      }
    } catch (error) {
      console.error('删除餐厅失败:', error)
      ElMessage.error('删除餐厅失败')
    } finally {
      deleteDialogVisible.value = false
      restaurantToDelete.value = null
    }
  }

  onMounted(async () => {
    await checkUserRole()
    await fetchRestaurants()
  })

  return {
    loading,
    restaurants,
    searchQuery,
    sortBy,
    defaultAvatar,
    deleteDialogVisible,
    isAdmin,
    handleSearch,
    handleSort,
    navigateToDetail,
    navigateToEdit,
    handleDelete,
    confirmDelete
  }
} 