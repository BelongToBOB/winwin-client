/// <reference types="vite/client" />
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10_000,
})

export const lmsApi = axios.create({
  baseURL: import.meta.env.VITE_LMS_API_URL ?? 'https://checkout.winwinwealth.co/api',
  timeout: 15_000,
})

lmsApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[LMS API Error]', err.response?.data ?? err.message)
    return Promise.reject(err)
  }
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data ?? err.message)
    return Promise.reject(err)
  }
)
