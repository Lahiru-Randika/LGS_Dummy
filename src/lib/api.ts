/**
 * Backend integration seam.
 *
 * The current project is intentionally UI-first and uses mock data. Replace
 * calls behind this small client instead of putting fetch() calls inside pages.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000/api/v1'

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`LGS API request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}
