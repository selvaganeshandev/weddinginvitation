import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Clock3, Flower2, Heart,
  MapPin, Menu, Pause, Play, Volume2, VolumeX, X,
} from 'lucide-react'
import './App.css'

const navItems = [
  ['HOME', 'home'], ['STORY', 'story'], ['WEDDING', 'wedding'],
  ['VENUE', 'venue'],
] as const

const moments = [
  ['01', 'FIRST MEETING', 'An unexpected hello became the beginning of our story.'],
  ['02', 'A BEAUTIFUL BOND', 'Every shared moment brought our two worlds closer.'],
  ['03', 'A PROMISE', 'Two families, two hearts, one promise for a lifetime.'],
  ['04', 'FOREVER', 'Now, with your blessings, our next chapter begins.'],
]

const familyGroups = [
  ['Mr. Subramani', 'Mrs. S. Bakiya Lakshmi'],
  ['Mr. G. Panner Selvam', 'Mrs. P. Tamilarasi'],
]

const groomFamilyGroups = [
  ['Mr. S. Ramasamy', 'Mrs. R. Ramadevi', ''],
  ['Mr. J. Guna Pandian', 'Mrs. G. Selva Shankari', 'B.A. · M.Com. · B.Ed.'],
  ['Mr. P. Mohana Krishnan · B.E.', 'Mrs. A. Shreelekha · B.E.', ''],
]

const groomFamilyMembers = [
  'Selvi G. S. S. Mythreyi · BBM, MBA',
  'Selvan U. S. Selva Ganeshan · B.E.',
  'Selvan G. S. Kavindraa · B.E.',
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

function TempleArtwork() {
  return (
    <svg className="temple-art" viewBox="0 0 1000 700" role="img" aria-label="Decorative line illustration of a South Indian temple gopuram">
      <defs>
        <linearGradient id="templeGold" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f7e8c6" /><stop offset=".5" stopColor="#d4af37" /><stop offset="1" stopColor="#8c6422" /></linearGradient>
        <linearGradient id="templeGlow" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#d4af37" stopOpacity=".22" /><stop offset="1" stopColor="#d4af37" stopOpacity="0" /></linearGradient>
      </defs>
      <ellipse cx="500" cy="640" rx="385" ry="36" fill="url(#templeGlow)" />
      <g fill="none" stroke="url(#templeGold)" strokeWidth="2" opacity=".86" strokeLinejoin="round">
        <path d="M170 601h660M195 580h610M223 557h554M249 532h502M274 505h452M298 476h404M321 445h358M344 411h312M365 375h270M384 337h232M403 297h194M421 255h158M438 210h124M454 162h92M470 112h60M483 65h34" />
        <path d="M235 601v-36h530v36M265 557v-34h470v34M296 526v-31h408v31M325 500v-30h350v30M350 470v-29h300v29M378 440v-29h244v29M404 411v-30h192v30M430 381v-29h140v29M452 352v-29h96v29M468 323v-28h64v28M481 295v-30h38v30M490 265V52h20v213" />
        <path d="M450 601v-95q50-71 100 0v95M469 601v-83q31-47 62 0v83M490 601v-62q10-17 20 0v62" />
        <path d="M273 557q25-43 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0" />
        <path d="M299 505q25-37 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0" />
        <path d="M354 445q21-33 42 0t42 0 42 0 42 0 42 0 42 0 42 0 42 0" />
        <path d="M411 375q18-26 36 0t36 0 36 0 36 0 36 0 36 0" />
        <path d="M453 297q12-20 24 0t24 0 24 0 24 0 24 0" />
        {[ [325,540],[675,540],[355,485],[645,485],[389,422],[611,422],[425,389],[575,389],[453,338],[547,338],[469,280],[531,280] ].map(([x,y], index) => <g key={index} transform={`translate(${x} ${y})`}><path d="M0-13c-11 9-10 22 0 27 10-5 11-18 0-27Z"/><circle cy="1" r="3" /></g>)}
        <path d="M486 62q14-25 28 0M479 72h42M471 107h58M440 207h120M426 253h148" />
      </g>
      <g fill="#d4af37" opacity=".9"><circle cx="500" cy="40" r="4"/><circle cx="430" cy="91" r="2"/><circle cx="570" cy="91" r="2"/><circle cx="400" cy="178" r="2"/><circle cx="600" cy="178" r="2"/></g>
    </svg>
  )
}

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [style, setStyle] = useState<React.CSSProperties>({})
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setStyle({ transform: `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)` })
  }
  return <article className={`tilt-card ${className}`} style={style} onPointerMove={tilt} onPointerLeave={() => setStyle({})}>{children}</article>
}

function App() {
  const [opened, setOpened] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [musicMessage, setMusicMessage] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

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
        {!opened && <motion.section className="opening" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }} transition={{ duration: 1.2 }} aria-label="Wedding invitation opening">
          <div className="opening-frame" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="opening-ornament" aria-hidden="true"><Flower2 size={30} strokeWidth={0.8} /><i /><Flower2 size={18} strokeWidth={0.8} /></div>
          <motion.p className="eyebrow opening-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}>WEDDING INVITATION · COME TO CELEBRATE</motion.p>
          <motion.div className="opening-names" initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .8, duration: 1.1 }}>
            <span className="royal-title">KING &amp; QUEEN</span><h1>CHANDRU</h1><span className="ampersand">weds</span><h1>SANDHIYA</h1>
          </motion.div>
          <motion.p className="opening-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }}>With the eternal blessings of the late parents of the Groom &amp; Bride,<br className="desktop-break" /> we request the honour of your gracious presence with love.</motion.p>
          <motion.div className="opening-events" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
            <article className="opening-event"><p className="eyebrow">THE WEDDING</p><h2>SUNDAY · 15 NOVEMBER 2026</h2><p className="opening-event-time">9:00 AM ONWARDS</p><OrnamentDivider /><p className="opening-venue">Shri Senniamman Thiru Koil<br />Senniamman Koil Scheme, Block 7, Tondiarpet<br />Chennai – 600 021</p></article>
            <article className="opening-event"><p className="eyebrow">THE RECEPTION</p><h2>MONDAY · 16 NOVEMBER 2026</h2><p className="opening-event-time">6:30 PM ONWARDS</p><OrnamentDivider /><p className="opening-venue">Hyatt Mahal<br />16, Prakasam Road, Ayyavapuram, George Town<br />Tamil Nadu – 600 108</p></article>
          </motion.div>
          <motion.p className="opening-closing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>We eagerly await your gracious presence with love.</motion.p>
          <motion.button className="gold-button opening-button" type="button" onClick={() => { setOpened(true); window.scrollTo(0, 0) }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
            OPEN INVITATION <ArrowDown size={15} strokeWidth={1.5} />
          </motion.button>
          <p className="opening-footnote">WITH THE BLESSINGS OF OUR BELOVED PARENTS</p>
        </motion.section>}
      </AnimatePresence>

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
          <section className="temple-hero" id="home">
            <div className="temple-photo" aria-hidden="true"><img src="/images/temple-venue.jpg" alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} /><TempleArtwork /></div>
            <div className="temple-shade" />
            <div className="hero-copy">
              <p className="eyebrow">WITH BLESSINGS, LOVE &amp; GRATITUDE</p>
              <OrnamentDivider />
              <h2>THE BEGINNING OF<br /><em>A BEAUTIFUL JOURNEY</em></h2>
              <p className="hero-description">With blessings, love and the presence<br className="desktop-break" /> of our families, we invite you to celebrate<br className="desktop-break" /> the beginning of our forever.</p>
              <a href="#story" className="text-link">DISCOVER OUR STORY <ArrowDown size={14} /></a>
            </div>
            <div className="hero-side-note">A PROMISE OF FOREVER <span>·</span> 15.11.2026</div>
            <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
            <span className="temple-note">TEMPLE PHOTO PLACEHOLDER · ADD YOUR IMAGE TO public/images/temple-venue.jpg</span>
          </section>

          <section className="story-section section-pad" id="story">
            <Reveal className="section-heading"><p className="eyebrow">OUR STORY</p><h2>Two hearts,<br /><em>one beautiful journey.</em></h2><OrnamentDivider /><p className="section-intro">Every love story is made of little moments.<br />These are a few of ours.</p></Reveal>
            <div className="couple-portraits">
              <Reveal className="portrait-wrap portrait-left"><div className="portrait-frame"><div className="portrait-placeholder portrait-groom" aria-label="Chandru portrait placeholder"><span>C</span><Flower2 /></div></div><p>CHANDRU</p><span>THE GROOM</span></Reveal>
              <div className="portrait-heart" aria-hidden="true"><Heart size={25} strokeWidth={1} /></div>
              <Reveal className="portrait-wrap portrait-right" delay={.18}><div className="portrait-frame"><div className="portrait-placeholder portrait-bride" aria-label="Sandhiya portrait placeholder"><span>S</span><Flower2 /></div></div><p>SANDHIYA</p><span>THE BRIDE</span></Reveal>
            </div>
            <div className="story-timeline">{moments.map(([number, title, copy], index) => <Reveal key={title} className="story-moment" delay={index * .08}><span className="story-number">{number}</span><span className="story-line" /><h3>{title}</h3><p>{copy}</p></Reveal>)}</div>
          </section>

          <section className="details-section section-pad" id="wedding">
            <Reveal className="section-heading"><p className="eyebrow">SAVE THE DATE</p><h2>A day woven<br /><em>with love &amp; blessings.</em></h2><OrnamentDivider /><p className="section-intro">Please join our families as we celebrate<br />a new beginning.</p></Reveal>
            <div className="details-grid">
              <Reveal><TiltCard className="detail-card"><CalendarDays /><span className="detail-label">WEDDING CEREMONY</span><h3>Sunday</h3><p>15 November 2026</p><small>THE CEREMONY DAY</small></TiltCard></Reveal>
              <Reveal delay={.08}><TiltCard className="detail-card"><Clock3 /><span className="detail-label">CEREMONY TIME</span><h3>9:00 AM</h3><p>Onwards · Sunday morning</p><small>PLEASE ARRIVE A LITTLE EARLY</small></TiltCard></Reveal>
              <Reveal delay={.16}><TiltCard className="detail-card"><Flower2 /><span className="detail-label">WEDDING VENUE</span><h3>Shri Senniamman Thiru Koil</h3><p>Senniamman Koil Scheme, Block 7, Tondiarpet</p><small>CHENNAI – 600 021</small></TiltCard></Reveal>
              <Reveal delay={.24}><TiltCard className="detail-card"><CalendarDays /><span className="detail-label">RECEPTION</span><h3>Monday</h3><p>16 November 2026</p><small>AN EVENING CELEBRATION</small></TiltCard></Reveal>
              <Reveal delay={.32}><TiltCard className="detail-card"><Clock3 /><span className="detail-label">RECEPTION TIME</span><h3>6:30 PM</h3><p>Monday evening · onwards</p><small>JOIN US TO CELEBRATE</small></TiltCard></Reveal>
              <Reveal delay={.4}><TiltCard className="detail-card"><MapPin /><span className="detail-label">RECEPTION VENUE</span><h3>Hyatt Mahal</h3><p>16, Prakasam Road, Ayyavapuram, George Town</p><small>TAMIL NADU – 600 108</small></TiltCard></Reveal>
            </div>
          </section>

          <section className="family-section section-pad">
            <Reveal className="family-heading"><p className="eyebrow">WEDDING INVITATION · COME TO CELEBRATE</p><h2>Our families,<br /><em>with love.</em></h2><OrnamentDivider /><p className="family-blessing">Seeking the eternal blessings of the late parents of the Groom &amp; Bride,<br />we request the honour of your gracious presence with love.</p></Reveal>
            <Reveal className="reception-panel"><p className="eyebrow">RECEPTION</p><h3>Monday, 16 November 2026</h3><p className="reception-time">6:30 PM onwards</p><OrnamentDivider /><p className="reception-venue"><strong>Hyatt Mahal</strong><br />16, Prakasam Road<br />Ayyavapuram, George Town<br />Tamil Nadu – 600 108</p></Reveal>
            <Reveal className="family-couple"><p className="eyebrow">OF THE GROOM</p><h3>Selvan S. Chandra Sekaran <span>B.E.</span></h3><p className="family-work">Different Hair Pvt. Ltd.</p><span className="family-weds">weds</span><p className="eyebrow">OF THE BRIDE</p><h3>Selvi M. Sandhiya</h3><p className="family-work">Randstad India Pvt. Ltd.</p></Reveal>
            <div className="family-lineage"><Reveal className="lineage-card"><span className="eyebrow">SON OF</span><p>Mr. S. Suresh Babu <small>B.A.</small></p><span className="lineage-and">&amp;</span><p>Mrs. S. Umamaheswari <small>M.Com., M.Phil.</small></p></Reveal><Reveal className="lineage-card" delay={.1}><span className="eyebrow">DAUGHTER OF</span><p>Mr. K. Mani</p><span className="lineage-and">&amp;</span><p>Mrs. M. Anusuya</p></Reveal></div>
            <Reveal className="family-elders"><p className="eyebrow">WITH BLESSINGS FROM THE GROOM'S FAMILY</p><p className="groom-family-welcome">We eagerly await your gracious presence<br />with love.</p><div className="family-groups">{familyGroups.map(([first, second]) => <div className="family-pair" key={first}><p>{first}</p><span>&amp;</span><p>{second}</p></div>)}</div><div className="groom-family-groups">{groomFamilyGroups.map(([first, second, qualifications]) => <div className="groom-family-pair" key={first}><p>{first}</p><span>&amp;</span><p>{second}</p>{qualifications && <small>{qualifications}</small>}</div>)}</div><div className="groom-family-members">{groomFamilyMembers.map((member) => <span key={member}>{member}</span>)}</div></Reveal>
            <Reveal className="family-invitation" delay={.2}><p>You and your family are invited to become<br className="desktop-break" /> a treasured part of their journey together.</p><h3>It is our joy to be united as<br /><em>Husband &amp; Wife.</em></h3><span>We eagerly await your gracious presence with love.</span></Reveal>
          </section>

          <section className="message-section section-pad"><Reveal><Flower2 className="message-flower" strokeWidth={.8} /><p className="eyebrow">A CELEBRATION OF LOVE</p><h2>Your presence is<br /><em>our greatest gift.</em></h2><OrnamentDivider /><p className="section-intro">Your presence, blessings and love will make<br className="desktop-break" /> our special day even more meaningful.</p><Heart className="message-heart" size={18} strokeWidth={1} /></Reveal></section>

          <section className="venue-section section-pad" id="venue">
            <Reveal className="venue-card">
              <div className="venue-image"><img src="/images/temple-venue.jpg" alt="South Indian temple wedding venue" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} /><TempleArtwork /><div className="venue-image-shade" /><span className="image-caption">A PLACE FOR OUR NEW BEGINNING</span></div>
              <div className="venue-copy"><p className="eyebrow">WHERE OUR FOREVER BEGINS</p><h2>A sacred place<br /><em>for a sacred promise.</em></h2><OrnamentDivider /><p>We look forward to welcoming you for a day of love, blessings and togetherness.</p><div className="venue-facts"><span><MapPin /> Shri Senniamman Thiru Koil · Tondiarpet</span><span><CalendarDays /> Wedding · Sunday, 15 November</span><span><Clock3 /> 9:00 AM onwards</span><span><MapPin /> Hyatt Mahal · George Town</span><span><CalendarDays /> Reception · Monday, 16 November</span><span><Clock3 /> 6:30 PM onwards</span></div><a className="gold-button gold-button-small" href="#wedding">VIEW EVENT DETAILS <ArrowUpRight size={15} /></a><small className="venue-note">Full addresses are listed in the invitation details.</small></div>
            </Reveal>
          </section>

        </main>

        <footer className="site-footer"><a className="footer-monogram" href="#home">C <span>&amp;</span> S</a><p>15 <i>·</i> 16 NOVEMBER 2026</p><span>A celebration of love,<br />designed to leave a lasting impression.</span><Heart size={14} className="footer-heart" /></footer>

        <div className="music-wrap"><div className="music-controls"><button className={`music-button ${musicPlaying ? 'is-playing' : ''}`} type="button" onClick={toggleMusic} aria-label={musicPlaying ? 'Pause wedding music' : 'Play wedding music'} title={musicPlaying ? 'Pause music' : 'Play music'}>{musicPlaying ? <Pause size={16} /> : <Play size={16} />}{musicPlaying && <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>}</button><button className="mute-button" type="button" onClick={toggleMute} aria-label={muted ? 'Unmute wedding music' : 'Mute wedding music'} title={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div>{musicMessage && <span className="music-message" role="status">{musicMessage}</span>}</div>
      </>}

    </>
  )
}

export default App