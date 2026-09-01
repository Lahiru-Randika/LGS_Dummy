import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useAuth } from './context/AuthContext'
import { AboutPage } from './pages/AboutPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ApprovalsPage } from './pages/ApprovalsPage'
import { BuildingsPage } from './pages/BuildingsPage'
import { ContactPage } from './pages/ContactPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExplorePage } from './pages/ExplorePage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MapPage } from './pages/MapPage'
import { RegisterPage } from './pages/RegisterPage'
import { RequestDetailPage } from './pages/RequestDetailPage'
import { RequestsPage } from './pages/RequestsPage'
import { ServicesPage } from './pages/ServicesPage'
import { NewsPage } from './pages/NewsPage'
import { TaxPage } from './pages/TaxPage'
import { UsersPage } from './pages/UsersPage'
import type { UserRole } from './types'

function Protected() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function RoleGate({ roles }: { roles: UserRole[] }) {
  const { user } = useAuth()
  return user && roles.includes(user.role) ? <Outlet /> : <Navigate to="/app" replace />
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE — localhost:5173/ ALWAYS renders the landing page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* PUBLIC MAP — no login required */}
      <Route path="/map" element={<ExplorePage />} />
      {/* Backward-compatible redirect; the visible URL becomes /map */}
      <Route path="/explore" element={<Navigate to="/map" replace />} />

      {/* AUTHENTICATED APPLICATION */}
      <Route element={<Protected />}>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="requests/:id" element={<RequestDetailPage />} />

          <Route element={<RoleGate roles={['APPROVER', 'SUPERIOR']} />}>
            <Route path="approvals" element={<ApprovalsPage />} />
          </Route>

          <Route element={<RoleGate roles={['SUPERIOR']} />}>
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="tax" element={<TaxPage />} />
          </Route>

          <Route element={<RoleGate roles={['GOV_ADMIN', 'APPROVER', 'SUPERIOR']} />}>
            <Route path="buildings" element={<BuildingsPage />} />
          </Route>

          <Route element={<RoleGate roles={['APPROVER', 'SUPERIOR']} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
