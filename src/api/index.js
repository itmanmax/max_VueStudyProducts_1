import axios from 'axios'

const api = axios.create({
  timeout: 5000
})

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 检查响应状态
    const { code, message, data } = response.data
    if (code === 200) {
      return data
    } else {
      // 如果状态码不是200，抛出错误
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  error => {
    console.error('API Error:', error.response || error)
    return Promise.reject(error)
  }
)

// 认证信息
const getAuthParams = () => {
  return {
    username: 'admin',
    password: 'admin123'
  }
}

// 餐厅相关接口
export const restaurantApi = {
  // 公开接口
  getList: () => api.get('/api/restaurants'),
  getDetail: (id) => api.get(`/api/restaurants/${id}`),
  search: (params) => api.get('/api/restaurants/search', { params }),
  getTopRated: () => api.get('/api/restaurants/top-rated'),

  // 管理接口（需要认证）
  create: (data) => api.post('/api/admin/restaurants', data, { params: getAuthParams() }),
  update: (id, data) => api.put(`/api/admin/restaurants/${id}`, data, { params: getAuthParams() }),
  delete: (id) => api.delete(`/api/admin/restaurants/${id}`, { params: getAuthParams() })
}

// 餐厅标签相关接口
export const restaurantTagApi = {
  // 公开接口
  getPopular: () => api.get('/api/restaurant-tags/popular'),
  getByRestaurant: (restaurantId) => api.get(`/api/restaurant-tags/restaurant/${restaurantId}`),
  search: (params) => api.get('/api/restaurant-tags/search', { params }),

  // 管理接口（需要认证）
  create: (data) => api.post('/api/admin/restaurant-tags', data, { params: getAuthParams() }),
  update: (tagId, data) => api.put(`/api/admin/restaurant-tags/${tagId}`, data, { params: getAuthParams() }),
  delete: (tagId) => api.delete(`/api/admin/restaurant-tags/${tagId}`, { params: getAuthParams() }),
  batchCreate: (data) => api.post('/api/admin/restaurant-tags/batch', data, { params: getAuthParams() }),
  deleteRestaurantTags: (restaurantId) => api.delete(`/api/admin/restaurant-tags/restaurant/${restaurantId}`, { params: getAuthParams() })
}

// 菜品相关接口
export const dishApi = {
  // 公开接口
  getList: () => api.get('/api/dishes'),
  getDetail: (id) => api.get(`/api/dishes/${id}`),
  getByRestaurant: (restaurantId) => api.get(`/api/dishes/restaurant/${restaurantId}`),
  search: (params) => api.get('/api/dishes/search', { params }),
  getBySpicyLevel: (level) => api.get(`/api/dishes/spicy/${level}`),
  getTopRated: () => api.get('/api/dishes/top-rated'),

  // 管理接口（需要认证）
  create: (data) => api.post('/api/admin/dishes', data, { params: getAuthParams() }),
  update: (id, data) => api.put(`/api/admin/dishes/${id}`, data, { params: getAuthParams() }),
  delete: (id) => api.delete(`/api/admin/dishes/${id}`, { params: getAuthParams() }),
  updateRating: (id, data) => api.put(`/api/admin/dishes/${id}/rating`, data, { params: getAuthParams() })
}

// 反馈评价相关接口
export const feedbackApi = {
  // 公开接口
  getList: () => api.get('/api/feedback'),
  getDetail: (id) => api.get(`/api/feedback/${id}`),
  checkStatus: () => api.get('/api/feedback/check'),
  getRestaurantFeedback: (restaurantId) => api.get(`/api/feedback/restaurant/${restaurantId}`),
  getRestaurantRating: (restaurantId) => api.get(`/api/feedback/restaurant/${restaurantId}/rating`),
  getRestaurantTopFeedback: (restaurantId) => api.get(`/api/feedback/restaurant/${restaurantId}/top`),
  getUserFeedback: (userId) => api.get(`/api/feedback/user/${userId}`),

  // 管理接口（需要认证）
  create: (data) => api.post('/api/admin/feedback', data, { params: getAuthParams() }),
  update: (id, data) => api.put(`/api/admin/feedback/${id}`, data, { params: getAuthParams() }),
  delete: (id) => api.delete(`/api/admin/feedback/${id}`, { params: getAuthParams() }),
  deleteRestaurantFeedback: (restaurantId) => api.delete(`/api/admin/feedback/restaurant/${restaurantId}`, { params: getAuthParams() }),
  deleteUserFeedback: (userId) => api.delete(`/api/admin/feedback/user/${userId}`, { params: getAuthParams() })
}

// 用户相关接口
export const userApi = {
  // 公开接口
  getInfo: (userId) => api.get(`/api/users/${userId}`),
  findByName: (name) => api.get(`/api/users/findByName/${name}`),
  login: (data) => api.post('/api/users/login', data),
  register: (data) => api.post('/api/users/register', data),

  // 管理接口（需要认证）
  update: (userId, data) => api.put(`/api/admin/users/${userId}`, data, { params: getAuthParams() }),
  delete: (userId) => api.delete(`/api/admin/users/${userId}`, { params: getAuthParams() }),
  updatePassword: (userId, data) => api.put(`/api/admin/users/${userId}/password`, data, { params: getAuthParams() }),
  updatePoints: (userId, data) => api.put(`/api/admin/users/${userId}/points`, data, { params: getAuthParams() }),
  getList: () => api.get('/api/admin/users/list', { params: getAuthParams() })
}

// 优惠券相关接口
export const couponApi = {
  // 公开接口
  getList: () => api.get('/api/coupons'),
  getDetail: (id) => api.get(`/api/coupons/${id}`),
  checkValidity: (id) => api.get(`/api/coupons/${id}/check`),
  getPlatformCoupons: (platform) => api.get(`/api/coupons/platform/${platform}`),
  getRestaurantCoupons: (restaurantId) => api.get(`/api/coupons/restaurant/${restaurantId}`),
  getValidCoupons: () => api.get('/api/coupons/valid'),
  getValidRestaurantCoupons: (restaurantId) => api.get(`/api/coupons/valid/restaurant/${restaurantId}`),

  // 管理接口（需要认证）
  create: (data) => api.post('/api/admin/coupons', data, { params: getAuthParams() }),
  update: (id, data) => api.put(`/api/admin/coupons/${id}`, data, { params: getAuthParams() }),
  delete: (id) => api.delete(`/api/admin/coupons/${id}`, { params: getAuthParams() }),
  deleteExpired: () => api.delete('/api/admin/coupons/expired', { params: getAuthParams() }),
  deleteRestaurantCoupons: (restaurantId) => api.delete(`/api/admin/coupons/restaurant/${restaurantId}`, { params: getAuthParams() })
} 