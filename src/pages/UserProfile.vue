<template>
  <el-container>
    <el-header>
      <h2>个人中心</h2>
      <div class="auth-buttons">
        <template v-if="isLoggedIn">
          <span class="welcome-text">欢迎, {{ userInfo.nickname }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </template>
        <el-button v-else type="primary" @click="showLoginDialog">登录</el-button>
      </div>
    </el-header>
    
    <el-main v-if="isLoggedIn">
      <el-row :gutter="20">
        <!-- 左侧个人信息卡片 -->
        <el-col :span="8">
          <el-card class="user-info-card">
            <div class="user-header">
              <el-avatar 
                :size="100" 
                :src="userInfo.avatar" 
                @error="() => userInfo.avatar = defaultAvatar"
              />
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
                <el-button link>查看全部</el-button>
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
                <el-button link>查看全部</el-button>
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
    
    <el-main v-else>
      <el-empty description="请登录后查看个人信息">
        <el-button type="primary" @click="showLoginDialog">
          立即登录
        </el-button>
      </el-empty>
    </el-main>

    <!-- 登录对话框 -->
    <el-dialog
      title="用户登录"
      v-model="loginDialogVisible"
      width="400px"
      center
    >
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleLogin" :loading="loginLoading">
            登录
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑资料对话框 -->
    <el-dialog
      title="编辑个人资料"
      v-model="dialogVisible"
      width="500px"
      center
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar-preview">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input
            type="textarea"
            v-model="editForm.signature"
            :rows="3"
            placeholder="写点什么介绍自己吧..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import restaurantDetails from '../data/restaurantDetails.json'

const router = useRouter()
const defaultAvatar = '/Users/Users1.jpg'  // 使用默认用户头像
const dialogVisible = ref(false)

// 用户基本信息
const userInfo = ref({
  id: '10086',
  nickname: '美食达人',
  avatar: defaultAvatar,
  favoriteCount: 12,
  commentCount: 45,
  likeCount: 128,
  signature: '美食爱好者，热爱分享美食体验'
})

// 编辑表单数据
const editForm = ref({
  nickname: '',
  avatar: '',
  signature: ''
})

// 收藏的餐厅 - 从 restaurantDetails 中获取数据
const favoriteRestaurants = ref([
  {
    id: 1,
    name: restaurantDetails['1'].name,
    image: restaurantDetails['1'].image,
    rating: restaurantDetails['1'].rating
  },
  {
    id: 2,
    name: restaurantDetails['2'].name,
    image: restaurantDetails['2'].image,
    rating: restaurantDetails['2'].rating
  },
  {
    id: 3,
    name: restaurantDetails['3'].name,
    image: restaurantDetails['3'].image,
    rating: restaurantDetails['3'].rating
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

// 登录相关的状态
const isLoggedIn = ref(false)
const loginDialogVisible = ref(false)
const loginLoading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 显示编辑对话框
const editProfile = () => {
  editForm.value = {
    nickname: userInfo.value.nickname,
    avatar: userInfo.value.avatar,
    signature: userInfo.value.signature
  }
  dialogVisible.value = true
}

// 处理头像上传
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }

  // 创建本地预览URL
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    editForm.value.avatar = e.target.result
  }
  return false // 阻止自动上传
}

// 保存个人资料
const handleSaveProfile = () => {
  userInfo.value = {
    ...userInfo.value,
    nickname: editForm.value.nickname,
    avatar: editForm.value.avatar || defaultAvatar,
    signature: editForm.value.signature
  }
  dialogVisible.value = false
  ElMessage.success('个人资料更新成功')
}

// 方法
const navigateToRestaurant = (restaurantId) => {
  router.push(`/restaurant/${restaurantId}`)
}

// 显示登录对话框
const showLoginDialog = () => {
  loginDialogVisible.value = true
}

// 处理登录
const handleLogin = () => {
  loginLoading.value = true
  // 模拟登录请求
  setTimeout(() => {
    isLoggedIn.value = true
    loginLoading.value = false
    loginDialogVisible.value = false
    ElMessage.success('登录成功！')
    
    // 重置表单
    loginForm.value = {
      username: '',
      password: ''
    }
  }, 1000)
}

// 处理登出
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    isLoggedIn.value = false
    ElMessage.success('已退出登录')
  }).catch(() => {
    // 添加取消处理
    ElMessage.info('已取消退出')
  })
}
</script>

<style scoped>
.el-header {
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  .el-row {
    margin: 0;
  }

  .el-col {
    padding: 10px;
  }

  .restaurant-item {
    cursor: pointer;
    padding: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .el-image {
      width: 100%;
      height: 160px;
      border-radius: 8px;
      margin-bottom: 15px;
      object-fit: cover;
    }

    h4 {
      margin: 10px 0;
      font-size: 1.1em;
      color: var(--el-text-color-primary);
      flex-grow: 1;
    }

    .restaurant-rating {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.9em;
      color: #666;
      margin-top: auto;
    }
  }
}

.content-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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

:deep(.el-button--link) {
  color: var(--secondary-color);
  font-size: 0.9em;
  padding: 0;

  &:hover {
    color: var(--primary-color);
  }
}

.avatar-uploader {
  text-align: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.user-signature {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  color: var(--el-text-color-primary);
  font-size: 14px;
}

:deep(.el-dialog__body) {
  padding: 30px 40px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 登录表单样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary-light-2);
}
</style> 