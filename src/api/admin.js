import { api } from './request'

// 管理员认证相关接口
export const adminAuthApi = {
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: () => api.post('/api/auth/token/refresh'),
  validateToken: () => api.post('/api/auth/token/validate')
}

// 用户管理相关接口
export const userManageApi = {
  getList: () => api.get('/api/admin/users/list'),
  getDetail: (userId) => api.get(`/api/admin/users/${userId}`),
  update: (userId, data) => api.put(`/api/admin/users/${userId}`, data),
  delete: (userId) => api.delete(`/api/admin/users/${userId}`),
  updatePassword: (userId, data) => api.put(`/api/admin/users/${userId}/password`, data),
  updatePoints: (userId, data) => api.put(`/api/admin/users/${userId}/points`, data),
  findByName: (name) => api.get(`/api/admin/users/findByName/${name}`)
}

// 餐厅管理相关接口
export const restaurantManageApi = {
  add: (data) => api.post('/api/admin/restaurants', data),
  update: (id, data) => api.put(`/api/admin/restaurants/${id}`, data),
  delete: (id) => api.delete(`/api/admin/restaurants/${id}`),
  setFeatured: (id, data) => api.put(`/api/admin/restaurants/${id}/featured`, data),
  updateStatus: (id, data) => api.put(`/api/admin/restaurants/${id}/status`, data),
  verify: (id, data) => api.put(`/api/admin/restaurants/${id}/verify`, data)
}

// 菜品管理相关接口
export const dishManageApi = {
  add: (data) => api.post('/api/admin/dishes', data),
  update: (id, data) => api.put(`/api/admin/dishes/${id}`, data),
  delete: (id) => api.delete(`/api/admin/dishes/${id}`),
  updateStatus: (id, data) => api.put(`/api/admin/dishes/${id}/status`, data)
}

// 标签管理相关接口
export const tagManageApi = {
  add: (data) => api.post('/api/admin/tags', data),
  update: (id, data) => api.put(`/api/admin/tags/${id}`, data),
  delete: (id) => api.delete(`/api/admin/tags/${id}`)
}

// 餐厅标签管理相关接口
export const restaurantTagManageApi = {
  addTag: (restaurantId, data) => api.post(`/api/admin/restaurant-tags/restaurant/${restaurantId}`, data),
  deleteTag: (restaurantId) => api.delete(`/api/admin/restaurant-tags/restaurant/${restaurantId}`),
  deleteAllTags: (restaurantId) => api.delete(`/api/admin/restaurant-tags/restaurant/${restaurantId}/all`)
}

// 优惠券管理相关接口
export const couponManageApi = {
  add: (data) => api.post('/api/admin/coupons', data),
  update: (id, data) => api.put(`/api/admin/coupons/${id}`, data),
  delete: (id) => api.delete(`/api/admin/coupons/${id}`),
  deleteExpired: () => api.delete('/api/admin/coupons/expired')
}

// 评价反馈管理相关接口
export const feedbackManageApi = {
  add: (data) => api.post('/api/admin/feedback', data),
  update: (id, data) => api.put(`/api/admin/feedback/${id}`, data),
  delete: (id) => api.delete(`/api/admin/feedback/${id}`),
  updateStatus: (id, data) => api.put(`/api/admin/feedback/${id}/status`, data),
  getReport: () => api.get('/api/admin/feedback/report'),
  deleteRestaurantFeedback: (restaurantId) => api.delete(`/api/admin/feedback/restaurant/${restaurantId}`),
  deleteUserFeedback: (userId) => api.delete(`/api/admin/feedback/user/${userId}`)
} 