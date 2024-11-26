<template>
  <div class="restaurant-list">
    <el-button type="primary" @click="dialogVisible = true" class="add-btn">
      添加餐厅
    </el-button>
    
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="restaurant in restaurants" :key="restaurant.id">
        <el-card class="restaurant-card" shadow="hover">
          <div class="restaurant-info">
            <h3>{{ restaurant.name }}</h3>
            <div class="rating-row">
              <el-rate v-model="restaurant.rating" disabled></el-rate>
              <span class="rating-value">{{ restaurant.rating }}分</span>
            </div>
            <div class="tags">
              <el-tag size="small" type="success">{{ restaurant.category }}</el-tag>
              <el-tag size="small" type="warning">米其林推荐</el-tag>
            </div>
            <p class="description">{{ restaurant.description }}</p>
            <div class="price-range">
              <span>人均：¥{{ restaurant.averagePrice }}</span>
            </div>
            <div class="operation-buttons">
              <el-button type="primary" @click="viewDetails(restaurant.id)">查看详情</el-button>
              <el-button type="warning" @click="handleEdit(restaurant)">编辑</el-button>
              <el-button type="danger" @click="handleDelete(restaurant.id)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog 
      :title="editingRestaurant ? '编辑餐厅' : '添加餐厅'" 
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="restaurantForm" label-width="100px">
        <el-form-item label="餐厅名称">
          <el-input v-model="restaurantForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="restaurantForm.category"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="restaurantForm.address"></el-input>
        </el-form-item>
        <el-form-item label="人均价格">
          <el-input-number v-model="restaurantForm.averagePrice"></el-input-number>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="restaurantForm.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const restaurants = ref([
  {
    id: 1,
    name: '美味轩',
    category: '川菜',
    address: '上海市长宁区某某路123号',
    rating: 4.5,
    description: '正宗川菜，麻辣鲜香',
    averagePrice: 128,
    isRecommended: true
  },
  {
    id: 2,
    name: '食尚坊',
    category: '粤菜',
    address: '上海市静安区某某路456号',
    rating: 4.8,
    description: '粤菜经典，口味地道',
    averagePrice: 188,
    isRecommended: true
  },
  {
    id: 3,
    name: '味道之家',
    category: '本帮菜',
    address: '上海市黄浦区某某路789号',
    rating: 4.2,
    description: '本帮菜代表，经典上海味道',
    averagePrice: 158,
    isRecommended: false
  }
])

const dialogVisible = ref(false)
const editingRestaurant = ref(null)
const restaurantForm = ref({
  name: '',
  category: '',
  address: '',
  averagePrice: 0,
  description: ''
})

const viewDetails = (id) => {
  router.push({ name: 'RestaurantDetails', params: { id } })
}

const addRestaurant = (newRestaurant) => {
  const id = restaurants.value.length > 0 
    ? Math.max(...restaurants.value.map(r => r.id)) + 1 
    : 1
    
  restaurants.value.push({
    id,
    rating: 5,
    isRecommended: false,
    ...newRestaurant
  })
  
  ElMessage.success('添加餐厅成功')
}

const deleteRestaurant = (id) => {
  const index = restaurants.value.findIndex(r => r.id === id)
  if (index > -1) {
    restaurants.value.splice(index, 1)
    // 保存到localStorage
    saveToStorage()
    ElMessage.success('删除餐厅成功')
  }
}

const updateRestaurant = (id, updatedData) => {
  const index = restaurants.value.findIndex(r => r.id === id)
  if (index > -1) {
    restaurants.value[index] = {
      ...restaurants.value[index],
      ...updatedData
    }
    ElMessage.success('更新餐厅信息成功')
  }
}

const handleEdit = (restaurant) => {
  editingRestaurant.value = restaurant
  restaurantForm.value = { ...restaurant }
  dialogVisible.value = true
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该餐厅吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteRestaurant(id)
  })
}

const handleSubmit = () => {
  if (editingRestaurant.value) {
    updateRestaurant(editingRestaurant.value.id, restaurantForm.value)
  } else {
    addRestaurant(restaurantForm.value)
  }
  dialogVisible.value = false
  editingRestaurant.value = null
  restaurantForm.value = {
    name: '',
    category: '',
    address: '',
    averagePrice: 0,
    description: ''
  }
}

// 保存数据到localStorage
const saveToStorage = () => {
  localStorage.setItem('restaurants', JSON.stringify(restaurants.value))
}

// 从localStorage加载数据
const loadFromStorage = () => {
  const stored = localStorage.getItem('restaurants')
  if (stored) {
    restaurants.value = JSON.parse(stored)
  }
}

// 在增删改操作后调用saveToStorage()
// 在组件挂载时调用loadFromStorage()
</script>

<style scoped>
.restaurant-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.restaurant-info {
  padding: 20px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.tags {
  margin: 15px 0;
  display: flex;
  gap: 8px;
}

.description {
  color: #666;
  margin: 15px 0;
  line-height: 1.5;
}

.price-range {
  color: #e6a23c;
  font-weight: 500;
  margin-bottom: 15px;
}

.detail-btn {
  width: 100%;
  margin-top: 10px;
}

.add-btn {
  margin-bottom: 20px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
</style> 