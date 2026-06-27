import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { path: '/dashboard', icon: '🏠', label: 'Home' },
  { path: '/send',      icon: '💸', label: 'Send Money' },
  { path: '/history',   icon: '📋', label: 'Activity' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const displayName = user?.username?.split('@')[0] || 'User'
  const displayEmail = user?.username || 'demo@paypal.com'
  const initial = displayName[0].toUpperCase()

  async function handleLogout() {
    try { await logout() } catch {}
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Pay<span>Pal</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <div
            key={item.path}
            className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initial}</div>
          <div className="user-info">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{displayEmail}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
