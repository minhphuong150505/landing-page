import axios from 'axios'
import type { ContactRequest, NewsletterRequest, ApiResponse } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export const contactApi = {
  submit: (data: ContactRequest) =>
    api.post<ApiResponse>('/api/contact', data).then(r => r.data),
}

export const newsletterApi = {
  subscribe: (data: NewsletterRequest) =>
    api.post<ApiResponse>('/api/newsletter/subscribe', data).then(r => r.data),
}
