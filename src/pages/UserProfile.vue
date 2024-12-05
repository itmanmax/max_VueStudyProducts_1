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
        <el-button v-if="!isLoggedIn" type="success" @click="showRegisterDialog">注册</el-button>
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
      @close="resetForm('loginForm')"
    >
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱" />
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
          <el-button type="primary" @click="submitLogin" :loading="loginLoading">
            登录
          </el-button>
          <el-button link @click="switchToRegister">
            没有账号？立即注册
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 注册对话框 -->
    <el-dialog
      title="用户注册"
      v-model="registerDialogVisible"
      width="400px"
      center
      @close="resetForm('registerForm')"
    >
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRegister" :loading="registerLoading">
            注册
          </el-button>
          <el-button link @click="switchToLogin">
            已有账号？立即登录
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑资料对话框 -->
    <el-dialog
      title="编个人资料"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import restaurantDetails from '../data/restaurantDetails.json'
import { userApi } from '../api'

const router = useRouter()
const defaultAvatar = '/Users/Users1.jpg'
const dialogVisible = ref(false)
const loginDialogVisible = ref(false)
const registerDialogVisible = ref(false)
const loginLoading = ref(false)
const registerLoading = ref(false)
const isLoggedIn = ref(false)

// 表单引用
const loginFormRef = ref(null)
const registerFormRef = ref(null)

// 用户基本信息
const userInfo = ref({
  id: '',
  nickname: '',
  avatar: defaultAvatar,
  favoriteCount: 0,
  commentCount: 0,
  likeCount: 0,
  signature: ''
})

// 空的收藏列表和活动历史
const favoriteRestaurants = ref([])
const userActivities = ref([])

// 登录表单
const loginForm = ref({
  email: '',
  password: ''
})

// 注册表单
const registerForm = ref({
  name: '',  // 修改为 name 以匹配 API
  email: '',
  password: '',
  confirmPassword: ''
})

// 登录表单验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  name: [  // 修改为 name 以匹配 API
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 显示登录对话框
const showLoginDialog = () => {
  loginDialogVisible.value = true
}

// 显示注册对话框
const showRegisterDialog = () => {
  registerDialogVisible.value = true
}

// 切换到注册
const switchToRegister = () => {
  loginDialogVisible.value = false
  resetForm('loginForm')
  registerDialogVisible.value = true
}

// 切换到登录
const switchToLogin = () => {
  registerDialogVisible.value = false
  resetForm('registerForm')
  loginDialogVisible.value = true
}

// 重置表单
const resetForm = (formName) => {
  if (formName === 'loginForm') {
    loginFormRef.value?.resetFields()
    loginForm.value = {
      email: '',
      password: ''
    }
  } else if (formName === 'registerForm') {
    registerFormRef.value?.resetFields()
    registerForm.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
}

// 提交注册
const submitRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    console.log('开始表单验证...')
    await registerFormRef.value.validate()
    console.log('表单验证通过')
    
    registerLoading.value = true
    
    // 准备注册数据
    const registerData = {
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password
    }
    console.log('准备发送的注册数据:', JSON.stringify(registerData, null, 2))
    
    // 调用注册 API
    console.log('开始调用注册 API...')
    const response = await userApi.register(registerData)
    console.log('收到注册 API 响应:', JSON.stringify(response, null, 2))
    
    // 检查注册响应 - 修改判断逻辑
    if (response && response.userId) {
      console.log('注册成功，响应数据:', JSON.stringify(response, null, 2))
      // 注册成功
      ElMessage.success('注册成功，请登录')
      
      // 保存注册时使用的邮箱
      const registeredEmail = response.email
      console.log('保存的注册邮箱:', registeredEmail)
      
      // 重置注册表单
      resetForm('registerForm')
      
      // 关闭注册窗口，打开登录窗口
      registerDialogVisible.value = false
      
      // 等待一小段时间后打开登录窗口，让用户看到成功消息
      setTimeout(() => {
        loginDialogVisible.value = true
        // 填充邮箱
        loginForm.value.email = registeredEmail
      }, 1000)
      
    } else {
      console.error('注册失败，响应内容:', JSON.stringify(response, null, 2))
      // 注册失败
      ElMessage.error(response?.message || '注册失败，请重试')
    }
  } catch (error) {
    console.error('注册过程发生错误:', error)
    if (error.response) {
      console.error('错误响应数据:', JSON.stringify(error.response.data, null, 2))
      ElMessage.error(error.response.data?.message || '注册失败，请重试')
    } else if (error.message) {
      console.error('错误信息:', error.message)
      ElMessage.error(error.message)
    } else {
      console.error('未知错误:', error)
      ElMessage.error('注册失败，请重试')
    }
  } finally {
    registerLoading.value = false
    console.log('注册流程结束')
  }
}

// 提交登录
const submitLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    loginLoading.value = true
    const token = await userApi.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })
    
    // 保存 token 到 localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('isLoggedIn', 'true')
    
    isLoggedIn.value = true
    loginDialogVisible.value = false
    ElMessage.success('登录成功')
    
    // 重置表单
    resetForm('loginForm')
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    loginLoading.value = false
  }
}

// 处理登出
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除 token 和登录状态
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
    
    isLoggedIn.value = false
    userInfo.value = {
      id: '',
      nickname: '',
      avatar: defaultAvatar,
      favoriteCount: 0,
      commentCount: 0,
      likeCount: 0,
      signature: ''
    }
    ElMessage.success('已退出登录')
  })
}

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const isUserLoggedIn = localStorage.getItem('isLoggedIn')
  
  if (token && isUserLoggedIn === 'true') {
    isLoggedIn.value = true
  }
}

onMounted(() => {
  checkLoginStatus()
})

// 编辑资料相关
const editForm = ref({
  nickname: '',
  avatar: '',
  signature: ''
})

const editProfile = () => {
  editForm.value = {
    nickname: userInfo.value.nickname,
    avatar: userInfo.value.avatar,
    signature: userInfo.value.signature
  }
  dialogVisible.value = true
}

const handleSaveProfile = () => {
  // 模拟保存个人资料
  userInfo.value = {
    ...userInfo.value,
    ...editForm.value
  }
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

const beforeAvatarUpload = (file) => {
  // 模拟头像上传
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    editForm.value.avatar = reader.result
  }
  return false
}

const navigateToRestaurant = (restaurantId) => {
  router.push(`/restaurant/${restaurantId}`)
}
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.welcome-text {
  margin-right: 15px;
  font-size: 16px;
  color: #606266;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.user-info-card {
  text-align: center;
  padding: 20px;
}

.user-header {
  margin-bottom: 20px;
}

.user-header h3 {
  margin: 10px 0 5px;
  font-size: 18px;
}

.user-id {
  color: #909399;
  font-size: 14px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .number {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.stat-item .label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
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
  margin-top: 20px;
}

.restaurant-item {
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.restaurant-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.restaurant-item .el-image {
  width: 100%;
  height: 150px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.restaurant-item h4 {
  margin: 10px 0;
  font-size: 16px;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-uploader {
  text-align: center;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
}

.avatar-uploader-icon:hover {
  border-color: #409eff;
}
</style> 