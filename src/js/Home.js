import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import restaurantDetails from '../data/restaurantDetails.json'
import dishes from '../data/dishes.json'

export const useHome = () => {
  const router = useRouter()
  const drawingRestaurant = ref(false)
  const scratchingDish = ref(false)

  // 随机餐厅数据
  const randomRestaurant = ref({})

  // 随机菜品数据
  const randomDish = ref({})

  const canvas = ref(null)
  const scratchCard = ref(null)
  const isScratching = ref(false)
  const isScratched = ref(false)
  let ctx = null

  // 抽签选择餐厅
  const drawLuckyRestaurant = async () => {
    drawingRestaurant.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const restaurantIds = Object.keys(restaurantDetails)
    const randomId = restaurantIds[Math.floor(Math.random() * restaurantIds.length)]
    const restaurant = restaurantDetails[randomId]
    
    randomRestaurant.value = {
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
      rating: restaurant.rating,
      description: restaurant.description
    }
    
    drawingRestaurant.value = false
  }

  // 初始化刮刮卡
  const initScratchCard = () => {
    if (!canvas.value || !scratchCard.value) return
    
    const rect = scratchCard.value.getBoundingClientRect()
    canvas.value.width = rect.width
    canvas.value.height = rect.height
    
    ctx = canvas.value.getContext('2d', { willReadFrequently: true })
    ctx.fillStyle = '#CCCCCC'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    
    ctx.font = '20px Arial'
    ctx.fillStyle = '#666666'
    ctx.textAlign = 'center'
    ctx.fillText('刮一刮，看看今日美味', canvas.value.width / 2, canvas.value.height / 2)
  }

  // 开始刮卡
  const startScratching = (e) => {
    isScratching.value = true
    const touch = e.touches ? e.touches[0] : e
    handleScratch(touch)
  }

  // 刮卡过程
  const scratching = (e) => {
    if (!isScratching.value) return
    const touch = e.touches ? e.touches[0] : e
    handleScratch(touch)
  }

  // 停止刮卡
  const stopScratching = () => {
    isScratching.value = false
  }

  // 检查刮开面积
  const checkScratched = () => {
    const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
    const pixels = imageData.data
    let scratched = 0
    
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) scratched++
    }
    
    const total = pixels.length / 4
    const percentage = (scratched / total) * 100
    
    if (percentage > 60) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
      isScratched.value = true
      canvas.value.style.transition = 'opacity 0.3s ease'
      canvas.value.style.opacity = '0'
      
      setTimeout(() => {
        if (canvas.value) {
          canvas.value.style.display = 'none'
        }
      }, 300)
    } else if (percentage > 50) {
      isScratched.value = true
    }
  }

  // 绘制刮痕
  const handleScratch = (touch) => {
    if (!ctx || !canvas.value) return
    
    const rect = canvas.value.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()
    
    requestAnimationFrame(() => {
      checkScratched()
    })
  }

  // 重置刮刮卡
  const resetScratch = async () => {
    const dishIds = Object.keys(dishes)
    const randomId = dishIds[Math.floor(Math.random() * dishIds.length)]
    const dish = dishes[randomId]
    
    randomDish.value = {
      id: dish.id,
      name: dish.name,
      image: dish.image,
      restaurantName: dish.restaurantName,
      rating: dish.rating,
      price: dish.price,
      description: dish.description
    }
    
    isScratched.value = false
    
    if (canvas.value) {
      canvas.value.style.transition = 'none'
      canvas.value.style.opacity = '1'
      canvas.value.style.display = 'block'
    }
    
    initScratchCard()
  }

  onMounted(() => {
    resetScratch()
  })

  // 跳转到餐厅详情
  const goToRestaurant = (id) => {
    router.push(`/restaurant/${id}`)
  }

  // 跳转到菜品详情
  const goToDish = (id) => {
    router.push(`/dish/${id}`)
  }

  return {
    drawingRestaurant,
    randomRestaurant,
    randomDish,
    canvas,
    scratchCard,
    isScratching,
    isScratched,
    drawLuckyRestaurant,
    initScratchCard,
    startScratching,
    scratching,
    stopScratching,
    resetScratch,
    goToRestaurant,
    goToDish
  }
} 