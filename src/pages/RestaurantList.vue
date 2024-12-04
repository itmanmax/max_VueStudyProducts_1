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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Picture } from '@element-plus/icons-vue'
import { restaurantApi } from '../api'

const router = useRouter()
const loading = ref(false)
const restaurants = ref([])
const searchQuery = ref('')
const sortBy = ref('rating-desc')
const defaultImage = '/path/to/default/image.jpg' // 设置默认图片路径

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加餐厅')
const restaurantFormRef = ref(null)
const restaurantForm = ref({
  name: '',
  address: '',
  rating: 0,
  description: '',
  phone: '',
  business_hours: '',
  image: '',
  cuisine_type: '',
  restaurant_id: null
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入餐厅名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  rating: [{ required: true, message: '请选择评分', trigger: 'change' }]
}

// 获取餐厅列表
const fetchRestaurants = async () => {
  loading.value = true
  try {
    const response = await restaurantApi.getList()
    console.log('API Response:', response)
    
    // 处理后端返回的数据格式
    if (response.code === 200 && Array.isArray(response.data)) {
      restaurants.value = response.data.map(restaurant => ({
        ...restaurant,
        restaurant_id: restaurant.restaurantId, // 字段名转换
        rating: Number(restaurant.rating) || 0,
        created_at: restaurant.createdAt,
        updated_at: restaurant.updatedAt,
        // 如果这些字段暂时没有，提供默认值
        description: restaurant.description || '暂无描述',
        phone: restaurant.phone || '暂无电话',
        business_hours: restaurant.businessHours || '暂无营业时间信息',
        image: restaurant.image || defaultImage,
        cuisine_type: restaurant.cuisineType || '暂无分类'
      }))
    } else {
      ElMessage.warning('获取数据格式异常')
      restaurants.value = []
    }
  } catch (error) {
    console.error('获取餐厅列表失败:', error)
    console.error('错误详情:', error.response || error)
    ElMessage.error(`获取餐厅列表失败: ${error.message || '未知错误'}`)
  } finally {
    loading.value = false
  }
}

// 搜索餐厅
const handleSearch = async () => {
  if (!searchQuery.value) {
    await fetchRestaurants()
    return
  }
  loading.value = true
  try {
    const response = await restaurantApi.search({ query: searchQuery.value })
    const searchData = Array.isArray(response) ? response : []
    restaurants.value = searchData.map(restaurant => ({
      ...restaurant,
      rating: Number(restaurant.rating) || 0,
      restaurant_id: restaurant.restaurant_id || restaurant.id
    }))
  } catch (error) {
    console.error('搜索餐厅失败:', error)
    ElMessage.error('搜索餐厅失败')
  } finally {
    loading.value = false
  }
}

// 排序处理
const handleSort = () => {
  restaurants.value.sort((a, b) => {
    const ratingA = Number(a.rating) || 0
    const ratingB = Number(b.rating) || 0
    if (sortBy.value === 'rating-desc') {
      return ratingB - ratingA
    } else {
      return ratingA - ratingB
    }
  })
}

// 查看详情
const viewDetails = (id) => {
  router.push(`/restaurant/${id}`)
}

// 显示添加对话框
const showAddDialog = () => {
  if (!checkPermission()) {
    ElMessage.warning('您没有权限执行此操作')
    return
  }
  
  dialogTitle.value = '添加餐厅'
  restaurantForm.value = {
    name: '',
    address: '',
    rating: 0,
    description: '',
    phone: '',
    business_hours: '',
    image: '',
    cuisine_type: '',
    restaurant_id: null
  }
  dialogVisible.value = true
}

// 编辑餐厅
const editRestaurant = (restaurant) => {
  if (!checkPermission()) {
    ElMessage.warning('您没有权限执行此操作')
    return
  }
  
  console.log('Editing restaurant:', restaurant) // 添加日志
  
  dialogTitle.value = '编辑餐厅'
  restaurantForm.value = {
    restaurant_id: restaurant.restaurantId, // 使用后端返回的 restaurantId
    name: restaurant.name,
    address: restaurant.address,
    rating: Number(restaurant.rating) || 0,
    description: restaurant.description || '',
    phone: restaurant.phone || '',
    business_hours: restaurant.businessHours || '',
    image: restaurant.image || '',
    cuisine_type: restaurant.cuisineType || ''
  }
  dialogVisible.value = true
}

// 删除餐厅
const deleteRestaurant = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个餐厅吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    try {
      await restaurantApi.delete(id)
      ElMessage.success('删除成功')
      await fetchRestaurants()
    } catch (error) {
      if (error.response?.status === 401) {
        ElMessage.error('没有权限执行此操作')
      } else {
        ElMessage.error('删除失败：' + (error.message || '未知错误'))
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除餐厅失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!restaurantFormRef.value) return
  
  try {
    await restaurantFormRef.value.validate()
    
    const submitData = {
      restaurantId: restaurantForm.value.restaurant_id,
      name: restaurantForm.value.name,
      address: restaurantForm.value.address,
      rating: Number(restaurantForm.value.rating) || 0,
      phone: restaurantForm.value.phone,
      businessHours: restaurantForm.value.business_hours,
      image: restaurantForm.value.image,
      cuisineType: restaurantForm.value.cuisine_type,
      description: restaurantForm.value.description
    }
    
    try {
      if (restaurantForm.value.restaurant_id) {
        console.log('Submitting update:', {
          id: restaurantForm.value.restaurant_id,
          data: submitData
        })
        
        const id = restaurantForm.value.restaurant_id
        if (id === undefined || id === null) {
          throw new Error('Invalid restaurant ID')
        }
        
        const { restaurantId, ...updateData } = submitData
        await restaurantApi.update(id, updateData)
        ElMessage.success('编辑成功')
      } else {
        await restaurantApi.create(submitData)
        ElMessage.success('添加成功')
      }
      
      dialogVisible.value = false
      await fetchRestaurants()
    } catch (error) {
      console.error('API Error:', error.response || error)
      if (error.response?.status === 401) {
        ElMessage.error('没有权限执行此操作')
      } else {
        ElMessage.error(`操作失败：${error.response?.data?.message || error.message || '未知错误'}`)
      }
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  }
}

// 添加权限检查方法
const checkPermission = () => {
  // 这里可以添加更复杂的权限检查逻辑
  return true // 暂时默认都有权限
}

// 初始化
onMounted(() => {
  fetchRestaurants()
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
  overflow: hidden;
}

.button-group {
  display: flex;
  gap: 8px;
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

:deep(.el-dialog__body) {
  padding: 20px;
}
</style> 