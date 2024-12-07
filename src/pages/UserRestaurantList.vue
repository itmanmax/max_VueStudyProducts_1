<template>
  <div class="page-container">
    <div class="restaurant-list" v-loading.fullscreen.lock="loading" 
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255, 255, 255, 0.8)">
      <div class="filter-card">
        <el-input v-model="searchQuery" placeholder="搜索餐厅" clearable @input="handleSearch"/>
        <el-select v-model="sortBy" placeholder="排序方式" class="sort-select" @change="handleSort">
          <el-option label="评分从高到低" value="rating-desc" />
          <el-option label="评分从低到高" value="rating-asc" />
        </el-select>
      </div>

      <div class="restaurant-grid">
        <div v-for="restaurant in restaurants" :key="restaurant.restaurant_id" class="restaurant-card">
          <el-image :src="restaurant.image || defaultImage" fit="cover" class="restaurant-image">
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="restaurant-info">
            <h3>{{ restaurant.name }}</h3>
            <div class="rating">
              <el-rate 
                :model-value="Number(restaurant.rating)" 
                disabled 
                show-score
                :max="5"
                :allow-half="true"
              />
            </div>
            <p class="description">{{ restaurant.description || '暂无描述' }}</p>
            <div class="button-group">
              <el-button type="primary" size="small" @click="viewDetails(restaurant.restaurant_id)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserRestaurantList } from '../js/UserRestaurantList'
import { Picture } from '@element-plus/icons-vue'
import '../css/RestaurantList.css'  // 复用原有的CSS样式

const {
  loading,
  restaurants,
  searchQuery,
  sortBy,
  defaultImage,
  handleSearch,
  handleSort,
  viewDetails,
} = useUserRestaurantList()
</script>
