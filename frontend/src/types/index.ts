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

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T
}
