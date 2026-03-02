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

  const getXY = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const onDown = useCallback((e) => {
    if (e.cancelable) e.preventDefault()
    isDragging.current = true
    setIsRotating(true)
    const { x, y } = getXY(e)
    prevPointer.current = { x, y }
    velocity.current = { x: 0, y: 0 }
  }, [setIsRotating])

  const onMove = useCallback((e) => {
    if (!isDragging.current) return
    if (e.cancelable) e.preventDefault()
    const { x, y } = getXY(e)
    const dx = x - prevPointer.current.x
    const dy = y - prevPointer.current.y
    velocity.current.y = dx * DRAG_SPEED
    velocity.current.x = dy * DRAG_SPEED * 0.4
    prevPointer.current = { x, y }
  }, [])

  const onUp = useCallback(() => {
    isDragging.current = false
    setIsRotating(false)
  }, [setIsRotating])

  React.useEffect(() => {
    const c = gl.domElement
    c.addEventListener('pointerdown', onDown, { passive: false })
    c.addEventListener('pointermove', onMove, { passive: false })
    c.addEventListener('pointerup',   onUp)
    c.addEventListener('pointercancel', onUp)
    c.addEventListener('touchstart', onDown, { passive: false })
    c.addEventListener('touchmove',  onMove, { passive: false })
    c.addEventListener('touchend',   onUp)
    return () => {
      c.removeEventListener('pointerdown',   onDown)
      c.removeEventListener('pointermove',   onMove)
      c.removeEventListener('pointerup',     onUp)
      c.removeEventListener('pointercancel', onUp)
      c.removeEventListener('touchstart',    onDown)
      c.removeEventListener('touchmove',     onMove)
      c.removeEventListener('touchend',      onUp)
    }
  }, [gl, onDown, onMove, onUp])

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
