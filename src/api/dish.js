import request from '../utils/request'

export const dishApi = {
  // 获取餐厅的所有菜品
  getByRestaurant: (restaurantId) => {
    return request({
      url: `/api/public/restaurants/${restaurantId}/dishes`,
      method: 'get'
    })
  },
  
  // 获取菜品详情
  getDetail: (dishId) => {
    return request({
      url: `/api/public/dishes/${dishId}`,
      method: 'get'
    })
  }
} 