import { api } from './request'

// 餐厅相关接口
export const restaurantApi = {
  getList: () => api.get('/api/public/restaurants'),
  getDetail: (id) => api.get(`/api/public/restaurants/${id}`),
  getCategories: () => api.get('/api/public/restaurants/categories'),
  getNearby: () => api.get('/api/public/restaurants/nearby'),
  search: (params) => api.get('/api/public/restaurants/search', { params }),
  getTopRated: () => api.get('/api/public/restaurants/top-rated'),
  delete: (id) => api.delete(`/api/public/restaurants/${id}`),
  update: (id, data) => api.put(`/api/public/restaurants/${id}`, data)
}

// 菜品相关接口
export const publicDishApi = {
  getList: () => api.get('/api/public/dishes'),
  getDetail: (id) => api.get(`/api/public/dishes/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/api/public/dishes/restaurant/${restaurantId}`),
  search: (params) => api.get('/api/public/dishes/search', { params }),
  getBySpicyLevel: (level) => api.get(`/api/public/dishes/spicy/${level}`),
  getTopRated: () => api.get('/api/public/dishes/top-rated')
}

// 标签相关接口
export const publicTagApi = {
  getList: () => api.get('/api/public/tags'),
  getPopular: () => api.get('/api/public/tags/popular'),
  getByRestaurant: (restaurantId) => api.get(`/api/public/tags/restaurant/${restaurantId}`)
}

// 用户公开接口
export const publicUserApi = {
  login: (data) => api.post('/api/public/users/login', {
    account: data.account,
    password: data.password
  }),
  register: (data) => api.post('/api/public/users/register', data),
  resetPassword: (data) => api.post('/api/public/users/password-reset', data),
  checkRole: () => api.get('/api/auth/users/profile/role'),
  getProfile: () => api.get('/api/users/profile/detail')
}

// 优惠券相关接口
export const publicCouponApi = {
  getList: () => api.get('/api/public/coupons'),
  getDetail: (id) => api.get(`/api/public/coupons/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/api/public/coupons/restaurant/${restaurantId}`),
  getValid: () => api.get('/api/public/coupons/valid'),
  getValidByRestaurant: (restaurantId) => api.get(`/api/public/coupons/valid/restaurant/${restaurantId}`)
}

// 评价反馈相关接口
export const publicFeedbackApi = {
  getByRestaurant: (restaurantId) => api.get(`/api/public/feedback/restaurant/${restaurantId}`),
  getRestaurantSummary: (restaurantId) => api.get(`/api/public/feedback/restaurant/${restaurantId}/summary`)
}

// 管理员相关接口
export const adminAuthApi = {
  login: (data) => api.post('/api/auth/admin/login', {
    username: data.username,
    password: data.password
  })
}; 