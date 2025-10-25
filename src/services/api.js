import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data)
    return response.data
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)

    // 处理不同的错误状态码
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          throw new Error(data.message || '请求参数错误')
        case 500:
          throw new Error('服务器内部错误')
        default:
          throw new Error(data.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      throw new Error(error.message || '未知错误')
    }
  }
)

// 排盘 API
export const arrangeApi = {
  // 排盘接口
  arrange: async (formData) => {
    const requestData = {
      name: formData.name || '',
      gender: formData.gender,
      birth_date: formData.birthDate,
      calendar_type: formData.calendarType,
      location: {
        province: formData.location.province,
        city: formData.location.city,
        district: formData.location.district || ''
      },
      leap_month: formData.leapMonth || false
    }

    return await api.post('/arrange', requestData)
  },

  // 健康检查
  health: async () => {
    return await api.get('/health')
  }
}

// 默认导出 api 实例
export default api