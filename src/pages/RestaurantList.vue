<template>
  <div class="page-container">
    <div class="restaurant-list" v-loading.fullscreen.lock="loading" 
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255, 255, 255, 0.8)">
      <div class="filter-card">
        <el-input v-model="searchQuery" placeholder="搜索餐厅" clearable />
        <el-select v-model="sortBy" placeholder="排序方式" class="sort-select">
          <el-option label="评分从高到低" value="rating-desc" />
          <el-option label="评分从低到高" value="rating-asc" />
        </el-select>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>添加餐厅
        </el-button>
      </div>
      <div class="restaurant-grid">
        <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="restaurant-card">
          <el-image :src="restaurantDetails[restaurant.id].image" fit="cover" class="restaurant-image">
            <template #error>
              <div class="image-slot">
                <el-icon><picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="restaurant-info">
            <h3>{{ restaurant.name }}</h3>
            <div class="rating">
              <el-rate v-model="restaurant.rating" disabled show-score />
            </div>
            <p class="description">{{ restaurantDetails[restaurant.id].description }}</p>
            <div class="button-group">
              <el-button type="primary" size="small" @click="viewDetails(restaurant.id)">
                查看详情
              </el-button>
              <el-button type="warning" size="small" @click="editRestaurant(restaurant)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteRestaurant(restaurant.id)">
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="50%"
      >
        <el-form :model="restaurantForm" label-width="100px">
          <el-form-item label="餐厅名称">
            <el-input v-model="restaurantForm.name" />
          </el-form-item>
          <el-form-item label="评分">
            <el-rate v-model="restaurantForm.rating" :max="5" show-score />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="restaurantForm.description" />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import restaurants from '../data/restaurants.json'
import restaurantDetails from '../data/restaurantDetails.json'

const router = useRouter()
const searchQuery = ref('')
const sortBy = ref('rating-desc')
const loading = ref(false)

// 创建本地餐厅数据的副本
const localRestaurants = ref([...restaurants])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加餐厅')
const restaurantForm = ref({
  id: null,
  name: '',
  rating: 0,
  description: ''
})

// 计算筛选后的餐厅列表
const filteredRestaurants = computed(() => {
  let result = [...localRestaurants.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(restaurant => 
      restaurant.name.toLowerCase().includes(query)
    )
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'rating-desc':
        return b.rating - a.rating
      case 'rating-asc':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  return result
})

// 查看详情
const viewDetails = (id) => {
  router.push(`/restaurant/${id}`)
}

// 显示添加对话框
const showAddDialog = () => {
  dialogTitle.value = '添加餐厅'
  restaurantForm.value = {
    id: localRestaurants.value.length + 1,
    name: '',
    rating: 0,
    description: ''
  }
  dialogVisible.value = true
}

// 编辑餐厅
const editRestaurant = (restaurant) => {
  dialogTitle.value = '编辑餐厅'
  restaurantForm.value = { ...restaurant }
  dialogVisible.value = true
}

// 删除餐厅
const deleteRestaurant = (id) => {
  ElMessageBox.confirm('确定要删除这个餐厅吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localRestaurants.value = localRestaurants.value.filter(r => r.id !== id)
    ElMessage.success('删除成功')
  })
}

// 提交表单
const handleSubmit = () => {
  if (restaurantForm.value.id) {
    // 编辑现有餐厅
    const index = localRestaurants.value.findIndex(r => r.id === restaurantForm.value.id)
    if (index !== -1) {
      localRestaurants.value[index] = { ...restaurantForm.value }
    }
  } else {
    // 添加新餐厅
    localRestaurants.value.push({
      ...restaurantForm.value,
      id: localRestaurants.value.length + 1
    })
  }
  dialogVisible.value = false
  ElMessage.success(restaurantForm.value.id ? '编辑成功' : '添加成功')
}

// 初始化
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<style scoped>
.restaurant-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-card {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.sort-select {
  width: 150px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.restaurant-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.restaurant-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.restaurant-info {
  padding: 15px;
}

.restaurant-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.rating {
  margin-bottom: 10px;
}

.description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.card-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

/* 修改加载动画样式 */
:deep(.el-loading-spinner) {
  .el-loading-text {
    color: var(--el-color-primary);
    margin: 8px 0;
    font-size: 14px;
  }

  .circular {
    width: 42px;
    height: 42px;
    animation: loading-rotate 2s linear infinite;
  }
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* 加载遮罩层样式 */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

/* 添加页面容器样式 */
.page-container {
  min-height: 100vh;
  position: relative;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.filter-card {
  display: flex;
  gap: 16px;
  align-items: center;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style> 