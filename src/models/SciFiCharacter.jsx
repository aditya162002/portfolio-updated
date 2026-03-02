import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations, Text } from '@react-three/drei'
import { useFrame, useGraph } from '@react-three/fiber'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
import * as THREE from 'three'

// ── Treadmill ─────────────────────────────────────────────────────────────────
function Treadmill() {
  const W = 0.58   // belt width
  const L = 1.89   // belt length (1.35 × 1.4)
  const H = 0.07   // belt thickness
  const railH = 0.55
  const railT = 0.032

  // Scrolling belt texture — horizontal stripes
  const beltTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 256
    const ctx = c.getContext('2d')
    for (let i = 0; i < 32; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#1e1e1e' : '#2e2e2e'
      ctx.fillRect(0, i * 8, 64, 8)
    }
    // Yellow edge markers
    ctx.fillStyle = '#ffcc00'
    ctx.fillRect(0, 0, 64, 3)
    ctx.fillRect(0, 253, 64, 3)
    const t = new THREE.CanvasTexture(c)
    t.wrapT = THREE.RepeatWrapping
    t.repeat.set(1, 2)
    return t
  }, [])

  // Display canvas — "AI RACE" panel
  const displayTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 160
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#000a1a'
    ctx.fillRect(0, 0, 256, 160)
    // Top label
    ctx.font = 'bold 28px monospace'
    ctx.fillStyle = '#00e5ff'
    ctx.textAlign = 'center'
    ctx.fillText('🤖  AI  RACE', 128, 38)
    // Divider
    ctx.fillStyle = '#00e5ff'
    ctx.fillRect(20, 52, 216, 2)
    // Speed
    ctx.font = 'bold 22px monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('SPEED: 12.4 km/h', 128, 82)
    // Distance
    ctx.font = '18px monospace'
    ctx.fillStyle = '#aaaaaa'
    ctx.fillText('DIST:  2.3 km', 128, 108)
    // Rank
    ctx.font = 'bold 20px monospace'
    ctx.fillStyle = '#ffcc00'
    ctx.fillText('RANK:  #1  🏆', 128, 138)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  // Scroll belt each frame
  useFrame((_, delta) => {
    beltTex.offset.y -= delta * 2.0
  })

  const metal = { color: '#999', metalness: 0.9, roughness: 0.15 }

  const screenY = H / 2 + railH + 0.11
  const screenZ = L / 3.5   // positive Z = in front of the character

  return (
    <group>
      {/* ── Cyan glow from the display screen ── */}
      <pointLight
        position={[0, screenY, screenZ - 0.08]}
        color="#00e5ff"
        intensity={1.2}
        distance={1.0}
        decay={2}
      />
      {/* ── Soft warm light on the runner ── */}
      <pointLight
        position={[0, H / 2 + 0.5, -0.1]}
        color="#ffffff"
        intensity={0.6}
        distance={1.2}
        decay={2}
      />

      {/* ── Belt ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[W, H, L]} />
        <meshStandardMaterial map={beltTex} />
      </mesh>

      {/* ── Frame base ── */}
      <mesh position={[0, -H / 2 - 0.022, 0]}>
        <boxGeometry args={[W + 0.09, 0.038, L + 0.09]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* ── Left rail ── */}
      <mesh position={[-W / 2 + 0.018, H / 2 + railH / 2, screenZ]}>
        <boxGeometry args={[railT, railH, railT]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* ── Right rail ── */}
      <mesh position={[W / 2 - 0.018, H / 2 + railH / 2, screenZ]}>
        <boxGeometry args={[railT, railH, railT]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* ── Handlebar ── */}
      <mesh position={[0, H / 2 + railH, screenZ]}>
        <boxGeometry args={[W - 0.05, railT, railT]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* ── Display housing ── */}
      <mesh position={[0, screenY, screenZ + 0.005]}>
        <boxGeometry args={[0.3, 0.19, 0.022]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── Display screen ── */}
      <mesh position={[0, screenY, screenZ - 0.012]}>
        <planeGeometry args={[0.27, 0.165]} />
        <meshStandardMaterial
          map={displayTex}
          emissiveMap={displayTex}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={1.8}
          roughness={0}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

// ── SciFiCharacter ────────────────────────────────────────────────────────────
export function SciFiCharacter({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF('/human.glb')

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  useGraph(clonedScene)

  const { actions } = useAnimations(animations, groupRef)

  useEffect(() => {
    if (!actions) return

    // Hard-kill TPose so it can NEVER blend in randomly
    if (actions['TPose']) {
      actions['TPose'].stop()
      actions['TPose'].enabled = false
      actions['TPose'].setEffectiveWeight(0)
    }

    // Play only Run (most movement), full weight
    const anim = actions['Run'] || actions['Walk'] || actions['Idle']
    if (anim) {
      anim.enabled = true
      anim.setEffectiveWeight(1)
      anim.reset().fadeIn(0.2).play()
    }

    return () => {
      Object.values(actions).forEach((a) => { if (a) { a.stop(); a.enabled = false } })
    }
  }, [actions])

  return (
    <group position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* Treadmill centered at feet level */}
      <Treadmill />
      {/* Character on belt — behind the handlebar */}
      <group ref={groupRef} position={[0, 0.06, -0.22]}>
      <primitive object={clonedScene} />
      </group>
    </group>
  )
}

useGLTF.preload('/human.glb')
