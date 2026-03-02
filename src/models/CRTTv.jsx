import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TICKER =
  '★  HELPING EARLY STAGE STARTUPS SHIP FAST  ·  0 → 1 PRODUCTS          ' +
  '>>>  FOUNDING ENGINEER  ·  BUILT MULTIPLAYER PLATFORMS  ·  AI PIPELINES          ' +
  '>>>  REACT  ·  NODE.JS  ·  AWS  ·  PYTHON  ·  TypeScript          ' +
  '>>>  GOT AN IDEA?  LET\'S BUILD IT TOGETHER  ·  aditya@bhadauria.dev          ' +
  '>>>  '

export function CRTTv({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const stateRef = useRef(null)

  // ── Create material imperatively — bypasses R3F reconciler ──
  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:             new THREE.Color('#000000'),
    emissive:          new THREE.Color('#ffffff'),
    emissiveIntensity: 1.1,
    roughness:         0.05,
    metalness:         0,
    toneMapped:        false,
  }), [])

  React.useEffect(() => {
    const W = 512, H = 420
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    const cx  = W / 2

    // Draw full static content straight onto main canvas first
    const drawStatic = (c) => {
      // Dark green base
      c.fillStyle = '#030f05'
      c.fillRect(0, 0, W, H)

      // Centre phosphor glow
      const glow = c.createRadialGradient(cx, H * 0.36, 0, cx, H * 0.36, W * 0.6)
      glow.addColorStop(0, 'rgba(0,110,30,0.6)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      c.fillStyle = glow
      c.fillRect(0, 0, W, H)

      // Channel tag
      c.textAlign    = 'right'
      c.textBaseline = 'top'
      c.font         = 'bold 13px monospace'
      c.fillStyle    = 'rgba(0,255,65,0.45)'
      c.fillText('ADI·TV  CH.1', W - 14, 14)

      // ── MAIN HEADLINE ──
      c.textAlign    = 'center'
      c.textBaseline = 'alphabetic'
      c.shadowColor  = '#00ff41'
      c.shadowBlur   = 24
      c.fillStyle    = '#00ff41'

      c.font = 'bold 82px Arial Black, Arial'
      c.fillText('HELPING', cx, 92)

      c.font = 'bold 62px Arial Black, Arial'
      c.fillStyle = '#55ffcc'
      c.fillText('EARLY STAGE', cx, 154)

      c.font = 'bold 82px Arial Black, Arial'
      c.fillStyle = '#00ff41'
      c.fillText('STARTUPS', cx, 216)
      c.shadowBlur = 0

      // ── Tagline ──
      c.font      = 'bold 17px Arial'
      c.fillStyle = 'rgba(130,235,150,0.7)'
      c.fillText('FULL STACK ENGINEER  ·  INDIA 🇮🇳', cx, 234)

      // Divider
      const div = c.createLinearGradient(0, 0, W, 0)
      div.addColorStop(0,   'rgba(0,255,65,0)')
      div.addColorStop(0.2, 'rgba(0,255,65,0.85)')
      div.addColorStop(0.8, 'rgba(0,255,65,0.85)')
      div.addColorStop(1,   'rgba(0,255,65,0)')
      c.fillStyle = div
      c.fillRect(0, 248, W, 2)

      // Ticker trough
      c.fillStyle = '#010a02'
      c.fillRect(0, 250, W, H - 250)

      // Scanlines
      for (let y = 0; y < H; y += 4) {
        c.fillStyle = 'rgba(0,0,0,0.16)'
        c.fillRect(0, y, W, 1)
      }

      // Edge vignette
      const vig = c.createRadialGradient(cx, H / 2, H * 0.2, cx, H / 2, H * 0.7)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.65)')
      c.fillStyle = vig
      c.fillRect(0, 0, W, H)
    }

    // Static bg canvas (redrawn cheaply each frame)
    const bg = document.createElement('canvas')
    bg.width = W; bg.height = H
    drawStatic(bg.getContext('2d'))

    // Draw initial frame on main canvas so texture isn't blank
    drawStatic(ctx)

    // Measure ticker
    ctx.font = 'bold 18px Arial'
    const textW = ctx.measureText(TICKER).width

    // Create texture from the already-drawn canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace  = THREE.SRGBColorSpace
    texture.minFilter   = THREE.LinearFilter
    texture.magFilter   = THREE.LinearFilter
    texture.needsUpdate = true

    // Attach directly to imperative material
    screenMat.emissiveMap  = texture
    screenMat.needsUpdate  = true

    stateRef.current = {
      ctx, canvas, bg, texture,
      W, H,
      tickerY: 252, tickerH: H - 252,
      tickerOffset: W, textW,
      ready: true,
    }

    return () => {
      texture.dispose()
      screenMat.emissiveMap = null
    }
  }, [screenMat])

  // ── Per-frame animation ──
  useFrame(() => {
    const s = stateRef.current
    if (!s?.ready) return
    const { ctx, bg, texture, W, H, tickerY, tickerH } = s

    // Repaint static layer
    ctx.drawImage(bg, 0, 0)

    // LIVE badge blink
    const blink = Math.floor(Date.now() / 700) % 2 === 0
    ctx.fillStyle    = blink ? '#cc0000' : '#660000'
    ctx.fillRect(12, 10, 68, 24)
    ctx.font         = 'bold 13px monospace'
    ctx.textAlign    = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle    = blink ? '#ffffff' : '#ff8888'
    ctx.fillText(blink ? '● LIVE' : '○ LIVE', 16, 22)

    // Ticker band
    ctx.fillStyle = '#010a02'
    ctx.fillRect(0, tickerY, W, tickerH)

    // Ticker top glow bar
    const bar = ctx.createLinearGradient(0, 0, W, 0)
    bar.addColorStop(0,   'rgba(0,255,65,0)')
    bar.addColorStop(0.15,'rgba(0,255,65,1)')
    bar.addColorStop(0.85,'rgba(0,255,65,1)')
    bar.addColorStop(1,   'rgba(0,255,65,0)')
    ctx.fillStyle = bar
    ctx.fillRect(0, tickerY, W, 2)

    // Scrolling ticker text
    ctx.save()
    ctx.beginPath()
    ctx.rect(6, tickerY + 4, W - 12, tickerH - 6)
    ctx.clip()
    ctx.font         = 'bold 18px Arial'
    ctx.fillStyle    = '#00ff41'
    ctx.textBaseline = 'middle'
    ctx.textAlign    = 'left'
    ctx.shadowColor  = '#00ff41'
    ctx.shadowBlur   = 6
    ctx.fillText(TICKER, s.tickerOffset, tickerY + tickerH / 2 + 1)
    ctx.restore()
    ctx.shadowBlur = 0

    s.tickerOffset -= 1.5
    if (s.tickerOffset < -(s.textW + 20)) s.tickerOffset = W

    texture.needsUpdate = true
  })

  const BW = 0.46, BH = 0.40, BD = 0.28
  const SW = 0.32, SH = 0.27

  return (
    <group position={position} scale={scale} rotation={rotation} dispose={null}>

      {/* Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BW, BH, BD]} />
        <meshStandardMaterial color="#ccc0a2" roughness={0.88} metalness={0.04} />
      </mesh>

      {/* CRT back bulge */}
      <mesh position={[0, 0, -BD / 2 - 0.06]} castShadow>
        <boxGeometry args={[BW * 0.72, BH * 0.68, 0.14]} />
        <meshStandardMaterial color="#b9ae92" roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Dark bezel */}
      <mesh position={[0, 0.018, BD / 2 + 0.001]}>
        <planeGeometry args={[SW + 0.06, SH + 0.06]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
      </mesh>

      {/* Screen — imperative material attached via primitive */}
      <mesh position={[0, 0.018, BD / 2 + 0.003]}>
        <planeGeometry args={[SW, SH]} />
        <primitive object={screenMat} attach="material" />
      </mesh>

      {/* Glass glare */}
      <mesh position={[-SW * 0.18, SH * 0.28 + 0.018, BD / 2 + 0.006]}>
        <planeGeometry args={[SW * 0.25, SH * 0.14]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.03} roughness={0} />
      </mesh>

      {/* Knobs */}
      <mesh position={[BW / 2 - 0.034, 0.07, BD / 2 + 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.016, 0.028, 10]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.5} metalness={0.45} />
      </mesh>
      <mesh position={[BW / 2 - 0.034, -0.025, BD / 2 + 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.016, 0.028, 10]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.5} metalness={0.45} />
      </mesh>

      {/* Speaker grille */}
      {[0.06, 0.03, 0, -0.03, -0.06].map((y, i) => (
        <mesh key={i} position={[BW / 2 - 0.078, y, BD / 2 + 0.001]}>
          <planeGeometry args={[0.005, 0.036]} />
          <meshStandardMaterial color="#8a8a7a" roughness={0.85} />
        </mesh>
      ))}

      {/* Feet */}
      <mesh position={[-BW / 3, -BH / 2 - 0.018, 0.03]} castShadow>
        <boxGeometry args={[0.068, 0.034, 0.092]} />
        <meshStandardMaterial color="#a09478" roughness={0.9} />
      </mesh>
      <mesh position={[BW / 3, -BH / 2 - 0.018, 0.03]} castShadow>
        <boxGeometry args={[0.068, 0.034, 0.092]} />
        <meshStandardMaterial color="#a09478" roughness={0.9} />
      </mesh>

      {/* Screen glow light */}
      <pointLight position={[0, 0.018, BD / 2 + 0.1]} color="#00ff41"
        intensity={0.15} distance={0.7} decay={2} />
    </group>
  )
}
