import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 如果响应成功，返回响应的data部分
    return response.data
  },
  error => {
    // 打印详细错误信息以便调试
    console.error('API Error:', error.response || error)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证相关接口
export const authApi = {
  login: (data) => api.post('/login', data),
  getToken: () => api.get('/api/token'),
  generateToken: (data) => api.post('/api/token/generate', data)
}

// 用户相关接口
export const userApi = {
  // 获取用户信息
  getInfo: (userId) => api.get(`/users/${userId}`),
  // 更新用户信息
  updateInfo: (userId, data) => api.put(`/users/${userId}`, data),
  // 修改密码
  updatePassword: (userId, data) => api.put(`/users/${userId}/password`, data),
  // 更新积分
  updatePoints: (userId, data) => api.put(`/users/${userId}/points`, data),
  // 删除用户
  delete: () => api.delete('/users/delete'),
  // 按名字查找用户
  findByName: (name) => api.get(`/users/findByName/${name}`),
  // 获取用户列表
  getList: () => api.get('/users/list'),
  // 用户注册
  register: (data) => api.post('/users/register', data)
}

// 餐厅相关接口
export const restaurantApi = {
  // 获取餐厅列表
  getList: () => api.get('/restaurants'),
  // 添加餐厅
  create: (data) => api.post('/restaurants', data),
  // 获取餐厅详情
  getDetail: (id) => api.get(`/restaurants/${id}`),
  // 更新餐厅信息
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  // 删除餐厅
  delete: (id) => api.delete(`/restaurants/${id}`),
  // 获取所有餐厅
  getAll: () => api.get('/restaurants/all'),
  // 搜索餐厅
  search: (params) => api.get('/restaurants/search', { params }),
  // 获取高评分餐厅
  getTopRated: () => api.get('/restaurants/top-rated')
}

// 菜品相关接口
export const dishApi = {
  // 获取菜品列表
  getList: () => api.get('/dishes'),
  // 添加菜品
  create: (data) => api.post('/dishes', data),
  // 获取菜品详情
  getDetail: (id) => api.get(`/dishes/${id}`),
  // 更新菜品
  update: (id, data) => api.put(`/dishes/${id}`, data),
  // 删除菜品
  delete: (id) => api.delete(`/dishes/${id}`),
  // 更新菜品评分
  updateRating: (id, data) => api.put(`/dishes/${id}/rating`, data),
  // 获取餐厅菜品
  getByRestaurant: (restaurantId) => api.get(`/dishes/restaurant/${restaurantId}`),
  // 搜索菜品
  search: (params) => api.get('/dishes/search', { params }),
  // 按辣度查询
  getBySpicyLevel: (level) => api.get(`/dishes/spicy/${level}`),
  // 获取高评分菜品
  getTopRated: () => api.get('/dishes/top-rated')
}

// 反馈评价相关接口
export const feedbackApi = {
  // 获取反馈列表
  getList: () => api.get('/feedback'),
  // 添加反馈
  create: (data) => api.post('/feedback', data),
  // 获取反馈详情
  getDetail: (id) => api.get(`/feedback/${id}`),
  // 更新反馈
  update: (id, data) => api.put(`/feedback/${id}`, data),
  // 删除反馈
  delete: (id) => api.delete(`/feedback/${id}`),
  // 检查用户评价状态
  checkStatus: () => api.get('/feedback/check'),
  // 获取餐厅反馈
  getRestaurantFeedback: (restaurantId) => api.get(`/feedback/restaurant/${restaurantId}`),
  // 获取餐厅平均评分
  getRestaurantRating: (restaurantId) => api.get(`/feedback/restaurant/${restaurantId}/rating`),
  // 获取餐厅高评分反馈
  getRestaurantTopFeedback: (restaurantId) => api.get(`/feedback/restaurant/${restaurantId}/top`),
  // 获取用户反馈
  getUserFeedback: (userId) => api.get(`/feedback/user/${userId}`)
} 