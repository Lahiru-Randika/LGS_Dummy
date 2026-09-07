import {
  Check,
  ChevronRight,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  PageHeader,
} from '../components/PageHeader'

import {
  roleLabel,
  useAuth,
} from '../context/AuthContext'

import {
  ApiError,
} from '../services/http'

import {
  usersService,
  type Department,
} from '../services/users.service'

import type {
  GovernmentUser,
  UserRole,
} from '../types'

/* =========================================================
   ROLE HIERARCHY

   Must also be enforced by backend.
========================================================= */

const ROLE_LEVEL:
  Record<
    UserRole,
    number
  > = {
    CITIZEN:
      0,

    GOV_WORKER:
      1,

    GOV_ADMIN:
      2,

    APPROVER:
      3,

    SUPERIOR:
      4,
  }

const ROLE_OPTIONS:
  Array<{
    role:
      UserRole

    label:
      string

    level:
      number

    description:
      string
  }> = [
    {
      role:
        'CITIZEN',

      label:
        'Citizen',

      level:
        0,

      description:
        'Public portal access only.',
    },

    {
      role:
        'GOV_WORKER',

      label:
        'Field Officer',

      level:
        1,

      description:
        'Assigned requests and field inspections.',
    },

    {
      role:
        'GOV_ADMIN',

      label:
        'Government Administrator',

      level:
        2,

      description:
        'Department and request administration.',
    },

    {
      role:
        'APPROVER',

      label:
        'Approval Officer',

      level:
        3,

      description:
        'Approval workflow and user-access management.',
    },

    {
      role:
        'SUPERIOR',

      label:
        'Municipal Director',

      level:
        4,

      description:
        'Highest municipal system authority.',
    },
  ]

/* =========================================================
   LOCAL MESSAGE

   Replaces window.alert().
========================================================= */

type MessageState = {
  type:
    | 'success'
    | 'error'

  text:
    string
} | null

/* =========================================================
   PAGE
========================================================= */

export function UsersPage() {
  const {
    user,
  } =
    useAuth()

  const [
    users,
    setUsers,
  ] =
    useState<
      GovernmentUser[]
    >([])

  const [
    departments,
    setDepartments,
  ] =
    useState<
      Department[]
    >([])

  const [
    search,
    setSearch,
  ] =
    useState(
      '',
    )

  const [
    selectedUser,
    setSelectedUser,
  ] =
    useState<
      GovernmentUser | null
    >(
      null,
    )

  const [
    selectedRole,
    setSelectedRole,
  ] =
    useState<
      UserRole
    >(
      'CITIZEN',
    )

  const [
    departmentId,
    setDepartmentId,
  ] =
    useState(
      '',
    )

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    )

  const [
    saving,
    setSaving,
  ] =
    useState(
      false,
    )

  const [
    message,
    setMessage,
  ] =
    useState<
      MessageState
    >(
      null,
    )

  /* =======================================================
     CURRENT ACTOR LEVEL
  ======================================================= */

  const actorLevel =
    user
      ? ROLE_LEVEL[
          user.role
        ]
      : -1

  const actorCanManage =
    user?.role ===
      'SUPERIOR' ||
    user?.role ===
      'APPROVER'

  /* =======================================================
     LOAD ALL USERS
  ======================================================= */

  async function load() {
    try {
      setLoading(
        true,
      )

      const [
        usersResult,
        departmentResult,
      ] =
        await Promise.all([
          usersService.list({
            limit:
              100,
          }),

          usersService.departments(),
        ])

      setUsers(
        usersResult.items,
      )

      setDepartments(
        departmentResult,
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to load users',
        error,
      )

      setUsers(
        [],
      )

      setMessage({
        type:
          'error',

        text:
          'Unable to load user accounts.',
      })
    } finally {
      setLoading(
        false,
      )
    }
  }

  useEffect(() => {
    void load()
  }, [])

  /* =======================================================
     SEARCH

     Citizens + government staff are searchable together.
  ======================================================= */

  const filtered =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase()

        if (
          !query
        ) {
          return users
        }

        return users.filter(
          (
            account,
          ) =>
            `
              ${account.name}
              ${account.email}
              ${account.role}
              ${roleLabel(account.role)}
              ${account.department || ''}
            `
              .toLowerCase()
              .includes(
                query,
              ),
        )
      },
      [
        users,
        search,
      ],
    )

  /* =======================================================
     OPEN ACCOUNT

     Clicking/searching does not itself change anything.
  ======================================================= */

  function openUser(
    target:
      GovernmentUser,
  ) {
    setSelectedUser(
      target,
    )

    setSelectedRole(
      target.role,
    )

    setDepartmentId(
      target.departmentId
        ? String(
            target.departmentId,
          )
        : '',
    )

    setMessage(
      null,
    )
  }

  /* =======================================================
     CAN MODIFY TARGET?

     APPROVER cannot edit SUPERIOR.
     User cannot edit themselves.
  ======================================================= */

  function canModifyTarget(
    target:
      GovernmentUser,
  ) {
    if (
      !user ||
      !actorCanManage
    ) {
      return false
    }

    if (
      target.id ===
      user.id
    ) {
      return false
    }

    const targetLevel =
      ROLE_LEVEL[
        target.role
      ]

    return (
      targetLevel <=
      actorLevel
    )
  }

  /* =======================================================
     AVAILABLE ROLE OPTIONS

     Actor can never assign above their own level.
  ======================================================= */

  const availableRoles =
    useMemo(
      () =>
        ROLE_OPTIONS.filter(
          (
            option,
          ) =>
            option.level <=
            actorLevel,
        ),
      [
        actorLevel,
      ],
    )

  /* =======================================================
     SAVE ROLE / DEPARTMENT
  ======================================================= */

  async function saveAccess() {
    if (
      !selectedUser ||
      !user
    ) {
      return
    }

    setMessage(
      null,
    )

    if (
      !actorCanManage
    ) {
      setMessage({
        type:
          'error',

        text:
          'Your account cannot change user access.',
      })

      return
    }

    if (
      selectedUser.id ===
      user.id
    ) {
      setMessage({
        type:
          'error',

        text:
          'You cannot modify your own role.',
      })

      return
    }

    const targetLevel =
      ROLE_LEVEL[
        selectedUser.role
      ]

    const requestedLevel =
      ROLE_LEVEL[
        selectedRole
      ]

    if (
      targetLevel >
      actorLevel
    ) {
      setMessage({
        type:
          'error',

        text:
          'You cannot modify an account above your access level.',
      })

      return
    }

    if (
      requestedLevel >
      actorLevel
    ) {
      setMessage({
        type:
          'error',

        text:
          'You cannot assign a role above your own access level.',
      })

      return
    }

    /*
      Citizen has no municipal department.

      Other roles can have one.
    */
    const nextDepartmentId =
      selectedRole ===
      'CITIZEN'
        ? null
        : departmentId
          ? Number(
              departmentId,
            )
          : null

    try {
      setSaving(
        true,
      )

      await usersService.updateAccess(
        selectedUser.id,
        {
          role:
            selectedRole,

          departmentId:
            nextDepartmentId,
        },
      )

      setMessage({
        type:
          'success',

        text:
          `${selectedUser.name}'s access was updated successfully.`,
      })

      await load()

      /*
        Refresh selected account from newly loaded data
        is not necessary; close panel after successful update.
      */
      window.setTimeout(
        () => {
          setSelectedUser(
            null,
          )

          setMessage(
            null,
          )
        },
        1300,
      )
    } catch (
      error
    ) {
      setMessage({
        type:
          'error',

        text:
          error instanceof
            ApiError
            ? error.message
            : 'Unable to update this account.',
      })
    } finally {
      setSaving(
        false,
      )
    }
  }

  /* =======================================================
     ROLE STYLE
  ======================================================= */

  function roleStyle(
    role:
      UserRole,
  ) {
    switch (
      role
    ) {
      case 'SUPERIOR':
        return 'bg-violet-50 text-violet-700'

      case 'APPROVER':
        return 'bg-blue-50 text-blue-700'

      case 'GOV_ADMIN':
        return 'bg-amber-50 text-amber-700'

      case 'GOV_WORKER':
        return 'bg-emerald-50 text-emerald-700'

      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="page">
      <PageHeader
        eyebrow="Access governance"
        title="User access"
        description="Search all registered users and manage access levels according to the municipal role hierarchy."
      />


      {/* ===================================================
          MESSAGE
          Replaces browser alert dialogs
      ==================================================== */}

      {message && (
        <div
          className={`
            mb-5
            flex
            items-center
            gap-3
            rounded-xl
            border
            px-4
            py-3
            text-[12px]
            font-semibold

            ${
              message.type ===
              'success'
                ? `
                  border-emerald-200
                  bg-emerald-50
                  text-emerald-800
                `
                : `
                  border-red-200
                  bg-red-50
                  text-red-700
                `
            }
          `}
        >
          {message.type ===
          'success' ? (
            <Check
              size={
                17
              }
            />
          ) : (
            <X
              size={
                17
              }
            />
          )}

          {
            message.text
          }
        </div>
      )}

      {/* ===================================================
          USERS
      ==================================================== */}

      <div className="table-panel">
        <div className="table-toolbar">
          <div className="search-field">
            <Search
              size={
                16
              }
            />

            <input
              placeholder="Search name, email, role or department…"
              value={
                search
              }
              onChange={
                (
                  event,
                ) =>
                  setSearch(
                    event.target.value,
                  )
              }
            />
          </div>

          <span>
            <Users
              size={
                15
              }
            />

            {filtered.length}{' '}
            registered{' '}
            {filtered.length ===
            1
              ? 'user'
              : 'users'}
          </span>
        </div>

        <div className="data-table">
          <div className="data-row data-row--head">
            <span>
              User
            </span>

            <span>
              Access level
            </span>

            <span>
              Department
            </span>

            <span>
              Status
            </span>

            <span>
              Action
            </span>
          </div>

          {loading ? (
            <div className="p-6 text-[12px] text-slate-500">
              Loading registered users…
            </div>
          ) : filtered.length ? (
            filtered.map(
              (
                account,
              ) => {
                const editable =
                  canModifyTarget(
                    account,
                  )

                return (
                  <button
                    type="button"
                    key={
                      account.id
                    }
                    onClick={
                      () =>
                        openUser(
                          account,
                        )
                    }
                    className="
                      data-row
                      w-full
                      cursor-pointer
                      border-0
                      bg-transparent
                      text-left
                      transition
                      hover:bg-slate-50
                    "
                  >
                    {/* USER */}
                    <span className="user-cell">
                      <i className="avatar">
                        {
                          account.avatar
                        }
                      </i>

                      <span>
                        <strong>
                          {
                            account.name
                          }
                        </strong>

                        <small>
                          {
                            account.email
                          }
                        </small>
                      </span>
                    </span>

                    {/* ROLE */}
                    <span>
                      <b
                        className={`
                          inline-flex
                          rounded-lg
                          px-3
                          py-1.5
                          text-[10px]
                          font-bold

                          ${roleStyle(
                            account.role,
                          )}
                        `}
                      >
                        {roleLabel(
                          account.role,
                        )}
                      </b>
                    </span>

                    {/* DEPARTMENT */}
                    <span>
                      {account.department ||
                        (
                          account.role ===
                          'CITIZEN'
                            ? 'Public user'
                            : '—'
                        )}
                    </span>

                    {/* STATUS */}
                    <span>
                      <i
                        className={
                          account.status ===
                          'ACTIVE'
                            ? 'online-dot'
                            : 'online-dot opacity-30'
                        }
                      />

                      {
                        account.status
                      }
                    </span>

                    {/* ACTION */}
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {account.id ===
                        user?.id
                          ? 'Your account'
                          : editable
                            ? 'Manage access'
                            : 'View access'}
                      </span>

                      <ChevronRight
                        size={
                          16
                        }
                        className="text-slate-400"
                      />
                    </span>
                  </button>
                )
              },
            )
          ) : (
            <div className="p-6 text-[12px] text-slate-500">
              No matching users found.
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          COMPACT ACCESS PANEL
      ==================================================== */}

      {selectedUser && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close access panel"
            className="
              fixed
              inset-0
              z-[2500]
              cursor-default
              border-0
              bg-slate-950/25
              backdrop-blur-[1px]
            "
            onClick={
              () =>
                setSelectedUser(
                  null,
                )
            }
          />

          {/* Panel */}
          <aside
            className="
              fixed
              bottom-4
              right-4
              top-4
              z-[2600]

              flex
              w-[420px]
              max-w-[calc(100%-32px)]
              flex-col

              overflow-hidden

              rounded-2xl
              border
              border-slate-200
              bg-white

              shadow-[0_30px_90px_rgba(15,23,42,.25)]
            "
          >
            {/* =============================================
                HEADER
            ============================================== */}

            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <i className="avatar">
                  {
                    selectedUser.avatar
                  }
                </i>

                <div className="min-w-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-[.12em] text-teal-700">
                    Account access
                  </span>

                  <h2 className="mt-1 truncate font-['Manrope'] text-lg font-extrabold text-slate-950">
                    {
                      selectedUser.name
                    }
                  </h2>

                  <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    {
                      selectedUser.email
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                onClick={
                  () =>
                    setSelectedUser(
                      null,
                    )
                }
              >
                <X
                  size={
                    16
                  }
                />
              </button>
            </div>

            {/* =============================================
                BODY
            ============================================== */}

            <div className="flex-1 overflow-y-auto p-5">
              {/* Current status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <small className="text-[8px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                    Current level
                  </small>

                  <strong className="mt-1.5 block text-[11px] text-slate-800">
                    Level{' '}
                    {
                      ROLE_LEVEL[
                        selectedUser.role
                      ]
                    }
                  </strong>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5">
                  <small className="text-[8px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                    Status
                  </small>

                  <strong className="mt-1.5 block text-[11px] text-slate-800">
                    {
                      selectedUser.status
                    }
                  </strong>
                </div>
              </div>

              {/* ===========================================
                  ROLE SELECTOR
              ============================================ */}

              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <UserCog
                    size={
                      16
                    }
                    className="text-teal-700"
                  />

                  <span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-600">
                    Access level
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {ROLE_OPTIONS.map(
                    (
                      option,
                    ) => {
                      const actorAllowed =
                        option.level <=
                        actorLevel

                      const selected =
                        selectedRole ===
                        option.role

                      const targetEditable =
                        canModifyTarget(
                          selectedUser,
                        )

                      const enabled =
                        actorAllowed &&
                        targetEditable

                      return (
                        <button
                          type="button"
                          key={
                            option.role
                          }
                          disabled={
                            !enabled
                          }
                          onClick={
                            () =>
                              setSelectedRole(
                                option.role,
                              )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-3

                            rounded-xl
                            border
                            px-4
                            py-3
                            text-left

                            transition

                            ${
                              selected
                                ? `
                                  border-teal-500
                                  bg-teal-50
                                `
                                : `
                                  border-slate-200
                                  bg-white
                                `
                            }

                            ${
                              enabled
                                ? `
                                  cursor-pointer
                                  hover:border-teal-300
                                `
                                : `
                                  cursor-not-allowed
                                  opacity-45
                                `
                            }
                          `}
                        >
                          <span>
                            <strong className="block text-[11px] text-slate-900">
                              Level{' '}
                              {
                                option.level
                              }
                              {' · '}
                              {
                                option.label
                              }
                            </strong>

                            <small className="mt-1 block text-[9px] leading-4 text-slate-500">
                              {
                                option.description
                              }
                            </small>
                          </span>

                          {selected && (
                            <Check
                              size={
                                16
                              }
                              className="shrink-0 text-teal-700"
                            />
                          )}
                        </button>
                      )
                    },
                  )}
                </div>
              </div>

              {/* ===========================================
                  DEPARTMENT
              ============================================ */}

              {selectedRole !==
                'CITIZEN' && (
                <div className="mt-5">
                  <label>
                    <span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-600">
                      Department
                    </span>

                    <select
                      value={
                        departmentId
                      }
                      disabled={
                        !canModifyTarget(
                          selectedUser,
                        )
                      }
                      onChange={
                        (
                          event,
                        ) =>
                          setDepartmentId(
                            event.target.value,
                          )
                      }
                      className="
                        mt-2
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-[11px]
                        text-slate-700
                        outline-none

                        focus:border-teal-500
                        focus:ring-2
                        focus:ring-teal-100

                        disabled:bg-slate-50
                      "
                    >
                      <option value="">
                        Select department
                      </option>

                      {departments.map(
                        (
                          department,
                        ) => (
                          <option
                            key={
                              department.id
                            }
                            value={
                              department.id
                            }
                          >
                            {
                              department.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
              )}

              {/* ===========================================
                  RESTRICTION MESSAGE
              ============================================ */}

              {!canModifyTarget(
                selectedUser,
              ) && (
                <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[10px] leading-5 text-amber-800">
                  {selectedUser.id ===
                  user?.id
                    ? 'You cannot modify your own role.'
                    : 'This account is above your permitted management level.'}
                </div>
              )}
            </div>

            {/* =============================================
                FOOTER
            ============================================== */}

            <div className="border-t border-slate-100 bg-white p-4">
              <button
                type="button"
                disabled={
                  saving ||
                  !canModifyTarget(
                    selectedUser,
                  )
                }
                onClick={
                  () =>
                    void saveAccess()
                }
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-950
                  text-[11px]
                  font-extrabold
                  text-white

                  transition
                  hover:bg-slate-800

                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ShieldCheck
                  size={
                    15
                  }
                />

                {saving
                  ? 'Saving access…'
                  : 'Apply access change'}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}