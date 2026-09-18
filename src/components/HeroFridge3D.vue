<template>
  <div ref="wrap" class="hero3d" aria-label="Интерактивная 3D-модель холодильника"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const wrap = ref(null)
let renderer, scene, camera, fridge, frameId, resizeObserver
let mouseX = 0
let mouseY = 0
let targetMouseX = 0
let targetMouseY = 0
let scrollProgress = 0
let onPointerMove, onScroll

function roundedBox(width, height, depth, radius = 0.14, color = 0xe8f0ef) {
  const shape = new THREE.Shape()
  const x = -width / 2
  const y = -height / 2
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.045,
    bevelThickness: 0.045,
    bevelSegments: 4
  })
  geometry.center()
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.54,
    roughness: 0.22,
    clearcoat: 0.72,
    clearcoatRoughness: 0.24
  })
  return new THREE.Mesh(geometry, material)
}

function buildFridge() {
  const group = new THREE.Group()

  const body = roundedBox(2.25, 4.2, 1.25, 0.18, 0xdce8e7)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  const seam = new THREE.Mesh(
    new THREE.BoxGeometry(2.12, 0.035, 1.31),
    new THREE.MeshStandardMaterial({ color: 0x1f3031, metalness: 0.45, roughness: 0.25 })
  )
  seam.position.set(0, 0.35, 0.03)
  group.add(seam)

  const handleMat = new THREE.MeshPhysicalMaterial({ color: 0x131a1b, metalness: 0.85, roughness: 0.16 })
  const handle1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 1.24, 8, 16), handleMat)
  handle1.position.set(0.79, 1.05, 0.69)
  const handle2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.72, 8, 16), handleMat)
  handle2.position.set(0.79, -0.55, 0.69)
  group.add(handle1, handle2)

  const display = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.23, 0.045),
    new THREE.MeshPhysicalMaterial({
      color: 0x071314,
      emissive: 0x19e7d2,
      emissiveIntensity: 0.38,
      roughness: 0.18,
      metalness: 0.28
    })
  )
  display.position.set(-0.38, 1.2, 0.665)
  group.add(display)

  const logo = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.06, 0.025),
    new THREE.MeshStandardMaterial({ color: 0x6f8384, metalness: 0.62, roughness: 0.22 })
  )
  logo.position.set(-0.48, 1.63, 0.67)
  group.add(logo)

  const footMat = new THREE.MeshStandardMaterial({ color: 0x0d1516, metalness: 0.5, roughness: 0.42 })
  ;[-0.75, 0.75].forEach((x) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 18), footMat)
    foot.position.set(x, -2.18, 0.22)
    group.add(foot)
  })

  group.rotation.y = -0.32
  group.rotation.x = 0.03
  group.position.y = -0.02
  return group
}

function buildOrbitRings() {
  const rings = new THREE.Group()
  const material = new THREE.MeshBasicMaterial({ color: 0x1a5b58, transparent: true, opacity: 0.34 })
  ;[2.65, 3.05, 3.5].forEach((radius, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 8, 140), material.clone())
    ring.rotation.x = Math.PI / 2.38 + i * 0.08
    ring.rotation.z = i * 0.35
    rings.add(ring)
  })
  return rings
}

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 0.1, 8.8)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  wrap.value.appendChild(renderer.domElement)

  fridge = buildFridge()
  scene.add(fridge)

  const rings = buildOrbitRings()
  scene.add(rings)

  const ambient = new THREE.HemisphereLight(0xc9ffff, 0x030708, 2.15)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 4.5)
  key.position.set(-3.4, 5, 5.4)
  key.castShadow = true
  scene.add(key)

  const teal = new THREE.PointLight(0x00f5d4, 16, 12)
  teal.position.set(3.2, 1.6, 3)
  scene.add(teal)

  const blue = new THREE.PointLight(0x3c86ff, 11, 10)
  blue.position.set(-3.2, -1.2, 3)
  scene.add(blue)

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 64),
    new THREE.MeshBasicMaterial({ color: 0x062c2a, transparent: true, opacity: 0.28 })
  )
  floor.scale.y = 0.28
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -2.28
  scene.add(floor)

  const resize = () => {
    if (!wrap.value) return
    const { clientWidth, clientHeight } = wrap.value
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / Math.max(clientHeight, 1)
    camera.updateProjectionMatrix()
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(wrap.value)
  resize()

  onPointerMove = (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
  }
  onScroll = () => {
    scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  const clock = new THREE.Clock()
  const animate = () => {
    const t = clock.getElapsedTime()
    mouseX += (targetMouseX - mouseX) * 0.045
    mouseY += (targetMouseY - mouseY) * 0.045

    fridge.rotation.y += ((-0.32 + mouseX * 0.16 + scrollProgress * 0.32) - fridge.rotation.y) * 0.05
    fridge.rotation.x += ((0.03 - mouseY * 0.07 + scrollProgress * 0.04) - fridge.rotation.x) * 0.05
    fridge.position.y = Math.sin(t * 1.05) * 0.08 - scrollProgress * 0.28
    fridge.position.x = mouseX * 0.09 + scrollProgress * 0.22
    rings.rotation.z = t * 0.055
    rings.rotation.y = t * 0.025
    rings.position.y = Math.sin(t * 0.65) * 0.05

    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('scroll', onScroll)
  renderer?.dispose()
})
</script>
