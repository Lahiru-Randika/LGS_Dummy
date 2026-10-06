import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useAuth } from './context/AuthContext'
import type { UserRole } from './types'

// Route-level code splitting keeps GIS/admin/public bundles out of the initial load.
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })))
const NewsPage = lazy(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })))
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(m => ({ default: m.ExplorePage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })))
const RequestsPage = lazy(() => import('./pages/RequestsPage').then(m => ({ default: m.RequestsPage })))
const RequestDetailPage = lazy(() => import('./pages/RequestDetailPage').then(m => ({ default: m.RequestDetailPage })))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })))
const ApprovalsPage = lazy(() => import('./pages/ApprovalsPage').then(m => ({ default: m.ApprovalsPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const TaxPage = lazy(() => import('./pages/TaxPage').then(m => ({ default: m.TaxPage })))
const BuildingsPage = lazy(() => import('./pages/BuildingsPage').then(m => ({ default: m.BuildingsPage })))
const UsersPage = lazy(() => import('./pages/UsersPage').then(m => ({ default: m.UsersPage })))
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage').then(m => ({ default: m.MyBookingsPage })))
const MyTaxPaymentsPage = lazy(() => import('./pages/MyTaxPaymentsPage').then(m => ({ default: m.MyTaxPaymentsPage })))
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage').then(m => ({ default: m.ApplicationsPage })))

function Protected() {
  const {
    user,
    loading,
  } =
    useAuth()

  if (
    loading
  ) {
    return null
  }

  return user
    ? <Outlet />
    : (
      <Navigate
        to="/login"
        replace
      />
    )
}

function RoleGate({
  roles,
}: {
  roles:
    UserRole[]
}) {
  const {
    user,
    loading,
  } =
    useAuth()

  if (
    loading
  ) {
    return null
  }

  return user &&
    roles.includes(
      user.role,
    )
    ? <Outlet />
    : (
      <Navigate
        to="/app"
        replace
      />
    )
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}><Routes>
      {/* ===============================================
          PUBLIC WEBSITE
      ================================================ */}

      <Route
        path="/"
        element={
          <LandingPage />
        }
      />

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      <Route
        path="/register"
        element={
          <RegisterPage />
        }
      />

      <Route
        path="/about"
        element={
          <AboutPage />
        }
      />

      <Route
        path="/services"
        element={
          <ServicesPage />
        }
      />

      <Route
        path="/news"
        element={
          <NewsPage />
        }
      />

      <Route
        path="/contact"
        element={
          <ContactPage />
        }
      />

      {/* ===============================================
          PUBLIC MAP
      ================================================ */}

      <Route
        path="/map"
        element={
          <ExplorePage />
        }
      />

      <Route
        path="/explore"
        element={
          <Navigate
            to="/map"
            replace
          />
        }
      />

      {/* ===============================================
          AUTHENTICATED APPLICATION
      ================================================ */}

      <Route
        element={
          <Protected />
        }
      >
        <Route
          path="/app"
          element={
            <AppShell />
          }
        >
          <Route
            index
            element={
              <DashboardPage />
            }
          />

          <Route
            path="map"
            element={
              <MapPage />
            }
          />

          <Route
            path="requests"
            element={
              <RequestsPage />
            }
          />

          <Route
            path="requests/:id"
            element={
              <RequestDetailPage />
            }
          />

          {/* Citizen-only service pages */}
          <Route element={<RoleGate roles={['CITIZEN']} />}>
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="my-tax-payments" element={<MyTaxPaymentsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
          </Route>

          {/* All authenticated roles can open this */}
          <Route
            path="notifications"
            element={
              <NotificationsPage />
            }
          />

          {/* ===========================================
              APPROVAL
          ============================================ */}

          <Route
            element={
              <RoleGate
                roles={[
                  'APPROVER',
                  'SUPERIOR',
                ]}
              />
            }
          >
            <Route
              path="approvals"
              element={
                <ApprovalsPage />
              }
            />
          </Route>

          {/* ===========================================
              SUPERIOR
          ============================================ */}

          <Route
            element={
              <RoleGate
                roles={[
                  'SUPERIOR',
                ]}
              />
            }
          >
            <Route
              path="analytics"
              element={
                <AnalyticsPage />
              }
            />

            <Route
              path="tax"
              element={
                <TaxPage />
              }
            />
          </Route>

          {/* ===========================================
              BUILDING MANAGEMENT
          ============================================ */}

          <Route
            element={
              <RoleGate
                roles={[
                  'GOV_ADMIN',
                  'APPROVER',
                  'SUPERIOR',
                ]}
              />
            }
          >
            <Route
              path="buildings"
              element={
                <BuildingsPage />
              }
            />
          </Route>

          {/* ===========================================
              USER MANAGEMENT
          ============================================ */}

          <Route
            element={
              <RoleGate
                roles={[
                  'APPROVER',
                  'SUPERIOR',
                ]}
              />
            }
          >
            <Route
              path="users"
              element={
                <UsersPage />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/app"
                replace
              />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes></Suspense>
  )
}