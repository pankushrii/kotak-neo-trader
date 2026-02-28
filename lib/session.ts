// Session utilities for managing Kotak trading sessions

export interface SessionData {
  token: string
  userId: string
  expiresAt: string
}

const SESSION_STORAGE_KEY = 'kotak_session'

export const sessionManager = {
  saveSession(data: SessionData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data))
    }
  },

  getSession(): SessionData | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(SESSION_STORAGE_KEY)
      return data ? JSON.parse(data) : null
    }
    return null
  },

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  },

  isSessionValid(): boolean {
    const session = this.getSession()
    if (!session) return false

    const expiresAt = new Date(session.expiresAt)
    return expiresAt > new Date()
  },

  getToken(): string | null {
    const session = this.getSession()
    return session?.token || null
  },
}