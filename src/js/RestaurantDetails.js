import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { restaurantApi, publicDishApi, publicTagApi } from '../api'

export const useRestaurantDetails = () => {
  const route = useRoute()
  const router = useRouter()
  const restaurant = ref(null)
  const dishes = ref([])
  const restaurantTags = ref([])
  const defaultAvatar = '/images/default-restaurant.jpg'

  // 获取餐厅详情
  const fetchRestaurantDetails = async () => {
    try {
      const restaurantId = route.params.id

      // 获取餐厅详情
      const restaurantResponse = await restaurantApi.getDetail(restaurantId)
      if (restaurantResponse.data.code === 200) {
        restaurant.value = restaurantResponse.data.data
      } else {
        ElMessage.error(restaurantResponse.data.message || '获取餐厅详情失败')
        router.back()
        return
      }

      // 获取餐厅菜品
      try {
        const dishesResponse = await publicDishApi.getByRestaurant(restaurantId)
        if (dishesResponse.data.code === 200) {
          dishes.value = dishesResponse.data.data.map(dish => ({
            ...dish,
            rating: Number(dish.rating) || 0,
            price: Number(dish.price) || 0,
            description: dish.description || '暂无描述'
          }))
        }
      } catch (error) {
        dishes.value = []
      }

      // 获取餐厅标签
      try {
        const tagsResponse = await publicTagApi.getByRestaurant(restaurantId)
        if (tagsResponse.data.code === 200) {
          restaurantTags.value = tagsResponse.data.data
        }
      } catch (error) {
        restaurantTags.value = []
      }

    } catch (error) {
      ElMessage.error('加载餐厅数据失败')
      router.back()
    }
  }

  const goBack = () => router.back()

  const navigateToDish = (dishId) => {
    console.log('正在跳转到菜品详情，dishId:', dishId)
    if (!dishId) {
      ElMessage.warning('菜品信息不完整')
      return
    }
    router.push({
      name: 'DishDetails',
      params: { id: dishId }
    }).catch(err => {
      console.error('路由跳转失败:', err)
      ElMessage.error('页面跳转失败')
    })
  }

  const handleImageError = (e) => {
    console.error('图片加载失败:', e)
  }

  // 根据标签名称返回随机标签类型
  const getTagType = (tagName) => {
    const types = ['primary', 'success', 'warning', 'danger', 'info']
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