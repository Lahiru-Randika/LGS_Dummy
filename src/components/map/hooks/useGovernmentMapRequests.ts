import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  requestsService,
} from '../../../services/requests.service'
import type {
  ServiceRequest,
} from '../../../types'

type MapUser = {
  id: string
  role: string
} | null | undefined

export function useGovernmentMapRequests(
  user: MapUser,
) {
  const [
    requests,
    setRequests,
  ] = useState<
    ServiceRequest[]
  >([])

  useEffect(() => {
    let cancelled = false

    const loadRequests =
      async () => {
        if (
          !user ||
          user.role === 'CITIZEN'
        ) {
          if (!cancelled) {
            setRequests([])
          }
          return
        }

        try {
          const result =
            await requestsService.list({
              limit: 100,
            })

          if (!cancelled) {
            setRequests(
              result.items,
            )
          }
        } catch (error) {
          console.error(
            'Unable to load map requests.',
            error,
          )

          if (!cancelled) {
            setRequests([])
          }
        }
      }

    void loadRequests()

    return () => {
      cancelled = true
    }
  }, [
    user?.id,
    user?.role,
  ])

  const visibleRequests =
    useMemo(() => {
      if (
        !user ||
        user.role === 'CITIZEN'
      ) {
        return []
      }

      if (
        user.role === 'GOV_WORKER'
      ) {
        return requests.filter(
          (request) =>
            request.assignedTo ===
            user.id,
        )
      }

      return requests
    }, [
      user,
      requests,
    ])

  return {
    requests,
    visibleRequests,
  }
}
