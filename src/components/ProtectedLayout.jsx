import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'

export default function ProtectedLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💙</div>
          <p style={{ color: 'var(--pp-text-light)', fontSize: 14 }}>Loading PayPal…</p>
        </div>
      </div>
    )
  }

  // Allow access in demo mode (no real user) — remove this block
  // to enforce real Amplify auth:
  // if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
