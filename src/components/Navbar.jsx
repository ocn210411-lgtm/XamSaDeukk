import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data } = useSite()
  const location = useLocation()

  // Pages avec fond sombre → navbar toujours blanche
  const darkBgPages = ['/encyclopedie', '/jeux', '/apprendre-wolof']
  const isOnDarkPage = darkBgPages.some(p => location.pathname.startsWith(p))
  const isHome = location.pathname === '/'

  // Transparent uniquement sur la home ET pas encore scrollé
  const transparent = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/encyclopedie', label: 'Encyclopédie' },
    { to: '/jeux', label: 'Jeux' },
    { to: '/apprendre-wolof', label: 'Apprendre le Wolof' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: transparent ? 'transparent' : 'rgba(255,255,255,0.97)',
        backdropFilter: transparent ? 'none' : 'blur(12px)',
        boxShadow: transparent ? 'none' : '0 2px 16px rgba(92,45,10,0.1)'
      }}>
      <div className="flag-stripe" />
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-black font-playfair" style={{ color: '#C8552A' }}>Xam</span>
          <span className="text-2xl font-black font-playfair" style={{ color: '#E8A830' }}>Sa</span>
          <span className="text-2xl font-black font-playfair" style={{ color: '#0D7A3E' }}>Deukk</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className="text-sm font-medium transition-colors"
              style={{
                color: location.pathname === l.to || location.pathname.startsWith(l.to + '/') && l.to !== '/'
                  ? '#C8552A'
                  : '#5C2D0A',
                fontWeight: location.pathname === l.to ? 700 : 500,
                textDecoration: 'none'
              }}>
              {l.label}
            </Link>
          ))}
          <Link to="/admin" className="text-sm px-4 py-2 text-white no-underline" style={{ borderRadius: 50, background: 'linear-gradient(135deg,#C8552A,#A83820)', fontWeight: 600 }}>
            Admin
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`} style={{ color: '#5C2D0A' }} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-2" style={{ borderColor: 'rgba(232,168,48,0.2)' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="block py-2 font-medium" style={{ color: '#5C2D0A' }} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="/admin" className="block py-2 font-semibold" style={{ color: '#C8552A' }} onClick={() => setMenuOpen(false)}>
            ⚙️ Admin
          </Link>
        </div>
      )}
    </nav>
  )
}
