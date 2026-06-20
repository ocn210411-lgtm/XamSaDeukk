import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

export default function Footer() {
  const { data } = useSite()
  const { footerText } = data.siteSettings

  return (
    <footer style={{ background: 'linear-gradient(135deg, #1A0A00 0%, #2D1200 50%, #1A0A00 100%)' }} className="text-white pt-16 pb-8">
      <div className="flag-stripe mb-12" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-3xl font-black font-playfair" style={{ color: '#E87A50' }}>Xam</span>
            <span className="text-3xl font-black font-playfair" style={{ color: '#E8A830' }}>Sa</span>
            <span className="text-3xl font-black font-playfair" style={{ color: '#4AA870' }}>Deukk</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            La plateforme culturelle qui célèbre et préserve le riche patrimoine du Sénégal à travers des jeux interactifs, une encyclopédie vivante et un tuteur Wolof.
          </p>
          <div className="flex gap-3">
            {['🌍', '🎮', '📚', '🦁'].map((e, i) => (
              <span key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-transform hover:scale-110"
                style={{ background: 'rgba(232,168,48,0.15)', border: '1px solid rgba(232,168,48,0.2)' }}>
                {e}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3" style={{ color: '#E8A830' }}>Jeux</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            {[['🎮 Tous les jeux','/jeux'],['🃏 Mémoire Wolof','/jeux/memoire-wolof'],['🗺️ Géographie','/jeux/carte'],['👨‍🍳 Chef Sénégalais','/jeux/cuisine'],['🧠 Quiz IA','/jeux/quiz']].map(([l,t]) => (
              <li key={t}><Link to={t} className="hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3" style={{ color: '#E8A830' }}>Explorer</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            {[['📚 Encyclopédie','/encyclopedie'],['🦁 Apprendre le Wolof','/apprendre-wolof'],['🏛️ Culture Memory','/jeux/memoire-culture'],['⚙️ Admin Panel','/admin']].map(([l,t]) => (
              <li key={t}><Link to={t} className="hover:text-gold transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
        style={{ borderTop: '1px solid rgba(232,168,48,0.1)' }}>
        <p className="text-white/40 text-sm text-center">{footerText}</p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-xs">
          <div className="flex gap-3 text-white/30">
            <span>🇸🇳</span>
            <span>Teranga • Jom • Kersa</span>
          </div>
          <span style={{ color: 'rgba(232,168,48,0.4)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>
            Site réalisé par{' '}
            <a href="https://nisow-agency.com" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(232,168,48,0.55)', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={e => e.target.style.color = '#E8A830'}
              onMouseLeave={e => e.target.style.color = 'rgba(232,168,48,0.55)'}>
              nisow-agency.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
