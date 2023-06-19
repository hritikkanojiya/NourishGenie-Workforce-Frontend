import axios from 'axios'
import jwt_decode from 'jwt-decode'
const API_URL = process.env.REACT_APP_API_URL
export const REFRESH_TOKEN = `${API_URL}/agent/auth/refresh`

const api = axios.create()
function isTokenExpired() {
  console.log('Hey')
  const currentTime = Date.now() / 1000
  const decodedToken: any = jwt_decode(localStorage.getItem('token') || '')
  if (decodedToken.exp < currentTime) {
    return true
  }
  return false
}
api.interceptors.request.use(
  async (config: any) => {
    if (isTokenExpired()) {
      try {
        const response = await axios.post(
          REFRESH_TOKEN,
          {},
          {
            withCredentials: true,
          }
        )
        localStorage.setItem('token', response.data.data.jwtToken)
        config.headers.genie_access_token = `Bearer ${response.data.data.jwtToken}`
      } catch (error) {
        console.log(error)
      }
    }
    return config
  },
  (error) => {
    // Handle request error
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

export default api
