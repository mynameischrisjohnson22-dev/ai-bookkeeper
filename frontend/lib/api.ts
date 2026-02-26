import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:4000"

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api