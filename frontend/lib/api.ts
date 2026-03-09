import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_URL

if(!baseURL){
  throw new Error("NEXT_PUBLIC_API_URL missing")
}

const api = axios.create({
  baseURL: baseURL.replace(/\/$/, ""),
  headers:{
    "Content-Type":"application/json"
  }
})

api.interceptors.request.use((config)=>{

  if(typeof window!=="undefined"){

    const token=localStorage.getItem("token")

    if(token){
      config.headers=config.headers||{}
      config.headers.Authorization=`Bearer ${token}`
    }

  }

  return config

})

api.interceptors.response.use(

(res)=>res,

(error)=>{

  const status=error?.response?.status

  if(status===401 && typeof window!=="undefined"){

    const token=localStorage.getItem("token")

    if(token){
      localStorage.removeItem("token")
      window.location.href="/auth/login"
    }

  }

  return Promise.reject(error)

})

export default api