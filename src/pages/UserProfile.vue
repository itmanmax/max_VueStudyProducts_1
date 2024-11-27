<template>
  <el-container>
    <el-header>
      <h2>个人中心</h2>
    </el-header>
    
    <el-main>
      <el-row :gutter="20">
        <!-- 左侧个人信息卡片 -->
        <el-col :span="8">
          <el-card class="user-info-card">
            <div class="user-header">
              <el-avatar :size="100" :src="userInfo.avatar" :fallback="defaultAvatarUrl" />
              <h3>{{ userInfo.nickname }}</h3>
              <p class="user-id">ID: {{ userInfo.id }}</p>
            </div>
            
            <div class="user-stats">
              <div class="stat-item">
                <span class="number">{{ userInfo.favoriteCount }}</span>
                <span class="label">收藏</span>
              </div>
              <div class="stat-item">
                <span class="number">{{ userInfo.commentCount }}</span>
                <span class="label">评论</span>
              </div>
              <div class="stat-item">
                <span class="number">{{ userInfo.likeCount }}</span>
                <span class="label">获赞</span>
              </div>
            </div>

            <el-button type="primary" class="edit-profile-btn" @click="editProfile">
              编辑资料
            </el-button>
          </el-card>
        </el-col>

        <!-- 右侧内容区域 -->
        <el-col :span="16">
          <!-- 收藏的餐厅 -->
          <el-card class="content-card">
            <template #header>
              <div class="card-header">
                <span>我的收藏</span>
                <el-button type="text">查看全部</el-button>
              </div>
            </template>
            
            <div class="favorite-restaurants">
              <el-row :gutter="20">
                <el-col :span="8" v-for="restaurant in favoriteRestaurants" :key="restaurant.id">
                  <div class="restaurant-item" @click="navigateToRestaurant(restaurant.id)">
                    <el-image :src="restaurant.image" fit="cover" />
                    <h4>{{ restaurant.name }}</h4>
                    <div class="restaurant-rating">
                      <el-rate v-model="restaurant.rating" disabled :max="5" />
                      <span>{{ restaurant.rating }}分</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 历史记录 -->
          <el-card class="content-card">
            <template #header>
              <div class="card-header">
                <span>历史记录</span>
                <el-button type="text">查看全部</el-button>
              </div>
            </template>

            <el-timeline>
              <el-timeline-item
                v-for="activity in userActivities"
                :key="activity.id"
                :timestamp="activity.time"
                :type="activity.type"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const defaultAvatarUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 用户基本信息
const userInfo = ref({
  id: '10086',
  nickname: '美食达人',
  avatar: defaultAvatarUrl,
  favoriteCount: 12,
  commentCount: 45,
  likeCount: 128
})

// 收藏的餐厅
const favoriteRestaurants = ref([
  {
    id: 1,
    name: '美味轩',
    image: '/restaurants/rest1.jpg',
    rating: 4.5
  },
  {
    id: 2,
    name: '江南小馆',
    image: '/restaurants/rest2.jpg',
    rating: 4.3
  },
  {
    id: 3,
    name: '川香园',
    image: '/restaurants/rest3.jpg',
    rating: 4.7
  }
])

// 用户活动历史
const userActivities = ref([
  {
    id: 1,
    type: 'success',
    content: '收藏了餐厅「美味轩」',
    time: '2024-03-25 14:30'
  },
  {
    id: 2,
    type: 'info',
    content: '评论了「宫保鸡丁」: 味道非常好，下次还会再来！',
    time: '2024-03-24 18:20'
  },
  {
    id: 3,
    type: 'warning',
    content: '给「麻婆豆腐」打了4.5分',
    time: '2024-03-23 12:45'
  }
])

// 方法
const editProfile = () => {
  // TODO: 实现编辑资料功能
  console.log('编辑资料')
}

const navigateToRestaurant = (restaurantId) => {
  router.push(`/restaurant/${restaurantId}`)
}
</script>

<style scoped>
.el-header {
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.el-main {
  background: var(--background-light);
  padding: 20px;
}

.user-info-card, .content-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(42, 157, 143, 0.1);
  transition: all 0.3s ease;
}

.user-info-card:hover, .content-card:hover {
  box-shadow: 0 8px 20px rgba(29, 61, 50, 0.1);
}

.user-info-card {
  text-align: center;
  padding: 20px;
}

.user-header {
  margin-bottom: 20px;

  h3 {
    margin: 10px 0 5px;
    font-size: 1.5em;
  }

  .user-id {
    color: #999;
    margin: 0;
  }
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .number {
    font-size: 1.5em;
    font-weight: bold;
    color: var(--secondary-color);
  }

  .label {
    color: #999;
    font-size: 0.9em;
    margin-top: 5px;
  }
}

.edit-profile-btn {
  width: 100%;
  margin-top: 20px;
}

.content-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-restaurants {
  .restaurant-item {
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .el-image {
      width: 100%;
      height: 120px;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    h4 {
      margin: 10px 0;
      font-size: 1.1em;
    }

    .restaurant-rating {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9em;
      color: #666;
    }
  }
}

:deep(.el-timeline-item__content) {
  color: #666;
}

:deep(.el-timeline-item__timestamp) {
  color: #999;
}

:deep(.el-button--primary) {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}

:deep(.el-timeline-item__node) {
  background-color: var(--secondary-color);
}
</style> 