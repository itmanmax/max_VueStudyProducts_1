import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { restaurantApi } from '../api'

export const useRestaurantList = () => {
  const router = useRouter()
  const loading = ref(false)
  const restaurants = ref([])
  const searchQuery = ref('')
  const sortBy = ref('rating-desc')
  const defaultImage = '/path/to/default/image.jpg'

  // 表单相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('添加餐厅')
  const restaurantFormRef = ref(null)
  const restaurantForm = ref({
    name: '',
    address: '',
    rating: 0,
    description: '',
    phone: '',
    business_hours: '',
    image: '',
    cuisine_type: '',
    restaurant_id: null
  })

  // 表单验证规则
  const rules = {
    name: [{ required: true, message: '请输入餐厅名称', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    rating: [{ required: true, message: '请选择评分', trigger: 'change' }]
  }

  // 获取餐厅列表
  const fetchRestaurants = async () => {
    loading.value = true
    try {
      const data = await restaurantApi.getList()
      console.log('API Response:', data)

      if (Array.isArray(data)) {
        restaurants.value = data.map(restaurant => ({
          ...restaurant,
          restaurant_id: restaurant.restaurantId,
          rating: Number(restaurant.rating) || 0,
          description: restaurant.description || '暂无描述',
          phone: restaurant.phone || '暂无电话',
          business_hours: restaurant.businessHours || '暂无营业时间信息',
          image: restaurant.image || defaultImage,
          cuisine_type: restaurant.cuisineType || '暂无分类'
        }))
      } else {
        ElMessage.warning('获取数据格式异常')
        restaurants.value = []
      }
    } catch (error) {
      console.error('获取餐厅列表失败:', error)
      ElMessage.error(`获具体餐厅列表失败: ${error.message || '未知错误'}`)
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
      const searchData = Array.isArray(response) ? response : []
      restaurants.value = searchData.map(restaurant => ({
        ...restaurant,
        rating: Number(restaurant.rating) || 0,
        restaurant_id: restaurant.restaurant_id || restaurant.id
      }))
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

  // 查看详情
  const viewDetails = (id) => {
    router.push(`/restaurant/${id}`)
  }

  // 显示添加对话框
  const showAddDialog = () => {
    dialogTitle.value = '添加餐厅'
    restaurantForm.value = {
      name: '',
      address: '',
      rating: 0,
      description: '',
      phone: '',
      business_hours: '',
      image: '',
      cuisine_type: '',
      restaurant_id: null
    }
    dialogVisible.value = true
  }

  // 编辑餐厅
  const editRestaurant = (restaurant) => {
    dialogTitle.value = '编辑餐厅'
    restaurantForm.value = {
      restaurant_id: restaurant.restaurantId,
      name: restaurant.name,
      address: restaurant.address,
      rating: Number(restaurant.rating) || 0,
      description: restaurant.description || '',
      phone: restaurant.phone || '',
      business_hours: restaurant.businessHours || '',
      image: restaurant.image || '',
      cuisine_type: restaurant.cuisineType || ''
    }
    dialogVisible.value = true
  }

  // 删除餐厅
  const deleteRestaurant = async (id) => {
    try {
      await ElMessageBox.confirm('确定要删除这个餐厅吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await restaurantApi.delete(id)
      ElMessage.success('删除成功')
      await fetchRestaurants()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除餐厅失败:', error)
      }
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!restaurantFormRef.value) return

    try {
      await restaurantFormRef.value.validate()

      const submitData = {
        name: restaurantForm.value.name,
        address: restaurantForm.value.address,
        rating: Number(restaurantForm.value.rating) || 0,
        phone: restaurantForm.value.phone,
        businessHours: restaurantForm.value.business_hours,
        image: restaurantForm.value.image,
        cuisineType: restaurantForm.value.cuisine_type,
        description: restaurantForm.value.description
      }

      if (restaurantForm.value.restaurant_id) {
        const id = restaurantForm.value.restaurant_id
        await restaurantApi.update(id, submitData)
        ElMessage.success('编辑成功')
      } else {
        await restaurantApi.create(submitData)
        ElMessage.success('添加成功')
      }

      dialogVisible.value = false
      await fetchRestaurants()
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('请检查表单填写是否正确')
    }
  }

  // 权限检查
  const checkPermission = () => {
    return true // 暂时默认都有权限
  }

  // 初始化
  onMounted(() => {
    fetchRestaurants()
  })

  return {
    loading,
    restaurants,
    searchQuery,
    sortBy,
    dialogVisible,
    dialogTitle,
    restaurantFormRef,
    restaurantForm,
    rules,
    fetchRestaurants,
    handleSearch,
    handleSort,
    viewDetails,
    showAddDialog,
    editRestaurant,
    deleteRestaurant,
    handleSubmit,
    checkPermission
  }
} 