<template>
  <div class="ai-chat-box" :class="{ 'chat-expanded': isExpanded }">
    <!-- 聊天图标按钮 -->
    <el-button
      class="chat-toggle-btn"
      type="primary"
      @click="handleChatClick"
    >
      <el-icon :class="{ 'is-expanded': isExpanded }" :size="24">
        <ChatDotRound v-if="!isExpanded" />
        <Close v-else />
      </el-icon>
    </el-button>

    <!-- 聊天窗口 -->
    <div class="chat-window" v-show="isExpanded && userStore.isLoggedIn">
      <div class="chat-header">
        <span>AI 助手</span>
        <el-select v-model="currentType" size="small" style="width: 120px">
          <el-option label="餐厅咨询" value="RESTAURANT" />
          <el-option label="菜品咨询" value="DISH" />
          <el-option label="优惠券" value="COUPON" />
          <el-option label="个性推荐" value="RECOMMENDATION" />
          <el-option label="评价相关" value="FEEDBACK" />
          <el-option label="标签搜索" value="TAG" />
        </el-select>
        <el-button
          link
          icon="Delete"
          @click="clearChat"
          :disabled="messages.length === 0"
        >
          清空对话
        </el-button>
      </div>

      <!-- 消息列表 -->
      <div class="chat-messages" ref="messageContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role]"
        >
          <el-avatar
            :size="32"
            :src="message.role === 'user' ? userStore.userInfo?.avatar : AI_AVATAR"
          />
          <div class="message-content">
            <div v-if="message.role === 'assistant'" v-html="markdownToHtml(message.content)" class="markdown-content"></div>
            <div v-else>{{ message.content }}</div>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          placeholder="请输入消息..."
          :disabled="loading"
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button
              type="primary"
              :icon="loading ? 'Loading' : 'Position'"
              :loading="loading"
              @click="sendMessage"
              :disabled="!inputMessage.trim()"
            >
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '../stores/userStore'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ChatDotRound, Close } from '@element-plus/icons-vue'
import { marked } from 'marked'

const router = useRouter()
const userStore = useUserStore()
const isExpanded = ref(false)
const inputMessage = ref('')
const messages = ref([])
const loading = ref(false)
const messageContainer = ref(null)
const currentType = ref('RESTAURANT')

// 设置 AI 头像常量
const AI_AVATAR = 'http://pic.maxtral.fun/Onedrive/2024/11/20/673ccf0d7f8b6.ico'

// 配置 marked 选项
marked.setOptions({
  breaks: true,  // 支持换行
  gfm: true,     // 支持 GitHub 风格 Markdown
  sanitize: true // 消毒 HTML 标签
})

// Markdown 转 HTML
const markdownToHtml = (content) => {
  try {
    return marked(content || '')
  } catch (error) {
    console.error('Markdown 解析错误:', error)
    return content
  }
}

// 处理聊天按钮点击
const handleChatClick = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再使用AI助手')
    router.push('/user')
    return
  }
  toggleChat()
}

// 切换聊天窗口
const toggleChat = () => {
  isExpanded.value = !isExpanded.value
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = inputMessage.value.trim()
  messages.value.push({
    role: 'user',
    content: userMessage
  })
  inputMessage.value = ''
  loading.value = true

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        message: userMessage,
        userId: userStore.userInfo?.name,
        type: currentType.value
      })
    })

    if (!response.ok) throw new Error('请求失败')

    const data = await response.json()
    if (data.code === 200) {
      messages.value.push({
        role: 'assistant',
        content: data.data
      })
    } else {
      throw new Error(data.message || '请求失败')
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error(error.message || '发送消息失败，请重试')
    messages.value.pop()
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// 清空对话
const clearChat = async () => {
  try {
    if (!userStore.userInfo?.userId) {
      ElMessage.error('用户信息不完整')
      return
    }
    
    const response = await fetch(`/api/ai/chat/${userStore.userInfo.userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) throw new Error('清空对话失败')

    messages.value = []
    ElMessage.success('对话已清空')
  } catch (error) {
    console.error('清空对话失败:', error)
    ElMessage.error('清空对话失败，请重试')
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动到底部
watch(messages, scrollToBottom)
</script>

<style scoped>
.ai-chat-box {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
}

.chat-toggle-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 48px !important;
  height: 48px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0 !important;
  min-height: unset !important;
}

.el-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
  color: #fff;
}

.chat-window {
  position: absolute;
  right: 0;
  bottom: 56px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  transform-origin: bottom right;
  animation: slideIn 0.3s ease;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: var(--el-color-primary);
  color: white;
  border-radius: 12px 12px 0 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-content {
  background: #f4f4f5;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
  white-space: pre-wrap;  /* 保留换行 */
}

.message.user .message-content {
  background: var(--el-color-primary-light-9);
}

.chat-input {
  padding: 12px;
  border-top: 1px solid #eee;
}

/* 自定义滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f4f4f5;
}

/* 添加动画效果 */
.chat-window {
  transform-origin: bottom right;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--el-color-primary-dark-2);
}

/* 确保图标居中 */
.chat-toggle-btn :deep(.el-icon) {
  margin: 0 !important;
}

/* Markdown 内容样式 */
.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(p) {
  margin: 0.5em 0;
}

.markdown-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.markdown-content :deep(a) {
  color: var(--el-color-primary);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.markdown-content :deep(blockquote) {
  margin: 0.5em 0;
  padding-left: 1em;
  border-left: 4px solid var(--el-color-primary-light-5);
  color: var(--el-text-color-secondary);
}

.message .el-avatar {
  background-color: transparent;  /* 移除头像背景色 */
  border: none;                   /* 移除边框 */
}

/* AI头像特殊样式 */
.message.assistant .el-avatar {
  padding: 2px;                   /* 添加内边距 */
  background: #fff;               /* 白色背景 */
  border-radius: 50%;             /* 保持圆形 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  /* 添加轻微阴影 */
}
</style> 