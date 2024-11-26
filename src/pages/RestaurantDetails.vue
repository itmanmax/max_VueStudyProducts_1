<template>
  <el-container>
    <el-header>
      <el-button @click="goBack" type="primary" icon="ArrowLeft">返回</el-button>
      <h2>{{ restaurant.name }}</h2>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-carousel height="500px" indicator-position="outside" :interval="4000" type="card">
            <el-carousel-item v-for="dish in restaurant.dishes" :key="dish.id">
              <div class="carousel-item-wrapper">
                <el-image 
                  :src="dish.image"
                  fit="cover"
                  class="carousel-image"
                />
                <div class="carousel-caption">
                  <h3>{{ dish.name }}</h3>
                  <p class="price">¥{{ dish.price }}</p>
                  <p class="description">{{ dish.description }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
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
                <el-avatar :size="32" :src="comment.userAvatar" />
                <div class="comment-content">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '../utils/date'

const route = useRoute()
const router = useRouter()
const restaurant = ref({
  name: '',
  rating: 0,
  dishes: [],
  comments: []
})

onMounted(async () => {
  const id = route.params.id
  // 模拟API调用
  restaurant.value = {
    id,
    name: '美味轩',
    rating: 4.5,
    dishes: [
      { 
        id: 1,
        name: '宫保鸡丁', 
        price: 25,
        image: '/foods/food1.jpg'
      },
      { 
        id: 2,
        name: '麻婆豆腐', 
        price: 20,
        image: '/foods/food2.jpg'
      },
      { 
        id: 3,
        name: '鱼香肉丝', 
        price: 22,
        image: '/foods/food3.jpg'
      }
    ],
    comments: [
      {
        id: 1,
        content: '味道非常好，环境也不错！',
        userAvatar: '/avatars/user1.jpg',
        createTime: '2024-03-20'
      },
      {
        id: 2,
        content: '服务员态度很好，下次还会再来。',
        userAvatar: '/avatars/user2.jpg',
        createTime: '2024-03-21'
      },
      {
        id: 3,
        content: '菜品种类丰富，性价比高。',
        userAvatar: '/avatars/user3.jpg',
        createTime: '2024-03-22'
      }
    ]
  }
})

const goBack = () => router.back()
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
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
  height: 3px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #f8c037;
}

:deep(.el-carousel__item) {
  padding: 10px;
  box-sizing: border-box;
  background: transparent;
}

.rating-card {
  height: 100%;
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

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.comment-content {
  flex: 1;
  
  p {
    margin: 0 0 8px;
  }
  
  .comment-time {
    color: #999;
    font-size: 12px;
  }
}
</style> 