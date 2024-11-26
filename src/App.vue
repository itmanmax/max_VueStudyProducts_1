<template>
  <el-container class="app-container">
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
        <el-menu-item index="User" class="menu-item">
          <el-icon><UserFilled /></el-icon>
          <span>会员专区</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, Shop, UserFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeMenu = ref('Home')

// 更新激活的菜单项
const updateActiveMenu = () => {
  if (route.name === 'Home') {
    activeMenu.value = 'Home'
  } else if (route.name === 'RestaurantDetails') {
    activeMenu.value = 'Restaurant'
  } else if (route.name === 'UserInfo') {
    activeMenu.value = 'User'
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
  } else if (key === 'User') {
    router.push({ name: 'UserInfo' })
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  overflow: hidden;
}

.logo-container {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.brand-name {
  margin-top: 15px;
  font-size: 1.4rem;
  color: #333;
  letter-spacing: 3px;
  font-weight: 300;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.el-menu-vertical {
  border: none;
  padding: 20px 0;
}

.menu-item {
  margin: 8px 16px;
  border-radius: 8px;
  height: 50px;
  line-height: 50px;
  border: none !important;
}

.menu-item:hover {
  background: rgba(212, 175, 55, 0.05) !important;
}

.menu-item.is-active {
  background: rgba(212, 175, 55, 0.1) !important;
}

.el-icon {
  font-size: 18px;
  margin-right: 12px;
}

.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
}

.aside-container {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  height: 100vh;
  overflow-y: auto;
}

.el-main {
  height: 100vh;
  padding: 0;
  overflow: hidden;
}

/* 确保内容区域的卡片能够正确排列 */
:deep(.el-row) {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

:deep(.el-col) {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
