import { useState } from 'react'
import { useSite } from '../../context/SiteContext'

export default function StatsEditor() {
  const { data, update } = useSite()
  const [siteStats, setSiteStats] = useState([...data.siteStats])
  const [wolofBanner, setWolofBanner] = useState({ ...data.wolofBanner })
  const [saved, setSaved] = useState(false)

  const save = () => {
    update('siteStats', siteStats)
    update('wolofBanner', wolofBanner)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updStat = (i, field, val) => {
    const n = [...siteStats]
    n[i] = { ...n[i], [field]: val }
    setSiteStats(n)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">Statistiques & Bannière</h1>
          <p className="text-brown/60 text-sm mt-1">Modifiez les chiffres clés et la bannière Wolof</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 font-medium text-sm">✅ Sauvegardé !</span>}
          <button onClick={save} className="btn-primary px-5 py-2 text-sm text-white">💾 Sauvegarder</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-bold font-playfair text-brown mb-5">Chiffres clés du site</h2>
          <div className="space-y-4">
            {siteStats.map((s, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-center">
                <input value={s.icon} onChange={e => updStat(i, 'icon', e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-2xl text-center outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)' }} />
                <input value={s.value} onChange={e => updStat(i, 'value', e.target.value)} placeholder="Valeur"
                  className="px-3 py-2.5 rounded-xl text-sm font-bold outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
                <input value={s.label} onChange={e => updStat(i, 'label', e.target.value)} placeholder="Label"
                  className="px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #1A0A00, #2D1200)' }}>
            <p className="text-xs text-white/50 mb-2">Aperçu</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {siteStats.map((s, i) => (
                <div key={i}>
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-sm font-black" style={{ color: '#E8A830' }}>{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold font-playfair text-brown">Bannière Wolof</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={wolofBanner.visible} onChange={e => setWolofBanner({ ...wolofBanner, visible: e.target.checked })} />
              <span className="text-sm text-brown/70">Visible</span>
            </label>
          </div>

          {[['title','Titre'],['subtitle','Sous-titre'],['badge','Badge'],['cta','Bouton CTA']].map(([k,l]) => (
            <div key={k}>
              <label className="text-xs font-semibold text-brown/70 uppercase tracking-wide block mb-1">{l}</label>
              {k === 'subtitle' ? (
                <textarea value={wolofBanner[k]} onChange={e => setWolofBanner({ ...wolofBanner, [k]: e.target.value })} rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              ) : (
                <input value={wolofBanner[k]} onChange={e => setWolofBanner({ ...wolofBanner, [k]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
              )}
            </div>
          ))}

          <div className="rounded-2xl p-6 text-center mt-2" style={{ background: 'linear-gradient(135deg, #0D7A3E, #0A5C2E)' }}>
            <span className="inline-block text-xs px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(232,168,48,0.2)', color: '#E8A830' }}>
              {wolofBanner.badge}
            </span>
            <div className="text-xl font-black text-white mb-2">🦁 {wolofBanner.title}</div>
            <p className="text-white/70 text-xs mb-3">{wolofBanner.subtitle}</p>
            <span className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-brown" style={{ background: '#E8A830' }}>
              {wolofBanner.cta} →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
