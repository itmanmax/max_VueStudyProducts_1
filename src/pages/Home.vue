<template>
  <div class="home-container">
    <div class="background-gradient"></div>
    <div class="overlay"></div>
    <div class="content-wrapper">
      <div class="header-section">
        <h1 class="title">惊喜一餐-zhn</h1>
        <div class="divider">
          <span class="line"></span>
          <span class="dot"></span>
          <span class="line"></span>
        </div>
        <p class="subtitle">臻选星级美馔 · 品鉴非凡味境</p>
        <div class="welcome-text">
          <p>欢迎来到惊喜一餐</p>
          <p>这里为您准备了一顿特别的惊喜餐点！</p>
        </div>
      </div>
      
      <div class="recommendation-section">
        <h2 class="section-title">今日推荐</h2>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="lucky-draw-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>今日餐馆</span>
                  <el-button type="primary" @click="drawLuckyRestaurant" :loading="drawingRestaurant">
                    <el-icon><Collection /></el-icon>
                    抽个签
                  </el-button>
                </div>
              </template>
              
              <div class="lucky-draw-content" v-if="!drawingRestaurant && randomRestaurant.id">
                <div class="lucky-paper">
                  <div class="lucky-result">
                    <el-image 
                      :src="randomRestaurant.image" 
                      fit="cover" 
                      class="restaurant-image"
                      @click="goToRestaurant(randomRestaurant.id)"
                    />
                    <div class="restaurant-info">
                      <h3>{{ randomRestaurant.name }}</h3>
                      <el-rate v-model="randomRestaurant.rating" disabled show-score />
                      <p class="description">{{ randomRestaurant.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="drawingRestaurant" class="drawing-animation">
                <el-icon class="rotating-icon"><Collection /></el-icon>
                <p>正在求签...</p>
              </div>
              <div v-else class="empty-draw">
                <el-icon><Collection /></el-icon>
                <p>点击抽签，寻找你的缘分餐厅</p>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="scratch-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>今日美味</span>
                  <el-button type="primary" @click="resetScratch" v-if="isScratched">
                    <el-icon><Refresh /></el-icon>
                    换一张
                  </el-button>
                </div>
              </template>
              
              <div class="scratch-content" ref="scratchCard">
                <canvas 
                  ref="canvas" 
                  class="scratch-canvas"
                  @mousedown.passive="startScratching"
                  @mousemove.passive="scratching"
                  @mouseup.passive="stopScratching"
                  @mouseleave.passive="stopScratching"
                  @touchstart.passive="startScratching"
                  @touchmove.passive="scratching"
                  @touchend.passive="stopScratching"
                ></canvas>
                
                <div class="lucky-draw-content">
                  <div class="lucky-paper">
                    <div class="lucky-result">
                      <el-image 
                        :src="randomDish.image" 
                        fit="cover" 
                        class="dish-image"
                        @click="goToDish(randomDish.id)"
                      />
                      <div class="dish-info">
                        <h3>{{ randomDish.name }}</h3>
                        <p class="restaurant-name">来自：{{ randomDish.restaurantName }}</p>
                        <el-rate v-model="randomDish.rating" disabled show-score />
                        <p class="description">{{ randomDish.description }}</p>
                        <div class="price">¥{{ randomDish.price }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="bottom-link">
        <a href="http://home.maxtral.fun" target="_blank">MAX主页</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Collection, Refresh } from '@element-plus/icons-vue'
import { useHome } from '../js/Home'
import '../css/Home.css'

const {
  drawingRestaurant,
  randomRestaurant,
  randomDish,
  canvas,
  scratchCard,
  isScratching,
  isScratched,
  drawLuckyRestaurant,
  initScratchCard,
  startScratching,
  scratching,
  stopScratching,
  resetScratch,
  goToRestaurant,
  goToDish
} = useHome()
</script> 