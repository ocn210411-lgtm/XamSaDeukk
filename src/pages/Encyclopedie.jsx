import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSite } from '../context/SiteContext'

const CATEGORIES = [
  { id: 'all', label: 'Tout', icon: '🌍', color: '#C8552A' },
  { id: 'personnalite', label: 'Personnalités', icon: '👑', color: '#E8A830' },
  { id: 'evenement', label: 'Événements', icon: '📅', color: '#0D7A3E' },
  { id: 'lieu', label: 'Lieux', icon: '🗺️', color: '#1A6B8A' },
  { id: 'culture', label: 'Culture', icon: '🎭', color: '#6B3FA0' },
  { id: 'defi', label: 'Défis', icon: '⚡', color: '#B22222' },
]

function EntryCard({ entry, onClick }) {
  const cat = CATEGORIES.find(c => c.id === entry.category) || CATEGORIES[0]
  const isEmoji = entry.image && !entry.image.startsWith('data:')
  return (
    <button onClick={() => onClick(entry)}
      className="glass-card text-left group w-full transition-all"
      style={{ cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(92,45,10,0.18)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '' }}
    >
      {/* Image / Emoji */}
      <div style={{
        width: '100%', height: 140, borderRadius: '12px 12px 0 0',
        overflow: 'hidden', position: 'relative',
        background: isEmoji ? `linear-gradient(135deg, ${cat.color}22, ${cat.color}44)` : undefined
      }}>
        {isEmoji ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
            {entry.image}
          </div>
        ) : (
          <img src={entry.image} alt={entry.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {/* Catégorie badge */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: cat.color, borderRadius: 20,
          padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          {cat.icon} {cat.label}
        </div>
        {entry.period && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.55)', borderRadius: 20,
            padding: '2px 8px', fontSize: 10, color: '#fff', fontWeight: 500
          }}>
            {entry.period}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-black font-playfair text-brown text-base mb-1 leading-tight">{entry.title}</h3>
        {entry.subtitle && <p className="text-brown/60 text-xs mb-2 italic">{entry.subtitle}</p>}
        <p className="text-brown/70 text-sm line-clamp-2 leading-relaxed">{entry.description}</p>
        {entry.tags && (
          <div className="flex flex-wrap gap-1 mt-3">
            {entry.tags.slice(0, 3).map(t => (
              <span key={t} style={{
                background: `${cat.color}15`, color: cat.color,
                borderRadius: 10, padding: '2px 7px', fontSize: 10, fontWeight: 600
              }}>{t}</span>
            ))}
          </div>
        )}
        <div className="mt-3 text-xs font-semibold" style={{ color: cat.color }}>
          Lire l'histoire complète →
        </div>
      </div>
    </button>
  )
}

function EntryModal({ entry, onClose }) {
  if (!entry) return null
  const cat = CATEGORIES.find(c => c.id === entry.category) || CATEGORIES[0]
  const isEmoji = entry.image && !entry.image.startsWith('data:')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, overflowY: 'auto'
    }} onClick={onClose}>
      <div style={{
        background: '#FDF6EC', borderRadius: 20, maxWidth: 680, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header image */}
        <div style={{ width: '100%', height: 220, position: 'relative', borderRadius: '20px 20px 0 0', overflow: 'hidden',
          background: isEmoji ? `linear-gradient(135deg, ${cat.color}33, ${cat.color}66)` : undefined }}>
          {isEmoji ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>
              {entry.image}
            </div>
          ) : (
            <img src={entry.image} alt={entry.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(92,45,10,0.8) 0%, transparent 50%)' }} />
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%',
            width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: cat.color, borderRadius: 20,
              padding: '3px 12px', fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 8
            }}>
              {cat.icon} {cat.label}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'Playfair Display, serif', lineHeight: 1.2 }}>
              {entry.title}
            </h2>
            {entry.subtitle && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>{entry.subtitle}</p>}
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: '24px 28px' }}>
          {entry.period && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(232,168,48,0.15)', borderRadius: 20,
              padding: '4px 14px', fontSize: 12, color: '#5C2D0A', fontWeight: 600, marginBottom: 16
            }}>
              📅 {entry.period}
            </div>
          )}

          {/* Texte de description — paragraphes */}
          <div style={{ color: '#5C2D0A', lineHeight: 1.8, fontSize: 15 }}>
            {entry.description.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: 16 }}>{para}</p>
            ))}
          </div>

          {entry.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20, borderTop: '1px solid rgba(232,168,48,0.2)', paddingTop: 16 }}>
              {entry.tags.map(t => (
                <span key={t} style={{
                  background: `${cat.color}15`, color: cat.color,
                  borderRadius: 12, padding: '4px 12px', fontSize: 12, fontWeight: 600
                }}>#{t}</span>
              ))}
            </div>
          )}

          <button onClick={onClose} style={{
            marginTop: 20, width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #C8552A, #A83820)',
            border: 'none', borderRadius: 12, color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer'
          }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Encyclopedie() {
  const { data } = useSite()
  const entries = data.encyclopedie || []
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedEntry, setSelectedEntry] = useState(null)

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchCat = activeCategory === 'all' || e.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || (e.subtitle || '').toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [entries, activeCategory, search])

  const counts = useMemo(() => {
    const c = {}
    CATEGORIES.forEach(cat => {
      c[cat.id] = cat.id === 'all' ? entries.length : entries.filter(e => e.category === cat.id).length
    })
    return c
  }, [entries])

  return (
    <div className="min-h-screen" style={{ background: '#FDF6EC' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #5C2D0A 0%, #C8552A 50%, #E8A830 100%)',
        paddingTop: 100, paddingBottom: 60, textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div className="flag-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        {/* Motif bogolan en fond */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📚</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>
            Encyclopédie du Sénégal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, lineHeight: 1.6, marginBottom: 24 }}>
            Personnalités illustres, événements historiques, lieux emblématiques,<br />
            patrimoine culturel et défis contemporains — tout le Sénégal en un seul endroit.
          </p>
          {/* Barre de recherche */}
          <div style={{ maxWidth: 460, margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher une personnalité, un lieu, un événement..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 20px',
                borderRadius: 50, border: 'none', outline: 'none',
                fontSize: 14, color: '#5C2D0A',
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(232,168,48,0.2)', position: 'sticky', top: 60, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '14px 18px', whiteSpace: 'nowrap', border: 'none', background: 'transparent',
                  cursor: 'pointer', borderBottom: active ? `3px solid ${cat.color}` : '3px solid transparent',
                  color: active ? cat.color : '#5C2D0A99',
                  fontWeight: active ? 700 : 500, fontSize: 13, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 5
                }}>
                {cat.icon} {cat.label}
                <span style={{
                  background: active ? cat.color : 'rgba(92,45,10,0.1)',
                  color: active ? '#fff' : '#5C2D0A99',
                  borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 700
                }}>{counts[cat.id]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grille d'entrées */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px 60px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(92,45,10,0.5)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16 }}>Aucun résultat pour "{search}"</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }}
              style={{ marginTop: 12, color: '#C8552A', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'rgba(92,45,10,0.5)', fontSize: 13, marginBottom: 20 }}>
              {filtered.length} entrée{filtered.length > 1 ? 's' : ''} {activeCategory !== 'all' ? `dans "${CATEGORIES.find(c => c.id === activeCategory)?.label}"` : ''}
              {search ? ` · Recherche : "${search}"` : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map(entry => (
                <EntryCard key={entry.id} entry={entry} onClick={setSelectedEntry} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedEntry && <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}

      <Footer />
    </div>
  )
}
