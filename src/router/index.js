import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Home from '../pages/Home.vue'
import { publicUserApi } from '../api'

// 用户路由
const userRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user',
    name: 'UserInfo',
    component: () => import('../pages/UserInfo.vue')
  },
  {
    path: '/restaurants',
    name: 'UserRestaurantList',
    component: () => import('../pages/UserRestaurantList.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetails',
    component: () => import('../pages/RestaurantDetails.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dishes/:id',
    name: 'DishDetails',
    component: () => import('../pages/DishDetails.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: () => import('../pages/UserProfile.vue'),
    meta: { requiresAuth: true }
  }
]

// 管理员路由
const adminRoutes = [
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../pages/AdminDashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/restaurants',
    name: 'AdminRestaurantList',
    component: () => import('../pages/RestaurantList.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../pages/UserManagement.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/developing',
    name: 'Developing',
    component: () => import('../pages/Developing.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...userRoutes, ...adminRoutes]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  // 如果有 token，先验证 token 有效性
  if (token) {
    try {
      const response = await publicUserApi.checkRole()
      if (response.data.code === 200) {
        // token 有效，更新管理员状态
        const isAdminUser = response.data.data.includes('ADMIN')
        localStorage.setItem('isAdmin', isAdminUser.toString())
        
        // 检查页面权限
        if (to.meta.requiresAdmin && !isAdminUser) {
          ElMessage.warning('需要管理员权限')
          next('/')
          return
        }
        // token 有效，继续导航
        next()
        return
      } else {
        // token 无效，清除存储的信息
        localStorage.removeItem('token')
        localStorage.removeItem('isAdmin')
      }
    } catch (error) {
      // token 验证失败，清除存储的信息
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')
      if (to.meta.requiresAuth || to.meta.requiresAdmin) {
        ElMessage.error('登录已过期，请重新登录')
        next('/user')
        return
      }
    }
  }

  // 如果是需要登录的页面但没有 token
  if (to.meta.requiresAuth && !token) {
    ElMessage.warning('请先登录')
    next('/user')
    return
  }

  // 如果是管理员页面但没有权限
  if (to.meta.requiresAdmin && !isAdmin) {
    ElMessage.warning('需要管理员权限')
    next('/')
    return
  }

  next()
})

export default router 