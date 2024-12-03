<template>
  <el-container v-if="restaurant">
    <el-header>
      <el-button @click="goBack" type="primary" icon="ArrowLeft">返回</el-button>
      <h2>{{ restaurant.name }}</h2>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="section-title">
            <h3>本店菜谱</h3>
            <span class="subtitle">精选特色菜品</span>
          </div>

          <el-carousel 
            height="500px" 
            indicator-position="outside" 
            :interval="1000"
            arrow="always"
            type="card"
            :touch-move-prevent="false"
          >
            <el-carousel-item v-for="dish in restaurant.dishes" :key="dish.id">
              <div class="carousel-item-wrapper" @click="navigateToDish(dish.id)">
                <el-image 
                  :src="dish.image"
                  fit="cover"
                  class="carousel-image"
                  @error="handleImageError"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                      <span>图片加载失败</span>
                    </div>
                  </template>
                </el-image>
                <div class="carousel-caption">
                  <h3>{{ dish.name }}</h3>
                  <p class="price">¥{{ dish.price }}</p>
                  <p class="description">{{ dish.description }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>

          <div class="restaurant-details">
            <el-card class="info-card">
              <template #header>
                <div class="card-header">
                  <h3>餐厅信息</h3>
                </div>
              </template>
              <div class="info-content">
                <div class="info-item">
                  <el-icon><Location /></el-icon>
                  <span>地址：{{ restaurant.address }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Phone /></el-icon>
                  <span>电话：{{ restaurant.phone }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Clock /></el-icon>
                  <span>营业时间：{{ restaurant.businessHours }}</span>
                </div>
              </div>
            </el-card>

            <el-card class="features-card">
              <template #header>
                <div class="card-header">
                  <h3>餐厅特色</h3>
                </div>
              </template>
              <div class="features-content">
                <div class="feature-tags">
                  <el-tag>无烟环境</el-tag>
                  <el-tag>免费WiFi</el-tag>
                  <el-tag>停车方便</el-tag>
                  <el-tag>提供包间</el-tag>
                </div>
                <p class="restaurant-desc">{{ restaurant.description }}</p>
              </div>
            </el-card>
          </div>
        </el-col>
        
        <el-col :span="8">
          <el-card class="rating-card">
            <template #header>
              <div class="rating-header">
                <span>用户评分</span>
                <el-rate v-model="restaurant.rating" disabled show-score />
              </div>
            </template>
            <div class="comments-list">
              <div v-for="comment in restaurant.comments" :key="comment.id" class="comment-item">
                <el-avatar 
                  :size="32" 
                  :src="comment.user?.avatar || defaultAvatar"
                >
                  <template #error>
                    <img :src="defaultAvatar" alt="default avatar">
                  </template>
                </el-avatar>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="username">{{ comment.user?.name || '匿名用户' }}</span>
                    <el-rate v-model="comment.rating" disabled show-score />
                  </div>
                  <p>{{ comment.content }}</p>
                  <span class="comment-time">{{ comment.createTime }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  
  <el-container v-else>
    <el-main>
      <el-empty description="加载中...">
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-empty>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import restaurants from '../data/restaurants.json'
import restaurantDetails from '../data/restaurantDetails.json'
import dishes from '../data/dishes.json'
import { Location, Phone, Clock } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const restaurant = ref(null)

const defaultAvatar = '/Users/default-avatar.jpg'

onMounted(() => {
  const restaurantId = parseInt(route.params.id)
  const details = restaurantDetails[restaurantId]
  if (details) {
    restaurant.value = {
      ...details,
      dishes: details.dishes.map(dishId => dishes[dishId])
    }
  } else {
    ElMessage.error('未找到该餐厅信息')
    router.back()
  }
})

const goBack = () => router.back()

const navigateToDish = (dishId) => {
  router.push(`/dish/${dishId}`)
}

const handleImageError = (e) => {
  console.error('图片加载失败:', e)
}
</script>

<style scoped>
.el-header {
  background-color: #fff;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

h2 {
  margin-left: 20px;
  margin-bottom: 0;
}

.carousel-item-wrapper {
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 4px solid #fff;
  background: #fff;
  margin: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.carousel-item-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-item-wrapper:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(29, 61, 50, 0.9), transparent);
  color: white;
  text-align: left;
}

.carousel-caption h3 {
  font-size: 24px;
  margin: 0 0 10px;
  font-weight: 500;
}

.carousel-caption .price {
  font-size: 20px;
  color: #f8c037;
  margin: 8px 0;
}

.carousel-caption .description {
  font-size: 16px;
  opacity: 0.9;
  margin: 8px 0 0;
}

:deep(.el-carousel__indicators) {
  transform: translateY(25px);
}

:deep(.el-carousel__indicator) {
  padding: 12px 4px;
}

:deep(.el-carousel__button) {
  width: 30px;
  height: 6px;
  border-radius: 3px;
  background-color: rgba(29, 61, 50, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: var(--secondary-color);
  width: 50px;
}

:deep(.el-carousel__item) {
  padding: 10px;
  box-sizing: border-box;
  background: transparent;
}

.rating-card {
  height: 100%;
  border: 1px solid rgba(42, 157, 143, 0.1);
}

.rating-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comments-list {
  max-height: 500px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.username {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.comment-time {
  color: #999;
  font-size: 12px;
  display: block;
  margin-top: 8px;
}

:deep(.el-rate__icon) {
  color: var(--secondary-color) !important;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

.image-error .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

:deep(.el-carousel__arrow) {
  width: 50px;
  height: 50px;
  background-color: rgba(29, 61, 50, 0.8);
  border: 2px solid #fff;
  
  &:hover {
    background-color: var(--secondary-color);
  }

  i {
    font-size: 24px;
  }
}

:deep(.el-carousel__arrow--left) {
  left: 20px;
}

:deep(.el-carousel__arrow--right) {
  right: 20px;
}

.section-title {
  margin-bottom: 20px;
  padding: 0 10px;

  h3 {
    font-size: 24px;
    color: var(--el-text-color-primary);
    margin: 0 0 8px 0;
  }

  .subtitle {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

.restaurant-details {
  margin-top: 30px;
  display: grid;
  gap: 20px;
}

.info-card, .features-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  h3 {
    margin: 0;
    font-size: 18px;
    color: var(--el-text-color-primary);
  }
}

.info-content {
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    color: var(--el-text-color-regular);

    .el-icon {
      margin-right: 10px;
      color: var(--secondary-color);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.features-content {
  .feature-tags {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .el-tag {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);
      color: white;
    }
  }

  .restaurant-desc {
    color: var(--el-text-color-regular);
    line-height: 1.6;
    margin: 0;
  }
}
</style> 