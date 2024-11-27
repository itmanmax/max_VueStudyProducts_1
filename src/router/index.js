import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import RestaurantDetails from '../pages/RestaurantDetails.vue'
import UserInfo from '../pages/UserInfo.vue'
import RestaurantList from '@/pages/RestaurantList.vue'
import DishDetails from '../pages/DishDetails.vue'
import UserProfile from '../pages/UserProfile.vue'
import UserManagement from '../pages/UserManagement.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetails',
    component: RestaurantDetails,
    props: true
  },
  {
    path: '/user',
    name: 'UserInfo',
    component: UserInfo
  },
  {
    path: '/restaurants',
    name: 'RestaurantList',
    component: RestaurantList
  },
  {
    path: '/dish/:id',
    name: 'DishDetails',
    component: DishDetails
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 