import { useState, useRef } from 'react'
import { useSite } from '../../context/SiteContext'

const CATEGORIES = [
  { id: 'personnalite', label: 'Personnalité', icon: '👑' },
  { id: 'evenement', label: 'Événement', icon: '📅' },
  { id: 'lieu', label: 'Lieu', icon: '🗺️' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'defi', label: 'Défi', icon: '⚡' },
]

const emptyEntry = () => ({
  id: Date.now(),
  category: 'personnalite',
  title: '',
  subtitle: '',
  image: '👤',
  description: '',
  tags: [],
  period: ''
})

export default function EncyclopedieAdmin() {
  const { data, update } = useSite()
  const [entries, setEntries] = useState([...(data.encyclopedie || [])])
  const [editing, setEditing] = useState(null) // id ou null
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const fileRef = useRef()

  const save = () => {
    update('encyclopedie', entries)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const startCreate = () => {
    const e = emptyEntry()
    setForm(e)
    setEditing(e.id)
    setCreating(true)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startEdit = (entry) => {
    setForm({ ...entry, tagsStr: (entry.tags || []).join(', ') })
    setEditing(entry.id)
    setCreating(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setForm(null)
    setEditing(null)
    setCreating(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleFormSave = () => {
    if (!form.title.trim()) return alert('Le titre est obligatoire')
    const tags = (form.tagsStr || '').split(',').map(t => t.trim()).filter(Boolean)
    const entry = { ...form, tags }
    delete entry.tagsStr
    if (creating) {
      setEntries(prev => [entry, ...prev])
    } else {
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e))
    }
    cancelEdit()
  }

  const del = (id) => {
    if (window.confirm('Supprimer cette entrée de l\'encyclopédie ?')) {
      setEntries(prev => prev.filter(e => e.id !== id))
    }
  }

  const setF = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10, outline: 'none',
    border: '1.5px solid rgba(232,168,48,0.4)', background: 'rgba(245,230,204,0.4)',
    color: '#5C2D0A', fontSize: 14, boxSizing: 'border-box'
  }

  const filtered = entries.filter(e => {
    const matchCat = filterCat === 'all' || e.category === filterCat
    const q = search.toLowerCase()
    const matchSearch = !q || e.title.toLowerCase().includes(q) || (e.subtitle || '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const catColor = { personnalite: '#E8A830', evenement: '#0D7A3E', lieu: '#1A6B8A', culture: '#6B3FA0', defi: '#B22222' }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">📚 Encyclopédie</h1>
          <p className="text-brown/60 text-sm mt-1">Gérez les entrées culturelles affichées sur la page Encyclopédie</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {saved && <span className="text-green-600 font-semibold text-sm">✅ Sauvegardé !</span>}
          <button onClick={startCreate} className="btn-gold px-4 py-2 text-white text-sm font-bold">+ Nouvelle entrée</button>
          <button onClick={save} className="btn-primary px-4 py-2 text-white text-sm font-bold">💾 Sauvegarder</button>
        </div>
      </div>

      {/* FORMULAIRE D'ÉDITION */}
      {form && (
        <div className="glass-card p-6 mb-6" style={{ border: '2px solid #E8A830' }}>
          <h2 className="text-lg font-black text-brown mb-5">
            {creating ? '✨ Nouvelle entrée' : `✏️ Modifier : ${form.title || 'Sans titre'}`}
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-brown/60 block mb-1.5 font-semibold">Catégorie *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setF('category', c.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: form.category === c.id ? (catColor[c.id] || '#C8552A') : 'rgba(245,230,204,0.6)',
                        color: form.category === c.id ? '#fff' : '#5C2D0A99',
                        border: `1.5px solid ${form.category === c.id ? 'transparent' : 'rgba(232,168,48,0.2)'}`
                      }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-brown/60 block mb-1.5 font-semibold">Titre *</label>
                <input style={inputStyle} value={form.title} onChange={e => setF('title', e.target.value)}
                  placeholder="Ex: Cheikh Anta Diop" />
              </div>

              <div>
                <label className="text-xs text-brown/60 block mb-1.5 font-semibold">Sous-titre / Rôle</label>
                <input style={inputStyle} value={form.subtitle || ''} onChange={e => setF('subtitle', e.target.value)}
                  placeholder="Ex: Historien et anthropologue (1923–1986)" />
              </div>

              <div>
                <label className="text-xs text-brown/60 block mb-1.5 font-semibold">Période / Date</label>
                <input style={inputStyle} value={form.period || ''} onChange={e => setF('period', e.target.value)}
                  placeholder="Ex: 1923–1986 · XIXe siècle · 4 avril 1960" />
              </div>

              <div>
                <label className="text-xs text-brown/60 block mb-1.5 font-semibold">Tags (séparés par des virgules)</label>
                <input style={inputStyle} value={form.tagsStr || ''} onChange={e => setF('tagsStr', e.target.value)}
                  placeholder="Ex: Histoire, Panafricanisme, Science" />
              </div>

              {/* Image */}
              <div>
                <label className="text-xs text-brown/60 block mb-1.5 font-semibold">Image / Emoji</label>
                <div className="flex gap-3 items-center">
                  <div style={{
                    width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                    background: 'rgba(232,168,48,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: form.image?.startsWith('data:') ? 0 : 40,
                    border: '1.5px solid rgba(232,168,48,0.3)'
                  }}>
                    {form.image?.startsWith('data:')
                      ? <img src={form.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : form.image}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input style={{ ...inputStyle, fontSize: 13 }} value={form.image?.startsWith('data:') ? '' : (form.image || '')}
                      onChange={e => setF('image', e.target.value)}
                      placeholder="Entrez un emoji (ex: 👑) ou uploadez une photo →" />
                    <button onClick={() => fileRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium w-full"
                      style={{ background: 'rgba(200,85,42,0.1)', color: '#C8552A', border: '1.5px solid rgba(200,85,42,0.2)' }}>
                      📸 Uploader une photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite — Description */}
            <div>
              <label className="text-xs text-brown/60 block mb-1.5 font-semibold">
                Histoire / Description *
                <span className="text-brown/40 ml-2 font-normal">(Séparez les paragraphes par une ligne vide)</span>
              </label>
              <textarea
                style={{ ...inputStyle, height: 340, resize: 'vertical', lineHeight: 1.7 }}
                value={form.description} onChange={e => setF('description', e.target.value)}
                placeholder={`Racontez l'histoire complète ici...\n\nVous pouvez utiliser plusieurs paragraphes en laissant une ligne vide entre eux.\n\nEx: Cheikh Anta Diop est né à Diourbel...\n\nSa thèse révolutionnaire...\n\nSon héritage aujourd'hui...`}
              />
              <p className="text-xs text-brown/40 mt-1">{(form.description || '').length} caractères</p>
            </div>
          </div>

          {/* Actions formulaire */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-sand/50">
            <button onClick={handleFormSave}
              className="btn-primary flex-1 py-3 text-white font-bold text-sm">
              {creating ? '✨ Créer l\'entrée' : '💾 Sauvegarder les modifications'}
            </button>
            <button onClick={cancelEdit}
              className="px-6 py-3 rounded-xl text-sm font-medium text-brown/70 border border-sand hover:border-gold transition-all">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* FILTRES */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 200, padding: '8px 12px', fontSize: 13 }}
        />
        <div className="flex gap-2 flex-wrap">
          {[{ id: 'all', label: 'Toutes', icon: '🌍' }, ...CATEGORIES].map(c => (
            <button key={c.id} onClick={() => setFilterCat(c.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: filterCat === c.id ? (catColor[c.id] || '#C8552A') : 'rgba(245,230,204,0.6)',
                color: filterCat === c.id ? '#fff' : '#5C2D0A99',
                border: `1.5px solid ${filterCat === c.id ? 'transparent' : 'rgba(232,168,48,0.2)'}`
              }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-brown/50">{filtered.length} entrée{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* LISTE */}
      <div className="space-y-3">
        {filtered.map(entry => {
          const cat = CATEGORIES.find(c => c.id === entry.category)
          const color = catColor[entry.category] || '#C8552A'
          const isEmoji = entry.image && !entry.image.startsWith('data:')
          return (
            <div key={entry.id} className="glass-card p-4 flex items-center gap-4">
              {/* Miniature */}
              <div style={{
                width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isEmoji ? 28 : 0, border: `1.5px solid ${color}30`
              }}>
                {isEmoji
                  ? entry.image
                  : <img src={entry.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                }
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-bold text-brown text-sm">{entry.title}</span>
                  <span style={{
                    background: `${color}15`, color, borderRadius: 20,
                    padding: '2px 8px', fontSize: 10, fontWeight: 700
                  }}>
                    {cat?.icon} {cat?.label}
                  </span>
                  {entry.period && <span className="text-xs text-brown/40">{entry.period}</span>}
                </div>
                {entry.subtitle && <p className="text-xs text-brown/50 italic">{entry.subtitle}</p>}
                <p className="text-xs text-brown/60 mt-1 line-clamp-1">{entry.description}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(entry)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: 'rgba(232,168,48,0.15)', color: '#C8552A' }}>
                  ✏️
                </button>
                <button onClick={() => del(entry.id)}
                  className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 border border-red-100">
                  🗑️
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-brown/60">{search ? `Aucun résultat pour "${search}"` : 'Aucune entrée dans cette catégorie'}</p>
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button onClick={save} className="btn-primary px-8 py-3 text-white font-bold">
            💾 Sauvegarder toutes les modifications
          </button>
        </div>
      )}
    </div>
  )
}
