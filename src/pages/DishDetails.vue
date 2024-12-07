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
import { useDishDetails } from '../js/DishDetails'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Picture } from '@element-plus/icons-vue'
import '../css/DishDetails.css'

const {
  dish,
  restaurantName,
  formatDate,
  goBack,
  handleImageError,
  getSpicyLevelText
} = useDishDetails()
</script> 