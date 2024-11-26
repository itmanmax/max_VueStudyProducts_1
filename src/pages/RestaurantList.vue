<template>
  <div class="restaurant-list">
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
            <el-button type="primary" @click="viewDetails(restaurant.id)" class="detail-btn">
              查看详情
              <el-icon class="el-icon-right"></el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const restaurants = ref([
  {
    id: 1,
    name: '美味轩',
    category: '川菜',
    address: '上海市长宁区某某路123号',
    rating: 4.5
  },
  {
    id: 2,
    name: '食尚坊',
    category: '粤菜',
    address: '上海市静安区某某路456号',
    rating: 4.8
  },
  {
    id: 3,
    name: '味道之家',
    category: '本帮菜',
    address: '上海市黄浦区某某路789号',
    rating: 4.2
  }
])

const viewDetails = (id) => {
  router.push({ name: 'RestaurantDetails', params: { id } })
}
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
</style> 