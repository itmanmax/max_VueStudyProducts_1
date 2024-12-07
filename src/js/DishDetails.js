import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { dishApi, restaurantApi } from '../api'

export const useDishDetails = () => {
  const route = useRoute()
  const router = useRouter()
  const dish = ref(null)
  const restaurantName = ref('')

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
    try {
      const dishId = route.params.id
      const dishData = await dishApi.getDetail(dishId)
      dish.value = {
        ...dishData,
        rating: parseFloat(dishData.rating) || 0,
        spicyLevel: Number(dishData.spicyLevel) || 0
      }

      // 获取餐厅信息
      if (dishData.restaurantId) {
        try {
          const restaurantData = await restaurantApi.getDetail(dishData.restaurantId)
          restaurantName.value = restaurantData.name
        } catch (error) {
          console.error('获取餐厅信息失败:', error)
          restaurantName.value = '未知餐厅'
        }
      }
    } catch (error) {
      console.error('加载菜品数据失败:', error)
      ElMessage.error('加载菜品数据失败')
      router.back()
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
    formatDate,
    goBack,
    handleImageError,
    getSpicyLevelText
  }
} 