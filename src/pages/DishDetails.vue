<template>
  <el-container v-if="dish">
    <el-header>
      <el-button @click="goBack" type="primary" icon="ArrowLeft">返回</el-button>
      <h2>{{ dish.name }}</h2>
    </el-header>
    
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="dish-image-container">
            <el-image 
              :src="dish.image"
              fit="cover"
              class="dish-main-image"
              @error="handleImageError"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>图片加载失败</span>
                </div>
              </template>
            </el-image>
            <div class="dish-price">¥{{ dish.price }}</div>
          </div>
          
          <el-card class="dish-info">
            <template #header>
              <div class="dish-info-header">
                <span>商品介绍</span>
                <el-rate v-model="dish.rating" disabled show-score />
              </div>
            </template>
            <p class="dish-description">{{ dish.description }}</p>
            <div class="dish-details">
              <div class="detail-item">
                <span class="label">烹饪时间：</span>
                <span>{{ dish.cookingTime }}分钟</span>
              </div>
              <div class="detail-item">
                <span class="label">所属餐厅：</span>
                <span>{{ dish.restaurantName }}</span>
              </div>
              <div class="detail-item">
                <span class="label">辣度：</span>
                <el-rate
                  v-model="dish.spicyLevel"
                  :max="3"
                  disabled
                  class="spicy-rate"
                />
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
import { ArrowLeft, Picture } from '@element-plus/icons-vue'
import dishes from '../data/dishes.json'

const route = useRoute()
const router = useRouter()
const dish = ref(null)

// 获取菜品详情
onMounted(() => {
  try {
    const dishId = route.params.id
    if (dishes[dishId]) {
      dish.value = dishes[dishId]
    } else {
      ElMessage.error('未找到该菜品信息')
      router.back()
    }
  } catch (error) {
    console.error('加载菜品数据失败:', error)
    ElMessage.error('加载菜品数据失败')
    router.back()
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 图片加载失败处理
const handleImageError = (e) => {
  console.error('图片加载失败:', e)
}
</script>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
}

.dish-image-container {
  position: relative;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dish-main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.dish-price {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--secondary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.2em;
  font-weight: bold;
}

.dish-info {
  margin-bottom: 20px;
}

.dish-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-description {
  color: #666;
  line-height: 1.6;
  margin: 15px 0;
}

.dish-details {
  margin-top: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.detail-item .label {
  color: #666;
  margin-right: 10px;
  min-width: 80px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f5f7fa;
  color: #909399;
}

.comments-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
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

:deep(.el-rate__icon) {
  color: var(--secondary-color) !important;
}
</style> 