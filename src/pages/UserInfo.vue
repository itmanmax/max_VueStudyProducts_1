<template>
  <el-container>
    <el-header>
      <h2>用户信息</h2>
    </el-header>
    <el-main>
      <el-card>
        <h3>基本信息</h3>
        <el-descriptions column="1">
          <el-descriptions-item label="用户名">张三</el-descriptions-item>
          <el-descriptions-item label="邮箱">zhangsan@example.com</el-descriptions-item>
          <el-descriptions-item label="注册时间">2023-01-01</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="mt-20">
        <h3>收藏的餐厅</h3>
        <el-table :data="favoriteRestaurants" style="width: 100%">
          <el-table-column prop="name" label="餐厅名称" width="180"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" size="mini" @click="removeFavorite(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="mt-20">
        <h3>历史操作记录</h3>
        <el-timeline>
          <el-timeline-item v-for="(record, index) in history" :key="index" :timestamp="record.time">
            {{ record.action }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const favoriteRestaurants = ref([
  { name: '美味轩' },
  { name: '食尚坊' },
  { name: '味道之家' }
])

const history = ref([
  { time: '2023-04-01', action: '收藏了“美味轩”' },
  { time: '2023-03-28', action: '评论了“食尚坊”' },
  { time: '2023-03-20', action: '收藏了“味道之家”' }
])

const removeFavorite = (index) => {
  favoriteRestaurants.value.splice(index, 1)
}
</script>

<style scoped>
.mt-20 {
  margin-top: 20px;
}
</style> 