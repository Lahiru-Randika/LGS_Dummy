import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/auth.service'
import { ApiError } from '../services/http'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const session = await authService.me()
      setUser(session.user)
      setPermissions(session.permissions)
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        console.error('Unable to restore LGS session', error)
      }
      setUser(null)
      setPermissions([])
    }
  }, [])

  useEffect(() => {
    refreshSession().finally(() => setLoading(false))
  }, [refreshSession])



  // Keep a valid server session alive while the user is actively using the app.
  // Returning after screen lock/sleep triggers a silent refresh instead of logout.
  useEffect(() => {
    if (!user) return
    let refreshing = false
    const silentlyRefresh = async () => {
      if (refreshing) return
      refreshing = true
      try {
        const session = await authService.refresh()
        setUser(session.user)
        setPermissions(session.permissions)
      } catch (error) {
        // Do not force logout for temporary network/server failures.
        if (error instanceof ApiError && error.status === 401) {
          setUser(null)
          setPermissions([])
        }
      } finally { refreshing = false }
    }
    const onVisible = () => { if (document.visibilityState === 'visible') void silentlyRefresh() }
    window.addEventListener('focus', silentlyRefresh)
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void silentlyRefresh() }, 6 * 60 * 60 * 1000)
    return () => { window.removeEventListener('focus', silentlyRefresh); document.removeEventListener('visibilitychange', onVisible); window.clearInterval(timer) }
  }, [user?.id])

  const login = useCallback(async (email: string, password: string) => {
    const session = await authService.login(email, password)
    setUser(session.user)
    setPermissions(session.permissions)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setPermissions([])
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
