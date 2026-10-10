import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROLE_HOME } from '../utils'

// Frontend-only route guard: checks the mock session held in React state.
export default function Guard({ role }) {
  const { session, authLoading } = useApp()
  const loc = useLocation()
  if (authLoading) return <div className="mx-auto max-w-7xl p-8 pt-24 text-sm text-muted">Restoring your secure session…</div>
  if (!session) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  if (session.role !== role) return <Navigate to={ROLE_HOME[session.role]} replace />
  return <Outlet />
}
