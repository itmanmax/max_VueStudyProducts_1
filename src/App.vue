<template>
  <el-container class="app-container">
    <SideNav />
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import SideNav from './components/SideNav.vue'
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

.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
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

.el-icon {
  font-size: 18px;
  margin-right: 12px;
}

/* 添加全局变量 */
:root {
  --primary-color: #1d3d32;      /* 深绿色 */
  --secondary-color: #2a9d8f;    /* 青绿色 */
  --accent-color: #4fd1c5;       /* 浅青色 */
  --text-primary: #2c3e50;       /* 主要文字颜色 */
  --text-secondary: #4a5568;     /* 次要文字颜色 */
  --background-light: #f8f9fa;   /* 浅色背景 */
  --gradient-primary: linear-gradient(135deg, #1d3d32 0%, #2a9d8f 100%);
}
</style>
