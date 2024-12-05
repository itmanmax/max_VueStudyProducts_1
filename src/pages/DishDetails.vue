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
                <div class="rating-info">
                  <el-rate 
                    v-model="dish.rating" 
                    disabled 
                    show-score
                    :max="5"
                    :allow-half="true"
                    score-template="{value}"
                  />
                </div>
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
                <span>{{ restaurantName }}</span>
              </div>
              <div class="detail-item">
                <span class="label">辣度：</span>
                <div class="spicy-info">
                  <div class="spicy-stars">
                    <span 
                      v-for="index in 5" 
                      :key="index"
                      class="spicy-star"
                      :class="{ active: index <= dish.spicyLevel }"
                    >★</span>
                  </div>
                  <span class="spicy-score">{{ dish.spicyLevel.toFixed(1) }}/5.0</span>
                  <span class="spicy-text">{{ getSpicyLevelText(dish.spicyLevel) }}</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="label">创建时间：</span>
                <span>{{ formatDate(dish.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">更新时间：</span>
                <span>{{ formatDate(dish.updatedAt) }}</span>
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
import { dishApi, restaurantApi } from '../api'

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
onMounted(async () => {
  try {
    const dishId = route.params.id
    // 获取菜品详情
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
})

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
  background: var(--el-color-primary);
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

:deep(.el-rate__icon) {
  color: var(--el-color-primary) !important;
}

.spicy-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spicy-stars {
  display: flex;
  gap: 2px;
}

.spicy-star {
  font-size: 16px;
  color: #dcdfe6;
  transition: color 0.3s;
}

.spicy-star.active {
  color: #ff4d4f;
}

.spicy-score {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 14px;
  min-width: 60px;
}

.spicy-text {
  color: #ff4d4f;
  font-weight: bold;
  font-size: 14px;
  margin-left: 4px;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-info :deep(.el-rate__text) {
  color: var(--el-color-primary);
  font-weight: bold;
}

.rating-info :deep(.el-rate__decimal) {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  overflow: hidden;
}
</style> 