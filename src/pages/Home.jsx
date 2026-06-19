import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSite } from '../context/SiteContext'

function HeroSection({ hero, announcement }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bogolan overflow-hidden pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-10 float" style={{ background: 'radial-gradient(circle, #E8A830 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full opacity-8 float" style={{ background: 'radial-gradient(circle, #C8552A 0%, transparent 70%)', animationDelay: '1.5s' }} />
      </div>

      {announcement?.visible && (
        <div className="relative z-10 mx-auto mt-4 mb-8 px-4">
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, rgba(200,85,42,0.1), rgba(232,168,48,0.1))', border: '1px solid rgba(232,168,48,0.25)', color: '#5C2D0A' }}>
            <span>{announcement.text}</span>
            <Link to={announcement.link} className="font-semibold hover:underline" style={{ color: '#C8552A' }}>{announcement.linkText}</Link>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-12">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold mb-6"
          style={{ background: 'rgba(200,85,42,0.1)', color: '#C8552A', border: '1px solid rgba(200,85,42,0.2)' }}>
          {hero.badge}
        </div>

        <h1 className="text-6xl md:text-8xl font-black font-playfair mb-6 leading-none">
          <span style={{ color: '#C8552A' }}>{hero.title}</span>{' '}
          <span className="shimmer-text" style={{ background: 'linear-gradient(90deg, #5C2D0A 30%, #E8A830 50%, #5C2D0A 70%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 3s linear infinite' }}>
            {hero.titleHighlight}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-brown/70 max-w-2xl mx-auto mb-10 leading-relaxed">{hero.subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/jeux" className="btn-primary px-8 py-4 text-base text-white no-underline inline-block" style={{ borderRadius: 50, background: 'linear-gradient(135deg,#C8552A,#A83820)', fontWeight: 600 }}>
            🎮 {hero.ctaMain}
          </Link>
          <Link to="/apprendre-wolof" className="px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5 no-underline inline-block"
            style={{ borderRadius: 50, background: 'rgba(232,168,48,0.15)', color: '#C8552A', border: '2px solid rgba(200,85,42,0.3)' }}>
            🦁 {hero.ctaSecond}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hero.stats.map((s, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black font-playfair" style={{ color: '#C8552A' }}>{s.value}</div>
              <div className="text-xs text-brown/60 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GamesSection({ games }) {
  const colors = ['#C8552A','#0D7A3E','#E8A830','#B22222','#5C2D0A','#6B3FA0','#1A6B8A']
  return (
    <section className="py-20 bogolan">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
            style={{ background: 'rgba(200,85,42,0.1)', color: '#C8552A', border: '1px solid rgba(200,85,42,0.2)' }}>
            🎮 Espace Jeux
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-playfair text-brown mb-4">Jeux Culturels Interactifs</h2>
          <p className="text-brown/60 text-lg max-w-xl mx-auto">Apprenez en vous amusant à travers des jeux soigneusement conçus</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((g, i) => (
            <Link key={g.id} to={g.link} className="glass-card p-6 game-card-hover block no-underline group" style={{ textDecoration: 'none' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${g.color}15` }}>
                  {g.icon}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${g.color}15`, color: g.color }}>
                  {g.badge}
                </span>
              </div>
              <h3 className="font-bold font-playfair text-lg text-brown mb-1 group-hover:text-terra transition-colors" style={{ '--terra': '#C8552A' }}>{g.title}</h3>
              <p className="text-brown/60 text-sm mb-3 leading-relaxed">{g.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brown/40">{g.difficulty}</span>
                <span className="text-sm font-semibold transition-colors" style={{ color: g.color }}>Jouer →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/jeux" className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold no-underline transition-all hover:-translate-y-1"
            style={{ borderRadius: 50, background: 'linear-gradient(135deg,#C8552A,#A83820)', color: '#fff', boxShadow: '0 4px 20px rgba(200,85,42,0.35)', fontSize: 15 }}>
            🎮 Voir tous les jeux
          </Link>
        </div>
      </div>
    </section>
  )
}

function WolofBanner({ wolofBanner }) {
  if (!wolofBanner.visible) return null
  return (
    <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D7A3E 0%, #0A5C2E 50%, #064020 100%)' }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)' }} />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'rgba(232,168,48,0.2)', color: '#E8A830', border: '1px solid rgba(232,168,48,0.3)' }}>
          {wolofBanner.badge}
        </span>
        <h2 className="text-4xl md:text-5xl font-black font-playfair text-white mb-4">
          🦁 {wolofBanner.title}
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">{wolofBanner.subtitle}</p>
        <Link to="/apprendre-wolof" className="inline-block px-8 py-4 font-semibold text-brown no-underline transition-transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #E8A830, #C88818)', borderRadius: 50, boxShadow: '0 4px 20px rgba(232,168,48,0.4)' }}>
          {wolofBanner.cta} →
        </Link>
      </div>
    </section>
  )
}

function TestimonialsSection({ testimonials }) {
  return (
    <section className="py-20 bogolan">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black font-playfair text-brown mb-4">Ce que disent nos utilisateurs</h2>
          <div className="flex justify-center gap-1 mb-2">{[...Array(5)].map((_, i) => <span key={i} style={{ color: '#E8A830' }}>★</span>)}</div>
          <p className="text-brown/60">Plus de 12 000 joueurs satisfaits</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="glass-card p-6">
              <div className="flex gap-1 mb-3">{[...Array(t.stars)].map((_, i) => <span key={i} style={{ color: '#E8A830' }}>★</span>)}</div>
              <p className="text-brown/70 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <div className="font-semibold text-brown text-sm">{t.name}</div>
                  <div className="text-brown/50 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SiteStatsSection({ siteStats }) {
  return (
    <section className="py-16" style={{ background: 'linear-gradient(135deg, #1A0A00, #2D1200, #1A0A00)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {siteStats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black font-playfair mb-1" style={{ color: '#E8A830' }}>{s.value}</div>
              <div className="text-white/50 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { data } = useSite()
  const { hero, announcement, games, wolofBanner, testimonials, siteStats } = data

  useEffect(() => {
    document.title = 'XamSaDeukk — Xam Sa Boppam, Xam Sa Reewam'
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(e => e.forEach(en => en.isIntersecting && en.target.classList.add('visible')), { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection hero={hero} announcement={announcement} />
      <GamesSection games={games} />
      <WolofBanner wolofBanner={wolofBanner} />
      <TestimonialsSection testimonials={testimonials} />
      <SiteStatsSection siteStats={siteStats} />
      <Footer />
    </div>
  )
}
