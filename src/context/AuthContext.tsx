import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoUsers } from '../data/mock'
import type { User, UserRole } from '../types'

type AuthValue = {
  user: User | null
  loginAs: (id: string) => void
  logout: () => void
  can: (capability: string) => boolean
}

const permissionMap: Record<UserRole, string[]> = {
  CITIZEN: ['map.public', 'request.create', 'request.own', 'booking.create'],
  GOV_WORKER: ['map.worker', 'request.assigned', 'request.update', 'inspection.update'],
  GOV_ADMIN: ['map.admin', 'request.all', 'request.assign', 'building.sensitive', 'department.view'],
  APPROVER: ['map.admin', 'request.all', 'approval.manage', 'users.view', 'building.sensitive'],
  SUPERIOR: ['map.executive', 'request.all', 'analytics.view', 'tax.view', 'users.view', 'building.sensitive'],
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const id = localStorage.getItem('lgs-demo-user')
    return demoUsers.find((item) => item.id === id) ?? null
  })

  useEffect(() => {
    if (user) localStorage.setItem('lgs-demo-user', user.id)
    else localStorage.removeItem('lgs-demo-user')
  }, [user])

  const value = useMemo<AuthValue>(() => ({
    user,
    loginAs: (id) => setUser(demoUsers.find((item) => item.id === id) ?? null),
    logout: () => setUser(null),
    can: (capability) => Boolean(user && permissionMap[user.role].includes(capability)),
  }), [user])

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
