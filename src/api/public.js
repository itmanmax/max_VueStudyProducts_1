import { api } from './request'

// 餐厅相关接口
export const restaurantApi = {
  getList: () => api.get('/api/public/restaurants'),
  getDetail: (id) => api.get(`/api/public/restaurants/${id}`),
  getCategories: () => api.get('/api/public/restaurants/categories'),
  getNearby: () => api.get('/api/public/restaurants/nearby'),
  search: (params) => api.get('/api/public/restaurants/search', { params }),
  getTopRated: () => api.get('/api/public/restaurants/top-rated'),
  delete: (id) => api.delete(`/api/public/restaurants/${id}`)
}

// 菜品相关接口
export const dishApi = {
  getList: () => api.get('/api/public/dishes'),
  getDetail: (id) => api.get(`/api/public/dishes/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/api/public/dishes/restaurant/${restaurantId}`),
  search: (params) => api.get('/api/public/dishes/search', { params }),
  getBySpicyLevel: (level) => api.get(`/api/public/dishes/spicy/${level}`),
  getTopRated: () => api.get('/api/public/dishes/top-rated')
}

// 标签相关接口
export const tagApi = {
  getList: () => api.get('/api/public/tags'),
  getPopular: () => api.get('/api/public/tags/popular'),
  getByRestaurant: (restaurantId) => api.get(`/api/public/tags/restaurant/${restaurantId}`)
}

// 用户公开接口
export const publicUserApi = {
  login: (data) => api.post('/api/public/users/login', data),
  register: (data) => api.post('/api/public/users/register', data),
  resetPassword: (data) => api.post('/api/public/users/password-reset', data),
  checkRole: () => api.get('/api/public/users/role')
}

// 优惠券相关接口
export const couponApi = {
  getList: () => api.get('/api/public/coupons'),
  getDetail: (id) => api.get(`/api/public/coupons/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/api/public/coupons/restaurant/${restaurantId}`),
  getValid: () => api.get('/api/public/coupons/valid'),
  getValidByRestaurant: (restaurantId) => api.get(`/api/public/coupons/valid/restaurant/${restaurantId}`)
}

// 评价反馈相关接口
export const feedbackApi = {
  getByRestaurant: (restaurantId) => api.get(`/api/public/feedback/restaurant/${restaurantId}`),
  getRestaurantSummary: (restaurantId) => api.get(`/api/public/feedback/restaurant/${restaurantId}/summary`)
} 