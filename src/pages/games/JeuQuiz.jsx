import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { callAI } from '../../utils/ai'

const STATIC_QS = [
  { q: 'Quelle est la capitale du Sénégal ?', a: 'Dakar', opts: ['Dakar','Saint-Louis','Thiès','Ziguinchor'] },
  { q: 'Quel est le fleuve le plus long du Sénégal ?', a: 'Fleuve Sénégal', opts: ['Fleuve Sénégal','Gambie','Casamance','Sine'] },
  { q: 'Qui est le premier président du Sénégal ?', a: 'Léopold Sédar Senghor', opts: ['Léopold Sédar Senghor','Abdou Diouf','Abdoulaye Wade','Macky Sall'] },
  { q: 'Quel est le plat national du Sénégal ?', a: 'Thiéboudienne', opts: ['Thiéboudienne','Yassa','Mafé','Pastels'] },
  { q: 'Quelle est la langue la plus parlée au Sénégal ?', a: 'Wolof', opts: ['Français','Wolof','Peul','Sérère'] },
  { q: 'Quelle île historique est classée UNESCO ?', a: 'Gorée', opts: ['Gorée','Carabane','Saloum','Mar Lodj'] },
  { q: 'Quel monument domine Dakar ?', a: 'Monument de la Renaissance Africaine', opts: ['Monument de la Renaissance Africaine','Arc de Triomphe','Obélisque','Tour Dakar'] },
]

export default function JeuQuiz() {
  const [qs, setQs] = useState(STATIC_QS)
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const genAI = async () => {
    setAiLoading(true)
    try {
      const raw = await callAI([{
        role: 'user',
        content: 'Génère 5 questions de culture générale sur le Sénégal (histoire, géographie, gastronomie, musique, arts). Format JSON strict: [{"q":"question","a":"bonne réponse","opts":["opt1","opt2","opt3","opt4"]}]. Réponds UNIQUEMENT avec le JSON.'
      }], { temp: 0.9, max: 600 })
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) {
        const aiQs = JSON.parse(match[0])
        setQs([...STATIC_QS, ...aiQs])
      }
    } catch { }
    setAiLoading(false)
    setGameStarted(true)
    setIdx(0); setScore(0); setChosen(null); setDone(false)
  }

  const answer = (opt) => {
    if (chosen) return
    setChosen(opt)
    if (opt === qs[idx].a) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= qs.length) { setDone(true); return }
    setIdx(i => i + 1); setChosen(null)
  }

  const restart = () => { setIdx(0); setScore(0); setChosen(null); setDone(false) }

  if (!gameStarted) return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-lg w-full">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-2">Quiz Culture</h1>
          <p className="text-brown/60 mb-8">Testez vos connaissances sur le Sénégal</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => setGameStarted(true)} className="btn-primary py-4 text-white">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-sm font-semibold">Quiz classique</div>
              <div className="text-xs opacity-80">{STATIC_QS.length} questions</div>
            </button>
            <button onClick={genAI} disabled={aiLoading} className="btn-gold py-4 text-white disabled:opacity-70">
              {aiLoading ? <><div className="text-2xl mb-1 animate-spin">⚙️</div><div className="text-xs">Génération...</div></> : <>
                <div className="text-2xl mb-1">✨</div>
                <div className="text-sm font-semibold">Quiz IA</div>
                <div className="text-xs opacity-80">Questions uniques</div>
              </>}
            </button>
          </div>
          <Link to="/" className="text-sm text-brown/50 hover:text-brown">← Retour</Link>
        </div>
      </div><Footer /></div>
  )

  if (done) return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">{score >= qs.length * 0.8 ? '🏆' : score >= qs.length * 0.5 ? '🎖️' : '📚'}</div>
          <h2 className="text-3xl font-black font-playfair text-brown mb-3">Quiz terminé !</h2>
          <div className="text-5xl font-black mb-2" style={{ color: '#E8A830' }}>{score}/{qs.length}</div>
          <p className="text-brown/60 mb-6">{score >= qs.length * 0.8 ? 'Excellent ! Vous êtes un vrai expert !' : score >= qs.length * 0.5 ? 'Bien joué ! Continuez à apprendre !' : 'Continuez à explorer la culture sénégalaise !'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-primary px-6 py-2.5 text-white text-sm">🔄 Rejouer</button>
            <button onClick={() => setGameStarted(false)} className="btn-gold px-6 py-2.5 text-white text-sm">🎯 Nouveau quiz</button>
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
            <span className="font-bold" style={{ color: '#E8A830' }}>Score: {score}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-sand mb-6 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${((idx+1)/qs.length)*100}%`, background: 'linear-gradient(90deg,#C8552A,#E8A830)' }} />
          </div>

          <div className="glass-card p-6 mb-5">
            <p className="text-lg font-bold font-playfair text-brown text-center">{q.q}</p>
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
                  {chosen && opt === q.a ? '✅ ' : chosen && opt === chosen && opt !== q.a ? '❌ ' : ''}{opt}
                </button>
              )
            })}
          </div>

          {chosen && (
            <button onClick={next} className="btn-primary w-full mt-4 py-3 text-white">
              {idx + 1 >= qs.length ? '🏁 Voir le résultat' : 'Question suivante →'}
            </button>
          )}
        </div>
      </div><Footer /></div>
  )
}
