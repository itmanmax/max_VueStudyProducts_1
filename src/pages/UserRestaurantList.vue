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
          <el-image :src="restaurant.image || defaultAvatar" fit="cover" class="restaurant-image">
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
              <el-button type="primary" size="small" @click="navigateToDetail(restaurant.restaurant_id)">
                查看详情
              </el-button>
              <template v-if="isAdmin">
                <el-button type="primary" size="small" @click.stop="navigateToEdit(restaurant.restaurant_id)">编辑</el-button>
                <el-button type="danger" size="small" @click.stop="handleDelete(restaurant.restaurant_id)">删除</el-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定要删除这个餐厅吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRestaurantList } from '../js/RestaurantList'
import { Picture } from '@element-plus/icons-vue'
import '../css/RestaurantList.css'

const {
  loading,
  restaurants,
  searchQuery,
  sortBy,
  defaultAvatar,
  deleteDialogVisible,
  isAdmin,
  handleSearch,
  handleSort,
  navigateToDetail,
  navigateToEdit,
  handleDelete,
  confirmDelete
} = useRestaurantList()
</script>
