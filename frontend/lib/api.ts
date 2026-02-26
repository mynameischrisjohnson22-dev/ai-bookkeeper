import axios from "axios"

// 🔹 Get base URL from env
const rawBaseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:4000"

// 🔹 Remove trailing slash if it exists
const baseURL = rawBaseURL.endsWith("/")
  ? rawBaseURL.slice(0, -1)
  : rawBaseURL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔐 Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")

      if (token) {
        // Axios v1 safe way
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`
        }
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api