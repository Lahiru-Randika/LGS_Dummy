export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_API_URL as string | undefined) ||
  'http://localhost:4000/api/v1'
).replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown
  fields?: unknown

  constructor(status: number, code: string, message: string, details?: unknown, fields?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.fields = fields
  }
}

type ApiEnvelope<T> = {
  success: boolean
  data: T
  meta?: unknown
  error?: {
    code?: string
    message?: string
    details?: unknown
    fields?: unknown
  }
}

type RequestOptions = RequestInit & { json?: unknown }

export function apiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function queryString(params: Record<string, unknown>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.set(key, String(value))
  })
  const rendered = search.toString()
  return rendered ? `?${rendered}` : ''
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<{ data: T; meta?: any }> {
  const { json, headers, ...rest } = options
  const body = json === undefined ? rest.body : JSON.stringify(json)
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const response = await fetch(apiUrl(path), {
    ...rest,
    body,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(json !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  let payload: ApiEnvelope<T> | any = null

  if (contentType.includes('application/json')) {
    try { payload = await response.json() } catch { payload = null }
  } else {
    try { payload = await response.text() } catch { payload = null }
  }

  if (!response.ok) {
    const error = payload?.error
    throw new ApiError(
      response.status,
      error?.code || 'HTTP_ERROR',
      error?.message || `Request failed (${response.status})`,
      error?.details,
      error?.fields,
    )
  }

  if (payload && typeof payload === 'object' && 'success' in payload) {
    return { data: payload.data as T, meta: payload.meta }
  }

  return { data: payload as T }
}

export async function apiData<T>(path: string, options?: RequestOptions) {
  return (await apiRequest<T>(path, options)).data
}

/**
 * Used for existing GIS/vector resources that are not JSON API envelopes.
 * Keeping this helper here ensures pages/components never call fetch directly.
 */
export async function fetchJsonResource<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json, application/geo+json, */*' },
    credentials: url.startsWith(API_BASE_URL) ? 'include' : 'same-origin',
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'RESOURCE_FETCH_FAILED', `${response.status} ${response.statusText} while loading ${url}`)
  }

  return response.json() as Promise<T>
}
