import axios from "axios"

// ===================================
// BASE URL
// ===================================

const baseURL = process.env.NEXT_PUBLIC_API_URL

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined. Set it in Vercel environment variables."
  )
}

// ===================================
// AXIOS INSTANCE
// ===================================

const api = axios.create({
  baseURL: baseURL.replace(/\/$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
})

// ===================================
// REQUEST INTERCEPTOR (JWT)
// ===================================

api.interceptors.request.use(
  (config) => {

    // Only run in browser
    if (typeof window !== "undefined") {

      const token = localStorage.getItem("token")

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }

    }

    return config
  },
  (error) => Promise.reject(error)
)

// ===================================
// RESPONSE INTERCEPTOR
// ===================================

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error?.response?.status === 401) {

      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
      }

    }

    return Promise.reject(error)

  }
)

export default api