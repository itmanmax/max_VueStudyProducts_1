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
            <el-card class="restaurant-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>精选餐厅</span>
                  <el-button text @click="refreshRestaurant">换一个</el-button>
                </div>
              </template>
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
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="dish-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>特色美食</span>
                  <el-button text @click="refreshDish">换一个</el-button>
                </div>
              </template>
              <el-image 
                :src="randomDish.image" 
                fit="cover" 
                class="dish-image"
                @click="goToDish(randomDish.id)"
              />
              <div class="dish-info">
                <h3>{{ randomDish.name }}</h3>
                <p class="restaurant-name">{{ randomDish.restaurantName }}</p>
                <el-rate v-model="randomDish.rating" disabled show-score />
                <p class="description">{{ randomDish.description }}</p>
                <div class="price">¥{{ randomDish.price }}</div>
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
import { Dish, Timer, Star } from '@element-plus/icons-vue'

const router = useRouter()
const randomRestaurant = ref({})
const randomDish = ref({})

// 高评分餐厅数据
const topRestaurants = ref([
  {
    id: 1,
    name: '星光食府',
    rating: 4.9,
    image: '/Restaurant/Restaurant1.png',
    description: '米其林三星餐厅，以创新法式料理闻名'
  },
  {
    id: 2,
    name: '江南雅筑',
    rating: 4.8,
    image: '/Restaurant/Restaurant2.png',
    description: '传统与现代融合的江南菜，米其林二星'
  },
  {
    id: 3,
    name: '和风物语',
    rating: 4.7,
    image: '/Restaurant/Restaurant3.png',
    description: '正统日式料理，米其林一星'
  }
])

// 随机推荐菜品
const allDishes = [
  {
    id: 1,
    name: '松露和牛饭',
    restaurantName: '星光食府',
    rating: 4.9,
    price: 688,
    image: '/foods/food1.jpg',
    description: '精选A5和牛配以黑松露，口感细腻，香气四溢'
  },
  {
    id: 2,
    name: '蟹粉狮子头',
    restaurantName: '江南雅筑',
    rating: 4.8,
    price: 288,
    image: '/foods/food2.jpg',
    description: '蟹粉与猪肉的完美结合，鲜美多汁'
  },
  {
    id: 3,
    name: '炙烤鳗鱼',
    restaurantName: '和风物语',
    rating: 4.7,
    price: 366,
    image: '/foods/food3.jpg',
    description: '秘制酱料腌制，炭火烤制，口感细腻'
  },
  {
    id: 4,
    name: '龙虾泡饭',
    restaurantName: '星光食府',
    rating: 4.9,
    price: 598,
    image: '/foods/food4.jpg',
    description: '新鲜龙虾配以秘制高汤，鲜美浓郁'
  },
  {
    id: 5,
    name: '松茸菌菇汤',
    restaurantName: '和风物语',
    rating: 4.8,
    price: 268,
    image: '/foods/food5.jpg',
    description: '精选松茸与各类菌菇，浓汤醇厚'
  },
  {
    id: 6,
    name: '北京烤鸭',
    restaurantName: '江南雅筑',
    rating: 4.7,
    price: 328,
    image: '/foods/food6.jpg',
    description: '传统工艺制作，皮酥肉嫩'
  },
  {
    id: 7,
    name: '清蒸大闸蟹',
    restaurantName: '星光食府',
    rating: 4.9,
    price: 488,
    image: '/foods/food7.jpg',
    description: '阳澄湖大闸蟹，蟹黄饱满，肉质鲜美'
  },
  {
    id: 8,
    name: '和牛寿喜烧',
    restaurantName: '和风物语',
    rating: 4.8,
    price: 598,
    image: '/foods/food8.jpg',
    description: 'A5和牛配以特制寿喜烧汤底，入口即化'
  },
]

// 随机选择餐厅和菜品
const selectRandomRestaurant = () => {
  const randomIndex = Math.floor(Math.random() * topRestaurants.value.length)
  randomRestaurant.value = topRestaurants.value[randomIndex]
}

const selectRandomDish = () => {
  const randomIndex = Math.floor(Math.random() * allDishes.length)
  randomDish.value = allDishes[randomIndex]
}

// 刷新推荐
const refreshRestaurant = () => {
  selectRandomRestaurant()
}

const refreshDish = () => {
  selectRandomDish()
}

// 页面跳转
const goToRestaurant = (id) => {
  router.push(`/restaurant/${id}`)
}

const goToDish = (id) => {
  router.push(`/dish/${id}`)
}

onMounted(() => {
  selectRandomRestaurant()
  selectRandomDish()
})
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

.restaurant-card, .dish-card {
  height: 100%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  backdrop-filter: blur(10px);
}

.restaurant-card:hover, .dish-card:hover {
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
</style> 