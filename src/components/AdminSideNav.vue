<template>
  <div class="admin-side-nav">
    <div class="logo-container">
      <img src="/logo.svg" alt="Logo" class="logo">
      <h1 class="app-title">管理后台</h1>
    </div>

    <el-menu
      class="nav-menu"
      :default-active="activeIndex"
      router
      :collapse="false"
    >
      <el-menu-item index="/admin/dashboard" class="menu-item">
        <el-icon><DataLine /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>

      <el-menu-item index="/admin/restaurants" class="menu-item">
        <el-icon><Shop /></el-icon>
        <span>餐厅管理</span>
      </el-menu-item>

      <el-menu-item index="/admin/users" class="menu-item">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>

      <el-menu-item index="/admin/developing" class="menu-item" disabled>
        <el-icon><Tools /></el-icon>
        <span>功能开发中</span>
      </el-menu-item>
    </el-menu>

    <div class="nav-footer">
      <el-button 
        type="danger" 
        class="logout-btn"
        @click="handleLogout"
      >
        <el-icon><SwitchButton /></el-icon>
        <span>退出登录</span>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { storeToRefs } from 'pinia'
import { 
  DataLine,
  Shop, 
  User,
  Food,
  Collection,
  Ticket,
  ChatDotRound,
  SwitchButton,
  Tools 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const isCollapse = ref(false)
const activeIndex = ref('/admin/dashboard')

// 处理登出
const handleLogout = async () => {
  await userStore.handleLogout()
  router.push('/')
}

// 监听路由变化
watch(
  () => route.path,
  (path) => {
    activeIndex.value = path
  },
  { immediate: true }
)
</script>

<style scoped>
.admin-side-nav {
  height: 100%;
  background: linear-gradient(180deg, #1d3d32 0%, #264653 100%);
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.logo-container {
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
}

.logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.app-title {
  color: #ffffff;
  font-size: 1.4em;
  margin: 0;
  font-weight: 400;
  letter-spacing: 3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-menu {
  border-right: none;
  background: transparent;
  flex: 1;
}

.menu-item {
  background: rgba(255, 255, 255, 0.08) !important;
  margin: 8px 16px;
  border-radius: 8px;
  height: 50px;
  line-height: 50px;
  border: none !important;
  backdrop-filter: blur(4px);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

.menu-item.is-active {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-menu) {
  background: transparent !important;
  border: none;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s ease;
}

:deep(.el-icon) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin-right: 8px;
  vertical-align: middle;
}

.nav-footer {
  margin-top: auto;
  padding: 16px;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style> 