import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSite } from '../context/SiteContext'

const CATEGORIES = [
  { id: 'all', label: 'Tous les jeux', icon: '🎮' },
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'langue', label: 'Langue', icon: '🦁' },
  { id: 'geographie', label: 'Géographie', icon: '🗺️' },
  { id: 'cuisine', label: 'Cuisine', icon: '🍚' },
  { id: 'ia', label: 'IA', icon: '🧠' },
]

// Mapping des jeux vers leurs catégories et infos enrichies
const GAMES_META = {
  '/jeux/puzzle': { category: 'culture', players: '1 joueur', time: '5–15 min', color: '#C8552A' },
  '/jeux/memoire-wolof': { category: 'langue', players: '1 joueur', time: '3–10 min', color: '#0D7A3E' },
  '/jeux/carte': { category: 'geographie', players: '1 joueur', time: '5–10 min', color: '#E8A830' },
  '/jeux/cuisine': { category: 'cuisine', players: '1 joueur', time: '2–8 min', color: '#B22222' },
  '/jeux/memoire-culture': { category: 'culture', players: '1 joueur', time: '3–8 min', color: '#5C2D0A' },
  '/encyclopedie': { category: 'culture', players: 'Lecture', time: 'À votre rythme', color: '#6B3FA0' },
  '/jeux/quiz': { category: 'ia', players: '1 joueur', time: '5–20 min', color: '#1A6B8A' },
}

export default function Jeux() {
  const { data } = useSite()
  const games = data.games || []
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = games.filter(g => {
    const meta = GAMES_META[g.link] || {}
    const matchCat = activeCategory === 'all' || meta.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch = !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen" style={{ background: '#FDF6EC' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #5C2D0A 0%, #C8552A 60%, #E8A830 100%)',
        paddingTop: 96, paddingBottom: 56, textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div className="flag-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🎮</div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', fontFamily: 'Playfair Display, serif', marginBottom: 10 }}>
            Espace Jeux Culturels
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
            Apprenez la culture, la langue et l'histoire du Sénégal<br />en jouant à des jeux interactifs enrichissants.
          </p>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher un jeu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '13px 20px', borderRadius: 50,
                border: 'none', outline: 'none', fontSize: 14, color: '#5C2D0A',
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(232,168,48,0.15)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px', display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '🧩', val: games.length, label: 'Jeux disponibles' },
            { icon: '🎯', val: '100%', label: 'Gratuit' },
            { icon: '📱', val: '✅', label: 'Sur mobile' },
            { icon: '🌍', val: '🇸🇳', label: 'Culture sénégalaise' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 28px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(232,168,48,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#C8552A', fontFamily: 'Playfair Display, serif' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(92,45,10,0.5)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres catégories */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(232,168,48,0.15)', position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '14px 16px', whiteSpace: 'nowrap', border: 'none', background: 'transparent',
                cursor: 'pointer',
                borderBottom: activeCategory === cat.id ? '3px solid #C8552A' : '3px solid transparent',
                color: activeCategory === cat.id ? '#C8552A' : 'rgba(92,45,10,0.6)',
                fontWeight: activeCategory === cat.id ? 700 : 500, fontSize: 13, transition: 'all 0.2s',
              }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de jeux */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px 60px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(92,45,10,0.5)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>Aucun jeu trouvé{search ? ` pour "${search}"` : ''}</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }}
              style={{ marginTop: 10, color: '#C8552A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>
              Voir tous les jeux
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 22 }}>
            {filtered.map((g) => {
              const meta = GAMES_META[g.link] || { color: g.color || '#C8552A', players: '1 joueur', time: '5–10 min' }
              const color = meta.color || g.color || '#C8552A'
              return (
                <Link key={g.id} to={g.link}
                  className="glass-card no-underline block"
                  style={{ textDecoration: 'none', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${color}25` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
                >
                  {/* Bande couleur en haut */}
                  <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)`, marginBottom: 0 }} />

                  <div style={{ padding: '20px 20px 16px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: `${color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 30
                      }}>
                        {g.icon}
                      </div>
                      <span style={{
                        background: `${color}15`, color, borderRadius: 20,
                        padding: '4px 10px', fontSize: 11, fontWeight: 700
                      }}>
                        {g.badge}
                      </span>
                    </div>

                    {/* Titre + desc */}
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#5C2D0A', fontFamily: 'Playfair Display, serif', marginBottom: 6, lineHeight: 1.3 }}>
                      {g.title}
                    </h3>
                    <p style={{ color: 'rgba(92,45,10,0.65)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                      {g.desc}
                    </p>

                    {/* Méta-infos */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(92,45,10,0.5)' }}>
                        <span>👤</span> {meta.players}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(92,45,10,0.5)' }}>
                        <span>⏱</span> {meta.time}
                      </div>
                      {g.difficulty && g.difficulty !== '📖' && (
                        <div style={{ fontSize: 11, color: 'rgba(92,45,10,0.5)' }}>
                          {g.difficulty}
                        </div>
                      )}
                    </div>

                    {/* Bouton jouer */}
                    <div style={{
                      width: '100%', padding: '11px',
                      background: `linear-gradient(135deg, ${color}, ${color}BB)`,
                      borderRadius: 12, textAlign: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 14,
                      boxShadow: `0 4px 16px ${color}40`
                    }}>
                      {g.link === '/encyclopedie' ? '📖 Lire l\'encyclopédie' : '🎮 Jouer maintenant'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA bannière Wolof */}
      <div style={{
        background: 'linear-gradient(135deg, #0D7A3E, #064020)',
        padding: '48px 16px', textAlign: 'center'
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🦁</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'Playfair Display, serif', marginBottom: 10 }}>
          Apprenez aussi le Wolof !
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          Notre tuteur IA vous apprend la langue nationale sénégalaise en mode conversationnel.
        </p>
        <Link to="/apprendre-wolof"
          style={{
            display: 'inline-block', padding: '14px 32px',
            background: 'linear-gradient(135deg, #E8A830, #C88818)',
            borderRadius: 50, color: '#5C2D0A', fontWeight: 700, fontSize: 15,
            textDecoration: 'none', boxShadow: '0 4px 20px rgba(232,168,48,0.4)'
          }}>
          Démarrer les leçons →
        </Link>
      </div>

      <Footer />
    </div>
  )
}
