import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { restaurantApi } from '../api'
import { ElMessage } from 'element-plus'

export function useUserRestaurantList() {
  const loading = ref(false)
  const restaurants = ref([])
  const searchQuery = ref('')
  const sortBy = ref('rating-desc')
  const router = useRouter()
  const defaultImage = 'https://via.placeholder.com/300x200'

  const fetchRestaurants = async () => {
    loading.value = true
    try {
      // 使用公开的餐厅列表接口
      const response = await restaurantApi.getList()
      if (response && Array.isArray(response)) {
        restaurants.value = response
      } else if (response && Array.isArray(response.data)) {
        restaurants.value = response.data
      } else {
        restaurants.value = []
      }
      console.log('获取到的餐厅数据:', restaurants.value)
    } catch (error) {
      ElMessage.error('获取餐厅列表失败')
      console.error('Error fetching restaurants:', error)
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    if (!searchQuery.value) {
      fetchRestaurants()
      return
    }
    
    const filtered = restaurants.value.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    restaurants.value = filtered
  }

  const handleSort = () => {
    const sorted = [...restaurants.value]
    if (sortBy.value === 'rating-desc') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (sortBy.value === 'rating-asc') {
      sorted.sort((a, b) => a.rating - b.rating)
    }
    restaurants.value = sorted
  }

  const viewDetails = (restaurantId) => {
    router.push(`/restaurant/${restaurantId}`)
  }

  onMounted(() => {
    fetchRestaurants()
  })

  return {
    loading,
    restaurants,
    searchQuery,
    sortBy,
    defaultImage,
    handleSearch,
    handleSort,
    viewDetails,
  }
} 