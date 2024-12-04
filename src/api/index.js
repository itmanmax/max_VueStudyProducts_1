import axios from 'axios'

const api = axios.create({
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
  login: (data) => api.post('/api/login', data),
  getToken: () => api.get('/api/token'),
  generateToken: (data) => api.post('/api/token/generate', data)
}

// 用户相关接口
export const userApi = {
  getInfo: (userId) => api.get(`/api/users/${userId}`),
  updateInfo: (userId, data) => api.put(`/api/users/${userId}`, data),
  updatePassword: (userId, data) => api.put(`/api/users/${userId}/password`, data),
  updatePoints: (userId, data) => api.put(`/api/users/${userId}/points`, data),
  delete: () => api.delete('/api/users/delete'),
  findByName: (name) => api.get(`/api/users/findByName/${name}`),
  getList: () => api.get('/api/users/list'),
  register: (data) => api.post('/api/users/register', data)
}

// 添加认证信息处理函数
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
  getTopRated: (limit) => api.get(`/api/restaurants/top-rated/${limit}`),
  
  // 需要认证的管理接口
  create: (data) => api.post('/api/admin/restaurants', data, {
    params: getAuthParams()
  }),
  update: (id, data) => {
    console.log('Updating restaurant:', { id, data })
    return api.put(`/api/admin/restaurants/${id}`, data, {
      params: getAuthParams(),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  delete: (id) => api.delete(`/api/admin/restaurants/${id}`, {
    params: getAuthParams()
  })
}

// 菜品相关接口
export const dishApi = {
  getList: () => api.get('/api/dishes'),
  create: (data) => api.post('/api/dishes', data),
  getDetail: (id) => api.get(`/api/dishes/${id}`),
  update: (id, data) => api.put(`/api/dishes/${id}`, data),
  delete: (id) => api.delete(`/api/dishes/${id}`),
  updateRating: (id, data) => api.put(`/api/dishes/${id}/rating`, data),
  getByRestaurant: (restaurantId) => api.get(`/api/dishes/restaurant/${restaurantId}`),
  search: (params) => api.get('/api/dishes/search', { params }),
  getBySpicyLevel: (level) => api.get(`/api/dishes/spicy/${level}`),
  getTopRated: () => api.get('/api/dishes/top-rated')
}

// 反馈评价相关接口
export const feedbackApi = {
  getList: () => api.get('/api/feedback'),
  create: (data) => api.post('/api/feedback', data),
  getDetail: (id) => api.get(`/api/feedback/${id}`),
  update: (id, data) => api.put(`/api/feedback/${id}`, data),
  delete: (id) => api.delete(`/api/feedback/${id}`),
  checkStatus: () => api.get('/api/feedback/check'),
  getRestaurantFeedback: (restaurantId) => api.get(`/api/feedback/restaurant/${restaurantId}`),
  getRestaurantRating: (restaurantId) => api.get(`/api/feedback/restaurant/${restaurantId}/rating`),
  getRestaurantTopFeedback: (restaurantId) => api.get(`/api/feedback/restaurant/${restaurantId}/top`),
  getUserFeedback: (userId) => api.get(`/api/feedback/user/${userId}`)
} 