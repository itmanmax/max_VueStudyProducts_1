import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import RestaurantDetails from '../pages/RestaurantDetails.vue'
import UserInfo from '../pages/UserInfo.vue'
import RestaurantList from '@/pages/RestaurantList.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 