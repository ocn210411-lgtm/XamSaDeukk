import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const PAIRS = [
  ['Bonjour','Salaam'], ['Merci','Jërejëf'], ['Eau','Ndox'],
  ['Maison','Kër'], ['Mère','Yaay'], ['Père','Baay'],
  ['Amour','Mbëgël'], ['Poisson','Jën'], ['Pain','Mburu'],
  ['Marché','Marché bi'], ['Enfant','Doom'], ['Grand','Mag'],
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function buildCards(pairs) {
  return shuffle(pairs.flatMap(([fr, wo], i) => [
    { id: `fr-${i}`, text: fr, pair: i, type: 'fr' },
    { id: `wo-${i}`, text: wo, pair: i, type: 'wo' },
  ]))
}

export default function JeuMemoireWolof() {
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
    setCards(buildCards(PAIRS.slice(0, pairCount)))
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
    if (a.pair === b.pair && a.type !== b.type) {
      setMatched(m => { const next = [...m, a.pair]; if (next.length === pairCount) setWon(true); return next })
      setFlipped([])
      setLock(false)
    } else {
      setTimeout(() => { setFlipped([]); setLock(false) }, 900)
    }
    setMoves(x => x + 1)
  }, [flipped])

  const flip = (id) => {
    if (lock || flipped.includes(id) || matched.includes(cards.find(c => c.id === id)?.pair)) return
    if (flipped.length === 2) return
    setFlipped(f => [...f, id])
  }

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  if (!level) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-lg w-full">
          <div className="text-6xl mb-4">🃏</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-2">Mémoire Wolof</h1>
          <p className="text-brown/60 mb-8">Associez les mots français à leur traduction wolof</p>
          <div className="grid grid-cols-3 gap-3">
            {[['easy','🌱 Facile','6 paires'],['medium','🔥 Moyen','9 paires'],['hard','💎 Difficile','12 paires']].map(([k,l,d]) => (
              <button key={k} onClick={() => setLevel(k)} className="p-4 rounded-2xl border-2 transition-all hover:scale-105"
                style={{ borderColor: k==='easy'?'#0D7A3E':k==='medium'?'#E8A830':'#C8552A', background: 'rgba(245,230,204,0.5)' }}>
                <div className="text-2xl mb-1">{l.split(' ')[0]}</div>
                <div className="font-bold text-brown text-sm">{l.split(' ').slice(1).join(' ')}</div>
                <div className="text-xs text-brown/50">{d}</div>
              </button>
            ))}
          </div>
          <Link to="/" className="mt-6 inline-block text-sm text-brown/50 hover:text-brown">← Retour</Link>
        </div>
      </div>
      <Footer />
    </div>
  )

  const cols = pairCount <= 6 ? 4 : pairCount <= 9 ? 6 : 6

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 bogolan min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setLevel(null)} className="text-sm text-brown/60 hover:text-brown">← Niveaux</button>
            <div className="flex gap-4 text-sm font-semibold text-brown">
              <span>⏱ {fmt(time)}</span>
              <span>🎯 {moves} coups</span>
              <span>✅ {matched.length}/{pairCount}</span>
            </div>
          </div>

          {won && (
            <div className="glass-card p-6 text-center mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-2xl font-black font-playfair text-brown mb-1">Bravo !</h2>
              <p className="text-brown/60 mb-4">{moves} coups · {fmt(time)}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setLevel(level)} className="btn-primary px-6 py-2.5 text-white text-sm">🔄 Rejouer</button>
                <button onClick={() => setLevel(null)} className="btn-gold px-6 py-2.5 text-white text-sm">🏆 Niveaux</button>
              </div>
            </div>
          )}

          <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {cards.map(card => {
              const isFlipped = flipped.includes(card.id)
              const isMatched = matched.includes(card.pair)
              return (
                <button key={card.id} onClick={() => flip(card.id)}
                  className="aspect-square rounded-2xl flex items-center justify-center text-center p-2 font-bold transition-all duration-300 text-sm"
                  style={{
                    background: isMatched ? 'linear-gradient(135deg,#0D7A3E,#0A5C2E)' : isFlipped ? 'linear-gradient(135deg,#C8552A,#A83820)' : 'linear-gradient(135deg,#5C2D0A,#3A1A00)',
                    color: (isFlipped || isMatched) ? '#fff' : 'transparent',
                    transform: isFlipped || isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                    boxShadow: isMatched ? '0 4px 16px rgba(13,122,62,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
                  }}>
                  {(isFlipped || isMatched) ? card.text : '?'}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
