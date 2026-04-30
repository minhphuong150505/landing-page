import axios from 'axios'
import type { ContactRequest, NewsletterRequest, UGCRegisterRequest, SlotRequest, ApiResponse, PageViewRequest, DashboardStats, VisitorStats, AdminContact, AdminNewsletter, AdminSlotBooking, AdminUGCRegistration, LoginRequest, LoginResponse } from '../types'
import { auth } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      auth.clear()
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export const contactApi = {
  submit: (data: ContactRequest) =>
    api.post<ApiResponse>('/api/contact', data).then(r => r.data),
}

export const newsletterApi = {
  subscribe: (data: NewsletterRequest) =>
    api.post<ApiResponse>('/api/newsletter/subscribe', data).then(r => r.data),
}

export const ugcApi = {
  register: (data: UGCRegisterRequest) =>
    api.post<ApiResponse>('/api/ugc/register', data).then(r => r.data),
}

export const slotApi = {
  book: (data: SlotRequest) =>
    api.post<ApiResponse>('/api/slot/book', data).then(r => r.data),
}

export const trackingApi = {
  pageview: (data: PageViewRequest) =>
    api.post<ApiResponse>('/api/tracking/pageview', data).then(r => r.data),
}

export const adminApi = {
  dashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/api/admin/dashboard').then(r => r.data),
  contacts: () =>
    api.get<ApiResponse<AdminContact[]>>('/api/admin/contacts').then(r => r.data),
  updateContactStatus: (id: number, status: string) =>
    api.put<ApiResponse<AdminContact>>(`/api/admin/contacts/${id}/status`, { status }).then(r => r.data),
  newsletter: () =>
    api.get<ApiResponse<AdminNewsletter[]>>('/api/admin/newsletter').then(r => r.data),
  slots: () =>
    api.get<ApiResponse<AdminSlotBooking[]>>('/api/admin/slots').then(r => r.data),
  updateSlotStatus: (id: number, status: string) =>
    api.put<ApiResponse<AdminSlotBooking>>(`/api/admin/slots/${id}/status`, { status }).then(r => r.data),
  ugc: () =>
    api.get<ApiResponse<AdminUGCRegistration[]>>('/api/admin/ugc').then(r => r.data),
  visitorStats: () =>
    api.get<ApiResponse<VisitorStats>>('/api/admin/visitor-stats').then(r => r.data),
}

export const authApi = {
  login: (req: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/api/auth/login', req).then(r => r.data),
  me: () =>
    api.get<ApiResponse<{ username: string; role: string }>>('/api/auth/me').then(r => r.data),
}
