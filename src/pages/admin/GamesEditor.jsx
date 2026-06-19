import { useState } from 'react'
import { useSite } from '../../context/SiteContext'

const emptyGame = { id: Date.now(), icon: '🎮', title: '', desc: '', color: '#C8552A', link: '/jeux/nouveau', badge: 'Nouveau', difficulty: '⭐⭐' }

export default function GamesEditor() {
  const { data, update } = useSite()
  const [games, setGames] = useState([...data.games])
  const [editing, setEditing] = useState(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    update('games', games)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setEditing(null)
  }

  const del = (id) => {
    if (window.confirm('Supprimer ce jeu ?')) setGames(games.filter(g => g.id !== id))
  }

  const add = () => {
    const g = { ...emptyGame, id: Date.now() }
    setGames([...games, g])
    setEditing(g.id)
  }

  const updateGame = (id, field, val) => setGames(games.map(g => g.id === id ? { ...g, [field]: val } : g))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">Gestion des Jeux</h1>
          <p className="text-brown/60 text-sm mt-1">Ajoutez, modifiez ou supprimez les cartes de jeux</p>
        </div>
        <div className="flex gap-3">
          {saved && <span className="text-green-600 font-medium text-sm self-center">✅ Sauvegardé !</span>}
          <button onClick={add} className="btn-gold px-4 py-2 text-sm text-white">+ Ajouter un jeu</button>
          <button onClick={save} className="btn-primary px-4 py-2 text-sm text-white">💾 Sauvegarder tout</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {games.map(g => (
          <div key={g.id} className={`glass-card p-5 transition-all ${editing === g.id ? 'ring-2 ring-gold' : ''}`}
            style={{ '--gold-color': '#E8A830', outline: editing === g.id ? '2px solid #E8A830' : 'none' }}>
            {editing === g.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-brown/60 block mb-1">Emoji</label>
                    <input value={g.icon} onChange={e => updateGame(g.id, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm text-center outline-none"
                      style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-brown/60 block mb-1">Titre</label>
                    <input value={g.title} onChange={e => updateGame(g.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                  </div>
                  <div>
                    <label className="text-xs text-brown/60 block mb-1">Badge</label>
                    <input value={g.badge} onChange={e => updateGame(g.id, 'badge', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-brown/60 block mb-1">Description</label>
                  <input value={g.desc} onChange={e => updateGame(g.id, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-brown/60 block mb-1">Couleur</label>
                    <input type="color" value={g.color} onChange={e => updateGame(g.id, 'color', e.target.value)}
                      className="w-full h-9 rounded-lg cursor-pointer border-0" />
                  </div>
                  <div>
                    <label className="text-xs text-brown/60 block mb-1">Difficulté</label>
                    <select value={g.difficulty} onChange={e => updateGame(g.id, 'difficulty', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }}>
                      <option value="⭐">⭐ Facile</option>
                      <option value="⭐⭐">⭐⭐ Moyen</option>
                      <option value="⭐⭐⭐">⭐⭐⭐ Difficile</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-brown/60 block mb-1">Lien</label>
                    <input value={g.link} onChange={e => updateGame(g.id, 'link', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditing(null)} className="btn-green flex-1 py-2 text-white text-sm">✅ Terminer</button>
                  <button onClick={() => del(g.id)} className="px-4 py-2 rounded-full text-sm text-red-500 border border-red-200 hover:bg-red-50">🗑️</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${g.color}15` }}>
                  {g.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-brown text-sm">{g.title || <span className="text-brown/30">Sans titre</span>}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${g.color}15`, color: g.color }}>{g.badge}</span>
                  </div>
                  <p className="text-brown/60 text-xs line-clamp-2">{g.desc || <span className="text-brown/30">Sans description</span>}</p>
                  <div className="text-xs text-brown/40 mt-1">{g.difficulty} · {g.link}</div>
                </div>
                <button onClick={() => setEditing(g.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: 'rgba(232,168,48,0.15)', color: '#C8552A' }}>
                  ✏️ Modifier
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
