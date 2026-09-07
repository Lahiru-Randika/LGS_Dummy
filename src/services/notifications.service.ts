import type {
  NotificationItem,
} from '../types'

import {
  apiData,
} from './http'

/*
  AppShell listens for this event.

  Whenever another page or the notification popover marks
  something as read, the bell count is refreshed immediately.
*/
export const NOTIFICATIONS_CHANGED_EVENT =
  'lgs:notifications-changed'

function notifyNotificationChanged() {
  if (
    typeof window !==
    'undefined'
  ) {
    window.dispatchEvent(
      new Event(
        NOTIFICATIONS_CHANGED_EVENT,
      ),
    )
  }
}

function relativeTime(
  value:
    string,
) {
  const then =
    new Date(
      value,
    ).getTime()

  if (
    !Number.isFinite(
      then,
    )
  ) {
    return value
  }

  const diff =
    Math.max(
      0,
      Date.now() -
        then,
    )

  const minutes =
    Math.floor(
      diff /
        60000,
    )

  if (
    minutes <
    1
  ) {
    return 'Just now'
  }

  if (
    minutes <
    60
  ) {
    return `${minutes} min ago`
  }

  const hours =
    Math.floor(
      minutes /
        60,
    )

  if (
    hours <
    24
  ) {
    return `${hours} hr${
      hours ===
      1
        ? ''
        : 's'
    } ago`
  }

  const days =
    Math.floor(
      hours /
        24,
    )

  if (
    days ===
    1
  ) {
    return 'Yesterday'
  }

  if (
    days <
    7
  ) {
    return `${days} days ago`
  }

  return new Date(
    value,
  ).toLocaleDateString(
    undefined,
    {
      year:
        'numeric',
      month:
        'short',
      day:
        'numeric',
    },
  )
}

function tone(
  value:
    unknown,
):
  NotificationItem['tone'] {
  const upper =
    String(
      value ||
        '',
    ).toUpperCase()

  if (
    upper ===
    'SUCCESS'
  ) {
    return 'success'
  }

  if (
    upper ===
      'WARNING' ||
    upper ===
      'DANGER'
  ) {
    return 'warning'
  }

  return 'info'
}

/*
  Determines where a notification should take the user.

  SERVICE_REQUEST:
      LGS-2026-000001
      ↓
      /app/requests/LGS-2026-000001

  APPROVAL:
      Approval center currently has no separate detail route,
      so it opens /app/approvals.
*/
export function notificationTarget(
  notification:
    NotificationItem,
):
  string | null {
  const entityType =
    notification.entityType
      ?.toUpperCase()

  const entityId =
    notification.entityId
      ?.trim()

  if (
    entityType ===
      'SERVICE_REQUEST' &&
    entityId
  ) {
    return `/app/requests/${encodeURIComponent(
      entityId,
    )}`
  }

  if (
    entityType ===
    'APPROVAL'
  ) {
    return '/app/approvals'
  }

  return null
}

export const notificationsService =
  {
    async list() {
      const raw =
        await apiData<
          any[]
        >(
          '/notifications',
        )

      return raw.map(
        (
          item,
        ):
          NotificationItem => ({
          id:
            String(
              item.id,
            ),

          type:
            item.type
              ? String(
                  item.type,
                )
              : undefined,

          title:
            String(
              item.title ||
                '',
            ),

          body:
            String(
              item.body ||
                '',
            ),

          createdAt:
            item.createdAt
              ? String(
                  item.createdAt,
                )
              : undefined,

          time:
            relativeTime(
              String(
                item.createdAt ||
                  '',
              ),
            ),

          tone:
            tone(
              item.tone,
            ),

          unread:
            !item.readAt,

          entityType:
            item.entityType
              ? String(
                  item.entityType,
                )
              : null,

          entityId:
            item.entityId
              ? String(
                  item.entityId,
                )
              : null,
        }),
      )
    },

    unreadCount:
      () =>
        apiData<{
          count:
            number
        }>(
          '/notifications/unread-count',
        ),

    async markRead(
      id:
        string,
    ) {
      const result =
        await apiData<{
          read:
            boolean
        }>(
          `/notifications/${encodeURIComponent(
            id,
          )}/read`,
          {
            method:
              'PATCH',
          },
        )

      notifyNotificationChanged()

      return result
    },

    async markAllRead() {
      const result =
        await apiData<{
          readAll:
            boolean
        }>(
          '/notifications/read-all',
          {
            method:
              'POST',
          },
        )

      notifyNotificationChanged()

      return result
    },
  }