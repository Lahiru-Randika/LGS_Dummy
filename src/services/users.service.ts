import type {
  GovernmentUser,
  PageMeta,
  UserRole,
  Worker,
} from '../types'

import {
  apiData,
  apiRequest,
  queryString,
} from './http'

export type Department = {
  id: number
  code: string
  name: string
  description?: string | null
}

function avatar(
  name: string,
) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (part) =>
          part[0],
      )
      .join('')
      .slice(
        0,
        2,
      )
      .toUpperCase() ||
    'LG'
  )
}

function mapUser(
  raw: any,
): GovernmentUser {
  const name =
    String(
      raw?.name ||
        raw?.email ||
        'Government user',
    )

  return {
    id:
      String(
        raw?.id ||
          '',
      ),

    name,

    shortName:
      name.split(/\s+/)[0] ||
      'User',

    email:
      String(
        raw?.email ||
          '',
      ),

    role:
      raw?.role as UserRole,

    department:
      raw?.departmentName ||
      undefined,

    departmentId:
      raw?.departmentId ??
      null,

    wardId:
      raw?.wardId ??
      null,

    avatar:
      avatar(name),

    status:
      raw?.status ||
      'ACTIVE',

    createdAt:
      raw?.createdAt,

    lastLoginAt:
      raw?.lastLoginAt,
  }
}

export const usersService = {
  async list(
    query: {
      search?: string
      role?: string
      departmentId?: number
      status?: string
      page?: number
      limit?: number
    } = {},
  ) {
    const response =
      await apiRequest<
        any[]
      >(
        `/users${queryString(
          query,
        )}`,
      )

    return {
      items:
        response.data.map(
          mapUser,
        ),

      meta:
        response.meta as
          | PageMeta
          | undefined,
    }
  },

  workers: () =>
    apiData<
      Worker[]
    >(
      '/users/workers',
    ),

  departments: () =>
    apiData<
      Department[]
    >(
      '/departments',
    ),

  invite(
    input: {
      firstName: string
      lastName: string
      email: string

      role:
        Exclude<
          UserRole,
          'CITIZEN'
        >

      departmentId?:
        | number
        | null
    },
  ) {
    return apiData<any>(
      '/users/invitations',
      {
        method:
          'POST',

        json:
          input,
      },
    )
  },

  updateAccess(
    id: string,

    input: {
      role:
        UserRole

      departmentId?:
        | number
        | null
    },
  ) {
    return apiData<{
      updated: boolean
      sessionsRevoked: boolean
    }>(
      `/users/${encodeURIComponent(
        id,
      )}/access`,
      {
        method:
          'PATCH',

        json:
          input,
      },
    )
  },
}