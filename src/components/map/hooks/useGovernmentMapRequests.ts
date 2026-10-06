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

/* =========================================================
   MAP VISIBILITY RULES
========================================================= */

/*
 * Completed requests are intentionally hidden from
 * the operational municipal map.
 *
 * They still exist in the Requests module and database.
 * They are simply not shown as map pins.
 */
const HIDDEN_MAP_STATUSES =
  new Set<string>([
    'RESOLVED',
    'CLOSED',
  ])

/* =========================================================
   GOVERNMENT MAP REQUESTS
========================================================= */

export function useGovernmentMapRequests(
  user: MapUser,
) {
  const [
    requests,
    setRequests,
  ] = useState<
    ServiceRequest[]
  >([])

  /* -------------------------------------------------------
     LOAD REQUESTS
  ------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false

    const loadRequests =
      async () => {
        /*
         * Citizens do not receive the government
         * request-marker layer.
         */
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

  /* -------------------------------------------------------
     DETERMINE VISIBLE REQUESTS
  ------------------------------------------------------- */

  const visibleRequests =
    useMemo(() => {
      if (
        !user ||
        user.role === 'CITIZEN'
      ) {
        return []
      }

      /*
       * Remove requests that are already finished.
       */
      const activeRequests =
        requests.filter(
          (request) =>
            !HIDDEN_MAP_STATUSES.has(
              request.status,
            ),
        )

      /*
       * Government workers only see active requests
       * assigned specifically to them.
       */
      if (
        user.role === 'GOV_WORKER'
      ) {
        return activeRequests.filter(
          (request) =>
            request.assignedTo ===
            user.id,
        )
      }

      /*
       * Admin / supervisor / other authorized
       * government roles see all active requests.
       */
      return activeRequests
    }, [
      user,
      requests,
    ])

  return {
    requests,
    visibleRequests,
  }
}