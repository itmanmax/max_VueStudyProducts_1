import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { restaurantApi, dishApi, restaurantTagApi } from '../api'

export const useRestaurantDetails = () => {
  const route = useRoute()
  const router = useRouter()
  const restaurant = ref(null)
  const dishes = ref([])
  const restaurantTags = ref([])
  const defaultAvatar = '/Users/default-avatar.jpg'

  // 获取餐厅详情
  const fetchRestaurantDetails = async () => {
    try {
      const restaurantId = route.params.id
      const restaurantData = await restaurantApi.getDetail(restaurantId)
      const dishesData = await dishApi.getByRestaurant(restaurantId)
      const tagsData = await restaurantTagApi.getByRestaurant(restaurantId)

      restaurant.value = restaurantData
      dishes.value = dishesData
      restaurantTags.value = tagsData
    } catch (error) {
      console.error('加载餐厅数据失败:', error)
      ElMessage.error('加载餐厅数据失败')
      router.back()
    }
  }

  const goBack = () => router.back()

  const navigateToDish = (dishId) => {
    router.push(`/dish/${dishId}`)
  }

  const handleImageError = (e) => {
    console.error('图片加载失败:', e)
  }

  // 根据标签名称返回随机标签类型
  const getTagType = (tagName) => {
    const types = ['', 'success', 'warning', 'danger', 'info']
    const hash = tagName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    return types[Math.abs(hash) % types.length]
  }

  onMounted(() => {
    fetchRestaurantDetails()
  })

  return {
    restaurant,
    dishes,
    restaurantTags,
    defaultAvatar,
    goBack,
    navigateToDish,
    handleImageError,
    getTagType
  }
} 