<template>
  <div class="home-container">
    <div class="background-gradient"></div>
    <div class="overlay"></div>
    <div class="content-wrapper">
      <div class="header-section">
        <h1 class="title">惊喜一餐-zhn</h1>
        <div class="divider">
          <span class="line"></span>
          <span class="dot"></span>
          <span class="line"></span>
        </div>
        <p class="subtitle">臻选星级美馔 · 品鉴非凡味境</p>
      </div>
      
      <div class="recommendation-section">
        <h2 class="section-title">今日推荐</h2>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="lucky-draw-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>今日餐馆</span>
                  <el-button type="primary" @click="drawLuckyRestaurant" :loading="drawingRestaurant">
                    <el-icon><Collection /></el-icon>
                    抽个签
                  </el-button>
                </div>
              </template>
              
              <div class="lucky-draw-content" v-if="!drawingRestaurant && randomRestaurant.id">
                <div class="lucky-paper">
                  <div class="lucky-result">
                    <el-image 
                      :src="randomRestaurant.image" 
                      fit="cover" 
                      class="restaurant-image"
                      @click="goToRestaurant(randomRestaurant.id)"
                    />
                    <div class="restaurant-info">
                      <h3>{{ randomRestaurant.name }}</h3>
                      <el-rate v-model="randomRestaurant.rating" disabled show-score />
                      <p class="description">{{ randomRestaurant.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="drawingRestaurant" class="drawing-animation">
                <el-icon class="rotating-icon"><Collection /></el-icon>
                <p>正在求签...</p>
              </div>
              <div v-else class="empty-draw">
                <el-icon><Collection /></el-icon>
                <p>点击抽签，寻找你的缘分餐厅</p>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="scratch-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>今日美味</span>
                  <el-button type="primary" @click="resetScratch" v-if="isScratched">
                    <el-icon><Refresh /></el-icon>
                    换一张
                  </el-button>
                </div>
              </template>
              
              <div class="scratch-content" ref="scratchCard">
                <canvas 
                  ref="canvas" 
                  class="scratch-canvas"
                  @mousedown.passive="startScratching"
                  @mousemove.passive="scratching"
                  @mouseup.passive="stopScratching"
                  @mouseleave.passive="stopScratching"
                  @touchstart.passive="startScratching"
                  @touchmove.passive="scratching"
                  @touchend.passive="stopScratching"
                ></canvas>
                
                <div class="lucky-draw-content">
                  <div class="lucky-paper">
                    <div class="lucky-result">
                      <el-image 
                        :src="randomDish.image" 
                        fit="cover" 
                        class="dish-image"
                        @click="goToDish(randomDish.id)"
                      />
                      <div class="dish-info">
                        <h3>{{ randomDish.name }}</h3>
                        <p class="restaurant-name">来自：{{ randomDish.restaurantName }}</p>
                        <el-rate v-model="randomDish.rating" disabled show-score />
                        <p class="description">{{ randomDish.description }}</p>
                        <div class="price">¥{{ randomDish.price }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <div class="features-section">
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="feature-card">
              <el-icon size="36"><Dish /></el-icon>
              <h3>星级美馔</h3>
              <p>严选米其林星级餐厅，为您呈现极致美食体验</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <el-icon size="36"><Timer /></el-icon>
              <h3>尊享预订</h3>
              <p>专属预订服务，为您保留最佳用餐时段</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <el-icon size="36"><Star /></el-icon>
              <h3>品鉴评价</h3>
              <p>美食鉴赏家真实点评，打造完美用餐体验</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="bottom-link">
        <a href="http://home.maxtral.fun" target="_blank">MAX主页</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Dish, Timer, Star, Collection, 
  Refresh, Picture 
} from '@element-plus/icons-vue'
import restaurantDetails from '../data/restaurantDetails.json'
import dishes from '../data/dishes.json'

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
  
  // 模拟抽签动画
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
  
  // 添加 willReadFrequently 属性以优化性能
  ctx = canvas.value.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#CCCCCC'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 添加提示文字
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
  
  if (percentage > 60) {  // 当刮开面积超过60%时
    // 清除剩余遮罩
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    isScratched.value = true
    
    // 添加完成动画
    canvas.value.style.transition = 'opacity 0.3s ease'
    canvas.value.style.opacity = '0'
    
    // 移除画布
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
  // 重新生成随机菜品
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
  
  // 重置刮刮卡状态
  isScratched.value = false
  
  // 重置画布样式
  if (canvas.value) {
    canvas.value.style.transition = 'none'
    canvas.value.style.opacity = '1'
    canvas.value.style.display = 'block'
  }
  
  initScratchCard()
}

onMounted(() => {
  // 初始化随机菜品和刮刮卡
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
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0.95;
  z-index: -2;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: -1;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  flex: 1;
}

.header-section {
  text-align: center;
  margin-top: 20px;
  color: #ffffff;
}

.title {
  font-size: 4.5rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto;
  width: 300px;
}

.line {
  height: 2px;
  width: 100px;
  background: rgba(255, 255, 255, 0.3);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4fd1c5;
  margin: 0 15px;
  box-shadow: 0 0 10px rgba(79, 209, 197, 0.5);
}

.subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 6px;
  opacity: 0.9;
  margin-top: 30px;
  font-family: "Noto Serif SC", serif;
}

.recommendation-section {
  margin: 40px 0;
}

.section-title {
  color: #ffffff;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.lucky-draw-card, .scratch-card {
  height: 100%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  backdrop-filter: blur(10px);
}

.lucky-draw-card:hover, .scratch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(42, 157, 143, 0.2);
}

.restaurant-image, .dish-image {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.restaurant-image:hover, .dish-image:hover {
  transform: scale(1.02);
}

.restaurant-info, .dish-info {
  padding: 20px;
}

.restaurant-info h3, .dish-info h3 {
  color: #2a9d8f;
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.restaurant-name {
  color: #4a5568;
  margin: 10px 0;
  font-size: 1.1rem;
}

.description {
  color: #4a5568;
  margin: 15px 0;
  line-height: 1.6;
}

.price {
  color: #2a9d8f;
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 10px;
}

.features-section {
  margin: 40px 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(42, 157, 143, 0.2);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin: 20px 0 15px;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--secondary-color);
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

.feature-card .el-icon {
  color: #2a9d8f;
  font-size: 36px;
}

.bottom-link {
  margin-top: 40px;
  padding: 15px 0;
  font-size: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 8px;
}

.bottom-link a {
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 4px;
}

.bottom-link a:hover {
  background: rgba(255, 255, 255, 0.2);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

:deep(.el-rate__icon) {
  color: var(--secondary-color) !important;
  margin-right: 4px;
}

:deep(.el-button--text) {
  color: var(--secondary-color);
}

:deep(.el-button--text:hover) {
  color: #38b2a4;
}

.drawing-animation, .scratching-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  
  .rotating-icon {
    font-size: 48px;
    color: var(--secondary-color);
    animation: rotate 2s linear infinite;
  }
  
  p {
    margin-top: 20px;
    color: var(--secondary-color);
    font-size: 18px;
  }
}

.empty-draw, .empty-scratch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #909399;
  
  .el-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }
}

.lucky-paper, .scratch-result {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform-origin: top center;
  animation: paperDrop 0.5s ease-out;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes paperDrop {
  from {
    transform: translateY(-20px) rotate(-2deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) rotate(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.4rem;
    letter-spacing: 4px;
  }
  
  .divider {
    width: 200px;
  }
  
  .line {
    width: 60px;
  }
}

.scratch-content {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.scratch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.scratch-result {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lucky-paper, .scratch-result .lucky-result {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  animation: paperDrop 0.5s ease-out;
}

.dish-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 15px;
}

.dish-info {
  text-align: left;

  h3 {
    color: var(--secondary-color);
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  .restaurant-name {
    color: #666;
    font-size: 1rem;
    margin-bottom: 8px;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 10px 0;
  }

  .price {
    color: var(--secondary-color);
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 10px;
  }
}

/* 确保评分显示正确 */
:deep(.el-rate) {
  display: inline-flex;
  align-items: center;
  margin: 8px 0;
}

:deep(.el-rate__text) {
  color: var(--secondary-color);
  margin-left: 8px;
}

.lucky-draw-content, .scratch-content {
  padding: 20px;
  height: 100%;
  min-height: 400px;
}

.lucky-paper {
  background: transparent;
  box-shadow: none;
  height: 100%;
  padding: 0;
}

.lucky-result {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  box-shadow: none;
}

.dish-image, .restaurant-image {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.dish-info, .restaurant-info {
  flex: 1;
  padding: 0;
  
  h3 {
    color: var(--secondary-color);
    font-size: 1.4rem;
    margin-bottom: 12px;
  }
  
  .restaurant-name {
    color: #666;
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  .description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 12px 0;
  }
  
  .price {
    color: var(--secondary-color);
    font-size: 1.3rem;
    font-weight: bold;
    margin-top: 12px;
  }
}

/* 评分样式修复 */
:deep(.el-rate) {
  display: inline-flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
}

:deep(.el-rate__icon) {
  font-size: 18px;
  margin-right: 6px;
}

:deep(.el-rate__text) {
  color: var(--secondary-color);
  font-size: 14px;
  margin-left: 8px;
}

.scratch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s ease;
  border-radius: 0;  /* 移除边框圆角 */
}

/* 移除多余的边框和阴影 */
.scratch-content {
  border: none;
  box-shadow: none;
  background: transparent;
}

.lucky-draw-card, .scratch-card {
  background: rgba(255, 255, 255, 0.95);
  border: none !important;
  box-shadow: none;
}
</style> 