export interface ContactRequest {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface NewsletterRequest {
  email: string
}

export interface UGCRegisterRequest {
  name: string
  phone: string
  handle?: string
}

export interface SlotRequest {
  name: string
  phone: string
}

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T
}

export interface PageViewRequest {
  path: string
  referrer?: string
  sessionId: string
}

export interface DashboardStats {
  totalContacts: number
  activeSubscribers: number
  totalSlotBookings: number
  totalUgcRegistrations: number
  totalPageViews: number
  uniqueVisitors: number
}

export interface VisitorStats {
  totalViews: number
  uniqueVisitors: number
  viewsByPath: Record<string, number>
  viewsByDay: Record<string, number>
}

export interface AdminContact {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: string
  createdAt: string
}

export interface AdminNewsletter {
  id: number
  email: string
  active: boolean
  subscribedAt: string
}

export interface AdminSlotBooking {
  id: number
  name: string
  phone: string
  status: string
  createdAt: string
}

export interface AdminUGCRegistration {
  id: number
  name: string
  phone: string
  handle?: string
  status: string
  createdAt: string
}
