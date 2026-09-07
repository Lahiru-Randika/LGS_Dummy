import {
  Bell,
  Check,
  CheckCircle2,
  CircleAlert,
  Info,
  LoaderCircle,
  X,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  notificationTarget,
  notificationsService,
} from '../services/notifications.service'

import type {
  NotificationItem,
} from '../types'

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: CircleAlert,
}

export function NotificationsPopover({
  onClose,
}: {
  onClose: () => void
}) {
  const navigate =
    useNavigate()

  const [
    notifications,
    setNotifications,
  ] =
    useState<
      NotificationItem[]
    >([])

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    )

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null)

  /* =====================================================
     LOAD LATEST 5 NOTIFICATIONS
  ===================================================== */

  async function load() {
    setLoading(
      true,
    )

    setError(
      null,
    )

    try {
      const items =
        await notificationsService.list()

      /*
        Sort newest → oldest first.

        createdAt is preferred.

        If createdAt is missing on an old notification,
        its existing order is preserved near the bottom.
      */
      const latest =
        [...items]
          .sort(
            (
              a,
              b,
            ) => {
              const aTime =
                a.createdAt
                  ? new Date(
                      a.createdAt,
                    ).getTime()
                  : 0

              const bTime =
                b.createdAt
                  ? new Date(
                      b.createdAt,
                    ).getTime()
                  : 0

              return (
                bTime -
                aTime
              )
            },
          )
          .slice(
            0,
            4,
          )

      setNotifications(
        latest,
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to load notifications',
        error,
      )

      setNotifications(
        [],
      )

      setError(
        'Unable to load notifications.',
      )
    } finally {
      setLoading(
        false,
      )
    }
  }

  useEffect(
    () => {
      void load()
    },
    [],
  )

  /* =====================================================
     OPEN NOTIFICATION
  ===================================================== */

  async function openNotification(
    item:
      NotificationItem,
  ) {
    try {
      /*
        Mark unread notification
        before navigating.
      */
      if (
        item.unread
      ) {
        await notificationsService.markRead(
          item.id,
        )

        setNotifications(
          (
            current,
          ) =>
            current.map(
              (
                notification,
              ) =>
                notification.id ===
                item.id
                  ? {
                      ...notification,
                      unread:
                        false,
                    }
                  : notification,
            ),
        )
      }

      const target =
        notificationTarget(
          item,
        )

      if (
        target
      ) {
        onClose()

        navigate(
          target,
        )
      }
    } catch (
      error
    ) {
      console.error(
        'Unable to open notification',
        error,
      )
    }
  }

  /* =====================================================
     MARK ALL READ
  ===================================================== */

  async function markAllRead() {
    try {
      await notificationsService.markAllRead()

      setNotifications(
        (
          current,
        ) =>
          current.map(
            (
              item,
            ) => ({
              ...item,
              unread:
                false,
            }),
          ),
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to mark notifications as read',
        error,
      )
    }
  }

  /* =====================================================
     OPEN NOTIFICATION CENTER
  ===================================================== */

  function openNotificationCenter() {
    onClose()

    navigate(
      '/app/notifications',
    )
  }

  const unreadCount =
    notifications.filter(
      (
        item,
      ) =>
        item.unread,
    ).length

  return (
    <div
      className="notify-popover"
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="notify-popover__head"
      >
        <div>
          <span
            className="eyebrow"
          >
            Updates
          </span>

          <h3>
            Notifications
          </h3>
        </div>

        <div
          className="flex items-center gap-1"
        >
          {unreadCount >
            0 && (
            <button
              type="button"
              className="text-button !px-2 !py-1 text-[8px]"
              onClick={() =>
                void markAllRead()
              }
            >
              <Check
                size={
                  13
                }
              />

              Mark all read
            </button>
          )}

          <button
            type="button"
            className="icon-btn"
            onClick={
              onClose
            }
            aria-label="Close notifications"
          >
            <X
              size={
                17
              }
            />
          </button>
        </div>
      </div>

      {/* =================================================
          LATEST 5
      ================================================== */}

      <div
        className="notify-list"
      >
        {loading ? (
          <div
            className="flex items-center justify-center gap-2 px-5 py-10 text-[10px] text-slate-500"
          >
            <LoaderCircle
              size={
                16
              }
              className="animate-spin text-teal-700"
            />

            Loading notifications...
          </div>
        ) : error ? (
          <div
            className="px-5 py-8 text-center"
          >
            <CircleAlert
              size={
                20
              }
              className="mx-auto text-amber-500"
            />

            <p
              className="mt-2 text-[10px] font-semibold text-slate-700"
            >
              {error}
            </p>

            <button
              type="button"
              className="text-button mt-3"
              onClick={() =>
                void load()
              }
            >
              Try again
            </button>
          </div>
        ) : notifications.length ? (
          notifications.map(
            (
              item,
            ) => {
              const Icon =
                icons[
                  item.tone
                ]

              const hasTarget =
                Boolean(
                  notificationTarget(
                    item,
                  ),
                )

              return (
                <article
                  key={
                    item.id
                  }
                  role="button"
                  tabIndex={
                    0
                  }
                  onClick={() =>
                    void openNotification(
                      item,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                        'Enter' ||
                      event.key ===
                        ' '
                    ) {
                      event.preventDefault()

                      void openNotification(
                        item,
                      )
                    }
                  }}
                  className={`notify-item cursor-pointer outline-none ${
                    item.unread
                      ? 'is-unread'
                      : ''
                  }`}
                >
                  {/* Icon */}
                  <span
                    className={`notify-item__icon notify-item__icon--${item.tone}`}
                  >
                    <Icon
                      size={
                        16
                      }
                    />
                  </span>

                  {/* Content */}
                  <div
                    className="min-w-0 flex-1"
                  >
                    <div
                      className="flex items-start justify-between gap-2"
                    >
                      <strong>
                        {
                          item.title
                        }
                      </strong>

                      {item.unread && (
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600"
                          aria-label="Unread"
                        />
                      )}
                    </div>

                    <p>
                      {
                        item.body
                      }
                    </p>

                    <div
                      className="mt-1 flex items-center gap-2"
                    >
                      <small>
                        {
                          item.time
                        }
                      </small>

                      {hasTarget && (
                        <small
                          className="font-bold text-teal-700"
                        >
                          View
                        </small>
                      )}
                    </div>
                  </div>
                </article>
              )
            },
          )
        ) : (
          <div
            className="px-5 py-10 text-center"
          >
            <Bell
              size={
                23
              }
              className="mx-auto text-slate-300"
            />

            <strong
              className="mt-3 block text-[10px] text-slate-700"
            >
              You're all caught up
            </strong>

            <p
              className="mt-1 text-[9px] text-slate-400"
            >
              New municipal updates will appear here.
            </p>
          </div>
        )}
      </div>

      {/* =================================================
          NOTIFICATION CENTER BUTTON
      ================================================== */}

      <div
        className="border-t border-slate-100 bg-white p-3"
      >
        <button
          type="button"
          onClick={
            openNotificationCenter
          }
          className="flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-extrabold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
        >
          <Bell
            size={
              15
            }
          />

          Notification center
        </button>
      </div>
    </div>
  )
}