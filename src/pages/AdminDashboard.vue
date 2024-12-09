<template>
  <div class="dashboard">
    <el-card class="admin-info-card">
      <template #header>
        <div class="card-header">
          <h3>管理员信息</h3>
        </div>
      </template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="管理员ID">{{ adminInfo?.adminId }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ adminInfo?.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ adminInfo?.name }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ adminInfo?.email }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ adminInfo?.phone }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="adminInfo?.status === 1 ? 'success' : 'danger'">
            {{ adminInfo?.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后登录">{{ adminInfo?.lastLogin || '暂无记录' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ adminInfo?.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ adminInfo?.updatedAt }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminAuthApi } from '../api'
import { ElMessage } from 'element-plus'

const adminInfo = ref(null)

const getAdminInfo = async () => {
  try {
    const response = await adminAuthApi.getInfo()
    if (response.data.code === 200) {
      adminInfo.value = response.data.data
    }
  } catch (error) {
    console.error('获取管理员信息失败:', error)
    ElMessage.error('获取管理员信息失败')
  }
}

onMounted(() => {
  getAdminInfo()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.admin-info-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.card-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 18px;
}

:deep(.el-descriptions) {
  padding: 20px;
}

:deep(.el-descriptions__label) {
  width: 120px;
  justify-content: flex-end;
}

:deep(.el-descriptions__content) {
  padding-left: 20px;
}
</style> 