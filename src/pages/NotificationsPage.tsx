import {
  Bell,
  Check,
  CheckCircle2,
  CircleAlert,
  Inbox,
  Info,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  PageHeader,
} from '../components/PageHeader'

import {
  notificationTarget,
  notificationsService,
} from '../services/notifications.service'

import type {
  NotificationItem,
} from '../types'

type Filter =
  | 'ALL'
  | 'UNREAD'

const icons = {
  info:
    Info,

  success:
    CheckCircle2,

  warning:
    CircleAlert,
}

function exactTime(
  value?:
    string,
) {
  if (
    !value
  ) {
    return ''
  }

  const date =
    new Date(
      value,
    )

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return ''
  }

  return date.toLocaleString(
    undefined,
    {
      year:
        'numeric',

      month:
        'short',

      day:
        'numeric',

      hour:
        'numeric',

      minute:
        '2-digit',
    },
  )
}

export function NotificationsPage() {
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
    filter,
    setFilter,
  ] =
    useState<
      Filter
    >(
      'ALL',
    )

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

      setNotifications(
        items,
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to load notification center',
        error,
      )

      setError(
        'Notifications could not be loaded.',
      )
    } finally {
      setLoading(
        false,
      )
    }
  }

  /*
    Refresh the page automatically every 30 seconds
    while the notification center is open.
  */
  useEffect(
    () => {
      void load()

      const timer =
        window.setInterval(
          () => {
            void load()
          },
          30_000,
        )

      return () =>
        window.clearInterval(
          timer,
        )
    },
    [],
  )

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (
            notification,
          ) =>
            notification.unread,
        ).length,
      [
        notifications,
      ],
    )

  const visible =
    useMemo(
      () =>
        filter ===
        'UNREAD'
          ? notifications.filter(
              (
                notification,
              ) =>
                notification.unread,
            )
          : notifications,
      [
        notifications,
        filter,
      ],
    )

  async function openNotification(
    item:
      NotificationItem,
  ) {
    try {
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

  async function markAllRead() {
    try {
      await notificationsService.markAllRead()

      setNotifications(
        (
          current,
        ) =>
          current.map(
            (
              notification,
            ) => ({
              ...notification,

              unread:
                false,
            }),
          ),
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to mark all notifications as read',
        error,
      )
    }
  }

  return (
    <div
      className="page"
    >
      <PageHeader
        eyebrow="Updates"
        title="Notification center"
        description="Requests, inspections, approvals and municipal updates that need your attention."
        actions={
          <div
            className="flex flex-wrap items-center gap-2"
          >
            <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                    void load()
                }
                disabled={loading}
                >
                <RefreshCw
                    size={15}
                    className={
                    loading
                        ? 'animate-spin'
                        : ''
                    }
                />

                {loading
                    ? 'Refreshing...'
                    : 'Refresh'}
                </button>

            {unreadCount >
              0 && (
              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  void markAllRead()
                }
              >
                <Check
                  size={
                    15
                  }
                />

                Mark all read
              </button>
            )}
          </div>
        }
      />

      {/* ================================================
          FILTERS / SUMMARY
      ================================================= */}
      <div
        className="mb-5 flex flex-wrap items-center justify-between gap-3"
      >
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
        >
          <button
            type="button"
            onClick={() =>
              setFilter(
                'ALL',
              )
            }
            className={`rounded-lg border-0 px-4 py-2 text-[10px] font-extrabold transition ${
              filter ===
              'ALL'
                ? 'bg-slate-950 text-white'
                : 'bg-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            All
            {' '}
            {
              notifications.length
            }
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter(
                'UNREAD',
              )
            }
            className={`rounded-lg border-0 px-4 py-2 text-[10px] font-extrabold transition ${
              filter ===
              'UNREAD'
                ? 'bg-slate-950 text-white'
                : 'bg-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            Unread
            {' '}
            {
              unreadCount
            }
          </button>
        </div>

        <div
          className="flex items-center gap-2 text-[9px] font-semibold text-slate-400"
        >
          <Bell
            size={
              13
            }
          />

          Updates automatically every 30 seconds
        </div>
      </div>

      {/* ================================================
          CONTENT
      ================================================= */}
      <section
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)]"
      >
        {loading &&
        !notifications.length ? (
          <div
            className="flex min-h-[260px] items-center justify-center gap-3 text-[11px] text-slate-500"
          >
            <LoaderCircle
              size={
                19
              }
              className="animate-spin text-teal-700"
            />

            Loading notifications...
          </div>
        ) : error ? (
          <div
            className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center"
          >
            <CircleAlert
              size={
                27
              }
              className="text-amber-500"
            />

            <strong
              className="mt-3 text-[12px] text-slate-800"
            >
              Unable to load notifications
            </strong>

            <p
              className="mt-1 text-[10px] text-slate-500"
            >
              {error}
            </p>

            <button
              type="button"
              className="secondary-btn mt-4"
              onClick={() =>
                void load()
              }
            >
              <RefreshCw
                size={
                  14
                }
              />

              Try again
            </button>
          </div>
        ) : visible.length ? (
          <div>
            {visible.map(
              (
                item,
              ) => {
                const Icon =
                  icons[
                    item.tone
                  ]

                const target =
                  notificationTarget(
                    item,
                  )

                return (
                  <button
                    type="button"
                    key={
                      item.id
                    }
                    onClick={() =>
                      void openNotification(
                        item,
                      )
                    }
                    className={`group flex w-full items-start gap-4 border-0 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-50 ${
                      item.unread
                        ? 'bg-teal-50/40'
                        : 'bg-white'
                    }`}
                  >
                    {/* Tone icon */}
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        item.tone ===
                        'success'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.tone ===
                            'warning'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <Icon
                        size={
                          17
                        }
                      />
                    </span>

                    {/* Notification text */}
                    <span
                      className="min-w-0 flex-1"
                    >
                      <span
                        className="flex items-start gap-2"
                      >
                        <strong
                          className="text-[11px] font-extrabold text-slate-900"
                        >
                          {
                            item.title
                          }
                        </strong>

                        {item.unread && (
                          <i
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600"
                            aria-label="Unread notification"
                          />
                        )}
                      </span>

                      <span
                        className="mt-1 block max-w-3xl text-[10px] leading-5 text-slate-500"
                      >
                        {
                          item.body
                        }
                      </span>

                      <span
                        className="mt-2 flex flex-wrap items-center gap-2"
                      >
                        <small
                          className="text-[8px] font-semibold text-slate-400"
                        >
                          {
                            item.time
                          }
                        </small>

                        {item.createdAt && (
                          <>
                            <small
                              className="text-[8px] text-slate-300"
                            >
                              •
                            </small>

                            <small
                              className="text-[8px] text-slate-400"
                            >
                              {exactTime(
                                item.createdAt,
                              )}
                            </small>
                          </>
                        )}

                        {target && (
                          <>
                            <small
                              className="text-[8px] text-slate-300"
                            >
                              •
                            </small>

                            <small
                              className="text-[8px] font-extrabold text-teal-700"
                            >
                              Open related item
                            </small>
                          </>
                        )}
                      </span>
                    </span>
                  </button>
                )
              },
            )}
          </div>
        ) : (
          <div
            className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center"
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-300"
            >
              <Inbox
                size={
                  24
                }
              />
            </span>

            <strong
              className="mt-4 text-[12px] text-slate-800"
            >
              {filter ===
              'UNREAD'
                ? 'No unread notifications'
                : 'No notifications yet'}
            </strong>

            <p
              className="mt-1 max-w-sm text-[10px] leading-5 text-slate-400"
            >
              {filter ===
              'UNREAD'
                ? 'You have read all of your current updates.'
                : 'Request, inspection and approval updates will appear here.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}