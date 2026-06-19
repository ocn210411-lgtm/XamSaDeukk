import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const DISHES = [
  { name: 'Thiéboudienne', emoji: '🍚', correct: ['Riz','Poisson','Tomates','Oignons','Yeet'], wrong: ['Poulet','Piment fort','Fromage'] },
  { name: 'Yassa Poulet', emoji: '🍗', correct: ['Poulet','Oignons','Citron','Moutarde','Riz'], wrong: ['Poisson','Lait','Sucre'] },
  { name: 'Mafé', emoji: '🥘', correct: ['Viande','Pâte d\'arachide','Tomates','Patates douces'], wrong: ['Poisson','Citron','Vanille'] },
  { name: 'Pastels', emoji: '🥟', correct: ['Farine','Poisson','Oignons','Persil','Huile'], wrong: ['Riz','Poulet','Sucre'] },
  { name: 'Thiou Mouton', emoji: '🐑', correct: ['Mouton','Riz','Tomates','Ail','Oignons'], wrong: ['Poisson','Noix de coco','Chocolat'] },
  { name: 'Soupou Kandja', emoji: '🍲', correct: ['Gombo','Huile de palme','Viande','Poisson fumé','Piment'], wrong: ['Riz','Lait','Miel'] },
]

export default function JeuCuisine() {
  const [gameState, setGameState] = useState('menu')
  const [dishIndex, setDishIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)

  const dish = DISHES[dishIndex]

  const allIngredients = dish ? [...dish.correct, ...dish.wrong].sort(() => Math.random() - 0.5) : []
  const [shuffled] = useState(() => allIngredients)

  const startGame = () => { setDishIndex(0); setScore(0); setGameState('playing'); setSelected([]); setResult(null) }

  const toggleIngredient = (ing) => {
    if (result) return
    setSelected(s => s.includes(ing) ? s.filter(x => x !== ing) : [...s, ing])
  }

  const check = () => {
    const correct = dish.correct
    const hits = selected.filter(s => correct.includes(s)).length
    const miss = selected.filter(s => !correct.includes(s)).length
    const pts = Math.max(0, hits * 20 - miss * 10)
    setScore(sc => sc + pts)
    setResult({ hits, miss, pts, total: correct.length })
  }

  const next = () => {
    if (dishIndex + 1 >= DISHES.length) { setGameState('done'); return }
    setDishIndex(i => i + 1)
    setSelected([])
    setResult(null)
  }

  if (gameState === 'menu') return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-lg w-full">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 className="text-3xl font-black font-playfair text-brown mb-2">Chef Sénégalais</h1>
          <p className="text-brown/60 mb-2">Sélectionnez les bons ingrédients pour chaque plat traditionnel</p>
          <p className="text-sm text-brown/40 mb-8">{DISHES.length} plats · Bon ingrédient = +20pts · Mauvais = -10pts</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {DISHES.map(d => <div key={d.name} className="glass-card p-3 text-center"><div className="text-2xl">{d.emoji}</div><div className="text-xs text-brown/60 mt-1">{d.name}</div></div>)}
          </div>
          <button onClick={startGame} className="btn-primary px-8 py-3 text-white">🍳 Commencer à cuisiner</button>
          <div className="mt-4"><Link to="/" className="text-sm text-brown/50 hover:text-brown">← Retour</Link></div>
        </div>
      </div><Footer /></div>
  )

  if (gameState === 'done') return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-24 pb-16 bogolan min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black font-playfair text-brown mb-2">Bravo Chef !</h2>
          <div className="text-5xl font-black mb-2" style={{ color: '#E8A830' }}>{score} pts</div>
          <p className="text-brown/60 mb-6">Vous avez préparé tous les plats !</p>
          <div className="flex gap-3 justify-center">
            <button onClick={startGame} className="btn-primary px-6 py-2.5 text-white text-sm">🔄 Rejouer</button>
            <Link to="/" className="btn-gold px-6 py-2.5 text-white text-sm no-underline">🏠 Accueil</Link>
          </div>
        </div>
      </div><Footer /></div>
  )

  const currentIngredients = [...dish.correct, ...dish.wrong].sort(() => 0.5 - Math.random())

  return (
    <div className="min-h-screen"><Navbar />
      <div className="pt-20 bogolan min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-brown/60">Plat {dishIndex + 1}/{DISHES.length}</span>
            <span className="font-bold text-brown">Score: <span style={{ color: '#E8A830' }}>{score}</span></span>
          </div>

          <div className="glass-card p-6 text-center mb-5">
            <div className="text-5xl mb-2">{dish.emoji}</div>
            <h2 className="text-2xl font-black font-playfair text-brown">{dish.name}</h2>
            <p className="text-sm text-brown/60 mt-1">Sélectionnez les {dish.correct.length} bons ingrédients</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {currentIngredients.map(ing => {
              const isSelected = selected.includes(ing)
              const showResult = result
              const isCorrect = dish.correct.includes(ing)
              let bg = 'rgba(245,230,204,0.6)'
              let border = '1.5px solid rgba(232,168,48,0.2)'
              if (showResult && isSelected && isCorrect) { bg = 'rgba(13,122,62,0.15)'; border = '2px solid #0D7A3E' }
              else if (showResult && isSelected && !isCorrect) { bg = 'rgba(178,34,34,0.15)'; border = '2px solid #B22222' }
              else if (showResult && !isSelected && isCorrect) { bg = 'rgba(13,122,62,0.08)'; border = '2px dashed #0D7A3E' }
              else if (isSelected) { bg = 'rgba(200,85,42,0.15)'; border = '2px solid #C8552A' }
              return (
                <button key={ing} onClick={() => toggleIngredient(ing)}
                  className="p-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{ background: bg, border, color: '#5C2D0A' }}>
                  {showResult && isSelected ? (isCorrect ? '✅' : '❌') : ''} {ing}
                </button>
              )
            })}
          </div>

          {result ? (
            <div className="glass-card p-4 text-center">
              <div className="text-3xl mb-1">{result.pts > 0 ? '🎉' : '😅'}</div>
              <p className="text-brown font-semibold">{result.hits}/{result.total} bons ingrédients · {result.miss} mauvais</p>
              <p className="text-lg font-black" style={{ color: result.pts > 0 ? '#0D7A3E' : '#B22222' }}>+{result.pts} points</p>
              <button onClick={next} className="btn-primary mt-3 px-6 py-2 text-white text-sm">
                {dishIndex + 1 >= DISHES.length ? '🏆 Voir résultat' : 'Plat suivant →'}
              </button>
            </div>
          ) : (
            <button onClick={check} disabled={selected.length === 0} className="btn-primary w-full py-3 text-white disabled:opacity-50">
              🍳 Valider ma recette ({selected.length} ingrédients)
            </button>
          )}
        </div>
      </div><Footer /></div>
  )
}
