import { useState } from 'react'
import { useSite } from '../../context/SiteContext'

export default function TestimonialsEditor() {
  const { data, update } = useSite()
  const [items, setItems] = useState([...data.testimonials])
  const [editing, setEditing] = useState(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    update('testimonials', items)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setEditing(null)
  }

  const add = () => {
    const n = { id: Date.now(), name: '', role: '', text: '', avatar: '👤', stars: 5 }
    setItems([...items, n])
    setEditing(n.id)
  }

  const upd = (id, field, val) => setItems(items.map(t => t.id === id ? { ...t, [field]: val } : t))
  const del = (id) => { if (window.confirm('Supprimer ?')) setItems(items.filter(t => t.id !== id)) }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">Témoignages</h1>
          <p className="text-brown/60 text-sm mt-1">Gérez les avis des utilisateurs affichés sur la page d'accueil</p>
        </div>
        <div className="flex gap-3">
          {saved && <span className="text-green-600 font-medium text-sm self-center">✅ Sauvegardé !</span>}
          <button onClick={add} className="btn-gold px-4 py-2 text-sm text-white">+ Ajouter</button>
          <button onClick={save} className="btn-primary px-4 py-2 text-sm text-white">💾 Sauvegarder</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(t => (
          <div key={t.id} className={`glass-card p-5 ${editing === t.id ? 'ring-2' : ''}`}
            style={{ outline: editing === t.id ? '2px solid #E8A830' : 'none' }}>
            {editing === t.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  <input value={t.avatar} onChange={e => upd(t.id, 'avatar', e.target.value)} placeholder="👤"
                    className="col-span-1 px-2 py-2 rounded-lg text-xl text-center outline-none"
                    style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)' }} />
                  <input value={t.name} onChange={e => upd(t.id, 'name', e.target.value)} placeholder="Nom"
                    className="col-span-4 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                </div>
                <input value={t.role} onChange={e => upd(t.id, 'role', e.target.value)} placeholder="Rôle / Ville"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                <textarea value={t.text} onChange={e => upd(t.id, 'text', e.target.value)} placeholder="Témoignage..." rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                <div>
                  <label className="text-xs text-brown/60 block mb-1">Note ({t.stars}/5)</label>
                  <input type="range" min={1} max={5} value={t.stars} onChange={e => upd(t.id, 'stars', +e.target.value)} className="w-full" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)} className="btn-green flex-1 py-2 text-white text-sm">✅ OK</button>
                  <button onClick={() => del(t.id)} className="px-4 py-2 rounded-full text-sm text-red-500 border border-red-200 hover:bg-red-50">🗑️</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex gap-1 mb-2">{[...Array(t.stars)].map((_, i) => <span key={i} style={{ color: '#E8A830' }}>★</span>)}</div>
                <p className="text-brown/70 text-sm italic mb-3 line-clamp-3">"{t.text || <span className="text-brown/30">Aucun texte</span>}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.avatar}</span>
                    <div>
                      <div className="font-semibold text-brown text-xs">{t.name || 'Sans nom'}</div>
                      <div className="text-brown/50 text-xs">{t.role}</div>
                    </div>
                  </div>
                  <button onClick={() => setEditing(t.id)} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(232,168,48,0.15)', color: '#C8552A' }}>✏️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
