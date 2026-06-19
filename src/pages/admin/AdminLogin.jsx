import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSite } from '../../context/SiteContext'

export default function AdminLogin() {
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, adminAuth } = useSite()
  const nav = useNavigate()

  useEffect(() => {
    if (adminAuth) nav('/admin/dashboard')
  }, [adminAuth])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (login(pwd)) nav('/admin/dashboard')
      else { setErr('Mot de passe incorrect'); setLoading(false) }
    }, 800)
  }

  return (
    <div className="min-h-screen bogolan flex items-center justify-center px-4">
      <div className="flag-stripe fixed top-0 left-0 right-0 z-50" />
      <div className="glass-card p-10 w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
          style={{ background: 'linear-gradient(135deg, #C8552A, #E8A830)' }}>
          🔐
        </div>
        <h1 className="text-3xl font-black font-playfair text-brown mb-2">
          <span style={{ color: '#C8552A' }}>Xam</span>
          <span style={{ color: '#E8A830' }}>Sa</span>
          <span style={{ color: '#0D7A3E' }}>Deukk</span>
        </h1>
        <p className="text-brown/60 text-sm mb-8">Panneau d'administration — Gestion du contenu</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setErr('') }}
              placeholder="Mot de passe admin"
              className="w-full px-5 py-3.5 rounded-2xl border text-sm outline-none transition-all"
              style={{ background: 'rgba(245,230,204,0.4)', border: `2px solid ${err ? '#B22222' : 'rgba(232,168,48,0.3)'}`, color: '#5C2D0A' }}
              autoFocus
            />
          </div>
          {err && <p className="text-red-600 text-sm font-medium">{err}</p>}
          <button type="submit" disabled={loading || !pwd} className="btn-primary w-full py-3.5 text-sm text-white"
            style={{ opacity: !pwd ? 0.5 : 1 }}>
            {loading ? '⏳ Vérification...' : '🚀 Accéder au Panel'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-sand/50">
          <a href="/" className="text-brown/50 text-xs hover:text-brown transition-colors">← Retour au site</a>
        </div>
      </div>
    </div>
  )
}
