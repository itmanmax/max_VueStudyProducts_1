import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { publicDishApi, restaurantApi } from '../api'

export const useDishDetails = () => {
  const route = useRoute()
  const router = useRouter()
  const dish = ref(null)
  const restaurantName = ref('')
  const loading = ref(false)

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '暂无'
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 获取菜品详情
  const fetchDishDetails = async () => {
    loading.value = true
    try {
      const dishId = route.params.id
      if (!dishId) {
        ElMessage.error('无效的菜品ID')
        router.back()
        return
      }

      const response = await publicDishApi.getDetail(dishId)
      if (response.data.code === 200) {
        const dishData = response.data.data
        dish.value = {
          ...dishData,
          rating: parseFloat(dishData.rating) || 0,
          price: Number(dishData.price) || 0,
          spicyLevel: Number(dishData.spicyLevel) || 0,
          description: dishData.description || '暂无描述'
        }

        // 获取餐厅信息
        if (dishData.restaurantId) {
          try {
            const restaurantResponse = await restaurantApi.getDetail(dishData.restaurantId)
            if (restaurantResponse.data.code === 200) {
              restaurantName.value = restaurantResponse.data.data.name
            } else {
              restaurantName.value = '未知餐厅'
            }
          } catch (error) {
            console.error('获取餐厅信息失败:', error)
            restaurantName.value = '未知餐厅'
          }
        }
      } else {
        ElMessage.error(response.data.message || '获取菜品详情失败')
        router.back()
      }
    } catch (error) {
      console.error('加载菜品数据失败:', error)
      ElMessage.error('加载菜品数据失败')
      router.back()
    } finally {
      loading.value = false
    }
  }

  // 返回上一页
  const goBack = () => {
    router.back()
  }

  // 图片加载失败处理
  const handleImageError = (e) => {
    console.error('图片加载失败:', e)
  }

  // 获取辣度等级文字说明
  const getSpicyLevelText = (level) => {
    const levels = {
      0: '不辣',
      1: '微辣',
      2: '中辣',
      3: '特辣',
      4: '麻辣',
      5: '变态辣'
    }
    return levels[level] || '未知'
  }

  // 初始化
  onMounted(() => {
    fetchDishDetails()
  })

  return {
    dish,
    restaurantName,
    loading,
    formatDate,
    goBack,
    handleImageError,
    getSpicyLevelText
  }
} 