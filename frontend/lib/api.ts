import axios, { InternalAxiosRequestConfig } from "axios"

/* ================= BASE URL ================= */

const baseURL = process.env.NEXT_PUBLIC_API_URL || ""

const api = axios.create({
  baseURL: baseURL.replace(/\/$/, ""), // remove trailing slash
  headers: {
    "Content-Type": "application/json"
  }
})

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {

  if (typeof window !== "undefined") {

    const token = localStorage.getItem("token")

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

  }

  return config
})

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(

  (response) => response,

  (error) => {

    const status = error?.response?.status

    if (status === 401 && typeof window !== "undefined") {

      localStorage.removeItem("token")

      // redirect to login
      window.location.href = "/auth/login"

    }

    return Promise.reject(error)
  }

)

export default api