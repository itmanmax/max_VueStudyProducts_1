<template>
  <div>
    <el-container v-if="restaurant">
      <el-header>
        <el-button @click="goBack" type="primary">返回</el-button>
        <h2>{{ restaurant.name }}</h2>
      </el-header>
      
      <el-main>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-carousel :interval="4000" type="card" height="400px" v-if="dishes.length > 0">
              <el-carousel-item v-for="dish in dishes" :key="dish.dishId">
                <router-link :to="`/dishes/${dish.dishId}`" class="carousel-item-wrapper">
                  <el-image 
                    :src="dish.image || defaultAvatar"
                    fit="cover"
                    class="carousel-image"
                    @error="handleImageError"
                  />
                  <div class="carousel-caption">
                    <h3>{{ dish.name }}</h3>
                    <div class="price">¥{{ dish.price }}</div>
                    <div class="description">{{ dish.description }}</div>
                  </div>
                </router-link>
              </el-carousel-item>
            </el-carousel>
            <el-empty v-else description="暂无菜品信息" />
          </el-col>

          <el-col :span="8">
            <div class="restaurant-info-card">
              <div class="info-header">
                <h3>餐厅信息</h3>
                <div class="rating">
                  <el-rate 
                    v-model="restaurant.rating" 
                    disabled 
                    show-score
                    :max="5"
                    :allow-half="true"
                  />
                </div>
              </div>
              <div class="info-content">
                <p><i class="el-icon-location"></i> 地址：{{ restaurant.address }}</p>
                <p><i class="el-icon-phone"></i> 电话：{{ restaurant.phone }}</p>
                <p><i class="el-icon-time"></i> 营业时间：{{ restaurant.businessHours }}</p>
                <p><i class="el-icon-food"></i> 菜系：{{ restaurant.cuisineType }}</p>
                <div class="description">{{ restaurant.description }}</div>
              </div>
              <div class="tags" v-if="restaurantTags.length">
                <h4>餐厅标签</h4>
                <el-tag
                  v-for="tag in restaurantTags"
                  :key="tag.id"
                  :type="getTagType(tag.name)"
                  class="tag-item"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </div>
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
  </div>
</template>

<script setup>
import { useRestaurantDetails } from '../js/RestaurantDetails'
import { useRouter } from 'vue-router'
import '../css/RestaurantDetails.css'

const router = useRouter()
const {
  restaurant,
  dishes,
  restaurantTags,
  defaultAvatar,
  goBack,
  handleImageError,
  getTagType
} = useRestaurantDetails()
</script>

<style>
.carousel-item-wrapper {
  cursor: pointer;
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
</style> 