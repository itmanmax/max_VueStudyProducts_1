<template>
  <el-container v-if="restaurant">
    <el-header>
      <el-button @click="goBack" type="primary">返回</el-button>
      <h2>{{ restaurant.name }}</h2>
    </el-header>
    
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="carousel-item-wrapper">
            <el-image 
              :src="restaurant.image || defaultAvatar"
              fit="cover"
              class="carousel-image"
              @error="handleImageError"
            />
            <div class="carousel-caption">
              <h3>{{ restaurant.name }}</h3>
              <div class="price">¥{{ restaurant.price }}</div>
              <div class="description">{{ restaurant.description }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 其他内容... -->
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
import { useRestaurantDetails } from '../js/RestaurantDetails' // 引入新的 JS 文件
import '../css/RestaurantDetails.css'  // 引入新的 CSS 文件

const {
  restaurant,
  dishes,
  restaurantTags,
  defaultAvatar,
  goBack,
  navigateToDish,
  handleImageError,
  getTagType
} = useRestaurantDetails() // 使用自定义组合函数
</script> 