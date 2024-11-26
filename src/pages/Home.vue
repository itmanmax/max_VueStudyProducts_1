<template>
  <div class="home-container">
    <div class="background-gradient"></div>
    <div class="overlay"></div>
    <div class="content-wrapper">
      <div class="header-section">
        <h1 class="title">惊喜一餐</h1>
        <div class="divider">
          <span class="line"></span>
          <span class="dot"></span>
          <span class="line"></span>
        </div>
        <p class="subtitle">臻选星级美馔 · 品鉴非凡味境</p>
      </div>
      
      <div class="features-section">
        <el-row :gutter="40">
          <el-col :span="8">
            <div class="feature-card">
              <el-icon size="36"><Dish /></el-icon>
              <h3>星级美馔</h3>
              <p>严选米其林星级餐厅，为您呈现极致美食体验</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <el-icon size="36"><Timer /></el-icon>
              <h3>尊享预订</h3>
              <p>专属预订服务，为您保留最佳用餐时段</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <el-icon size="36"><Star /></el-icon>
              <h3>品鉴评价</h3>
              <p>美食鉴赏家真实点评，打造完美用餐体验</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="action-section">
        <button class="explore-btn" @click="goToRestaurants">
          <span class="btn-text">探索星级美馔</span>
          <span class="btn-icon">→</span>
        </button>
      </div>

      <div class="bottom-link">
        <a href="http://home.maxtral.fun" target="_blank">MAX主页</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Dish, Timer, Star } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRestaurants = () => {
  router.push({ name: 'RestaurantList' })
}
</script>

<style scoped>
.home-container {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a4f63 0%, #2a9d8f 100%);
  opacity: 0.9;
  z-index: -2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header-section {
  text-align: center;
  margin-top: 20px;
  color: #ffffff;
}

.title {
  font-size: 4.5rem;
  margin-bottom: 2rem;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto;
  width: 300px;
}

.line {
  height: 1px;
  width: 100px;
  background: rgba(255, 255, 255, 0.5);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  margin: 0 15px;
}

.subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 6px;
  opacity: 0.9;
  margin-top: 30px;
  font-family: "Noto Serif SC", serif;
}

.features-section {
  margin: 0 auto;
  padding: 0 20px;
  margin: 40px 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.98);
}

.feature-card h3 {
  margin: 20px 0 15px;
  font-size: 1.5rem;
  font-weight: 500;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
}

.action-section {
  text-align: center;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.explore-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 15px 40px;
  font-size: 1.2rem;
  letter-spacing: 4px;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  min-width: 200px;
}

.explore-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: width 0.4s ease;
}

.explore-btn:hover::before {
  width: 100%;
}

.explore-btn:hover .btn-icon {
  transform: translateX(5px);
}

.btn-text {
  position: relative;
  z-index: 1;
  margin-right: 10px;
}

.btn-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  font-size: 1.4rem;
  display: inline-block;
  vertical-align: middle;
}

.bottom-link {
  position: relative;
  padding: 15px 0;
  font-size: 1rem;
  color: #ffffff;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-link a {
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.3s;
  padding: 5px 10px;
  border-radius: 4px;
}

.bottom-link a:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .title {
    font-size: 3rem;
    letter-spacing: 8px;
  }
  
  .subtitle {
    font-size: 1.4rem;
    letter-spacing: 4px;
  }
  
  .divider {
    width: 200px;
  }
  
  .line {
    width: 60px;
  }
}

:deep(.el-main),
:deep(.el-container) {
  background: none !important;
}

:deep(*) {
  background-color: transparent;
}
</style> 