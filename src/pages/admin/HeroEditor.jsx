import { useState } from 'react'
import { useSite } from '../../context/SiteContext'

export default function HeroEditor() {
  const { data, update } = useSite()
  const [hero, setHero] = useState({ ...data.hero })
  const [announcement, setAnnouncement] = useState({ ...data.announcement })
  const [saved, setSaved] = useState(false)

  const saveHero = () => {
    update('hero', hero)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveAnnouncement = () => {
    update('announcement', announcement)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateStat = (i, field, val) => {
    const stats = [...hero.stats]
    stats[i] = { ...stats[i], [field]: val }
    setHero({ ...hero, stats })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">Section Hero</h1>
          <p className="text-brown/60 text-sm mt-1">Modifiez le contenu principal de la page d'accueil</p>
        </div>
        {saved && <span className="text-green-600 font-medium text-sm animate-pulse">✅ Sauvegardé !</span>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold font-playfair text-brown">Textes principaux</h2>

          {[['badge','Badge/accroche'],['title','Titre (mot 1)'],['titleHighlight','Titre (mot 2 doré)'],['subtitle','Sous-titre'],['ctaMain','Bouton principal'],['ctaSecond','Bouton secondaire']].map(([k,l]) => (
            <div key={k}>
              <label className="text-xs font-semibold text-brown/70 uppercase tracking-wide block mb-1">{l}</label>
              {k === 'subtitle' ? (
                <textarea value={hero[k]} onChange={e => setHero({ ...hero, [k]: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              ) : (
                <input value={hero[k]} onChange={e => setHero({ ...hero, [k]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              )}
            </div>
          ))}

          <button onClick={saveHero} className="btn-primary w-full py-3 text-sm text-white">💾 Sauvegarder le Hero</button>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-bold font-playfair text-brown">Statistiques (4 items)</h2>
            {hero.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={s.icon} onChange={e => updateStat(i, 'icon', e.target.value)} placeholder="Emoji"
                  className="px-3 py-2 rounded-lg text-sm text-center outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                <input value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="Valeur"
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                <input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Label"
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              </div>
            ))}
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-playfair text-brown">Bannière d'annonce</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={announcement.visible} onChange={e => setAnnouncement({ ...announcement, visible: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm text-brown/70">Visible</span>
              </label>
            </div>
            {[['text','Texte'],['link','Lien (URL)'],['linkText','Texte du lien']].map(([k,l]) => (
              <div key={k}>
                <label className="text-xs font-semibold text-brown/70 uppercase tracking-wide block mb-1">{l}</label>
                <input value={announcement[k]} onChange={e => setAnnouncement({ ...announcement, [k]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              </div>
            ))}
            <button onClick={saveAnnouncement} className="btn-gold w-full py-3 text-sm text-white">💾 Sauvegarder l'annonce</button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mt-6">
        <h2 className="font-bold font-playfair text-brown mb-4">Aperçu en direct</h2>
        <div className="rounded-2xl p-8 text-center bogolan" style={{ border: '2px dashed rgba(232,168,48,0.3)' }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
            style={{ background: 'rgba(200,85,42,0.1)', color: '#C8552A', border: '1px solid rgba(200,85,42,0.2)' }}>
            {hero.badge}
          </div>
          <h3 className="text-4xl font-black font-playfair mb-3">
            <span style={{ color: '#C8552A' }}>{hero.title}</span>{' '}
            <span style={{ color: '#E8A830' }}>{hero.titleHighlight}</span>
          </h3>
          <p className="text-brown/60 max-w-lg mx-auto text-sm">{hero.subtitle}</p>
          <div className="flex gap-3 justify-center mt-4">
            <span className="px-5 py-2 rounded-full text-white text-sm" style={{ background: '#C8552A' }}>{hero.ctaMain}</span>
            <span className="px-5 py-2 rounded-full text-sm" style={{ background: 'rgba(200,85,42,0.1)', color: '#C8552A', border: '1px solid rgba(200,85,42,0.2)' }}>{hero.ctaSecond}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
