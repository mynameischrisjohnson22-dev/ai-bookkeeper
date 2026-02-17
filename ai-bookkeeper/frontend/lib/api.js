import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API ||
  (process.env.NODE_ENV === "production"
    ? "https://api.albdy.com"
    : "http://localhost:4000")

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
