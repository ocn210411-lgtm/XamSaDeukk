import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useSite } from '../../context/SiteContext'
import { fetchPuzzles, cloudEnabled } from '../../utils/cloudStorage'

// Génère les pièces pour un puzzle NxN
function buildPieces(gridN) {
  const pieces = []
  for (let r = 0; r < gridN; r++) {
    for (let c = 0; c < gridN; c++) {
      pieces.push({ id: r * gridN + c, correctRow: r, correctCol: c })
    }
  }
  // Mélange de Fisher-Yates
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]]
  }
  return pieces
}

// Affiche un fragment de l'image (une pièce du puzzle)
function PuzzlePiece({ imageUrl, row, col, gridN, size, selected, onClick, showNumber }) {
  const bgSize = `${gridN * 100}% ${gridN * 100}%`
  const bgPosX = gridN === 1 ? '0%' : `${(col / (gridN - 1)) * 100}%`
  const bgPosY = gridN === 1 ? '0%' : `${(row / (gridN - 1)) * 100}%`

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: bgSize,
        backgroundPosition: `${bgPosX} ${bgPosY}`,
        backgroundRepeat: 'no-repeat',
        border: selected ? '3px solid #E8A830' : '2px solid rgba(255,255,255,0.4)',
        borderRadius: 6,
        cursor: 'pointer',
        boxShadow: selected ? '0 0 20px rgba(232,168,48,0.7)' : '0 2px 8px rgba(0,0,0,0.25)',
        transition: 'all 0.15s',
        transform: selected ? 'scale(1.06)' : 'scale(1)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {showNumber && (
        <span style={{
          position: 'absolute', bottom: 2, right: 4,
          fontSize: 9, color: 'rgba(255,255,255,0.7)',
          fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.9)'
        }}>
          {row * gridN + col + 1}
        </span>
      )}
    </div>
  )
}

// Écran de sélection du puzzle
function SelectScreen({ puzzles }) {
  if (puzzles.length === 0) return (
    <div className="min-h-screen bogolan">
      <Navbar />
      <div className="pt-28 pb-16 flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-lg w-full">
          <div className="text-7xl mb-4">🧩</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-3">Puzzle Culturel</h1>
          <p className="text-brown/60 mb-6 leading-relaxed">
            Aucun puzzle disponible pour l'instant.<br />
            L'administrateur doit d'abord ajouter des photos dans le panel admin.
          </p>
          <div className="bg-sand/60 rounded-2xl p-4 text-sm text-brown/70 mb-6">
            👉 Panel admin → <strong>Puzzles Photos</strong> → Ajouter une photo
          </div>
          <Link to="/" className="text-sm text-brown/50 hover:text-brown">← Retour à l'accueil</Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  return null // handled in parent
}

export default function JeuPuzzle() {
  const { data, update } = useSite()
  const [puzzles, setPuzzles] = useState(data.puzzles || [])
  const [loadingCloud, setLoadingCloud] = useState(cloudEnabled)

  // Charger les puzzles depuis le cloud au démarrage
  useEffect(() => {
    if (!cloudEnabled) return
    fetchPuzzles().then(cloudPuzzles => {
      if (cloudPuzzles && cloudPuzzles.length > 0) {
        setPuzzles(cloudPuzzles)
        update('puzzles', cloudPuzzles)
      }
      setLoadingCloud(false)
    })
  }, [])

  const [step, setStep] = useState('select') // select | difficulty | play | won
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  const [gridN, setGridN] = useState(3)
  const [trayPieces, setTrayPieces] = useState([])
  const [gridSlots, setGridSlots] = useState([]) // array of piece or null
  const [selected, setSelected] = useState(null) // { from: 'tray'|'grid', piece, index }
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [timer, setTimer] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [hintsLeft, setHintsLeft] = useState(3)

  const PIECE_SIZE_TRAY = 64
  const GRID_PIECE_SIZE = Math.min(Math.floor(320 / gridN), 100)

  const startTimer = () => {
    const t = setInterval(() => setTime(s => s + 1), 1000)
    setTimer(t)
    return t
  }
  const stopTimer = () => { if (timer) clearInterval(timer) }

  const selectPuzzle = (p) => {
    setCurrentPuzzle(p)
    setStep('difficulty')
  }

  const startGame = (n) => {
    setGridN(n)
    const pieces = buildPieces(n)
    setTrayPieces(pieces)
    setGridSlots(Array(n * n).fill(null))
    setMoves(0)
    setTime(0)
    setSelected(null)
    setHintsLeft(3)
    if (timer) clearInterval(timer)
    startTimer()
    setStep('play')
  }

  const checkWin = (slots) => {
    return slots.every((p, i) => {
      if (!p) return false
      const r = Math.floor(i / gridN)
      const c = i % gridN
      return p.correctRow === r && p.correctCol === c
    })
  }

  const handleTrayClick = (piece, idx) => {
    if (selected?.from === 'tray' && selected.index === idx) {
      setSelected(null)
      return
    }
    if (selected?.from === 'grid') {
      // Place selected grid piece back to tray, pick this tray piece
      const newTray = [...trayPieces]
      newTray.splice(idx, 1, selected.piece)
      const newSlots = [...gridSlots]
      newSlots[selected.index] = null
      setTrayPieces(newTray)
      setGridSlots(newSlots)
      setSelected({ from: 'tray', piece, index: newTray.indexOf(piece) })
      setMoves(m => m + 1)
      return
    }
    setSelected({ from: 'tray', piece, index: idx })
  }

  const handleGridClick = (slotIdx) => {
    if (!selected) {
      if (gridSlots[slotIdx]) {
        setSelected({ from: 'grid', piece: gridSlots[slotIdx], index: slotIdx })
        const newSlots = [...gridSlots]
        newSlots[slotIdx] = null
        setGridSlots(newSlots)
      }
      return
    }

    const newSlots = [...gridSlots]
    const newTray = [...trayPieces]

    if (selected.from === 'tray') {
      // Si la case est occupée, renvoyer l'occupant au plateau
      if (newSlots[slotIdx]) {
        newTray.push(newSlots[slotIdx])
      }
      newSlots[slotIdx] = selected.piece
      // Retirer du tray
      const ti = newTray.findIndex(p => p.id === selected.piece.id)
      if (ti !== -1) newTray.splice(ti, 1)
    } else {
      // Grid → grid : swap
      const oldOccupant = newSlots[slotIdx]
      newSlots[slotIdx] = selected.piece
      if (oldOccupant) {
        newSlots[selected.index] = oldOccupant
      } else {
        newSlots[selected.index] = null
      }
    }

    setGridSlots(newSlots)
    setTrayPieces(newTray)
    setSelected(null)
    setMoves(m => m + 1)

    if (checkWin(newSlots)) {
      stopTimer()
      setTimeout(() => setStep('won'), 300)
    }
  }

  const useHint = () => {
    if (hintsLeft <= 0) return
    // Placer automatiquement la première pièce mal placée ou manquante
    const newSlots = [...gridSlots]
    const newTray = [...trayPieces]
    let placed = false
    for (let i = 0; i < gridN * gridN && !placed; i++) {
      const r = Math.floor(i / gridN)
      const c = i % gridN
      if (!newSlots[i] || newSlots[i].correctRow !== r || newSlots[i].correctCol !== c) {
        // Trouver la pièce correcte
        const correctPiece = [...newTray, ...newSlots.filter(Boolean)].find(p => p.correctRow === r && p.correctCol === c)
        if (correctPiece) {
          // Retirer de la grille si elle y est
          const fromSlot = newSlots.findIndex(p => p?.id === correctPiece.id)
          if (fromSlot !== -1) {
            if (newSlots[i]) newTray.push(newSlots[i])
            newSlots[fromSlot] = newSlots[i] ? newSlots[i] : null
            // On doit être plus précis : swap
            const tmpOccupant = newSlots[i]
            newSlots[i] = correctPiece
            newSlots[fromSlot] = tmpOccupant || null
          } else {
            // Dans le tray
            if (newSlots[i]) newTray.push(newSlots[i])
            newSlots[i] = correctPiece
            const ti = newTray.findIndex(p => p.id === correctPiece.id)
            if (ti !== -1) newTray.splice(ti, 1)
          }
          placed = true
        }
      }
    }
    setGridSlots(newSlots)
    setTrayPieces(newTray)
    setHintsLeft(h => h - 1)
    setMoves(m => m + 1)
    if (checkWin(newSlots)) { stopTimer(); setTimeout(() => setStep('won'), 300) }
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ═══════════════════════════════════════════════════════════
  // ÉCRAN SÉLECTION
  // ═══════════════════════════════════════════════════════════
  if (step === 'select') {
    if (loadingCloud) return (
      <div className="min-h-screen bogolan flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-28">
          <div className="text-6xl mb-4 animate-bounce">🧩</div>
          <p className="text-brown font-semibold text-lg">Chargement des puzzles...</p>
          <p className="text-brown/50 text-sm mt-2">Connexion au cloud ☁️</p>
        </div>
      </div>
    )
    if (puzzles.length === 0) return <SelectScreen puzzles={[]} />
    return (
      <div className="min-h-screen bogolan">
        <Navbar />
        <div className="pt-28 pb-16 max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-5xl mb-3">🧩</div>
            <h1 className="text-4xl font-black font-playfair text-brown mb-2">Puzzle Culturel</h1>
            <p className="text-brown/60">Choisissez une photo du patrimoine sénégalais à reconstituer</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {puzzles.map(p => (
              <button key={p.id} onClick={() => selectPuzzle(p)}
                className="glass-card overflow-hidden text-left group hover:scale-102 transition-all hover:shadow-xl"
                style={{ transform: 'scale(1)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className="w-full h-44 overflow-hidden" style={{ position: 'relative' }}>
                  <img src={p.image} alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(92,45,10,0.7) 0%, transparent 60%)'
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 10, left: 12, right: 12
                  }}>
                    <h3 className="font-bold text-white text-sm">{p.title}</h3>
                    {p.description && <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{p.description}</p>}
                  </div>
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(232,168,48,0.9)', borderRadius: 20,
                    padding: '2px 8px', fontSize: 11, fontWeight: 700, color: '#5C2D0A'
                  }}>
                    🧩 Puzzle
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs text-brown/60">Cliquez pour jouer</span>
                  <div className="flex gap-1">
                    {(p.gridOptions || [3, 4]).map(n => (
                      <span key={n} style={{
                        background: 'rgba(200,85,42,0.1)', color: '#C8552A',
                        borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 600
                      }}>{n}×{n}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/" className="text-sm text-brown/50 hover:text-brown">← Retour à l'accueil</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // ÉCRAN DIFFICULTÉ
  // ═══════════════════════════════════════════════════════════
  if (step === 'difficulty') {
    const opts = currentPuzzle.gridOptions || [3, 4, 5]
    const labels = { 3: { emoji: '🌱', name: 'Facile', desc: '9 pièces (3×3)' }, 4: { emoji: '🔥', name: 'Moyen', desc: '16 pièces (4×4)' }, 5: { emoji: '💎', name: 'Difficile', desc: '25 pièces (5×5)' } }
    return (
      <div className="min-h-screen bogolan">
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center px-4">
          <div className="glass-card p-10 text-center max-w-md w-full">
            <img src={currentPuzzle.image} alt={currentPuzzle.title}
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }} />
            <h2 className="text-2xl font-black font-playfair text-brown mb-1">{currentPuzzle.title}</h2>
            {currentPuzzle.description && <p className="text-brown/60 text-sm mb-6">{currentPuzzle.description}</p>}
            <p className="text-brown/70 font-medium mb-4">Choisissez la difficulté</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {opts.map(n => {
                const l = labels[n] || { emoji: '⭐', name: `${n}×${n}`, desc: `${n * n} pièces` }
                return (
                  <button key={n} onClick={() => startGame(n)}
                    className="p-4 rounded-2xl border-2 transition-all hover:scale-105 min-w-[90px]"
                    style={{ borderColor: n === 3 ? '#0D7A3E' : n === 4 ? '#E8A830' : '#C8552A', background: 'rgba(245,230,204,0.5)' }}>
                    <div className="text-2xl mb-1">{l.emoji}</div>
                    <div className="font-bold text-brown text-sm">{l.name}</div>
                    <div className="text-xs text-brown/50 mt-1">{l.desc}</div>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep('select')} className="mt-5 text-sm text-brown/50 hover:text-brown block text-center w-full">
              ← Choisir un autre puzzle
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // ÉCRAN VICTOIRE
  // ═══════════════════════════════════════════════════════════
  if (step === 'won') {
    const stars = moves <= gridN * gridN ? 3 : moves <= gridN * gridN * 2 ? 2 : 1
    return (
      <div className="min-h-screen bogolan">
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center px-4">
          <div className="glass-card p-10 text-center max-w-md w-full">
            <div className="text-6xl mb-3">🎉</div>
            <h1 className="text-3xl font-black font-playfair text-brown mb-2">Félicitations !</h1>
            <p className="text-brown/60 mb-6">Puzzle "{currentPuzzle.title}" reconstitué !</p>

            <img src={currentPuzzle.image} alt={currentPuzzle.title}
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 20, boxShadow: '0 8px 32px rgba(92,45,10,0.2)' }} />

            <div className="flex justify-center gap-2 mb-4 text-3xl">
              {Array(stars).fill('⭐').map((s, i) => <span key={i}>{s}</span>)}
              {Array(3 - stars).fill('☆').map((s, i) => <span key={i} style={{ opacity: 0.3 }}>{s}</span>)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-sand/60 rounded-xl p-3">
                <div className="text-2xl font-black text-brown">{moves}</div>
                <div className="text-xs text-brown/60">Coups</div>
              </div>
              <div className="bg-sand/60 rounded-xl p-3">
                <div className="text-2xl font-black text-brown">{fmt(time)}</div>
                <div className="text-xs text-brown/60">Temps</div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => startGame(gridN)} className="btn-primary px-5 py-2.5 text-white text-sm">🔄 Rejouer</button>
              <button onClick={() => setStep('difficulty')} className="btn-gold px-5 py-2.5 text-white text-sm">🎚️ Difficulté</button>
              <button onClick={() => setStep('select')} className="px-5 py-2.5 rounded-full text-sm font-semibold text-brown border-2 border-sand hover:border-gold transition-all">🧩 Autre puzzle</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // ÉCRAN DE JEU
  // ═══════════════════════════════════════════════════════════
  const totalPieces = gridN * gridN
  const placedCount = gridSlots.filter(Boolean).length

  return (
    <div className="min-h-screen bogolan">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <button onClick={() => { stopTimer(); setStep('select') }}
              className="text-sm text-brown/60 hover:text-brown flex items-center gap-1">
              ← Changer
            </button>
            <div className="flex gap-4 items-center flex-wrap">
              <span className="text-sm font-bold text-brown">{currentPuzzle.title}</span>
              <span className="text-sm text-brown/60">🎯 {moves} coups</span>
              <span className="text-sm text-brown/60">⏱ {fmt(time)}</span>
              <span className="text-sm text-brown/60">📦 {placedCount}/{totalPieces}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPreview(v => !v)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{ background: showPreview ? '#E8A830' : 'rgba(232,168,48,0.15)', color: showPreview ? '#fff' : '#C8552A' }}>
                👁 Aperçu
              </button>
              <button onClick={useHint} disabled={hintsLeft <= 0}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={{ background: hintsLeft > 0 ? 'rgba(13,122,62,0.15)' : 'rgba(0,0,0,0.05)', color: hintsLeft > 0 ? '#0D7A3E' : '#999', cursor: hintsLeft > 0 ? 'pointer' : 'not-allowed' }}>
                💡 Aide ({hintsLeft})
              </button>
            </div>
          </div>

          {/* Aperçu de l'image complète */}
          {showPreview && (
            <div className="mb-4 text-center">
              <img src={currentPuzzle.image} alt="aperçu"
                style={{ maxHeight: 150, borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'inline-block' }} />
              <p className="text-xs text-brown/50 mt-1">Image complète — guidez-vous !</p>
            </div>
          )}

          {/* Instruction */}
          {selected && (
            <div className="text-center mb-3">
              <span className="text-xs px-4 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(232,168,48,0.2)', color: '#5C2D0A' }}>
                ✨ Pièce sélectionnée — cliquez une case de la grille pour la placer
              </span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

            {/* GRILLE */}
            <div>
              <p className="text-xs text-brown/50 mb-2 text-center font-medium">🖼️ Grille à reconstituer</p>
              <div style={{
                display: 'inline-grid',
                gridTemplateColumns: `repeat(${gridN}, ${GRID_PIECE_SIZE}px)`,
                gap: 3,
                padding: 8,
                background: 'rgba(92,45,10,0.08)',
                borderRadius: 14,
                border: '2px solid rgba(232,168,48,0.2)'
              }}>
                {gridSlots.map((piece, i) => {
                  const r = Math.floor(i / gridN)
                  const c = i % gridN
                  return piece ? (
                    <PuzzlePiece key={i}
                      imageUrl={currentPuzzle.image}
                      row={piece.correctRow} col={piece.correctCol}
                      gridN={gridN} size={GRID_PIECE_SIZE}
                      selected={selected?.from === 'grid' && selected.index === i}
                      onClick={() => handleGridClick(i)}
                      showNumber={false}
                    />
                  ) : (
                    <div key={i} onClick={() => handleGridClick(i)}
                      style={{
                        width: GRID_PIECE_SIZE, height: GRID_PIECE_SIZE,
                        background: selected ? 'rgba(232,168,48,0.15)' : 'rgba(245,230,204,0.3)',
                        border: `2px dashed ${selected ? '#E8A830' : 'rgba(232,168,48,0.25)'}`,
                        borderRadius: 6, cursor: selected ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: 'rgba(92,45,10,0.3)', fontWeight: 600,
                        transition: 'all 0.15s'
                      }}>
                      {r + 1},{c + 1}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* PLATEAU DE PIÈCES */}
            <div className="flex-1">
              <p className="text-xs text-brown/50 mb-2 text-center font-medium">
                🧩 Pièces à placer ({trayPieces.length} restantes)
              </p>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 6,
                padding: 10,
                background: 'rgba(92,45,10,0.06)',
                borderRadius: 14,
                border: '2px solid rgba(232,168,48,0.15)',
                minHeight: 120,
                alignContent: 'flex-start',
                maxWidth: 340
              }}>
                {trayPieces.map((piece, idx) => (
                  <PuzzlePiece key={piece.id}
                    imageUrl={currentPuzzle.image}
                    row={piece.correctRow} col={piece.correctCol}
                    gridN={gridN} size={PIECE_SIZE_TRAY}
                    selected={selected?.from === 'tray' && selected.piece.id === piece.id}
                    onClick={() => handleTrayClick(piece, idx)}
                    showNumber={true}
                  />
                ))}
                {trayPieces.length === 0 && (
                  <div style={{ width: '100%', textAlign: 'center', color: 'rgba(92,45,10,0.4)', fontSize: 13, paddingTop: 20 }}>
                    ✅ Toutes les pièces sont placées !
                  </div>
                )}
              </div>

              {/* Barre de progression */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-brown/50 mb-1">
                  <span>Progression</span>
                  <span>{Math.round((placedCount / totalPieces) * 100)}%</span>
                </div>
                <div style={{ background: 'rgba(92,45,10,0.1)', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 10,
                    background: 'linear-gradient(90deg, #0D7A3E, #E8A830)',
                    width: `${(placedCount / totalPieces) * 100}%`,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Bouton rejouer */}
          <div className="text-center mt-6">
            <button onClick={() => startGame(gridN)}
              className="text-xs text-brown/50 hover:text-brown underline">
              🔄 Mélanger à nouveau
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
