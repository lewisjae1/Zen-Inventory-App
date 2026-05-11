import axios from 'axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        if (
            error.response?.status === 401 &&
            refreshToken &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                const res = await refreshApi.post('/api/token/refresh/', {
                    refresh: refreshToken,
                })

                const newAccess = res.data.access
                localStorage.setItem(ACCESS_TOKEN, newAccess)

                originalRequest.headers.Authorization = `Bearer ${newAccess}`

                return api(originalRequest)
            } catch (err) {
                localStorage.removeItem(ACCESS_TOKEN)
                localStorage.removeItem(REFRESH_TOKEN)

                window.location.href = "/login"

                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default api