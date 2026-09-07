import type { AuthSession, User, UserRole } from '../types'
import { apiData } from './http'

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'LG'
}

function normalizeUser(raw: any): User {
  const name = String(raw?.name || raw?.displayName || raw?.email || 'LGS User').trim()
  return {
    id: String(raw?.id || ''),
    name,
    shortName: name.split(/\s+/)[0] || 'User',
    email: String(raw?.email || ''),
    role: raw?.role as UserRole,
    departmentId: raw?.department?.id ?? raw?.departmentId ?? null,
    department: raw?.department?.name ?? raw?.departmentName ?? undefined,
    wardId: raw?.wardId ?? null,
    avatar: initials(name),
    status: raw?.status,
  }
}

function normalizeSession(raw: any): AuthSession {
  return {
    user: normalizeUser(raw?.user),
    permissions: Array.isArray(raw?.permissions) ? raw.permissions.map(String) : [],
  }
}

export const authService = {
  async login(email: string, password: string) {
    return normalizeSession(await apiData<any>('/auth/login', { method: 'POST', json: { email, password } }))
  },

  async me() {
    return normalizeSession(await apiData<any>('/auth/me'))
  },

  async logout() {
    return apiData<{ loggedOut: boolean }>('/auth/logout', { method: 'POST' })
  },

  async register(input: { firstName: string; lastName: string; email: string; password: string }) {
    return apiData<{ user: { id: string; name: string; email: string; role: 'CITIZEN' } }>('/auth/register', {
      method: 'POST',
      json: input,
    })
  },
}
