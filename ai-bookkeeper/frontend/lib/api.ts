import axios, { type AxiosInstance } from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:4000"

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
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
