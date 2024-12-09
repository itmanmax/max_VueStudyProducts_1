<template>
  <div class="developing-page">
    <el-card class="feature-card">
      <template #header>
        <div class="card-header">
          <h2>功能开发计划</h2>
          <el-tag type="success">持续更新中</el-tag>
        </div>
      </template>

      <el-timeline>
        <!-- 订单管理系统 -->
        <el-timeline-item
          timestamp="预计2024年Q1"
          placement="top"
          type="primary"
        >
          <el-card class="feature-item">
            <h4>订单管理系统</h4>
            <el-progress :percentage="70" status="success" />
            <div class="feature-details">
              <p>主要功能：</p>
              <ul>
                <li>订单创建和处理流程</li>
                <li>订单状态实时追踪</li>
                <li>订单统计和分析</li>
                <li>支付系统集成</li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 评价管理系统 -->
        <el-timeline-item
          timestamp="预计2024年Q2"
          placement="top"
          type="warning"
        >
          <el-card class="feature-item">
            <h4>评价管理系统</h4>
            <el-progress :percentage="45" status="exception" />
            <div class="feature-details">
              <p>主要功能：</p>
              <ul>
                <li>用户评价管理</li>
                <li>评分统计分析</li>
                <li>差评预警系统</li>
                <li>评价回复功能</li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 会员积分系统 -->
        <el-timeline-item
          timestamp="预计2024年Q2"
          placement="top"
          type="info"
        >
          <el-card class="feature-item">
            <h4>会员积分系统</h4>
            <el-progress :percentage="30" />
            <div class="feature-details">
              <p>主要功能：</p>
              <ul>
                <li>会员等级管理</li>
                <li>积分规则配置</li>
                <li>积分兑换商城</li>
                <li>会员特权管理</li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 数据分析系统 -->
        <el-timeline-item
          timestamp="预计2024年Q3"
          placement="top"
        >
          <el-card class="feature-item">
            <h4>数据分析系统</h4>
            <el-progress :percentage="15" />
            <div class="feature-details">
              <p>主要功能：</p>
              <ul>
                <li>销售数据分析</li>
                <li>用户行为分析</li>
                <li>经营报表生成</li>
                <li>数据可视化展示</li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 营销活动系统 -->
        <el-timeline-item
          timestamp="预计2024年Q3"
          placement="top"
          type="success"
        >
          <el-card class="feature-item">
            <h4>营销活动系统</h4>
            <el-progress :percentage="5" />
            <div class="feature-details">
              <p>主要功能：</p>
              <ul>
                <li>优惠券管理</li>
                <li>限时特惠活动</li>
                <li>节日营销活动</li>
                <li>会员专享活动</li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <div class="note-section">
        <el-alert
          title="开发说明"
          type="info"
          description="以上功能正在积极开发中，具体上线时间可能会根据实际情况调整。我们会优先考虑用户反馈和市场需求来调整开发优先级。"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.developing-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.feature-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.feature-item {
  margin-bottom: 20px;
}

.feature-item h4 {
  margin: 0 0 15px 0;
  color: var(--el-text-color-primary);
  font-size: 18px;
}

.feature-details {
  margin-top: 15px;
}

.feature-details p {
  margin: 10px 0;
  font-weight: bold;
  color: var(--el-text-color-regular);
}

.feature-details ul {
  margin: 0;
  padding-left: 20px;
  color: var(--el-text-color-secondary);
}

.feature-details li {
  margin: 5px 0;
}

.note-section {
  margin-top: 30px;
}

:deep(.el-timeline-item__node) {
  background-color: var(--el-color-primary);
}

:deep(.el-timeline-item__timestamp) {
  color: var(--el-text-color-secondary);
  font-weight: bold;
}

:deep(.el-progress-bar__inner) {
  transition: width 0.6s ease;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style> 