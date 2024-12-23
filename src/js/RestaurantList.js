import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { restaurantApi, publicUserApi, restaurantManageApi } from '../api'

export function useRestaurantList() {
  const router = useRouter()
  const loading = ref(false)
  const restaurants = ref([])
  const searchQuery = ref('')
  const sortBy = ref('rating-desc')
  const defaultAvatar = '/images/default-restaurant.jpg'
  const deleteDialogVisible = ref(false)
  const restaurantToDelete = ref(null)
  const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

  // 添加编辑对话框相关的状态
  const editDialogVisible = ref(false)
  const editingRestaurant = ref(null)

  // 添加餐厅对话框相关状态
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const restaurantFormRef = ref(null)
  const restaurantForm = ref({
    name: '',
    address: '',
    rating: 0,
    phone: '',
    business_hours: '',
    image: '',
    cuisine_type: '',
    description: ''
  })

  // 表单验证规则
  const rules = {
    name: [{ required: true, message: '请输入餐厅名称', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
  }

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
        isAdmin.value = response.data.data.includes('ADMIN')
        localStorage.setItem('isAdmin', isAdmin.value.toString())
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

  // 修改编辑餐厅的函数
  const editRestaurant = (restaurant) => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true'
    if (!isAdminUser) {
      ElMessage.warning('只有管理员可以编辑餐厅')
      return
    }
    // 设置要编辑的餐厅数据
    editingRestaurant.value = { ...restaurant }
    // 显示编辑对话框
    editDialogVisible.value = true
  }

  // 添加保存编辑的函数
  const handleEditSubmit = async () => {
    try {
      const response = await restaurantManageApi.update(
        editingRestaurant.value.restaurant_id, 
        editingRestaurant.value
      )
      if (response.data.code === 200) {
        ElMessage.success('更新成功')
        editDialogVisible.value = false
        // 刷新餐厅列表
        await fetchRestaurants()
      } else {
        ElMessage.error(response.data.message || '更新失败')
      }
    } catch (error) {
      console.error('更新餐厅失败:', error)
      ElMessage.error('更新餐厅失败')
    }
  }

  // 处理删除餐厅
  const handleDelete = (id) => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true'
    if (!isAdminUser) {
      ElMessage.warning('只有管理员可以删除餐厅')
      return
    }
    restaurantToDelete.value = id
    deleteDialogVisible.value = true
  }

  // 确认删除餐厅
  const confirmDelete = async () => {
    const isAdminUser = localStorage.getItem('isAdmin') === 'true'
    if (!isAdminUser) {
      ElMessage.warning('只有管理员可以删除餐厅')
      return
    }
    try {
      const response = await restaurantManageApi.delete(restaurantToDelete.value)
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

  // 检查是否有管理员权限
  const checkPermission = () => {
    return localStorage.getItem('isAdmin') === 'true'
  }

  // 显示添加餐厅对话框
  const showAddDialog = () => {
    dialogTitle.value = '添加餐厅'
    restaurantForm.value = {
      name: '',
      address: '',
      rating: 0,
      phone: '',
      business_hours: '',
      image: '',
      cuisine_type: '',
      description: ''
    }
    dialogVisible.value = true
  }

  // 处理提交添加餐厅
  const handleSubmit = async () => {
    if (!restaurantFormRef.value) return
    
    try {
      await restaurantFormRef.value.validate()
      const response = await restaurantManageApi.add(restaurantForm.value)
      
      if (response.data.code === 200) {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        await fetchRestaurants()
      } else {
        ElMessage.error(response.data.message || '添加失败')
      }
    } catch (error) {
      console.error('添加餐厅失败:', error)
      ElMessage.error('添加餐厅失败')
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
    editDialogVisible,
    editingRestaurant,
    isAdmin,
    handleSearch,
    handleSort,
    navigateToDetail,
    editRestaurant,
    handleEditSubmit,
    handleDelete,
    confirmDelete,
    checkPermission,
    dialogVisible,
    dialogTitle,
    restaurantFormRef,
    restaurantForm,
    rules,
    showAddDialog,
    handleSubmit
  }
} 