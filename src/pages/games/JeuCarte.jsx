import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const QUESTIONS = [
  { q: 'Quelle ville est la capitale du Sénégal ?', a: 'Dakar', opts: ['Dakar','Saint-Louis','Thiès','Kaolack'], region: 'Dakar' },
  { q: 'Quelle ancienne capitale est au nord du pays ?', a: 'Saint-Louis', opts: ['Saint-Louis','Louga','Matam','Podor'], region: 'Saint-Louis' },
  { q: 'Quelle ville est connue comme capitale du Mouridisme ?', a: 'Touba', opts: ['Touba','Kaolack','Thiès','Diourbel'], region: 'Diourbel' },
  { q: 'Quelle ville est le principal port de pêche du pays ?', a: 'Mbour', opts: ['Mbour','Joal','Kafountine','Kayar'], region: 'Thiès' },
  { q: 'Quelle ville est la plus grande ville de Casamance ?', a: 'Ziguinchor', opts: ['Ziguinchor','Bignona','Oussouye','Kolda'], region: 'Ziguinchor' },
  { q: 'Sur quelle île se trouve l\'un des plus grands lacs salés roses ?', a: 'Lac Rose (Retba)', opts: ['Lac Rose (Retba)','Lac de Guiers','Lac Tanma','Basse Casamance'], region: 'Dakar' },
  { q: 'Quelle région est connue pour les bassins arachidiers ?', a: 'Kaolack', opts: ['Kaolack','Thiès','Saint-Louis','Louga'], region: 'Kaolack' },
  { q: 'Quelle ville est à la frontière avec la Gambie au sud ?', a: 'Kolda', opts: ['Kolda','Sédhiou','Tambacounda','Kédougou'], region: 'Kolda' },
  { q: 'Quelle région abrite le Pays Bassari (UNESCO) ?', a: 'Kédougou', opts: ['Kédougou','Tambacounda','Matam','Kolda'], region: 'Kédougou' },
  { q: 'Quelle ville historique fut la première capitale coloniale ?', a: 'Saint-Louis', opts: ['Saint-Louis','Gorée','Rufisque','Dakar'], region: 'Saint-Louis' },
]

const REGIONS = [
  { name: 'Dakar', x: 8, y: 48, color: '#C8552A' },
  { name: 'Thiès', x: 14, y: 44, color: '#E8A830' },
  { name: 'Saint-Louis', x: 15, y: 12, color: '#0D7A3E' },
  { name: 'Diourbel', x: 22, y: 40, color: '#B22222' },
  { name: 'Kaolack', x: 28, y: 50, color: '#6B3FA0' },
  { name: 'Fatick', x: 20, y: 52, color: '#1A6B8A' },
  { name: 'Louga', x: 22, y: 25, color: '#5C2D0A' },
  { name: 'Matam', x: 48, y: 20, color: '#8B6914' },
  { name: 'Tambacounda', x: 52, y: 50, color: '#2D6E3E' },
  { name: 'Kédougou', x: 60, y: 65, color: '#6B2D8A' },
  { name: 'Kolda', x: 40, y: 70, color: '#8A3D1A' },
  { name: 'Sédhiou', x: 28, y: 72, color: '#1A5C4A' },
  { name: 'Ziguinchor', x: 18, y: 78, color: '#4A2D8A' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function JeuCarte() {
  const [qs] = useState(() => shuffle(QUESTIONS))
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  const answer = (opt) => {
    if (chosen) return
    setChosen(opt)
    if (opt === qs[idx].a) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= qs.length) { setDone(true); return }
    setIdx(i => i + 1); setChosen(null)
  }

  if (!started) return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-lg w-full">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-2">Géographie du Sénégal</h1>
          <p className="text-brown/60 mb-6">Testez vos connaissances sur les villes et régions du Sénégal</p>
          <div className="relative w-full aspect-square max-w-xs mx-auto mb-6 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)' }}>
            <div className="absolute inset-0 flex items-center justify-center text-brown/20 text-6xl font-black font-playfair">🇸🇳</div>
            {REGIONS.map(r => (
              <div key={r.name} className="absolute flex flex-col items-center" style={{ left: `${r.x}%`, top: `${r.y}%` }}>
                <div className="w-3 h-3 rounded-full border-2 border-white shadow-md" style={{ background: r.color }} />
                <span className="text-xs font-semibold mt-0.5 whitespace-nowrap" style={{ color: r.color, fontSize: '0.55rem' }}>{r.name}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStarted(true)} className="btn-primary px-8 py-3 text-white">🗺️ Commencer le quiz géo</button>
          <div className="mt-4"><Link to="/" className="text-sm text-brown/50 hover:text-brown">← Retour</Link></div>
        </div>
      </div><Footer /></div>
  )

  if (done) return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black font-playfair text-brown mb-3">Quiz terminé !</h2>
          <div className="text-5xl font-black mb-3" style={{ color: '#E8A830' }}>{score}/{qs.length}</div>
          <p className="text-brown/60 mb-6">{score >= 8 ? 'Géographe expert !' : score >= 5 ? 'Bon résultat !' : 'Continuez à explorer !'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setIdx(0); setScore(0); setChosen(null); setDone(false) }} className="btn-primary px-6 py-2.5 text-white text-sm">🔄 Rejouer</button>
            <Link to="/" className="btn-gold px-6 py-2.5 text-white text-sm no-underline">🏠 Accueil</Link>
          </div>
        </div>
      </div><Footer /></div>
  )

  const q = qs[idx]
  return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-20 bogolan min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-brown/60">Question {idx+1}/{qs.length}</span>
            <span className="font-bold" style={{ color: '#E8A830' }}>🗺️ {score} pts</span>
          </div>
          <div className="w-full h-2 rounded-full bg-sand mb-5 overflow-hidden">
            <div style={{ width: `${((idx+1)/qs.length)*100}%`, height: '100%', background: 'linear-gradient(90deg,#C8552A,#E8A830)', borderRadius: 999 }} />
          </div>

          <div className="glass-card p-6 mb-5 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-lg font-bold font-playfair text-brown">{q.q}</p>
            {q.region && <div className="mt-2 text-xs text-brown/40">Région: {q.region}</div>}
          </div>

          <div className="space-y-3">
            {q.opts.map(opt => {
              let style = { background: 'rgba(245,230,204,0.6)', border: '2px solid rgba(232,168,48,0.2)', color: '#5C2D0A' }
              if (chosen) {
                if (opt === q.a) style = { background: 'rgba(13,122,62,0.15)', border: '2px solid #0D7A3E', color: '#0D7A3E', fontWeight: 700 }
                else if (opt === chosen) style = { background: 'rgba(178,34,34,0.1)', border: '2px solid #B22222', color: '#B22222' }
                else style = { ...style, opacity: 0.5 }
              }
              return (
                <button key={opt} onClick={() => answer(opt)}
                  className="w-full px-5 py-3.5 rounded-2xl text-sm text-left transition-all hover:scale-[1.01]"
                  style={style}>
                  {chosen && opt === q.a ? '✅ ' : chosen && opt === chosen && opt !== q.a ? '❌ ' : '📍 '}{opt}
                </button>
              )
            })}
          </div>
          {chosen && (
            <button onClick={next} className="btn-primary w-full mt-4 py-3 text-white">
              {idx + 1 >= qs.length ? '🏁 Résultat final' : 'Question suivante →'}
            </button>
          )}
        </div>
      </div><Footer /></div>
  )
}
