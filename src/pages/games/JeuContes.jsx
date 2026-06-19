import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const TALES = [
  {
    id: 1, title: 'Le Lion et l\'Araignée', emoji: '🦁',
    intro: 'Dans la savane sénégalaise, une araignée rusée défia le puissant lion...',
    parts: [
      'Il y a très longtemps, dans la grande savane sénégalaise, vivait Simba, le roi des lions.',
      'L\'araignée Anansi, connue pour sa ruse, décida de défier le lion pour montrer que l\'intelligence vaut mieux que la force.',
      'Le lion, surpris de l\'audace d\'Anansi, accepta le défi et proposa une course.',
      'L\'araignée tissa une toile ingénieuse entre les arbres, piégeant le lion qui courait trop vite.',
      'Le lion, immobilisé, reconnut la sagesse d\'Anansi. "La ruse surpasse toujours la force brute", dit-il.',
      'Depuis ce jour, dans toute la savane, l\'araignée fut respectée et son nom synonyme de sagesse.'
    ]
  },
  {
    id: 2, title: 'Le Baobab Magique', emoji: '🌳',
    intro: 'Un jeune berger découvrit les secrets d\'un ancien baobab...',
    parts: [
      'Près du village de Touba, un jeune berger nommé Kofi gardait son troupeau chaque matin.',
      'Un vieux baobab se dressait au centre de la plaine, ses branches millénaires portant les secrets du temps.',
      'Un soir de pleine lune, Kofi entendit une voix douce sortir du tronc noueux du baobab.',
      '"Je suis l\'esprit de tes ancêtres", murmura la voix. "Plante ces graines et ton village prospérera."',
      'Kofi fit confiance à l\'esprit et planta les graines tout autour du village comme conseillé.',
      'Au printemps suivant, les cultures furent abondantes et le village vécut dans la prospérité pour toujours.'
    ]
  },
  {
    id: 3, title: 'La Pirogue d\'Or', emoji: '⛵',
    intro: 'Les pêcheurs du Sine-Saloum découvrirent une pirogue légendaire...',
    parts: [
      'Dans les mangroves du Sine-Saloum, des pêcheurs vivaient de la générosité du fleuve depuis des générations.',
      'Un matin brumeux, ils trouvèrent une pirogue dorée échouée sur la berge, sans propriétaire.',
      'Le chef du village décida que la pirogue appartenait à toute la communauté et non à un seul homme.',
      'Les pêcheurs s\'organisèrent en tours pour utiliser la pirogue qui ramenait toujours une pêche miraculeuse.',
      'Un étranger voulut acheter la pirogue pour s\'enrichir seul, mais elle refusa de bouger pour lui.',
      'La pirogue d\'or enseigna aux hommes que les dons du ciel sont faits pour être partagés.'
    ]
  }
]

function shuffle(arr) { return [...arr].map((v, i) => [Math.random(), v]).sort().map(([, v]) => v) }

export default function JeuContes() {
  const [tale, setTale] = useState(null)
  const [order, setOrder] = useState([])
  const [dragIdx, setDragIdx] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const startTale = (t) => {
    setTale(t)
    setOrder(shuffle(t.parts.map((text, i) => ({ text, correct: i }))))
    setChecked(false)
  }

  const moveUp = (i) => {
    if (i === 0) return
    const n = [...order]; [n[i-1], n[i]] = [n[i], n[i-1]]; setOrder(n)
  }
  const moveDown = (i) => {
    if (i === order.length - 1) return
    const n = [...order]; [n[i], n[i+1]] = [n[i+1], n[i]]; setOrder(n)
  }

  const checkOrder = () => {
    const pts = order.filter((p, i) => p.correct === i).length
    setScore(pts)
    setChecked(true)
  }

  if (!tale) return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-xl w-full">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-2">Contes & Légendes</h1>
          <p className="text-brown/60 mb-8">Remettez les paragraphes dans le bon ordre</p>
          <div className="grid gap-3">
            {TALES.map(t => (
              <button key={t.id} onClick={() => startTale(t)}
                className="glass-card p-5 text-left flex items-center gap-4 game-card-hover">
                <span className="text-4xl">{t.emoji}</span>
                <div>
                  <div className="font-bold font-playfair text-brown">{t.title}</div>
                  <div className="text-sm text-brown/60">{t.intro}</div>
                </div>
              </button>
            ))}
          </div>
          <Link to="/" className="mt-6 inline-block text-sm text-brown/50 hover:text-brown">← Retour</Link>
        </div>
      </div><Footer /></div>
  )

  return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-20 bogolan min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={() => setTale(null)} className="text-sm text-brown/60 hover:text-brown mb-5">← Choisir un conte</button>
          <div className="glass-card p-6 mb-6 text-center">
            <div className="text-4xl mb-2">{tale.emoji}</div>
            <h2 className="text-2xl font-black font-playfair text-brown">{tale.title}</h2>
            <p className="text-brown/60 text-sm mt-1">Remettez les {tale.parts.length} paragraphes dans l'ordre chronologique</p>
          </div>

          {checked && (
            <div className="glass-card p-4 text-center mb-4">
              <div className="text-3xl mb-1">{score === tale.parts.length ? '🎉' : score >= tale.parts.length / 2 ? '👍' : '📚'}</div>
              <p className="font-bold text-brown">{score}/{tale.parts.length} paragraphes bien placés</p>
              <div className="flex gap-3 justify-center mt-3">
                <button onClick={() => startTale(tale)} className="btn-primary px-5 py-2 text-white text-sm">🔄 Réessayer</button>
                <button onClick={() => setTale(null)} className="btn-gold px-5 py-2 text-white text-sm">📖 Autre conte</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {order.map((part, i) => {
              const isCorrect = checked && part.correct === i
              const isWrong = checked && part.correct !== i
              return (
                <div key={i} className="glass-card p-4 flex items-start gap-3 transition-all"
                  style={{ border: isCorrect ? '2px solid #0D7A3E' : isWrong ? '2px solid #B22222' : '1px solid rgba(232,168,48,0.15)' }}>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveUp(i)} disabled={checked} className="text-brown/40 hover:text-brown disabled:opacity-20 text-xs leading-none">▲</button>
                    <span className="text-xs font-bold text-center text-brown/40">{i+1}</span>
                    <button onClick={() => moveDown(i)} disabled={checked} className="text-brown/40 hover:text-brown disabled:opacity-20 text-xs leading-none">▼</button>
                  </div>
                  <p className="flex-1 text-sm text-brown/80 leading-relaxed">{part.text}</p>
                  {checked && <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>}
                </div>
              )
            })}
          </div>

          {!checked && (
            <button onClick={checkOrder} className="btn-primary w-full mt-5 py-3 text-white">
              📖 Vérifier mon ordre
            </button>
          )}
        </div>
      </div><Footer /></div>
  )
}
