import { api } from './request'

// 用户认证相关接口
export const userApi = {
  changePassword: (data) => api.put('/api/users/password', data),
  getProfile: () => api.get('/api/users/profile'),
  getProfileDetail: () => api.get('/api/users/profile/detail'),
  getMyRestaurants: () => api.get('/api/users/restaurants'),
  addRestaurant: (data) => api.post('/api/users/restaurants', data),
  updateRestaurant: (id, data) => api.put(`/api/users/restaurants/${id}`, data),
  deleteRestaurant: (id) => api.delete(`/api/users/restaurants/${id}`)
}

// 用户餐厅相关接口
export const userRestaurantApi = {
  addFavorite: (id) => api.post(`/api/user/restaurants/${id}/favorite`),
  removeFavorite: (id) => api.delete(`/api/user/restaurants/${id}/favorite`),
  rate: (id, data) => api.post(`/api/user/restaurants/${id}/rating`, data),
  getFavorites: () => api.get('/api/user/restaurants/favorites'),
  getRecent: () => api.get('/api/user/restaurants/recent')
}

// 用户标签相关接口
export const userTagApi = {
  addFavorite: (tagId) => api.post(`/api/user/tags/${tagId}/favorite`),
  removeFavorite: (tagId) => api.delete(`/api/user/tags/${tagId}/favorite`),
  getFavorites: () => api.get('/api/user/tags/favorite')
}

// 用户餐厅标签相关接口
export const userRestaurantTagApi = {
  getPopular: () => api.get('/api/user/restaurant-tags/popular'),
  getByRestaurant: (restaurantId) => api.get(`/api/user/restaurant-tags/restaurant/${restaurantId}`),
  search: (params) => api.get('/api/user/restaurant-tags/search', { params })
}

// 用户优惠券相关接口
export const userCouponApi = {
  receive: (id) => api.post(`/api/user/coupons/${id}/receive`),
  use: (id) => api.post(`/api/user/coupons/${id}/use`),
  getMyCoupons: () => api.get('/api/user/coupons/my')
}

// 用户评价反馈相关接口
export const userFeedbackApi = {
  add: (data) => api.post('/api/user/feedbacks', data),
  update: (id, data) => api.put(`/api/user/feedbacks/${id}`, data),
  getMyFeedback: () => api.get('/api/user/feedbacks/my')
} 