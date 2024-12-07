import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Home from '../pages/Home.vue'

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
    path: '/profile',
    name: 'UserProfile',
    component: () => import('../pages/UserProfile.vue'),
    meta: { requiresAuth: true }
  }
]

// 管理员路由
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'restaurants',
        name: 'AdminRestaurantList',
        component: () => import('../pages/RestaurantList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../pages/UserManagement.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...userRoutes, ...adminRoutes]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const isLoggedIn = localStorage.getItem('token')

  if (to.meta.requiresAdmin && !isAdmin) {
    ElMessage.warning('需要管理员权限')
    next('/')
    return
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/user')
    return
  }

  next()
})

export default router 