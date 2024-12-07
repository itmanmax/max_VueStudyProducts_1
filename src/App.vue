<template>
  <!-- 管理员布局 -->
  <template v-if="isAdmin">
    <router-view></router-view>
  </template>

  <!-- 用户布局 -->
  <template v-else>
    <el-container class="app-container">
      <el-aside width="240px">
        <SideNav />
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </template>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from './components/SideNav.vue'

const route = useRoute()
const isAdmin = ref(false)

// 监听路由变化，判断是否是管理员页面
watch(
  () => route.path,
  (path) => {
    isAdmin.value = path.startsWith('/admin')
  },
  { immediate: true }
)

// 监听 localStorage 中的管理员状态
watch(
  () => localStorage.getItem('isAdmin'),
  (newValue) => {
    isAdmin.value = newValue === 'true'
  },
  { immediate: true }
)
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
  --primary-color: #1d3d32;      /* 深绿色 */
  --secondary-color: #2a9d8f;    /* 青绿色 */
  --accent-color: #4fd1c5;       /* 浅青色 */
  --text-primary: #2c3e50;       /* 主要文字颜色 */
  --text-secondary: #4a5568;     /* 次要文字颜色 */
  --background-light: #f8f9fa;   /* 浅色背景 */
  --gradient-primary: linear-gradient(135deg, #1d3d32 0%, #2a9d8f 100%);
}

.app-container {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
}

.el-aside {
  background-color: transparent;
  border-right: none;
  padding: 0;
  flex-shrink: 0;
}

.el-main {
  padding: 0;
  margin: 0;
  background-color: transparent;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.el-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* Element Plus 主题覆盖 */
:root {
  --el-color-primary: var(--secondary-color);
}

/* 确保内容区域的卡片能够正确排列 */
.el-row {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.el-col {
  padding-left: 10px;
  padding-right: 10px;
}

.el-icon {
  font-size: 18px;
  margin-right: 12px;
}
</style>
