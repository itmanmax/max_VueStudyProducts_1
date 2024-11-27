<template>
  <el-container>
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
            />
            <div class="dish-price">¥{{ dish.price }}</div>
          </div>
          
          <el-card class="dish-info">
            <template #header>
              <div class="dish-info-header">
                <span>商品介绍</span>
                <el-rate v-model="dish.rating" disabled show-score />
              </div>
            </template>
            <p class="dish-description">{{ dish.description }}</p>
            <div class="dish-details">
              <div class="detail-item">
                <span class="label">烹饪时间：</span>
                <span>{{ dish.cookingTime }}分钟</span>
              </div>
              <div class="detail-item">
                <span class="label">辣度：</span>
                <el-rate
                  v-model="dish.spicyLevel"
                  disabled
                  :colors="['#F56C6C', '#F56C6C', '#F56C6C']"
                  :max="3"
                />
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="comments-card">
            <template #header>
              <div class="comments-header">
                <span>用户评价</span>
                <el-rate v-model="dish.rating" disabled show-score />
              </div>
            </template>
            <div class="comments-list">
              <div v-for="comment in dish.comments" :key="comment.id" class="comment-item">
                <el-avatar :size="32" :src="comment.userAvatar" :fallback="defaultAvatarUrl" />
                <div class="comment-content">
                  <p>{{ comment.content }}</p>
                  <span class="comment-time">{{ comment.createTime }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const defaultAvatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const dish = ref({
  name: '',
  price: 0,
  rating: 0,
  description: '',
  image: '',
  cookingTime: 0,
  spicyLevel: 0,
  comments: []
})

onMounted(async () => {
  const id = route.params.id
  // 模拟不同菜品的数据
  const dishesData = {
    '1': {
      id: 1,
      name: '宫保鸡丁',
      price: 25,
      rating: 4.8,
      description: '宫保鸡丁是一道闻名中外的川菜。鸡肉鲜嫩，花生香脆，配以干辣椒的麻辣味，口感层次丰富。',
      image: '/foods/food1.jpg',
      cookingTime: 20,
      spicyLevel: 2,
      comments: [
        {
          id: 1,
          content: '非常好吃，辣度适中，花生很脆！',
          userAvatar: defaultAvatarUrl,
          createTime: '2024-03-20'
        },
        {
          id: 2,
          content: '分量足，价格实惠，鸡肉很嫩',
          userAvatar: defaultAvatarUrl,
          createTime: '2024-03-21'
        }
      ]
    },
    '2': {
      id: 2,
      name: '麻婆豆腐',
      price: 20,
      rating: 4.6,
      description: '麻婆豆腐以嫩豆腐为主料，配以肉末，采用川味调料烹制，麻辣鲜香，入口即化。',
      image: '/foods/food2.jpg',
      cookingTime: 15,
      spicyLevel: 3,
      comments: [
        {
          id: 1,
          content: '豆腐很嫩，味道正宗！就是有点太辣了',
          userAvatar: defaultAvatarUrl,
          createTime: '2024-03-22'
        },
        {
          id: 2,
          content: '很地道的川菜味道，下饭神器',
          userAvatar: defaultAvatarUrl,
          createTime: '2024-03-23'
        }
      ]
    },
    '3': {
      id: 3,
      name: '鱼香肉丝',
      price: 22,
      rating: 4.7,
      description: '鱼香肉丝选用优质里脊肉，搭配胡萝卜、木耳等，以独特的鱼香调味料烹制，咸甜适中。',
      image: '/foods/food3.jpg',
      cookingTime: 18,
      spicyLevel: 1,
      comments: [
        {
          id: 1,
          content: '酸甜可口，肉丝很嫩，配菜新鲜',
          userAvatar: defaultAvatarUrl,
          createTime: '2024-03-21'
        },
        {
          id: 2,
          content: '调味恰到好处，不辣也很开胃',
          userAvatar: defaultAvatarUrl,
          createTime: '2024-03-22'
        }
      ]
    }
  }

  // 根据路由参数获取对应菜品数据
  dish.value = dishesData[id] || {
    id,
    name: '未知菜品',
    price: 0,
    rating: 0,
    description: '暂无描述',
    image: '/foods/default.jpg',
    cookingTime: 0,
    spicyLevel: 0,
    comments: []
  }
})

const goBack = () => router.back()
</script>

<style scoped>
.el-header {
  background-color: #fff;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

h2 {
  margin-left: 20px;
  margin-bottom: 0;
}

.el-main {
  background: var(--background-light);
  padding: 20px;
}

.dish-image-container {
  position: relative;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.dish-main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.dish-price {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--gradient-primary);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
}

.dish-info {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(42, 157, 143, 0.1);
  transition: all 0.3s ease;
}

.dish-info:hover {
  box-shadow: 0 8px 20px rgba(29, 61, 50, 0.1);
}

.dish-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.dish-details .detail-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.detail-item .label {
  color: #999;
  margin-right: 10px;
  width: 80px;
}

.comments-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(42, 157, 143, 0.1);
  transition: all 0.3s ease;
}

.comments-card:hover {
  box-shadow: 0 8px 20px rgba(29, 61, 50, 0.1);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments-list {
  max-height: 500px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.comment-content {
  flex: 1;
  
  p {
    margin: 0 0 8px;
  }
  
  .comment-time {
    color: #999;
    font-size: 12px;
  }
}

:deep(.el-rate__icon) {
  color: var(--secondary-color) !important;
}
</style> 