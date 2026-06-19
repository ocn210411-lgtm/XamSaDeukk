import { useState } from 'react'
import { useSite } from '../../context/SiteContext'

export default function Settings() {
  const { data, update } = useSite()
  const [settings, setSettings] = useState({ ...data.siteSettings })
  const [colors, setColors] = useState({ ...data.themeColors })
  const [saved, setSaved] = useState(false)

  const save = () => {
    update('siteSettings', settings)
    update('themeColors', colors)
    Object.entries(colors).forEach(([k, v]) => document.documentElement.style.setProperty(`--${k}`, v))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const colorLabels = {
    terra: 'Terracotta (primaire)',
    gold: 'Or (accent)',
    green: 'Vert (secondaire)',
    red: 'Rouge',
    cream: 'Crème (fond)',
    brown: 'Brun (texte)'
  }

  const presets = [
    { name: 'Sénégal Classique', colors: { terra: '#C8552A', gold: '#E8A830', green: '#0D7A3E', red: '#B22222', cream: '#FDF6EC', brown: '#5C2D0A' } },
    { name: 'Nuit Africaine', colors: { terra: '#FF7043', gold: '#FFD700', green: '#00897B', red: '#E53935', cream: '#1A1A2E', brown: '#E0E0E0' } },
    { name: 'Savane Dorée', colors: { terra: '#D4874B', gold: '#F0C060', green: '#5A8A4A', red: '#C04040', cream: '#FFF8E7', brown: '#4A3000' } },
    { name: 'Océan Dakar', colors: { terra: '#1565C0', gold: '#FFA726', green: '#0D7A3E', red: '#C62828', cream: '#E3F2FD', brown: '#1A237E' } },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-brown">Paramètres</h1>
          <p className="text-brown/60 text-sm mt-1">Configuration générale du site</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 font-medium text-sm">✅ Sauvegardé !</span>}
          <button onClick={save} className="btn-primary px-5 py-2 text-sm text-white">💾 Sauvegarder</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-bold font-playfair text-brown">Informations du site</h2>
          {[['siteName','Nom du site'],['tagline','Tagline'],['footerText','Texte du footer']].map(([k,l]) => (
            <div key={k}>
              <label className="text-xs font-semibold text-brown/70 uppercase tracking-wide block mb-1">{l}</label>
              <input value={settings[k]} onChange={e => setSettings({ ...settings, [k]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ border: '1.5px solid rgba(232,168,48,0.3)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }} />
            </div>
          ))}

          <div className="mt-4 p-4 rounded-xl bogolan" style={{ border: '1px solid rgba(232,168,48,0.2)' }}>
            <div className="text-2xl font-black font-playfair mb-1">
              <span style={{ color: colors.terra }}>{settings.siteName}</span>
            </div>
            <div className="text-sm" style={{ color: colors.gold }}>{settings.tagline}</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-bold font-playfair text-brown mb-4">Couleurs du thème</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(colorLabels).map(([k, l]) => (
              <div key={k} className="flex items-center gap-3">
                <input type="color" value={colors[k]} onChange={e => setColors({ ...colors, [k]: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-brown/70">{l}</div>
                  <div className="text-xs font-mono text-brown/40">{colors[k]}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-brown/70 uppercase tracking-wide mb-2">Thèmes prédéfinis</div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => (
                <button key={p.name} onClick={() => setColors(p.colors)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all hover:scale-105"
                  style={{ border: '1.5px solid rgba(232,168,48,0.2)', background: 'rgba(245,230,204,0.3)', color: '#5C2D0A' }}>
                  <div className="flex gap-0.5">
                    {['terra','gold','green'].map(c => (
                      <div key={c} className="w-3 h-3 rounded-full" style={{ background: p.colors[c] }} />
                    ))}
                  </div>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mt-6">
        <h2 className="font-bold font-playfair text-brown mb-4">Aperçu du thème</h2>
        <div className="rounded-2xl p-6 overflow-hidden" style={{ background: colors.cream }}>
          <div className="h-1 mb-4 rounded" style={{ background: `linear-gradient(90deg, ${colors.green} 33%, ${colors.gold} 33% 66%, ${colors.red} 66%)` }} />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black font-playfair" style={{ color: colors.terra }}>{settings.siteName}</span>
              <span className="text-sm ml-2" style={{ color: colors.gold }}>{settings.tagline}</span>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-1.5 rounded-full text-white text-xs font-semibold" style={{ background: colors.terra }}>Primaire</span>
              <span className="px-4 py-1.5 rounded-full text-white text-xs font-semibold" style={{ background: colors.green }}>Secondaire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
