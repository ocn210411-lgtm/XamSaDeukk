import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const PAIRS = [
  { icon: '🗼', name: 'Monument Renaissance' }, { icon: '⛵', name: 'Île de Gorée' },
  { icon: '💗', name: 'Lac Rose' }, { icon: '🕌', name: 'Grande Mosquée Touba' },
  { icon: '🎺', name: 'Sabar' }, { icon: '🎭', name: 'Masque Soninké' },
  { icon: '🐆', name: 'Panthère' }, { icon: '🌴', name: 'Baobab' },
  { icon: '🎨', name: 'Bogolan' }, { icon: '🏖️', name: 'Saly' },
  { icon: '🐚', name: 'Coquillages' }, { icon: '🎪', name: 'Tabaski' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function JeuMemoireCulture() {
  const [level, setLevel] = useState(null)
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [won, setWon] = useState(false)
  const [lock, setLock] = useState(false)

  const pairCount = level === 'easy' ? 6 : level === 'medium' ? 9 : 12

  useEffect(() => {
    if (!level) return
    const chosen = PAIRS.slice(0, pairCount)
    setCards(shuffle(chosen.flatMap((p, i) => [
      { id: `a-${i}`, pairId: i, content: p.icon, type: 'icon' },
      { id: `b-${i}`, pairId: i, content: p.name, type: 'text' }
    ])))
    setFlipped([]); setMatched([]); setMoves(0); setTime(0); setWon(false)
  }, [level])

  useEffect(() => {
    if (!level || won) return
    const t = setInterval(() => setTime(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [level, won])

  useEffect(() => {
    if (flipped.length !== 2) return
    setLock(true)
    const [a, b] = flipped.map(id => cards.find(c => c.id === id))
    if (a.pairId === b.pairId && a.type !== b.type) {
      setMatched(m => { const n = [...m, a.pairId]; if (n.length === pairCount) setWon(true); return n })
      setFlipped([]); setLock(false)
    } else {
      setTimeout(() => { setFlipped([]); setLock(false) }, 900)
    }
    setMoves(x => x + 1)
  }, [flipped])

  const flip = (id) => {
    if (lock || flipped.includes(id) || matched.includes(cards.find(c => c.id === id)?.pairId)) return
    if (flipped.length === 2) return
    setFlipped(f => [...f, id])
  }

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  if (!level) return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-lg w-full">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-2">Culture Memory</h1>
          <p className="text-brown/60 mb-8">Associez les icônes aux monuments et symboles du Sénégal</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {PAIRS.slice(0,6).map((p,i) => (
              <div key={i} className="glass-card p-3 text-center"><div className="text-2xl">{p.icon}</div><div className="text-xs text-brown/60 mt-1">{p.name}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['easy','🌱 Facile','6 paires'],['medium','🔥 Moyen','9 paires'],['hard','💎 Difficile','12 paires']].map(([k,l,d]) => (
              <button key={k} onClick={() => setLevel(k)} className="p-4 rounded-2xl border-2 transition-all hover:scale-105"
                style={{ borderColor: k==='easy'?'#0D7A3E':k==='medium'?'#E8A830':'#C8552A', background: 'rgba(245,230,204,0.5)' }}>
                <div className="font-bold text-brown text-sm">{l}</div>
                <div className="text-xs text-brown/50">{d}</div>
              </button>
            ))}
          </div>
          <Link to="/" className="mt-6 inline-block text-sm text-brown/50 hover:text-brown">← Retour</Link>
        </div>
      </div><Footer /></div>
  )

  const cols = pairCount <= 6 ? 4 : 6

  return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-20 bogolan min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setLevel(null)} className="text-sm text-brown/60 hover:text-brown">← Niveaux</button>
            <div className="flex gap-4 text-sm font-semibold text-brown">
              <span>⏱ {fmt(time)}</span><span>🎯 {moves}</span><span>✅ {matched.length}/{pairCount}</span>
            </div>
          </div>

          {won && (
            <div className="glass-card p-5 text-center mb-5">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-xl font-black font-playfair text-brown">Excellent !</h2>
              <p className="text-brown/60 text-sm">{moves} coups · {fmt(time)}</p>
              <div className="flex gap-3 justify-center mt-3">
                <button onClick={() => setLevel(level)} className="btn-primary px-5 py-2 text-white text-sm">🔄 Rejouer</button>
                <button onClick={() => setLevel(null)} className="btn-gold px-5 py-2 text-white text-sm">Niveaux</button>
              </div>
            </div>
          )}

          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {cards.map(card => {
              const isFlipped = flipped.includes(card.id)
              const isMatched = matched.includes(card.pairId)
              return (
                <button key={card.id} onClick={() => flip(card.id)}
                  className="aspect-square rounded-2xl flex items-center justify-center text-center p-1 transition-all duration-300"
                  style={{
                    background: isMatched ? 'linear-gradient(135deg,#0D7A3E,#0A5C2E)' : isFlipped ? 'linear-gradient(135deg,#5C2D0A,#3A1A00)' : 'linear-gradient(135deg,#C8552A,#8B3520)',
                    color: '#fff',
                    fontSize: card.type === 'icon' ? '2rem' : '0.65rem',
                    fontWeight: 700,
                  }}>
                  {(isFlipped || isMatched) ? card.content : '?'}
                </button>
              )
            })}
          </div>
        </div>
      </div><Footer /></div>
  )
}
