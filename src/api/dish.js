import { api } from './request'

export const dishApi = {
  // 获取餐厅的所有菜品
  getByRestaurant: (restaurantId) => {
    return api.get(`/api/public/restaurants/${restaurantId}/dishes`)
  },
  
  // 获取菜品详情
  getDetail: (dishId) => {
    return api.get(`/api/public/dishes/${dishId}`)
  }
} 