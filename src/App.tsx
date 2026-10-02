import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, Flower2, Heart, Menu, Pause, Play, Volume2, VolumeX, X,
} from 'lucide-react'
import './App.css'

const navItems = [
  ['HOME', 'home'], ['WEDDING', 'wedding'],
] as const

const blessingPairs = [
  ['Mr. S. Ramasamy', 'Mrs. R. Ramadevi', ''],
  ['Mr. J. Guna Pandian B.A', 'Mrs. G. Selva Shankari M.Com.B.Ed', ''],
  ['Mr. P. Mohana Krishnan B.E.', 'Mrs. A. Shreelekha B.E.', ''],
]

const blessingMembers = [
  'Selvan R. Subramani',
  'Selvi GSS.Mythreyi BBM, MBA',
  'Selvan U. S. Selva Ganeshan B.E',
  'Selvan GSS.Kavindraa B.E',
  'Master Sharvil Mohana Krishnan',
  'Master Satvik Mohana Krishnan',
]

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function OrnamentDivider({ className = '' }: { className?: string }) {
  return <div className={`ornament-divider ${className}`} aria-hidden="true"><span /><Flower2 size={15} strokeWidth={1} /><span /></div>
}

function App() {
  const [opened, setOpened] = useState(false)
  const [gateVisible, setGateVisible] = useState(false)
  const reduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [musicMessage, setMusicMessage] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const filmRef = useRef<HTMLVideoElement>(null)
  const [filmSound, setFilmSound] = useState(false)
  const fillRef = useRef<HTMLVideoElement>(null)
  const [filmEnded, setFilmEnded] = useState(false)
  // Phones held upright get the vertical edition of the film; everything else keeps the 16:9 film.
  const [portraitFilm] = useState(() => window.matchMedia('(orientation: portrait) and (max-width: 820px)').matches)

  // The film plays once, then rests on its closing frame (couple, date and venue) and invites the tap.
  const FILM_REST_AT = 17.4
  const endFilm = () => {
    for (const v of [filmRef.current, fillRef.current]) if (v) { v.pause(); v.currentTime = FILM_REST_AT }
    setFilmEnded(true)
  }
  const replayFilm = () => {
    setFilmEnded(false)
    for (const v of [filmRef.current, fillRef.current]) if (v) { v.currentTime = 0; v.play().catch(() => {}) }
  }

  // Browsers only autoplay muted video; the visitor's first tap turns the film's music on.
  const unmuteFilm = () => {
    const film = filmRef.current
    if (!film || filmSound) return
    film.muted = false
    film.volume = 0.7
    film.play().then(() => setFilmSound(true)).catch(() => { film.muted = true })
  }

  useEffect(() => {
    if (!opened) return
    document.body.classList.add('invitation-open')
    return () => document.body.classList.remove('invitation-open')
  }, [opened])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = muted
    setMusicMessage('')
    if (musicPlaying) {
      audio.pause()
      setMusicPlaying(false)
      return
    }
    try {
      await audio.play()
      setMusicPlaying(true)
    } catch {
      setMusicMessage('Add your music track at public/music/wedding-theme.mp3')
    }
  }

  // The "Open invitation" tap is the user gesture browsers require before audio can play.
  const startMusic = () => {
    const audio = audioRef.current
    if (!audio || musicPlaying) return
    audio.muted = muted
    audio.volume = 0.7
    audio.play().then(() => setMusicPlaying(true)).catch(() => {})
  }

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    if (audioRef.current) audioRef.current.muted = nextMuted
  }

  return (
    <>
      <audio ref={audioRef} src="/music/wedding-theme.mp3" loop preload="none" onEnded={() => setMusicPlaying(false)} />
      <div className="ambient-glow" aria-hidden="true" />
      <div className="gold-dust" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i, left: `${(i * 37 + 9) % 100}%`, top: `${(i * 23 + 5) % 100}%` } as React.CSSProperties} />)}</div>

      <AnimatePresence>
        {!opened && <motion.section className={`opening${filmEnded ? ' is-ended' : ''}${portraitFilm ? ' is-portrait-film' : ''}`} initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.4 : 0.6 }} aria-label="Wedding invitation opening" onPointerDown={unmuteFilm} onPointerMove={(event) => {
          if (event.pointerType !== 'mouse') return
          const { currentTarget: el, clientX, clientY } = event
          el.style.setProperty('--px', (clientX / el.clientWidth - 0.5).toFixed(3))
          el.style.setProperty('--py', (clientY / el.clientHeight - 0.5).toFixed(3))
        }}>
          {/* The film carries the invitation wording; the full frame is always shown over a blurred copy of itself */}
          <div className="opening-scene" aria-hidden="true">
            {!portraitFilm && <video ref={fillRef} className="opening-film-fill" src="/videos/opening-blur.mp4" autoPlay muted playsInline />}
            <video ref={filmRef} className="opening-film" src={portraitFilm ? '/videos/opening-film-portrait.mp4' : '/videos/opening-film.mp4'} poster={portraitFilm ? '/videos/opening-poster-portrait.jpg' : '/videos/opening-poster.jpg'} autoPlay muted playsInline preload="auto" onEnded={endFilm} />
          </div>
          <h1 className="visually-hidden">Chandru weds Sandhiya: wedding invitation</h1>
          {filmEnded && portraitFilm && <div className="film-cta-panel" aria-hidden="true" />}
          {filmEnded && <motion.div className="film-cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <p className="eyebrow">YOUR INVITATION AWAITS</p>
            <p className="film-cta-hint">Tap below to open the invitation</p>
          </motion.div>}
          {filmEnded && <button className="film-replay" type="button" onClick={replayFilm}>WATCH AGAIN</button>}
          {!filmSound && !filmEnded && <button className="film-sound" type="button" onClick={unmuteFilm}><Volume2 size={15} strokeWidth={1.5} /> TAP FOR SOUND</button>}
          <motion.button className="gold-button opening-button" type="button" onClick={() => { setGateVisible(!reduceMotion); setOpened(true); window.scrollTo(0, 0); startMusic() }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            OPEN INVITATION <ArrowDown size={15} strokeWidth={1.5} />
          </motion.button>
        </motion.section>}
      </AnimatePresence>

      {gateVisible && <div className="gate" aria-hidden="true">
        <motion.div className="gate-glow" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ delay: 0.5, duration: 1.9, times: [0, 0.35, 1] }} />
        {(['left', 'right'] as const).map((side) => (
          <motion.div
            key={side}
            className={`gate-door gate-${side}`}
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{ rotateY: side === 'left' ? 96 : -96, opacity: [1, 1, 0] }}
            transition={{ delay: 0.55, duration: 1.7, ease: [0.65, 0, 0.35, 1], opacity: { delay: 0.55, duration: 1.7, times: [0, 0.7, 1] } }}
            onAnimationComplete={side === 'right' ? () => setGateVisible(false) : undefined}
          ><div className="gate-scene" /><span className="gate-handle" /></motion.div>
        ))}
      </div>}

      {opened && <>
        <header className="site-header">
          <a className="brand-mark" href="#home" onClick={() => setMenuOpen(false)} aria-label="Chandru and Sandhiya, home">C <span>&amp;</span> S</a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
            {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          </nav>
          <a className="header-date" href="#wedding">15–16 · 11 · 2026</a>
        </header>

        <main>
          <section className="temple-hero journey-hero" id="home">
            {/* Bright edition: wording on top, the couple artwork below it (like a printed invitation) */}
            <div className="journey-backdrop" aria-hidden="true" />
            <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 28, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 1.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
              <p className="eyebrow">WITH BLESSINGS, LOVE &amp; GRATITUDE</p>
              <OrnamentDivider />
              <h2>THE BEGINNING OF<br /><em>A BEAUTIFUL JOURNEY</em></h2>
              <p className="hero-description">With blessings, love and the presence<br className="desktop-break" /> of our families, we invite you to celebrate<br className="desktop-break" /> the beginning of our forever.</p>
              <a href="#wedding" className="text-link">SAVE THE DATE <ArrowDown size={14} /></a>
            </motion.div>
            <motion.video className="journey-couple" autoPlay muted loop playsInline preload="auto" poster="/videos/journey-poster.jpg" aria-label="Chandru and Sandhiya walking hand in hand through a lantern-lit garden" initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
              {/* wide screens: couple on the left, soft garden continuation under the wording */}
              <source media="(min-width: 900px) and (orientation: landscape)" src="/videos/journey-wide.mp4" />
              <source src="/videos/journey.mp4" />
            </motion.video>
            <div className="hero-side-note">A PROMISE OF FOREVER <span>·</span> 15.11.2026</div>
            <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
          </section>

          <section className="family-section section-pad has-art" id="wedding">
            <div className="page-art" aria-hidden="true">
              {/* only wide screens show this layer, so only they download the wide film */}
              <video autoPlay muted loop playsInline poster="/videos/wedding-wide-poster.jpg"><source media="(min-width: 900px) and (orientation: landscape)" src="/videos/wedding-wide.mp4" /></video>
            </div>
            <div className="page-content">
            <Reveal className="family-heading"><h2>Wedding Invitation,<br /><em><span className="celebrate-line">come to celebrate</span><br />King &amp; Queen.</em></h2><OrnamentDivider /><p className="family-blessing">Seeking the eternal blessings of the late grandparents of the Groom.</p></Reveal>
            <Reveal className="family-couple"><h3>Selvan S. Chandra Sekaran <span>B.E.</span></h3><span className="family-weds">weds</span><h3>Selvi M. Sandhiya <span>B.Sc., M.A.</span></h3></Reveal>
            <Reveal className="family-photo"><video autoPlay muted loop playsInline poster="/videos/wedding-poster.jpg" aria-label="Chandru and Sandhiya seated together in the decorated wedding mandapam"><source media="not all and (min-width: 900px) and (orientation: landscape)" src="/videos/wedding.mp4" /></video></Reveal>
            <div className="family-lineage"><Reveal className="lineage-card"><span className="eyebrow">SON OF</span><p>Mr. S. Suresh Babu <small>B.A.</small></p><span className="lineage-and">&amp;</span><p>Mrs. S. Umamaheswari <small>M.Com., M.Phil.</small></p></Reveal><Reveal className="lineage-card" delay={.1}><span className="eyebrow">DAUGHTER OF</span><p>Mr. K. Mani</p><span className="lineage-and">&amp;</span><p>Mrs. M. Anusuya</p></Reveal></div>
            <div className="event-panels">
              <Reveal className="reception-panel"><p className="eyebrow">WEDDING</p><h3>Sunday, 15 November 2026</h3><p className="reception-time">9:00 AM onwards</p><OrnamentDivider /><p className="reception-venue"><strong>Shri Senniamman Thiru Koil</strong><br />Senniamman Koil Scheme<br />Block 7, Tondiarpet<br />Chennai – 600 021</p></Reveal>
              <Reveal className="reception-panel" delay={.12}><p className="eyebrow">RECEPTION</p><h3>Monday, 16 November 2026</h3><p className="reception-time">6:30 PM onwards</p><OrnamentDivider /><p className="reception-venue"><strong>Hyath Mahal</strong><br />196, Prakasam Road<br />Asirvadapuram, George Town<br />Tamil Nadu – 600 108</p></Reveal>
            </div>
            </div>
          </section>

          <section className="message-section section-pad has-art">
            <div className="page-art" aria-hidden="true">
              <video autoPlay muted loop playsInline poster="/videos/reception-wide-poster.jpg"><source media="(min-width: 900px) and (orientation: landscape)" src="/videos/reception-wide.mp4" /></video>
            </div>
            <Reveal className="page-content"><Flower2 className="message-flower" strokeWidth={.8} /><h2 className="message-title">A Celebration of Love</h2><OrnamentDivider /><p className="section-intro message-text">Your presence, blessings and love will make<br className="desktop-break" /> our special day even more meaningful.</p><Heart className="message-heart" size={18} strokeWidth={1} />
            <div className="message-photo"><video autoPlay muted loop playsInline poster="/videos/reception-poster.jpg" aria-label="Chandru and Sandhiya at their reception, welcomed by family under chandeliers and white flowers"><source media="not all and (min-width: 900px) and (orientation: landscape)" src="/videos/reception.mp4" /></video></div>
            <div className="blessing-family">
              <p className="blessing-welcome">We eagerly await your gracious presence with love.</p>
              <div className="blessing-pairs">{blessingPairs.map(([first, second, note]) => <div className="blessing-pair" key={first}><p>{first}</p><span>&amp;</span><p>{second}</p>{note && <small>{note}</small>}</div>)}</div>
              <div className="blessing-members">{blessingMembers.map((member) => <span key={member}>{member}</span>)}</div>
            </div>
          </Reveal></section>


        </main>

        <footer className="site-footer"><a className="footer-monogram" href="#home">C <span>&amp;</span> S</a><p>15 <i>·</i> 16 NOVEMBER 2026</p><span>A celebration of love,<br />designed to leave a lasting impression.</span><Heart size={14} className="footer-heart" /></footer>

        <div className="music-wrap"><div className="music-controls"><button className={`music-button ${musicPlaying ? 'is-playing' : ''}`} type="button" onClick={toggleMusic} aria-label={musicPlaying ? 'Pause wedding music' : 'Play wedding music'} title={musicPlaying ? 'Pause music' : 'Play music'}>{musicPlaying ? <Pause size={16} /> : <Play size={16} />}{musicPlaying && <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>}</button><button className="mute-button" type="button" onClick={toggleMute} aria-label={muted ? 'Unmute wedding music' : 'Mute wedding music'} title={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div>{musicMessage && <span className="music-message" role="status">{musicMessage}</span>}</div>
      </>}

    </>
  )
}

export default App