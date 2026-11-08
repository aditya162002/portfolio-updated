import Lenis from 'lenis'
import './style.css'

// Per scene: which face frame to show and what the speech bubble says.
// Scenes: Hello, About, Experience, Backgammon Galaxy, Amplytic, Results, Side projects, Toolkit, Off the clock, Contact
const FACES = [0, 1, 4, 1, 2, 3, 6, 5, 4, 7]
const QUIPS = [
  'Hi, I’m Aditya.',
  'Yes, you.',
  'Nailed it.',
  'Watch this.',
  'Hmm, let me think…',
  'Wait, really?',
  'Coffee first.',
  'Too many tools.',
  'Siuuu!',
  'Let’s talk.',
]
// Per scene: size/offset of the blue halo behind the head. The last one fills the screen.
const HALO = [
  { s: 1, x: 0, y: 0, ring: 0.35 },
  { s: 0.82, x: -0.08, y: 0.02, ring: 0.2 },
  { s: 0.95, x: 0.06, y: 0.02, ring: 0.45 },
  { s: 1.05, x: -0.04, y: 0, ring: 0.4 },
  { s: 1.12, x: 0, y: -0.02, ring: 0.55 },
  { s: 1.38, x: 0, y: 0, ring: 0.15 },
  { s: 1, x: -0.05, y: 0, ring: 0.35 },
  { s: 0.78, x: 0, y: 0.06, ring: 0.2 },
  { s: 1.2, x: 0.04, y: -0.02, ring: 0.5 },
  { s: 0, x: 0, y: 0, ring: 0 }, // s is set to "cover" in layout()
]

const $ = (s) => document.querySelector(s)
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))
const cl = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const sm = (v) => { v = cl(v); return v * v * (3 - 2 * v) }

// Split each big word into letters so they can animate one by one.
$$('[data-word]').forEach((w) => {
  w.innerHTML = [...w.textContent.trim()].map((c) => `<span data-l>${c}</span>`).join('')
})

const sceneEls = $$('[data-scene]')
const N = sceneEls.length
const sceneOf = (el) => sceneEls.indexOf(el.closest('[data-scene]'))

// Build the side dots from scene labels.
const index = $('[data-index]')
index.innerHTML = sceneEls
  .map((s, i) => `<a href="#" data-go="${i}" data-dot><span class="dl" data-dl>${s.dataset.label}</span><span class="dd" data-dd></span></a>`)
  .join('')
$$('[data-go="last"]').forEach((a) => (a.dataset.go = N - 1))

const E = {
  spacer: $('[data-spacer]'), progress: $('[data-progress]'), stage: $('[data-stage]'),
  halo: $('[data-halo]'), ring: $('[data-ring]'), face: $('[data-face]'), inner: $('[data-face-inner]'),
  frames: $$('[data-frame]'), bubble: $('[data-bubble]'), quip: $('[data-quip]'), hint: $('[data-hint]'),
  nav: $('[data-nav]'), cta: $('[data-cta]'), dots: $$('[data-dot]'),
  fill: $('[data-fill]'), track: $('[data-track]'),
  scenes: sceneEls.map((el) => ({ el, ks: $$('[data-k]', el), vis: null })),
  words: $$('[data-word]').map((el) => ({ el, ls: $$('[data-l]', el) })),
  orbit: $$('[data-orbit]').map((el) => ({ el, s: +el.dataset.orbit, a: (+el.dataset.a * Math.PI) / 180, r: +el.dataset.r, front: null })),
  rain: $$('[data-rain]').map((el, i) => ({ el, x: +el.dataset.x, y: +el.dataset.y, rot: +el.dataset.rot, i })),
  stepGroups: $$('[data-steps]').map((g) => ({ scene: sceneOf(g), steps: $$('[data-step]', g), last: -1 })),
  counts: $$('[data-count]'),
  cos: $$('[data-co]'),
}
const S = {
  fill: E.fill ? sceneOf(E.fill) : -1,
  track: E.track ? sceneOf(E.track) : -1,
  counts: E.counts.length ? sceneOf(E.counts[0]) : -1,
  rain: sceneEls.findIndex((s) => s.dataset.label === 'Toolkit'),
  co: $('[data-cos]') ? sceneOf($('[data-cos]')) : -1,
}

let lastCo = -2
let cur = 0, vel = 0, lastY = 0, mx = 0, my = 0, tx = 0, ty = 0, dark = null, lastK = -1
let narrow, vw, vh, fh, sh, head, D, cover, trackMax = 0
const t0 = performance.now()
const cache = new Map()
const set = (el, k, v) => {
  const m = cache.get(el) || {}
  if (m[k] === v) return
  m[k] = v; cache.set(el, m); el.style[k] = v
}

E.frames.forEach((f) => { const i = new Image(); i.src = f.src })

function layout() {
  vw = innerWidth; vh = innerHeight; narrow = vw < 820
  fh = narrow ? Math.min(vh * 0.44, vw * 0.98) : Math.max(320, Math.min(vh * 0.64, 620, vw * 0.4))
  E.face.style.width = E.face.style.height = fh + 'px'
  E.stage.style.setProperty('--cols', narrow ? 'minmax(0,1fr)' : `minmax(0,1fr) ${Math.round(fh * 0.84)}px minmax(0,1fr)`)
  E.stage.style.setProperty('--spacer', narrow ? 'none' : 'block')
  E.stage.style.setProperty('--wide', narrow ? 'none' : 'flex')
  E.stage.style.setProperty('--phone', narrow ? 'block' : 'none')
  E.stage.style.setProperty('--idx', narrow ? '0px' : '96px') // room for the side menu labels
  sh = vh * 1.35
  E.spacer.style.height = (N - 1) * sh + vh + 'px'
  head = { x: vw / 2, y: vh - fh * 0.62 }
  D = fh * 0.9
  E.halo.style.width = E.halo.style.height = D + 'px'
  E.ring.style.width = E.ring.style.height = D + 'px'
  cover = (Math.hypot(vw, vh) * 2.1) / D
  HALO[N - 1].s = cover
  E.bubble.style.left = vw / 2 + fh * (narrow ? 0.14 : 0.24) + 'px'
  E.bubble.style.top = vh - fh * (narrow ? 1.0 : 0.6) + 'px'
  E.orbit.forEach((o) => { o.w = o.el.offsetWidth; o.h = o.el.offsetHeight })
  if (E.track) trackMax = Math.max(0, E.track.scrollHeight - E.track.parentElement.clientHeight)
  cache.clear()
}

function swap(i) {
  const f = FACES[i] ?? 0
  E.frames.forEach((el, j) => (el.style.opacity = j === f ? '1' : '0'))
  E.inner.animate(
    [{ transform: 'scale(1,1)' }, { transform: 'scale(1.05,.93)', offset: 0.28 }, { transform: 'scale(.97,1.04)', offset: 0.6 }, { transform: 'scale(1,1)' }],
    { duration: 520, easing: 'cubic-bezier(.3,.7,.2,1)', composite: 'add' },
  )
  E.quip.textContent = QUIPS[i] ?? ''
  E.bubble.animate(
    [{ transform: 'scale(.2) rotate(-12deg)', opacity: 0 }, { transform: 'scale(1.08) rotate(2deg)', opacity: 1, offset: 0.6 }, { transform: 'scale(1) rotate(0)', opacity: 1 }],
    { duration: 480, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'both' },
  )
  E.halo.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)' }], { duration: 500 })
}

const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false })

layout()
addEventListener('resize', layout)
addEventListener('mousemove', (e) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1 })
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('[data-go]')
  if (!a) return
  e.preventDefault()
  const i = +a.dataset.go
  lenis.scrollTo(i * sh + (i ? sh * 0.12 : 0), { duration: 1.6 })
})
// Fonts change chip widths, so measure again once they load.
document.fonts && document.fonts.ready.then(layout)

function tick(now) {
  requestAnimationFrame(tick)
  lenis.raf(now)
  const y = lenis.animatedScroll
  vel += (y - lastY - vel) * 0.15; lastY = y
  const P = y / sh, time = (now - t0) / 1000
  const intro = (k) => sm((time - 0.25 - k * 0.09) / 0.7)

  const c = Math.max(0, Math.min(N - 1, Math.floor(P + 0.3)))
  if (c !== cur) { cur = c; swap(c) }

  set(E.progress, 'transform', `scaleX(${(P / (N - 1)).toFixed(4)})`)

  // Scene text in and out
  E.scenes.forEach((s, i) => {
    const t = P - i, last = i === N - 1
    const on = t > -0.45 && (last || t < 1.05)
    if (on !== s.vis) { s.vis = on; s.el.style.visibility = on ? 'visible' : 'hidden' }
    if (!on) return
    s.el.style.pointerEvents = t > -0.08 && (last || t < 0.7) ? 'auto' : 'none'
    s.ks.forEach((el, k) => {
      const e = i === 0 ? intro(k) : sm((t + 0.34) / 0.3 - k * 0.065)
      const x = last ? 0 : sm((t - 0.55) / 0.25 - k * 0.035)
      set(el, 'transform', `translate3d(0,${((1 - e) * 64 - x * 46).toFixed(1)}px,0)`)
      set(el, 'opacity', (e * (1 - x)).toFixed(3))
    })
  })

  // Big words
  E.words.forEach((w, i) => {
    const t = P - i, last = i === N - 1
    if (t < -0.6 || (!last && t > 1.1)) { set(w.el, 'visibility', 'hidden'); return }
    set(w.el, 'visibility', 'visible')
    set(w.el, 'transform', `translate3d(${((0.3 - t) * 6).toFixed(2)}vw,0,0) skewX(${cl(-vel * 0.25, -12, 12).toFixed(2)}deg)`)
    w.ls.forEach((l, j) => {
      const e = i === 0 ? intro(j * 0.6 + 0.5) : sm((t + 0.42) / 0.3 - j * 0.06)
      const x = last ? 0 : sm((t - 0.5) / 0.3 - j * 0.05)
      set(l, 'transform', `translate3d(0,${((1 - e) * 105 - x * 105).toFixed(1)}%,0)`)
    })
  })

  // Halo + ring
  const i0 = Math.max(0, Math.min(N - 1, Math.floor(P))), i1 = Math.min(N - 1, i0 + 1)
  const a = i0 === i1 ? 0 : sm((P - i0 - 0.55) / 0.45)
  const lerp = (p, q) => p + (q - p) * a
  let hs = lerp(HALO[i0].s, HALO[i1].s); if (P < 0) hs = 1
  const hIntro = sm((time - 0.1) / 0.9)
  hs *= (0.6 + 0.4 * hIntro) * (1 + Math.sin(time * 1.4) * 0.012)
  const hx = head.x + lerp(HALO[i0].x, HALO[i1].x) * fh, hy = head.y + lerp(HALO[i0].y, HALO[i1].y) * fh
  set(E.halo, 'transform', `translate3d(${(hx - D / 2).toFixed(1)}px,${(hy - D / 2).toFixed(1)}px,0) scale(${hs.toFixed(4)})`)
  const rs = Math.min(hs, 1.5) * 1.2
  set(E.ring, 'transform', `translate3d(${(hx - D / 2).toFixed(1)}px,${(hy - D / 2).toFixed(1)}px,0) scale(${rs.toFixed(4)}) rotate(${(P * 70 + time * 6).toFixed(2)}deg)`)
  set(E.ring, 'opacity', (lerp(HALO[i0].ring, HALO[i1].ring) * hIntro).toFixed(3))

  // Nav turns white on the blue contact screen
  const d = P > N - 1.42
  if (d !== dark) {
    dark = d
    E.nav.style.color = d ? '#FFFFFF' : '#141413'
    E.cta.style.background = d ? '#FFFFFF' : '#141413'; E.cta.style.color = d ? '#0B72D9' : '#F2F1EC'
    E.dots.forEach((el) => { el.style.color = d ? '#FFFFFF' : '#141413'; el.querySelector('[data-dd]').style.background = d ? '#FFFFFF' : '#141413' })
  }
  E.dots.forEach((el, i) => {
    const on = i === cur
    set(el.querySelector('[data-dl]'), 'opacity', on ? '1' : '0')
    set(el.querySelector('[data-dd]'), 'transform', on ? 'scale(1.8)' : 'scale(1)')
  })

  // Orbiting chips
  const rx = fh * (narrow ? 0.5 : 0.62), ry = fh * 0.36
  E.orbit.forEach((o, k) => {
    const t = P - o.s
    const v = (o.s === 0 ? intro(3 + k) : sm((t + 0.3) / 0.3 - k * 0.05)) * (1 - sm((t - 0.5) / 0.25))
    if (v <= 0.001) { set(o.el, 'opacity', '0'); set(o.el, 'visibility', 'hidden'); return }
    set(o.el, 'visibility', 'visible')
    const ang = o.a + t * 1.6 + time * 0.12
    const px = head.x + Math.cos(ang) * rx * o.r - o.w / 2, py = head.y - fh * 0.06 + Math.sin(ang) * ry * o.r - o.h / 2
    const front = Math.sin(ang) > 0.15
    if (front !== o.front) { o.front = front; o.el.style.zIndex = front ? '6' : '3' }
    const sc = (0.7 + 0.3 * v) * (front ? 1.06 : 0.92)
    set(o.el, 'transform', `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0) scale(${sc.toFixed(3)})`)
    set(o.el, 'opacity', (v * (front ? 1 : 0.75)).toFixed(3))
  })

  // Falling tool chips
  if (S.rain >= 0) {
    const t = P - S.rain
    E.rain.forEach((r) => {
      const fall = sm((t + 0.32) / 0.38 - r.i * 0.035), out = sm((t - 0.55) / 0.25)
      if (!(fall > 0 && out < 1)) { set(r.el, 'visibility', 'hidden'); return }
      set(r.el, 'visibility', 'visible')
      const bx = narrow ? (r.x < 50 ? r.x * 0.9 : r.x * 0.9 + 6) : r.x
      const left = (bx / 100) * vw, bottom = r.y * (narrow ? 0.7 : 1) + 12
      const yy = (1 - Math.pow(fall, 0.6)) * -(vh + 100) + out * (vh * 0.6)
      const bounce = fall > 0.85 ? Math.sin(((fall - 0.85) / 0.15) * Math.PI) * -10 : 0
      set(r.el, 'transform', `translate3d(${left.toFixed(1)}px,${(vh - bottom - 40 + yy + bounce).toFixed(1)}px,0) rotate(${(r.rot * fall + (1 - fall) * r.rot * 6).toFixed(2)}deg)`)
      set(r.el, 'opacity', (Math.min(1, fall * 3) * (1 - out)).toFixed(3))
    })
  }

  // About text fills in as you scroll
  if (E.fill) { const t = P - S.fill; set(E.fill, 'backgroundSize', `${(sm((t + 0.05) / 0.5) * 100).toFixed(1)}% 100%, 100% 100%`) }

  // Step lists highlight one step at a time
  E.stepGroups.forEach((g) => {
    const t = P - g.scene, st = Math.min(g.steps.length - 1, Math.floor(cl((t + 0.05) / 0.55) * g.steps.length))
    if (st !== g.last) { g.last = st; g.steps.forEach((s, i) => (s.style.filter = i === st ? 'none' : 'opacity(.38)')) }
  })

  // Experience: light up one company at a time, with a glare sweep on each switch
  if (S.co >= 0) {
    const t = P - S.co
    const co = t < -0.3 || t > 0.9 ? -1 : Math.min(2, Math.floor(cl(t / 0.5) * 3))
    if (co !== lastCo) {
      lastCo = co
      E.cos.forEach((el) => {
        const on = +el.dataset.co === co
        el.classList.toggle('co-on', on)
        el.classList.toggle('co-off', co >= 0 && !on)
        el.classList.remove('glare')
        if (on) { void el.offsetWidth; el.classList.add('glare') }
      })
    }
  }

  // Count-up numbers
  if (S.counts >= 0) {
    const k = sm((P - S.counts + 0.25) / 0.5)
    if (k !== lastK) {
      lastK = k
      E.counts.forEach((el) => {
        const end = +el.dataset.count, dec = +(el.dataset.dec || 0)
        let v = (end * k).toFixed(dec)
        if (el.dataset.sep) v = Math.round(+v).toLocaleString('en-US')
        if (el.dataset.suffix) v = Math.round(+v) + el.dataset.suffix
        el.textContent = v
      })
    }
  }

  // Work cards scroll inside their box
  if (E.track) { const t = P - S.track; set(E.track, 'transform', `translate3d(0,${(-sm((t + 0.05) / 0.55) * trackMax).toFixed(1)}px,0)`) }

  if (E.hint && P < 0.5) E.hint.style.transform = `scaleY(${(0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 3))).toFixed(3)})`

  // Face follows the mouse a little
  tx += (mx - tx) * 0.06; ty += (my - ty) * 0.06
  const fIn = sm((time - 0.05) / 0.9)
  const bob = Math.sin(time * 1.6) * fh * 0.006
  set(E.face, 'transform', `translateX(-50%) translate3d(0,${((1 - fIn) * fh * 0.5 + bob).toFixed(1)}px,0)`)
  set(E.face, 'opacity', fIn.toFixed(3))
  E.inner.style.transform = `rotateY(${(tx * 7).toFixed(2)}deg) rotateX(${(-ty * 3).toFixed(2)}deg) rotate(${cl(vel * 0.04, -3, 3).toFixed(2)}deg)`
}
requestAnimationFrame(tick)
