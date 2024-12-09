import { api } from './request'

// 用户个人相关接口
export const userProfileApi = {
  updatePassword: (data) => api.put('/api/users/password', data),
  getProfile: () => api.get('/api/users/profile/detail'),
  getProfileDetail: () => api.get('/api/users/profile/detail'),
  getRole: () => api.get('/api/auth/users/profile/role')
}

// 用户认证相关接口
export const userAuthApi = {
  login: (data) => api.post('/api/public/users/login', data),
  logout: () => api.post('/api/auth/user/logout'),
  refreshToken: () => api.post('/api/auth/user/token/refresh'),
  validateToken: () => api.post('/api/auth/user/token/validate')
}

// 用户操作相关接口
export const userOperationApi = {
  // 餐厅相关
  favoriteRestaurant: (id) => api.post(`/api/user/restaurants/${id}/favorite`),
  unfavoriteRestaurant: (id) => api.delete(`/api/user/restaurants/${id}/favorite`),
  rateRestaurant: (id, data) => api.post(`/api/user/restaurants/${id}/rating`, data),
  getFavoriteRestaurants: () => api.get('/api/user/restaurants/favorites'),
  getRecentRestaurants: () => api.get('/api/user/restaurants/recent'),

  // 菜品相关
  rateDish: (id, data) => api.post(`/api/user/dishes/${id}/rating`, data),
  reviewDish: (id, data) => api.post(`/api/user/dishes/${id}/review`, data),

  // 标签相关
  favoriteTag: (tagId) => api.post(`/api/user/tags/${tagId}/favorite`),
  unfavoriteTag: (tagId) => api.delete(`/api/user/tags/${tagId}/favorite`),
  getFavoriteTags: () => api.get('/api/user/tags/favorite'),

  // 优惠券相关
  receiveCoupon: (id) => api.post(`/api/user/coupons/${id}/receive`),
  useCoupon: (id) => api.post(`/api/user/coupons/${id}/use`),
  getMyCoupons: () => api.get('/api/user/coupons/my'),

  // 反馈相关
  addFeedback: (data) => api.post('/api/user/feedbacks', data),
  updateFeedback: (id, data) => api.put(`/api/user/feedbacks/${id}`, data),
  getMyFeedback: () => api.get('/api/user/feedbacks/my')
}

// 为了向后兼容，保留原来的导出
export const userApi = {
  ...userProfileApi,
  ...userAuthApi,
  ...userOperationApi
}

export default userApi 