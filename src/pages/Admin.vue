<template>
  <div class="admin-redirect">
    <el-card class="loading-card">
      <template #header>
        <div class="card-header">
          <h3>管理员页面加载中...</h3>
        </div>
      </template>
      <div class="loading-content">
        <el-icon class="loading-icon" :size="48">
          <Loading />
        </el-icon>
        <p class="loading-text">正在跳转到管理员仪表盘...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()

onMounted(() => {
  // 自动重定向到管理员仪表盘
  setTimeout(() => {
    router.replace('/admin/dashboard')
  }, 500)
})
</script>

<style scoped>
.admin-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.loading-card {
  width: 400px;
  text-align: center;
}

.card-header {
  display: flex;
  justify-content: center;
}

.loading-content {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-icon {
  animation: rotate 2s linear infinite;
  color: var(--el-color-primary);
}

.loading-text {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 