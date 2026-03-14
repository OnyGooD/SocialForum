import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

function absolutizeMedia(url) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  const origin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => {
    const normalize = (obj) => {
      if (obj && typeof obj === 'object') {
        if (obj.avatar) obj.avatar = absolutizeMedia(obj.avatar)
        if (obj.author_avatar) obj.author_avatar = absolutizeMedia(obj.author_avatar)
        Object.values(obj).forEach((value) => {
          if (Array.isArray(value)) value.forEach(normalize)
          else if (value && typeof value === 'object') normalize(value)
        })
      }
    }
    normalize(res.data)
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
