<template>
  <el-container class="app-container">
    <!-- 侧边栏 -->
    <el-aside width="240px" class="app-aside">
      <AdminSideNav v-if="userStore.isLoggedIn && userStore.isAdmin" />
      <SideNav v-else />
    </el-aside>

    <!-- 主内容区域 -->
    <el-container class="main-wrapper">
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

    <!-- AI对话框 -->
    <AiChatBox />
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SideNav from './components/SideNav.vue'
import AdminSideNav from './components/AdminSideNav.vue'
import AiChatBox from './components/AiChatBox.vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const { isLoggedIn, isAdmin } = storeToRefs(userStore)

onMounted(async () => {
  await userStore.initializeState()
})
</script>

<style>
/* 重置样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}

/* 全局变量 */
:root {
  --primary-color: #1d3d32;
  --secondary-color: #2a9d8f;
  --accent-color: #4fd1c5;
  --text-primary: #2c3e50;
  --text-secondary: #4a5568;
  --background-light: #f8f9fa;
  --gradient-primary: linear-gradient(135deg, #1d3d32 0%, #2a9d8f 100%);
}

/* 布局样式 */
.app-container {
  min-height: 100vh;
  display: flex;
}

.app-aside {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  z-index: 1000;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.main-wrapper {
  margin-left: 240px;
  flex: 1;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.el-main {
  padding: 20px;
  height: 100%;
}

/* Element Plus 主题覆盖 */
:root {
  --el-color-primary: var(--secondary-color);
}

.el-container {
  min-height: 100vh;
}

.el-icon {
  font-size: 18px;
  margin-right: 12px;
}

/* 排除AI聊天按钮的图标样式 */
.chat-toggle-btn .el-icon {
  margin-right: 0;
}
</style>
