import axios from "axios"

// ================================
// BASE URL
// ================================

const getBaseURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (!envURL) {
    console.warn("⚠️ NEXT_PUBLIC_API_URL not set. Using localhost.")
    return "http://localhost:4000"
  }

  return envURL.endsWith("/")
    ? envURL.slice(0, -1)
    : envURL
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
})

// ================================
// REQUEST INTERCEPTOR (JWT)
// ================================

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")

      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ================================
// RESPONSE INTERCEPTOR
// ================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 Unauthorized. Token may be invalid.")

      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api