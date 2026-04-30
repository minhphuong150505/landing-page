const TOKEN_KEY = 'admin_token'
const EXPIRES_KEY = 'admin_token_exp'

export const auth = {
  setToken(token: string, expiresAt: number) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(EXPIRES_KEY, String(expiresAt))
  },
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY)
    const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0)
    if (!token || Date.now() >= exp) {
      this.clear()
      return null
    }
    return token
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_KEY)
  },
  isAuthenticated(): boolean {
    return this.getToken() !== null
  },
}
