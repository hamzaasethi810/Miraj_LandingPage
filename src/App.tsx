
import { useEffect, useRef, type CSSProperties } from 'react'
import BrandLogo from './components/BrandLogo'
import logoArc from './assets/brand/miraj-arc.png'
import logoBase from './assets/brand/miraj-wordmark-base.png'
import './App.css'

type MeteorStyle = CSSProperties & {
  '--meteor-x': string
  '--meteor-y': string
  '--meteor-angle': string
  '--meteor-duration': string
  '--meteor-delay': string
  '--meteor-tail': string
  '--meteor-top': string
}

type RainStreak = {
  x: number
  y: number
  length: number
  speed: number
  slant: number
  opacity: number
  minX: number
  maxX: number
}

const meteors = Array.from({ length: 4 }, () => {
  const fromLeft = Math.random() < 0.5
  const travelX = 105 + Math.random() * 35
  const travelY = Math.random() * 16 - 8
  const angle = Math.atan2(fromLeft ? travelY : -travelY, travelX) * (180 / Math.PI)
  const style: MeteorStyle = {
    '--meteor-x': `${fromLeft ? travelX : -travelX}vw`,
    '--meteor-y': `${travelY}vw`,
    '--meteor-angle': `${angle}deg`,
    '--meteor-duration': `${20 + Math.random() * 16}s`,
    '--meteor-delay': `${Math.random() * 20}s`,
    '--meteor-tail': `${38 + Math.random() * 20}px`,
    '--meteor-top': `${8 + Math.random() * 72}%`,
  }

  return {
    direction: fromLeft ? 'left-to-right' : 'right-to-left',
    style,
  }
})

const mirajArcPath =
  'M 360 146 C 480 108, 650 60, 804 76 C 900 84, 984 120, 1045 150'
const mirajFlightPath =
  'M -1400 680 C -1000 680, 240 184, 360 146 C 480 108, 650 60, 804 76 C 900 84, 984 120, 1045 150'

function App() {
  const rainCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = rainCanvasRef.current
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const context = canvas?.getContext('2d')

    if (!canvas || !context || motionPreference.matches) return

    let width = 0
    let height = 0
    let pixelRatio = 1
    let animationFrame = 0
    let startTimer = 0
    let lastFrame = 0
    const streaks: RainStreak[] = []

    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

    const createRainStreak = (isLeft: boolean, y: number): RainStreak => {
      const sideWidth = width < 600 ? 0.15 : 0.2
      const minX = width * (isLeft ? 0.02 : 1 - sideWidth)
      const maxX = width * (isLeft ? sideWidth : 0.98)
      const streakLength = randomBetween(22, width < 600 ? 30 : 42)

      return {
        x: randomBetween(minX, maxX),
        y,
        length: streakLength,
        speed: randomBetween(560, 760),
        slant: randomBetween(-0.025, 0.025),
        opacity: randomBetween(0.16, 0.26),
        minX,
        maxX,
      }
    }

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      streaks.length = 0
      for (let index = 0; index < 52; index += 1) {
        streaks.push(createRainStreak(index % 2 === 0, randomBetween(-height, height)))
      }
    }

    const drawRainStreaks = (delta: number) => {
      for (const streak of streaks) {
        streak.y += streak.speed * delta
        streak.x = clamp(streak.x + streak.speed * streak.slant * delta, streak.minX, streak.maxX)

        if (streak.y > height + streak.length) {
          const next = createRainStreak(streak.x < width / 2, -streak.length)
          Object.assign(streak, next)
        }

        context.beginPath()
        context.moveTo(streak.x, streak.y)
        context.lineTo(streak.x + streak.slant * streak.length, streak.y + streak.length)
        context.strokeStyle = `rgba(207, 226, 248, ${streak.opacity})`
        context.lineWidth = streak.length > 32 ? 1.2 : 0.9
        context.lineCap = 'butt'
        context.stroke()
      }
    }

    const render = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.05)
      lastFrame = now
      context.clearRect(0, 0, width, height)
      drawRainStreaks(delta)

      animationFrame = window.requestAnimationFrame(render)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    startTimer = window.setTimeout(() => {
      lastFrame = performance.now()
      animationFrame = window.requestAnimationFrame(render)
    }, 6200)

    return () => {
      window.clearTimeout(startTimer)
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <main>
      <div className="night-sky" aria-hidden="true">
        <div className="sky-clouds" />
        <div className="sky-stars">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="sky-aurora" />
        <div className="moon-scene" aria-hidden="true">
          <svg className="moon" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="moonSurface" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e4e3dc" />
                <stop offset="55%" stopColor="#c9cac7" />
                <stop offset="100%" stopColor="#aeb2b7" />
              </linearGradient>
              <radialGradient id="moonMare">
                <stop offset="0%" stopColor="#626a73" stopOpacity="0.46" />
                <stop offset="70%" stopColor="#717982" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#717982" stopOpacity="0" />
              </radialGradient>
              <clipPath id="moonCrescent">
                <path d="M 70 7 A 46 46 0 1 0 70 93 C 45 84, 35 67, 35 50 C 35 33, 45 16, 70 7 Z" />
              </clipPath>
              <filter id="moonTexture" x="-8%" y="-8%" width="116%" height="116%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.42"
                  numOctaves="2"
                  seed="8"
                  result="lunarGrain"
                />
                <feColorMatrix in="lunarGrain" type="saturate" values="0" result="grayGrain" />
                <feComponentTransfer in="grayGrain" result="softGrain">
                  <feFuncA type="table" tableValues="0 0.18" />
                </feComponentTransfer>
                <feComposite in="softGrain" in2="SourceAlpha" operator="in" result="surfaceGrain" />
                <feBlend in="SourceGraphic" in2="surfaceGrain" mode="soft-light" />
              </filter>
            </defs>
            <g filter="url(#moonTexture)">
              <path
                className="moon-crescent"
                d="M 70 7 A 46 46 0 1 0 70 93 C 45 84, 35 67, 35 50 C 35 33, 45 16, 70 7 Z"
                fill="url(#moonSurface)"
              />
              <g clipPath="url(#moonCrescent)">
                <circle cx="20" cy="30" r="13" fill="url(#moonMare)" />
                <circle cx="25" cy="68" r="10" fill="url(#moonMare)" />
                <circle cx="13" cy="51" r="7" fill="url(#moonMare)" />
                <circle cx="17" cy="43" r="4.5" fill="#727982" fillOpacity="0.24" stroke="#f1f0e9" strokeOpacity="0.16" strokeWidth="0.8" />
                <circle cx="21" cy="70" r="3.5" fill="#727982" fillOpacity="0.22" stroke="#f1f0e9" strokeOpacity="0.14" strokeWidth="0.7" />
              </g>
            </g>
          </svg>
        </div>
        <canvas ref={rainCanvasRef} className="sky-rain" />
      </div>

      <header className="navbar page-reveal">
        <a href="#" className="brand">
          <BrandLogo variant="wordmark" />
        </a>

        <nav>
          <a href="#about">About</a>
          <a href="#ventures">Ventures</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-meteors" aria-hidden="true">
          {meteors.map((meteor, index) => (
            <span
              key={index}
              data-direction={meteor.direction}
              style={meteor.style}
            />
          ))}
        </div>

        <div className="hero-wordmark-stage" aria-hidden="true">
          <div className="hero-wordmark">
            <img
              src={logoBase}
              className="logo-base"
              alt=""
            />

            <img
              src={logoArc}
              className="logo-arc"
              alt=""
            />
          </div>
          <svg
            className="logo-star-twinkle"
            viewBox="0 0 1045 335"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="logoStarFlash" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ccaff" stopOpacity="0.24" />
                <stop offset="42%" stopColor="#9ccaff" stopOpacity="0.72" />
                <stop offset="50%" stopColor="#9ccaff" stopOpacity="0.95" />
                <stop offset="58%" stopColor="#9ccaff" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#9ccaff" stopOpacity="0.24" />
              </linearGradient>
            </defs>
            <path
              className="logo-star-shape"
              d="M 804 10 C 800 48, 796 64, 768 76 C 796 88, 800 104, 804 142 C 808 104, 812 88, 840 76 C 812 64, 808 48, 804 10 Z"
              fill="url(#logoStarFlash)"
            />
          </svg>
          <img
            className="logo-a-outline"
            src={logoBase}
            alt=""
          />

          <svg
            className="arc-animation"
            viewBox="0 0 1045 335"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="starTrail"
                gradientUnits="userSpaceOnUse"
                x1="-160"
                y1="0"
                x2="0"
                y2="0"
              >
                <stop offset="0%" stopColor="#398BFA" stopOpacity="0.02" />
                <stop offset="32%" stopColor="#7cc0ff" stopOpacity="0.24" />
                <stop offset="68%" stopColor="#b5ddff" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#EAF6FF" stopOpacity="0.78" />
              </linearGradient>
            </defs>

            <path
              className="arc-trace"
              d={mirajArcPath}
              pathLength="1000"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1000"
                to="0"
                dur="1.052s"
                begin="arcFlight.begin+2.748s"
                fill="freeze"
              />
              <animate
                attributeName="stroke-opacity"
                values="1;1;0"
                keyTimes="0;0.65;1"
                dur="1.6s"
                begin="arcFlight.begin+2.748s"
                fill="freeze"
              />
            </path>

            <g className="star-flight">
              <path className="star-trail" d="M -160 0 L 0 0">
                <animate
                  attributeName="opacity"
                  values="1;1;0;0"
                  keyTimes="0;0.68;0.72312;1"
                  begin="arcFlight.begin"
                  dur="3.8s"
                  fill="freeze"
                />
              </path>
              <circle className="star-glow" cx="0" cy="0" r="5.5" />
              <circle className="star-core" cx="0" cy="0" r="2.8" />
              <animateMotion
                id="arcFlight"
                dur="3.8s"
                begin="0.4s"
                fill="freeze"
                rotate="auto"
                calcMode="linear"
                keyPoints="0;0.72312;1"
                keyTimes="0;0.72312;1"
                path={mirajFlightPath}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.05;0.95;1"
                begin="arcFlight.begin"
                dur="3.8s"
                fill="freeze"
              />
            </g>
          </svg>
        </div>

        <div className="hero-divider page-reveal" aria-hidden="true" />

        <h1 className="page-reveal">
          Ascend Beyond
          <br />
          the Known.
        </h1>

        <p className="hero-description page-reveal">
          Advancing ideas, developing technology, and exploring
          new possibilities through innovation.
        </p>

        <a href="#about" className="hero-link page-reveal">
          Discover Miraj <span>→</span>
        </a>
      </section>

      <section id="about" className="content-section page-reveal">
        <p className="eyebrow">WHO WE ARE</p>
        <h2>Driven by vision. Built for what's beyond.</h2>
        <p>
          Miraj is an independent parent company focused on
          developing ideas, building ventures, and pursuing
          opportunities across technology and innovation.
        </p>
      </section>

      <section id="ventures" className="content-section page-reveal">
        <p className="eyebrow">OUR VENTURES</p>
        <h2>Ideas into impact.</h2>
        <p>
          We create digital products and are expanding into new sites
          and ventures. WrenchRates is our current live platform.
        </p>
        <a
          className="venture-card"
          href="https://wrenchrates.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="venture-card-label">LIVE PLATFORM</span>
          <span className="venture-card-title">WrenchRates</span>
          <span className="venture-card-description">
            Real car repair prices from owners near you.
          </span>
          <span className="venture-card-link">
            Explore WrenchRates <span aria-hidden="true">↗</span>
          </span>
        </a>
      </section>

      <footer id="contact" className="page-reveal">
        <p className="eyebrow">GET IN TOUCH</p>
        <h2>Let's build what's next.</h2>
        <p>
          For business inquiries, partnerships, and new opportunities,
          connect with Miraj.
        </p>
        <p className="copyright">
          © 2026 Miraj LLC. All rights reserved.
        </p>
      </footer>

    </main>
  )
}

export default App
