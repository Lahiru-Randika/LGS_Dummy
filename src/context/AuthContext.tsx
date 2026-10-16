import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { ApiError, getStoredAuthToken } from '../services/http'
import type { User, UserRole } from '../types'

type AuthValue = {
  user: User | null
  permissions: string[]
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  can: (capability: string) => boolean
}

const AuthContext = createContext<AuthValue | null>(null)

const SESSION_CACHE_KEY = 'lgs_auth_session'

function getCachedSession(): { user: User; permissions: string[] } | null {
  try {
    const raw = localStorage.getItem(SESSION_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed.user?.id) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function setCachedSession(session: { user: User; permissions: string[] } | null) {
  try {
    if (session) {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(SESSION_CACHE_KEY)
    }
  } catch {
    // Graceful fallback if localStorage is unavailable
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = getCachedSession()
  const hasStoredAuth = Boolean(getStoredAuthToken() || initial?.user)

  const [user, setUser] = useState<User | null>(initial?.user ?? null)
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? [])
  // If user is a guest without stored token or session, don't block initial rendering
  const [loading, setLoading] = useState<boolean>(hasStoredAuth)

  const refreshSession = useCallback(async () => {
    try {
      const session = await authService.me()
      setUser(session.user)
      setPermissions(session.permissions)
      setCachedSession({ user: session.user, permissions: session.permissions })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Access token or cookie might need extension; attempt refresh once before dropping session
        try {
          const refreshed = await authService.refresh()
          setUser(refreshed.user)
          setPermissions(refreshed.permissions)
          setCachedSession({ user: refreshed.user, permissions: refreshed.permissions })
        } catch (refreshErr) {
          if (refreshErr instanceof ApiError && refreshErr.status === 401) {
            setUser(null)
            setPermissions([])
            setCachedSession(null)
          }
        }
      } else {
        // Network error / server starting up: retain cached user to prevent unnecessary logout
        console.warn('Network issue restoring LGS session; keeping cached session if present', error)
      }
    }
  }, [])

  useEffect(() => {
    if (hasStoredAuth) {
      refreshSession().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [hasStoredAuth, refreshSession])

  // Keep a valid server session alive while the user is actively using the app.
  // Throttled: only refreshes if 15 minutes have passed, preventing rapid focus-event logout loops.
  useEffect(() => {
    if (!user) return
    let refreshing = false
    let lastRefreshTime = Date.now()

    const silentlyRefresh = async (force = false) => {
      if (refreshing) return
      const now = Date.now()
      // Only refresh if at least 15 minutes elapsed since last refresh (or if forced)
      if (!force && now - lastRefreshTime < 15 * 60 * 1000) return

      refreshing = true
      try {
        const session = await authService.refresh()
        lastRefreshTime = Date.now()
        setUser(session.user)
        setPermissions(session.permissions)
        setCachedSession({ user: session.user, permissions: session.permissions })
      } catch (error) {
        // Only invalidate if the backend explicitly confirms 401 (session revoked or expired)
        if (error instanceof ApiError && error.status === 401) {
          setUser(null)
          setPermissions([])
          setCachedSession(null)
        }
      } finally {
        refreshing = false
      }
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void silentlyRefresh()
      }
    }

    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    // Periodic refresh timer every 30 minutes while active
    const timer = window.setInterval(onVisible, 30 * 60 * 1000)

    return () => {
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(timer)
    }
  }, [user?.id])

  const login = useCallback(async (email: string, password: string) => {
    const session = await authService.login(email, password)
    setUser(session.user)
    setPermissions(session.permissions)
    setCachedSession({ user: session.user, permissions: session.permissions })
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setPermissions([])
      setCachedSession(null)
    }
  }, [])

  const value = useMemo<AuthValue>(() => ({
    user,
    permissions,
    loading,
    login,
    logout,
    refreshSession,
    can: (capability) => permissions.includes(capability),
  }), [user, permissions, loading, login, logout, refreshSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

export function roleLabel(role: UserRole) {
  return {
    CITIZEN: 'Citizen',
    GOV_WORKER: 'Field Officer',
    GOV_ADMIN: 'Government Admin',
    APPROVER: 'Approver',
    SUPERIOR: 'Municipal Director',
  }[role]
}
