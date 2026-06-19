import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'

const NAV = [
  { to: '/admin/dashboard', icon: '📊', label: 'Tableau de bord' },
  { to: '/admin/hero', icon: '🎨', label: 'Section Hero' },
  { to: '/admin/puzzles', icon: '🧩', label: 'Puzzles Photos' },
  { to: '/admin/encyclopedie', icon: '📚', label: 'Encyclopédie' },
  { to: '/admin/jeux', icon: '🎮', label: 'Jeux' },
  { to: '/admin/temoignages', icon: '💬', label: 'Témoignages' },
  { to: '/admin/statistiques', icon: '📈', label: 'Statistiques' },
  { to: '/admin/parametres', icon: '⚙️', label: 'Paramètres' },
]

export default function AdminLayout() {
  const { adminAuth, logout, data } = useSite()
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    if (!adminAuth) nav('/admin')
  }, [adminAuth])

  if (!adminAuth) return null

  return (
    <div className="flex min-h-screen" style={{ background: '#F0E8DC' }}>
      <aside className="admin-sidebar flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b" style={{ borderColor: 'rgba(232,168,48,0.15)' }}>
          <div className="text-lg font-black font-playfair leading-tight">
            <span style={{ color: '#E87A50' }}>Xam</span>
            <span style={{ color: '#E8A830' }}>Sa</span>
            <span style={{ color: '#4AA870' }}>Deukk</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Panneau Admin</div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.to} to={item.to}
              className={`admin-nav-item ${loc.pathname === item.to ? 'active' : ''}`}>
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'rgba(232,168,48,0.1)' }}>
          <Link to="/" className="admin-nav-item text-white/40 hover:text-white/60 block mb-2" style={{ textDecoration: 'none' }}>
            <span>🌐</span><span>Voir le site</span>
          </Link>
          <button onClick={() => { logout(); nav('/admin') }} className="admin-nav-item w-full text-left hover:text-red-400">
            <span>🚪</span><span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="flag-stripe" />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
