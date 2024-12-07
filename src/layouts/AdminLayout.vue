<template>
  <el-container class="admin-layout">
    <el-aside width="240px">
      <AdminSideNav />
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AdminSideNav from '../components/AdminSideNav.vue'
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.el-aside {
  background-color: transparent;
  border-right: none;
}

.el-main {
  padding: 20px;
  background-color: var(--el-bg-color);
}
</style> 