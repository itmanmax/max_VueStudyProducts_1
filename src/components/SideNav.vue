<template>
  <div class="side-nav">
    <div class="logo-container">
      <img src="/logo.svg" alt="Logo" class="logo">
      <h1 class="app-title">惊喜一餐</h1>
    </div>

    <el-menu
      class="nav-menu"
      :collapse="isCollapse"
      :default-active="activeIndex"
      router
    >
      <el-menu-item index="/" class="menu-item">
        <el-icon><HomeFilled /></el-icon>
        <span>探索殿堂</span>
      </el-menu-item>
      <el-menu-item index="/restaurants" class="menu-item">
        <el-icon><Shop /></el-icon>
        <span>米其林餐厅</span>
      </el-menu-item>
      <el-menu-item index="/user" class="menu-item">
        <el-icon><User /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>

    <div class="announcement-btn">
      <el-button 
        link
        class="announcement-trigger"
        @click="showAnnouncement"
      >
        <el-icon><Bell /></el-icon>
        <span>公告</span>
      </el-button>
    </div>

    <div class="nav-footer" v-if="isLoggedIn">
      <el-button 
        type="danger" 
        class="logout-btn"
        @click="handleLogout"
      >
        <el-icon><SwitchButton /></el-icon>
        <span>退出登录</span>
      </el-button>
    </div>

    <el-drawer
      v-model="drawerVisible"
      title="系统公告"
      direction="ttb"
      size="80%"
      :with-header="true"
    >
      <template #header>
        <div class="drawer-header">
          <span class="drawer-title">系统公告</span>
          <el-button
            class="close-btn"
            type="danger"
            circle
            @click="drawerVisible = false"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      <div class="markdown-content" v-html="markdownContent"></div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeFilled, 
  Shop, 
  UserFilled, 
  User,
  Setting,
  Bell,
  Close,
  SwitchButton 
} from '@element-plus/icons-vue'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const activeIndex = ref('/')
const drawerVisible = ref(false)
const markdownContent = ref('')
const isLoggedIn = ref(localStorage.getItem('token') !== null)

const fetchAnnouncement = async () => {
  try {
    const response = await fetch('https://www.maxtral.fun/APIphp/Supermeak/clear.md', {
      method: 'GET',
      headers: {
        'Accept': 'text/markdown,text/plain,*/*'
      }
    })
    
    if (!response.ok) {
      console.error('响应状态:', response.status, response.statusText)
      const text = await response.text()
      console.error('响应内容:', text)
      throw new Error('网络响应不正常')
    }
    const text = await response.text()
    console.log('成功获取到的内容:', text.substring(0, 100) + '...') // 只显示前100个字符
    markdownContent.value = marked(text)
  } catch (error) {
    console.error('加载公告失败:', error)
    ElMessage.error('加载公告失败，请稍后重试')
    // 如果加载失败，显示一个默认的公告内容
    markdownContent.value = marked(`
# 系统公告

## 暂时无法加载在线公告
很抱歉，当前无法加载在线公告内容。这可能是由于以下原因：
- 网络连接问题
- 服务器暂时不可用
- 跨域访问限制

请稍后再试。
    `)
  }
}

const showAnnouncement = () => {
  drawerVisible.value = true
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('isAdmin')
  isLoggedIn.value = false
  ElMessage.success('已退出登录')
  router.push('/')
}

// 监听 localStorage 的变化
watch(() => localStorage.getItem('token'), (newValue) => {
  isLoggedIn.value = newValue !== null
})

onMounted(() => {
  fetchAnnouncement()
})

// 更新激活的菜单项
const updateActiveMenu = () => {
  const path = route.path
  activeIndex.value = path
}

watch(
  () => route.path,
  () => {
    updateActiveMenu()
  },
  { immediate: true }
)

// 处理菜单选择
const handleSelect = (key) => {
  router.push(key)
}
</script>

<style scoped>
.side-nav {
  height: 100%;
  background: linear-gradient(180deg, #2A9D8F 0%, #264653 100%);
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
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

.sub-menu-item {
  padding-left: 54px !important;
}

:deep(.el-menu) {
  background: transparent !important;
  border: none;
}

:deep(.el-sub-menu) {
  background: transparent !important;
  
  &.menu-item {
    margin: 0;
    background: transparent !important;
  }
}

:deep(.el-sub-menu__title) {
  margin: 8px 16px !important;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: translateY(-1px);
  }
}

:deep(.el-sub-menu.is-opened) {
  background: transparent !important;
  
  .el-sub-menu__title {
    background: rgba(255, 255, 255, 0.15) !important;
  }
}

:deep(.el-sub-menu__content) {
  background: transparent !important;
  padding: 4px 0;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
  margin: 4px 16px;
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 6px;
  height: 40px;
  line-height: 40px;

  &:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    transform: translateY(-1px);
  }

  &.is-active {
    background: rgba(255, 255, 255, 0.18) !important;
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

:deep(.el-menu-item), 
:deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
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

:deep(.el-icon) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin-right: 8px;
  vertical-align: middle;
}

.announcement-btn {
  padding: 16px;
  margin-top: auto;
}

.announcement-trigger {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff !important;
  transition: all 0.3s ease;
  padding: 0 16px;
}

.announcement-trigger:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

.announcement-trigger :deep(.el-icon) {
  margin-right: 0;
}

.markdown-content {
  padding: 20px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
  font-size: 16px;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  margin-bottom: 1em;
  color: var(--secondary-color);
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  margin: 1em 0;
  color: var(--secondary-color);
}

.markdown-content :deep(p) {
  margin: 1em 0;
}

.markdown-content :deep(ul) {
  padding-left: 2em;
  margin: 1em 0;
}

.markdown-content :deep(li) {
  margin: 0.5em 0;
}

.markdown-content :deep(code) {
  background: #f5f7fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-content :deep(pre) {
  background: #f5f7fa;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-drawer__header > :first-child) {
  margin: 0;
}

:deep(.el-drawer__close-btn) {
  display: none;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.drawer-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.close-btn {
  font-size: 16px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
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