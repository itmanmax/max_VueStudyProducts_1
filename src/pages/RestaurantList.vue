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
        <el-button v-if="checkPermission()" type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>添加餐厅
        </el-button>
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
              <template v-if="checkPermission()">
                <el-button type="warning" size="small" @click="editRestaurant(restaurant)">
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="deleteRestaurant(restaurant.restaurant_id)">
                  删除
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加/编辑餐厅对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="50%"
      >
        <el-form :model="restaurantForm" label-width="100px" :rules="rules" ref="restaurantFormRef">
          <el-form-item label="餐厅名称" prop="name">
            <el-input v-model="restaurantForm.name" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="restaurantForm.address" />
          </el-form-item>
          <el-form-item label="评分" prop="rating">
            <el-rate 
              v-model="restaurantForm.rating"
              :max="5" 
              show-score
              :allow-half="true"
            />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="restaurantForm.phone" />
          </el-form-item>
          <el-form-item label="营业时间" prop="business_hours">
            <el-input v-model="restaurantForm.business_hours" />
          </el-form-item>
          <el-form-item label="图片链接" prop="image">
            <el-input v-model="restaurantForm.image" />
          </el-form-item>
          <el-form-item label="菜系类型" prop="cuisine_type">
            <el-input v-model="restaurantForm.cuisine_type" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="restaurantForm.description" rows="3"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { useRestaurantList } from '../js/RestaurantList' // 引入新的 JS 文件
import { Plus, Picture } from '@element-plus/icons-vue'
import { restaurantApi } from '../api'
import '../css/RestaurantList.css'  // 引入新的 CSS 文件

const {
  loading,
  restaurants,
  searchQuery,
  sortBy,
  dialogVisible,
  dialogTitle,
  restaurantFormRef,
  restaurantForm,
  rules,
  fetchRestaurants,
  handleSearch,
  handleSort,
  viewDetails,
  showAddDialog,
  editRestaurant,
  deleteRestaurant,
  handleSubmit,
  checkPermission
} = useRestaurantList() // 使用自定义组合函数

// ... existing template code ...
</script>

