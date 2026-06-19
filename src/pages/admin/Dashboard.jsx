import { useSite } from '../../context/SiteContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data, activityLog, reset } = useSite()

  const cards = [
    { label: 'Puzzles photos', value: (data.puzzles || []).length, icon: '🧩', color: '#C8552A', to: '/admin/puzzles' },
    { label: 'Encyclopédie', value: (data.encyclopedie || []).length, icon: '📚', color: '#6B3FA0', to: '/admin/encyclopedie' },
    { label: 'Jeux configurés', value: data.games.length, icon: '🎮', color: '#0D7A3E', to: '/admin/jeux' },
    { label: 'Actions récentes', value: activityLog.length, icon: '📋', color: '#E8A830', to: null },
  ]

  const shortcuts = [
    { label: 'Modifier le Hero', icon: '🎨', to: '/admin/hero' },
    { label: 'Puzzles Photos', icon: '🧩', to: '/admin/puzzles' },
    { label: 'Encyclopédie', icon: '📚', to: '/admin/encyclopedie' },
    { label: 'Paramètres', icon: '⚙️', to: '/admin/parametres' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">Tableau de bord</h1>
          <p className="text-brown/60 text-sm mt-1">Bienvenue dans le panneau administrateur XamSaDeukk</p>
        </div>
        <button onClick={() => { if (window.confirm('Réinitialiser toutes les données ?')) reset() }}
          className="text-sm px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          🔄 Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-3xl font-black font-playfair" style={{ color: c.color }}>{c.value}</span>
            </div>
            <div className="text-brown/70 text-sm font-medium">{c.label}</div>
            {c.to && <Link to={c.to} className="text-xs mt-2 block hover:underline" style={{ color: c.color }}>Gérer →</Link>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-bold font-playfair text-brown mb-4">Accès rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {shortcuts.map(s => (
              <Link key={s.to} to={s.to} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5 no-underline"
                style={{ background: 'rgba(245,230,204,0.6)', border: '1px solid rgba(232,168,48,0.15)', color: '#5C2D0A' }}>
                <span className="text-xl">{s.icon}</span>
                <span className="text-sm font-medium">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-bold font-playfair text-brown mb-4">Journal d'activité</h2>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {activityLog.length === 0 ? (
              <p className="text-brown/40 text-sm text-center py-4">Aucune activité pour l'instant</p>
            ) : activityLog.map(log => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-sand/50">
                <span className="text-sm text-brown/80">{log.msg}</span>
                <span className="text-xs text-brown/40">{new Date(log.time).toLocaleTimeString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mt-6">
        <h2 className="font-bold font-playfair text-brown mb-4">Aperçu du contenu actuel</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="font-semibold text-brown/80 text-sm mb-2">🎯 Hero</div>
            <div className="text-sm text-brown/60 space-y-1">
              <div>Titre: <strong>{data.hero.title} {data.hero.titleHighlight}</strong></div>
              <div>Stats: {data.hero.stats.map(s => s.value).join(' · ')}</div>
              <div>Annonce: {data.announcement.visible ? '✅ Visible' : '❌ Masquée'}</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-brown/80 text-sm mb-2">🌐 Site</div>
            <div className="text-sm text-brown/60 space-y-1">
              <div>Nom: <strong>{data.siteSettings.siteName}</strong></div>
              <div>Bannière Wolof: {data.wolofBanner.visible ? '✅ Visible' : '❌ Masquée'}</div>
              <div>Joueurs: {data.siteStats[0]?.value}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
