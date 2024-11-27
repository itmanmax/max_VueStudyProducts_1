<template>
  <el-aside width="240px" class="aside-container">
    <div class="logo-container">
      <img alt="Logo" class="logo" src="/logo.svg" />
      <div class="brand-name">惊喜一餐</div>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      @select="handleSelect"
      background-color="transparent"
      text-color="#666"
      active-text-color="#d4af37"
    >
      <el-menu-item index="Home" class="menu-item">
        <el-icon><HomeFilled /></el-icon>
        <span>探索殿堂</span>
      </el-menu-item>
      <el-menu-item index="Restaurant" class="menu-item">
        <el-icon><Shop /></el-icon>
        <span>米其林餐厅</span>
      </el-menu-item>
      <el-sub-menu index="UserManagement" class="menu-item">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户中心</span>
        </template>
        <el-menu-item index="UserProfile" class="sub-menu-item">
          <el-icon><UserFilled /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="UserManagement" class="sub-menu-item">
          <el-icon><Setting /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeFilled, 
  Shop, 
  UserFilled, 
  User,
  Setting 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeMenu = ref('Home')

// 更新激活的菜单项
const updateActiveMenu = () => {
  if (route.name === 'Home') {
    activeMenu.value = 'Home'
  } else if (route.name === 'RestaurantDetails' || route.name === 'RestaurantList') {
    activeMenu.value = 'Restaurant'
  } else if (route.name === 'UserProfile') {
    activeMenu.value = 'UserProfile'
  } else if (route.name === 'UserManagement') {
    activeMenu.value = 'UserManagement'
  }
}

watch(
  () => route.name,
  () => {
    updateActiveMenu()
  },
  { immediate: true }
)

// 处理菜单选择
const handleSelect = (key) => {
  if (key === 'Home') {
    router.push({ name: 'Home' })
  } else if (key === 'Restaurant') {
    router.push({ name: 'RestaurantList' })
  } else if (key === 'UserProfile') {
    router.push({ name: 'UserProfile' })
  } else if (key === 'UserManagement') {
    router.push({ name: 'UserManagement' })
  }
}
</script>

<style scoped>
.logo-container {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.brand-name {
  margin-top: 15px;
  font-size: 1.4rem;
  color: #ffffff;
  letter-spacing: 3px;
  font-weight: 300;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.el-menu-vertical {
  background: transparent !important;
  border: none;
  padding: 20px 0;
}

.menu-item {
  background: rgba(255, 255, 255, 0.1) !important;
  margin: 8px 16px;
  border-radius: 8px;
  height: 50px;
  line-height: 50px;
  border: none !important;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.menu-item.is-active {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}

.aside-container {
  flex-shrink: 0;
  background: var(--gradient-primary);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
}

.sub-menu-item {
  padding-left: 54px !important;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
  margin: 4px 16px;
}

:deep(.el-sub-menu__title) {
  margin: 8px 16px;
  border-radius: 8px;
}

:deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
}

:deep(.el-menu) {
  border: none;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
}
</style> 