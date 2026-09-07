import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Home,
  LogOut,
  Map,
  Menu,
  ReceiptText,
  Users,
  X,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  roleLabel,
  useAuth,
} from '../context/AuthContext'

import {
  NOTIFICATIONS_CHANGED_EVENT,
  notificationsService,
} from '../services/notifications.service'

import type {
  UserRole,
} from '../types'

import {
  Brand,
} from './Brand'

import {
  NotificationsPopover,
} from './NotificationsPopover'

type Item = {
  label:
    string

  to:
    string

  icon:
    typeof Home

  roles?:
    UserRole[]
}

const items:
  Item[] = [
    {
      label:
        'Overview',

      to:
        '/app',

      icon:
        Home,
    },

    {
      label:
        'Municipal map',

      to:
        '/app/map',

      icon:
        Map,
    },

    {
      label:
        'Requests',

      to:
        '/app/requests',

      icon:
        ClipboardCheck,
    },

    {
      label:
        'Approvals',

      to:
        '/app/approvals',

      icon:
        FileCheck2,

      roles: [
        'APPROVER',
        'SUPERIOR',
      ],
    },

    {
      label:
        'Analytics',

      to:
        '/app/analytics',

      icon:
        BarChart3,

      roles: [
        'SUPERIOR',
      ],
    },

    {
      label:
        'Tax',

      to:
        '/app/tax',

      icon:
        ReceiptText,

      roles: [
        'SUPERIOR',
      ],
    },

    {
      label:
        'Buildings',

      to:
        '/app/buildings',

      icon:
        Building2,

      roles: [
        'GOV_ADMIN',
        'APPROVER',
        'SUPERIOR',
      ],
    },

    {
      label:
        'Users',

      to:
        '/app/users',

      icon:
        Users,

      roles: [
        'APPROVER',
        'SUPERIOR',
      ],
    },
  ]

export function AppShell() {
  const {
    user,
    logout,
  } =
    useAuth()

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(
      false,
    )

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] =
    useState(
      false,
    )

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(
      false,
    )

  const [
    unreadCount,
    setUnreadCount,
  ] =
    useState(
      0,
    )

  const visibleItems =
    user
      ? items.filter(
          (
            item,
          ) =>
            !item.roles ||
            item.roles.includes(
              user.role,
            ),
        )
      : []

  /*
    ================================================
    UNREAD NOTIFICATION COUNT
    ================================================

    1. Load immediately.
    2. Refresh every 30 seconds.
    3. Refresh immediately when another component
       marks notifications as read.
  */
  useEffect(
    () => {
      if (
        !user
      ) {
        setUnreadCount(
          0,
        )

        return
      }

      let cancelled =
        false

      async function loadUnreadCount() {
        try {
          const result =
            await notificationsService.unreadCount()

          if (
            !cancelled
          ) {
            setUnreadCount(
              Number(
                result.count ||
                  0,
              ),
            )
          }
        } catch {
          if (
            !cancelled
          ) {
            setUnreadCount(
              0,
            )
          }
        }
      }

      void loadUnreadCount()

      const timer =
        window.setInterval(
          () => {
            void loadUnreadCount()
          },
          30_000,
        )

      const handleNotificationChanged =
        () => {
          void loadUnreadCount()
        }

      window.addEventListener(
        NOTIFICATIONS_CHANGED_EVENT,
        handleNotificationChanged,
      )

      return () => {
        cancelled =
          true

        window.clearInterval(
          timer,
        )

        window.removeEventListener(
          NOTIFICATIONS_CHANGED_EVENT,
          handleNotificationChanged,
        )
      }
    },
    [
      user?.id,
    ],
  )

  /*
    Close temporary menus after navigating.
  */
  useEffect(
    () => {
      setNotificationsOpen(
        false,
      )

      setProfileOpen(
        false,
      )

      setMobileOpen(
        false,
      )
    },
    [
      location.pathname,
    ],
  )

  if (
    !user
  ) {
    return null
  }

  const area =
    user.role ===
    'CITIZEN'
      ? 'Citizen portal'
      : user.role ===
        'SUPERIOR'
        ? 'Executive command'
        : 'Government workspace'

  const currentPageLabel =
    location.pathname ===
    '/app/notifications'
      ? 'Notifications'
      : visibleItems.find(
            (
              item,
            ) =>
              item.to ===
              location.pathname,
          )
          ?.label ??
        (
          location.pathname.startsWith(
            '/app/requests/',
          )
            ? 'Requests'
            : 'Workspace'
        )

  async function doLogout() {
    await logout()

    navigate(
      '/',
    )
  }

  return (
    <div
      className="app-shell"
    >
      <aside
        className={`sidebar ${
          mobileOpen
            ? 'is-open'
            : ''
        }`}
      >
        <div
          className="sidebar__brand"
        >
          <Brand
            light
          />

          <button
            type="button"
            className="sidebar__close"
            onClick={() =>
              setMobileOpen(
                false,
              )
            }
          >
            <X
              size={
                20
              }
            />
          </button>
        </div>

        <div
          className="workspace-label"
        >
          <span>
            {area}
          </span>

          <small>
            {roleLabel(
              user.role,
            )}
          </small>
        </div>

        <nav
          className="sidebar__nav"
          aria-label="Application navigation"
        >
          {visibleItems.map(
            (
              item,
            ) => (
              <NavLink
                key={
                  item.to
                }
                end={
                  item.to ===
                  '/app'
                }
                to={
                  item.to
                }
                onClick={() =>
                  setMobileOpen(
                    false,
                  )
                }
                className={({
                  isActive,
                }) =>
                  `side-link ${
                    isActive
                      ? 'is-active'
                      : ''
                  }`
                }
              >
                <item.icon
                  size={
                    18
                  }
                  strokeWidth={
                    1.9
                  }
                />

                <span>
                  {
                    item.label
                  }
                </span>
              </NavLink>
            ),
          )}
        </nav>

        <div
          className="sidebar__bottom"
        >
          <div
            className="civic-pulse"
          >
            <span
              className="civic-pulse__dot"
            />

            <div>
              <strong>
                Municipal network
              </strong>

              <small>
                All systems operational
              </small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={
              doLogout
            }
          >
            <LogOut
              size={
                17
              }
            />

            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="mobile-scrim"
          aria-label="Close menu"
          onClick={() =>
            setMobileOpen(
              false,
            )
          }
        />
      )}

      <main
        className="app-main"
      >
        <header
          className="topbar"
        >
          <div
            className="topbar__left"
          >
            <button
              type="button"
              className="icon-btn mobile-menu"
              onClick={() =>
                setMobileOpen(
                  true,
                )
              }
              aria-label="Open navigation"
            >
              <Menu
                size={
                  20
                }
              />
            </button>

            <div>
              <span
                className="topbar__crumb"
              >
                LGS /{' '}
                {
                  currentPageLabel
                }
              </span>

              <strong>
                {area}
              </strong>
            </div>
          </div>

          <div
            className="topbar__right"
          >
            {/* =========================================
                NOTIFICATIONS
            ========================================== */}
            <div
              className="popover-anchor"
            >
              <button
                type="button"
                className="icon-btn notification-btn"
                onClick={() => {
                  setProfileOpen(
                    false,
                  )

                  setNotificationsOpen(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }}
                aria-label="Notifications"
              >
                <Bell
                  size={
                    19
                  }
                />

                {unreadCount >
                  0 && (
                  <span>
                    {unreadCount >
                    99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <NotificationsPopover
                  onClose={() =>
                    setNotificationsOpen(
                      false,
                    )
                  }
                />
              )}
            </div>

            {/* =========================================
                PROFILE
            ========================================== */}
            <div
              className="popover-anchor"
            >
              <button
                type="button"
                className="profile-chip"
                onClick={() => {
                  setNotificationsOpen(
                    false,
                  )

                  setProfileOpen(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }}
              >
                <span
                  className="avatar"
                >
                  {
                    user.avatar
                  }
                </span>

                <span>
                  <strong>
                    {
                      user.shortName
                    }
                  </strong>

                  <small>
                    {roleLabel(
                      user.role,
                    )}
                  </small>
                </span>

                <ChevronDown
                  size={
                    15
                  }
                />
              </button>

              {profileOpen && (
                <div
                  className="profile-menu"
                >
                  <strong>
                    {
                      user.name
                    }
                  </strong>

                  <small>
                    {
                      user.email
                    }
                  </small>

                  <hr />

                  <button
                    type="button"
                    onClick={
                      doLogout
                    }
                  >
                    <LogOut
                      size={
                        15
                      }
                    />

                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div
          className="app-content"
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}