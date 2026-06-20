import { useState, useRef, useEffect } from 'react'
import { useSite } from '../../context/SiteContext'
import { compressImage, savePuzzles, fetchPuzzles, cloudEnabled } from '../../utils/cloudStorage'

const GRID_OPTIONS = [3, 4, 5]

export default function PuzzleAdmin() {
  const { data, update } = useSite()
  const [puzzles, setPuzzles] = useState([...(data.puzzles || [])])
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [cloudStatus, setCloudStatus] = useState(null)
  const fileRef = useRef()

  // Charger depuis le cloud au démarrage
  useEffect(() => {
    if (!cloudEnabled) return
    fetchPuzzles().then(cloudPuzzles => {
      if (cloudPuzzles && cloudPuzzles.length > 0) {
        setPuzzles(cloudPuzzles)
        update('puzzles', cloudPuzzles)
        setCloudStatus('sync')
      }
    })
  }, [])

  const save = async () => {
    setSaving(true)
    // Toujours sauvegarder en localStorage
    update('puzzles', puzzles)

    // Si cloud activé, sauvegarder aussi dans JSONBin
    if (cloudEnabled) {
      const ok = await savePuzzles(puzzles)
      setCloudStatus(ok ? 'saved' : 'error')
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const newPuzzles = []

    for (const file of files) {
      const base64Raw = await new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = ev => resolve(ev.target.result)
        reader.readAsDataURL(file)
      })
      // Compresser l'image avant stockage
      const base64 = await compressImage(base64Raw, 900, 0.75)
      newPuzzles.push({
        id: Date.now() + Math.random(),
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        description: '',
        image: base64,
        gridOptions: [3, 4]
      })
    }

    setPuzzles(prev => [...prev, ...newPuzzles])
    setUploading(false)
    e.target.value = ''
  }

  const del = (id) => {
    if (window.confirm('Supprimer ce puzzle ?')) {
      setPuzzles(prev => prev.filter(p => p.id !== id))
    }
  }

  const updatePuzzle = (id, field, val) => {
    setPuzzles(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p))
  }

  const toggleGrid = (id, n) => {
    setPuzzles(prev => prev.map(p => {
      if (p.id !== id) return p
      const opts = p.gridOptions || [3]
      const has = opts.includes(n)
      const next = has ? opts.filter(x => x !== n) : [...opts, n].sort()
      return { ...p, gridOptions: next.length ? next : [n] }
    }))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">🧩 Puzzles Photos</h1>
          <p className="text-brown/60 text-sm mt-1">
            Ajoutez des photos — chaque photo devient un puzzle jouable pour tous les visiteurs.
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {saved && <span className="text-green-600 font-semibold text-sm">✅ Sauvegardé !</span>}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="btn-gold px-5 py-2.5 text-white text-sm font-bold">
            {uploading ? '⏳ Compression...' : '📸 Ajouter des photos'}
          </button>
          <button onClick={save} disabled={saving}
            className="btn-primary px-5 py-2.5 text-white text-sm font-bold">
            {saving ? '⏳ Envoi cloud...' : `💾 Publier (${puzzles.length})`}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Bandeau état cloud */}
      {cloudEnabled ? (
        <div className="glass-card p-3 mb-5 flex items-center gap-3"
          style={{ background: cloudStatus === 'error' ? 'rgba(220,50,50,0.07)' : 'rgba(13,122,62,0.07)', border: `1.5px solid ${cloudStatus === 'error' ? 'rgba(220,50,50,0.2)' : 'rgba(13,122,62,0.2)'}` }}>
          <span className="text-xl">{cloudStatus === 'error' ? '❌' : cloudStatus === 'saved' ? '☁️' : cloudStatus === 'sync' ? '🔄' : '☁️'}</span>
          <span className="text-sm font-medium" style={{ color: cloudStatus === 'error' ? '#c00' : '#0D7A3E' }}>
            {cloudStatus === 'error' ? 'Erreur cloud — puzzles sauvegardés localement uniquement'
              : cloudStatus === 'saved' ? 'Puzzles publiés sur le cloud — visibles par tous les visiteurs ✅'
              : cloudStatus === 'sync' ? 'Puzzles synchronisés depuis le cloud'
              : 'Cloud connecté — cliquez "Publier" pour rendre les puzzles visibles par tous'}
          </span>
        </div>
      ) : (
        <div className="glass-card p-4 mb-5" style={{ background: 'rgba(232,120,30,0.07)', border: '1.5px solid rgba(232,120,30,0.25)' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="text-sm text-brown/80 leading-relaxed">
              <strong>Mode local uniquement</strong> — Les puzzles ne sont visibles que sur cet appareil.<br />
              Pour les rendre visibles par tous, ajoutez <code className="bg-sand px-1 rounded">VITE_JSONBIN_KEY</code> et <code className="bg-sand px-1 rounded">VITE_JSONBIN_ID</code> dans les variables d'environnement Render.
            </div>
          </div>
        </div>
      )}

      {/* Liste des puzzles */}
      {puzzles.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-bold text-brown mb-2">Aucune photo ajoutée</h3>
          <p className="text-brown/60 mb-6">Cliquez sur "Ajouter des photos" pour créer vos premiers puzzles</p>
          <button onClick={() => fileRef.current?.click()} className="btn-primary px-6 py-3 text-white font-bold">
            📸 Choisir des photos
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {puzzles.map(p => (
            <div key={p.id} className="glass-card overflow-hidden"
              style={{ outline: editing === p.id ? '2px solid #E8A830' : 'none' }}>
              <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent calc(${100 / (p.gridOptions?.[0] || 3)}% - 1px), rgba(255,255,255,0.5) calc(${100 / (p.gridOptions?.[0] || 3)}% - 1px), rgba(255,255,255,0.5) calc(${100 / (p.gridOptions?.[0] || 3)}%)),repeating-linear-gradient(90deg, transparent, transparent calc(${100 / (p.gridOptions?.[0] || 3)}% - 1px), rgba(255,255,255,0.5) calc(${100 / (p.gridOptions?.[0] || 3)}% - 1px), rgba(255,255,255,0.5) calc(${100 / (p.gridOptions?.[0] || 3)}%))`
                }} />
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: '3px 8px', fontSize: 10, color: '#fff', fontWeight: 600 }}>
                  {(p.gridOptions?.[0] || 3)}×{(p.gridOptions?.[0] || 3)}
                </div>
              </div>

              <div className="p-4">
                {editing === p.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-brown/60 block mb-1 font-medium">Titre du puzzle</label>
                      <input value={p.title} onChange={e => updatePuzzle(p.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ border: '1.5px solid rgba(232,168,48,0.4)', background: 'rgba(245,230,204,0.4)', color: '#5C2D0A' }} />
                    </div>
                    <div>
                      <label className="text-xs text-brown/60 block mb-1 font-medium">Description (facultatif)</label>
                      <input value={p.description || ''} onChange={e => updatePuzzle(p.id, 'description', e.target.value)}
                        placeholder="Ex: Monument Renaissance de Dakar..."
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ border: '1.5px solid rgba(232,168,48,0.4)', background: 'rgba(245,230,204,0.4)', color: '#5C2D0A' }} />
                    </div>
                    <div>
                      <label className="text-xs text-brown/60 block mb-1 font-medium">Niveaux de difficulté</label>
                      <div className="flex gap-2">
                        {GRID_OPTIONS.map(n => {
                          const active = (p.gridOptions || []).includes(n)
                          return (
                            <button key={n} onClick={() => toggleGrid(p.id, n)}
                              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                              style={{ background: active ? (n === 3 ? '#0D7A3E' : n === 4 ? '#E8A830' : '#C8552A') : 'rgba(245,230,204,0.5)', color: active ? '#fff' : '#5C2D0A99', border: `1.5px solid ${active ? 'transparent' : 'rgba(232,168,48,0.2)'}` }}>
                              {n}×{n}<br /><span style={{ fontWeight: 400, fontSize: 9 }}>{n === 3 ? 'Facile' : n === 4 ? 'Moyen' : 'Difficile'}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setEditing(null)} className="flex-1 py-2 text-sm font-semibold text-white rounded-xl" style={{ background: '#0D7A3E' }}>✅ Terminer</button>
                      <button onClick={() => del(p.id)} className="px-4 py-2 rounded-xl text-sm text-red-500 border border-red-200 hover:bg-red-50">🗑️</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-brown text-sm mb-1">{p.title || 'Sans titre'}</h3>
                    {p.description && <p className="text-brown/60 text-xs mb-2 line-clamp-1">{p.description}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1">
                        {(p.gridOptions || [3]).map(n => (
                          <span key={n} style={{ background: n === 3 ? 'rgba(13,122,62,0.15)' : n === 4 ? 'rgba(232,168,48,0.15)' : 'rgba(200,85,42,0.15)', color: n === 3 ? '#0D7A3E' : '#C8552A', borderRadius: 10, padding: '2px 7px', fontSize: 10, fontWeight: 700 }}>{n}×{n}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(p.id)} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(232,168,48,0.15)', color: '#C8552A' }}>✏️ Modifier</button>
                        <button onClick={() => del(p.id)} className="text-xs px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50">🗑️</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          <button onClick={() => fileRef.current?.click()}
            className="glass-card flex flex-col items-center justify-center min-h-48 transition-all border-2 border-dashed"
            style={{ borderColor: 'rgba(232,168,48,0.4)', background: 'rgba(245,230,204,0.3)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <div className="text-4xl mb-3">📸</div>
            <p className="font-bold text-brown text-sm">Ajouter une photo</p>
            <p className="text-brown/50 text-xs mt-1">JPG, PNG, WebP</p>
          </button>
        </div>
      )}

      {puzzles.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button onClick={save} disabled={saving} className="btn-primary px-8 py-3 text-white font-bold">
            {saving ? '⏳ Publication en cours...' : '☁️ Publier tous les puzzles'}
          </button>
        </div>
      )}
    </div>
  )
}
