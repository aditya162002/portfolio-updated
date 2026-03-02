import React, { useRef, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SciFiCharacter } from './SciFiCharacter'
import { CRTTv } from './CRTTv'

const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'

export function ComputerRoom({
  isRotating,
  setIsRotating,
  setCurrentStage,
  ...props
}) {
  const groupRef = useRef()
  const { scene } = useGLTF('/sci-fi_computer_room.glb', DRACO_CDN)

  // ── Make all screens plain black ──
  React.useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return

      if (child.material.name === 'Posters') {
        child.visible = false
        return
      }

      const n = child.name.toLowerCase()
      const m = (child.material.name || '').toLowerCase()

      const nameHit =
        n.includes('screen') || n.includes('monitor') || n.includes('display') ||
        n.includes('glass')  || n.includes('hologram') || n.includes('light') ||
        m.includes('screen') || m.includes('monitor') || m.includes('display') ||
        m.includes('emission') || m.includes('emit') || m.includes('glow') ||
        m.includes('hologram') || m.includes('light')

      const mat = child.material
      const hasEmissive    = mat.emissive && (mat.emissive.r > 0.05 || mat.emissive.g > 0.05 || mat.emissive.b > 0.05)
      const hasEmissiveMap = !!mat.emissiveMap
      const highIntensity  = (mat.emissiveIntensity || 0) > 0.1

      if (nameHit || hasEmissiveMap || (hasEmissive && highIntensity)) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#000000'),
          emissive: new THREE.Color('#000000'),
          emissiveIntensity: 0,
          roughness: 0.1,
          metalness: 0.1,
        })
      }
    })
  }, [scene])

  // Drag state refs
  const isDragging  = useRef(false)
  const prevPointer = useRef({ x: 0, y: 0 })
  const velocity    = useRef({ x: 0, y: 0 })

  const DAMPING     = 0.93
  const DRAG_SPEED  = 0.008
  const AUTO_ROTATE = 0.12

  const { gl } = useThree()

  // ── Use ONLY Pointer Events (handles both mouse & touch uniformly) ──
  const onPointerDown = useCallback((e) => {
    e.preventDefault()
    // Capture pointer so pointermove keeps firing even if finger leaves the element
    try { e.target.setPointerCapture(e.pointerId) } catch (_) {}
    isDragging.current = true
    setIsRotating(true)
    prevPointer.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
  }, [setIsRotating])

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const dx = e.clientX - prevPointer.current.x
    const dy = e.clientY - prevPointer.current.y
    velocity.current.y = dx * DRAG_SPEED
    velocity.current.x = dy * DRAG_SPEED * 0.4
    prevPointer.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback((e) => {
    try { e.target.releasePointerCapture(e.pointerId) } catch (_) {}
    isDragging.current = false
    setIsRotating(false)
  }, [setIsRotating])

  React.useEffect(() => {
    const c = gl.domElement
    // Pointer events cover mouse + touch + stylus in one unified API
    c.addEventListener('pointerdown',  onPointerDown, { passive: false })
    c.addEventListener('pointermove',  onPointerMove, { passive: false })
    c.addEventListener('pointerup',    onPointerUp)
    c.addEventListener('pointercancel', onPointerUp)
    c.addEventListener('pointerleave', onPointerUp)
    return () => {
      c.removeEventListener('pointerdown',   onPointerDown)
      c.removeEventListener('pointermove',   onPointerMove)
      c.removeEventListener('pointerup',     onPointerUp)
      c.removeEventListener('pointercancel', onPointerUp)
      c.removeEventListener('pointerleave',  onPointerUp)
    }
  }, [gl, onPointerDown, onPointerMove, onPointerUp])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (isDragging.current) {
      groupRef.current.rotation.y += velocity.current.y
      groupRef.current.rotation.x += velocity.current.x
    } else {
      if (Math.abs(velocity.current.y) > 0.0003 || Math.abs(velocity.current.x) > 0.0003) {
        groupRef.current.rotation.y += velocity.current.y
        groupRef.current.rotation.x += velocity.current.x
        velocity.current.y *= DAMPING
        velocity.current.x *= DAMPING
      } else {
        velocity.current.y = 0
        velocity.current.x = 0
        groupRef.current.rotation.y += AUTO_ROTATE * delta
      }
      groupRef.current.rotation.x *= 0.96
    }

    groupRef.current.rotation.x = THREE.MathUtils.clamp(
      groupRef.current.rotation.x, -0.4, 0.4
    )
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={scene} />
      <SciFiCharacter
        position={[0.06, -0.95, 1.1]}
        scale={0.85}
        rotation={[0, Math.PI, 0]}
      />
      {/* CRT TV in front of the treadmill */}
      <CRTTv
        position={[-1.12, -0.72, 1.05]}
        scale={1.05}
        rotation={[0, Math.PI * 0.1, 0]}
      />
    </group>
  )
}

useGLTF.preload('/sci-fi_computer_room.glb', DRACO_CDN)
