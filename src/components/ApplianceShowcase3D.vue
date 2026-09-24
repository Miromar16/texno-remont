<template>
  <div class="appliance-showcase3d" role="img" aria-label="Интерактивная 3D-сцена бытовой техники">
    <div ref="wrap" class="appliance-showcase3d__canvas"></div>
    <div class="appliance-showcase3d__chip chip-a">Холодильники</div>
    <div class="appliance-showcase3d__chip chip-b">Стиральные машины</div>
    <div class="appliance-showcase3d__chip chip-c">Бытовая техника</div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const wrap = ref(null)

let renderer
let scene
let camera
let rig
let fridge
let washer
let microwave
let frameId
let resizeObserver
let onPointerMove
let onPointerLeave

let pointerX = 0
let pointerY = 0
let targetPointerX = 0
let targetPointerY = 0

const graphite = (color = 0x273436) => new THREE.MeshPhysicalMaterial({
  color,
  metalness: 0.62,
  roughness: 0.22,
  clearcoat: 0.64,
  clearcoatRoughness: 0.2
})

const lightMetal = (color = 0xd9e5e3) => new THREE.MeshPhysicalMaterial({
  color,
  metalness: 0.46,
  roughness: 0.2,
  clearcoat: 0.78,
  clearcoatRoughness: 0.18
})

const dark = (color = 0x091112) => new THREE.MeshPhysicalMaterial({
  color,
  metalness: 0.5,
  roughness: 0.18,
  clearcoat: 0.48
})

const tealMat = (intensity = 1.45) => new THREE.MeshStandardMaterial({
  color: 0x0b403a,
  emissive: 0x19efd2,
  emissiveIntensity: intensity,
  metalness: 0.24,
  roughness: 0.18
})

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 3, 3, 3), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function cylinder(r, depth, material, x = 0, y = 0, z = 0, rx = Math.PI / 2) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 48), material)
  mesh.position.set(x, y, z)
  mesh.rotation.x = rx
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function roundedBox(width, height, depth, radius = 0.12, material = lightMetal()) {
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
    bevelSize: 0.035,
    bevelThickness: 0.035,
    bevelSegments: 4
  })
  geometry.center()

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function buildFridge() {
  const g = new THREE.Group()

  const body = roundedBox(1.78, 3.3, 1.15, 0.14, lightMetal(0xdce8e7))
  g.add(body)

  const topDoor = roundedBox(1.68, 1.84, 0.095, 0.09, lightMetal(0xe9f0ef))
  topDoor.position.set(0, 0.62, 0.615)
  g.add(topDoor)

  const bottomDoor = roundedBox(1.68, 1.18, 0.095, 0.09, lightMetal(0xd6e2e1))
  bottomDoor.position.set(0, -0.92, 0.615)
  g.add(bottomDoor)

  const seam = box(1.56, 0.025, 0.035, dark(0x1c2a2b), 0, -0.23, 0.675)
  g.add(seam)

  const handleMat = graphite(0x0d1516)
  g.add(
    box(0.06, 0.95, 0.075, handleMat, 0.61, 0.62, 0.705),
    box(0.06, 0.54, 0.075, handleMat, 0.61, -0.93, 0.705)
  )

  const display = box(0.42, 0.22, 0.025, dark(0x061011), -0.32, 0.86, 0.69)
  const glow = box(0.26, 0.028, 0.012, tealMat(1.7), -0.32, 0.86, 0.707)
  g.add(display, glow)

  g.position.set(1.12, 0.24, -0.42)
  g.rotation.y = -0.23
  g.rotation.x = 0.025
  g.scale.setScalar(1.08)
  return g
}

function buildWasher() {
  const g = new THREE.Group()

  const body = roundedBox(2.05, 2.08, 1.28, 0.11, graphite(0x354244))
  g.add(body)

  const fascia = box(1.9, 0.42, 0.09, graphite(0x465456), 0, 0.7, 0.69)
  g.add(fascia)

  const doorFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.63, 0.115, 20, 64),
    graphite(0x798687)
  )
  doorFrame.position.set(0, -0.26, 0.72)
  doorFrame.castShadow = true
  g.add(doorFrame)

  const neonRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.54, 0.026, 16, 64),
    tealMat(1.75)
  )
  neonRing.position.set(0, -0.26, 0.84)
  g.add(neonRing)

  const glass = cylinder(0.5, 0.075, new THREE.MeshPhysicalMaterial({
    color: 0x071719,
    transparent: true,
    opacity: 0.86,
    roughness: 0.08,
    metalness: 0.1,
    transmission: 0.08
  }), 0, -0.26, 0.77)
  g.add(glass)

  const knob = cylinder(0.13, 0.1, graphite(0xaab6b5), 0.38, 0.72, 0.8)
  const screen = box(0.34, 0.16, 0.025, dark(0x031011), 0.68, 0.72, 0.8)
  const line = box(0.19, 0.022, 0.012, tealMat(1.7), 0.68, 0.72, 0.82)
  g.add(knob, screen, line)

  g.position.set(-1.17, -0.72, 0.38)
  g.rotation.y = 0.24
  g.rotation.x = 0.035
  g.scale.setScalar(0.82)
  return g
}

function buildMicrowave() {
  const g = new THREE.Group()

  const body = roundedBox(2.15, 1.28, 1.14, 0.09, graphite(0x313f41))
  g.add(body)

  const door = box(1.42, 0.96, 0.075, dark(0x071011), -0.27, 0, 0.61)
  g.add(door)

  const glassGlow = box(1.1, 0.66, 0.016, new THREE.MeshStandardMaterial({
    color: 0x082220,
    emissive: 0x0e776d,
    emissiveIntensity: 0.54,
    transparent: true,
    opacity: 0.72
  }), -0.27, 0, 0.66)
  g.add(glassGlow)

  const panel = box(0.43, 0.96, 0.055, graphite(0x1d292b), 0.76, 0, 0.63)
  const screen = box(0.27, 0.17, 0.02, dark(0x020f10), 0.76, 0.3, 0.665)
  const screenLine = box(0.16, 0.021, 0.01, tealMat(1.65), 0.76, 0.3, 0.682)
  g.add(panel, screen, screenLine)

  ;[0.08, -0.08].forEach((y) => {
    g.add(cylinder(0.043, 0.03, graphite(0xb0b9b8), 0.76, y, 0.675))
  })
  g.add(cylinder(0.14, 0.08, graphite(0xaab4b3), 0.76, -0.34, 0.67))

 g.position.set(1.38, -1.02, 0.62)
g.rotation.y = -0.28
g.rotation.x = 0.03
g.scale.setScalar(0.62)
  return g
}

function buildOrbitRings() {
  const rings = new THREE.Group()
  ;[2.5, 3.05, 3.58].forEach((radius, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.008, 8, 150),
      new THREE.MeshBasicMaterial({
        color: i === 1 ? 0x20c9b5 : 0x26645f,
        transparent: true,
        opacity: i === 1 ? 0.28 : 0.18
      })
    )
    ring.rotation.x = Math.PI / 2.26 + i * 0.055
    ring.rotation.z = i * 0.42
    rings.add(ring)
  })
  rings.position.set(0.42, -0.12, -0.75)
  return rings
}

function buildCenterBadge() {
  const group = new THREE.Group()

  const outer = new THREE.Mesh(
    new THREE.TorusGeometry(0.47, 0.045, 18, 80),
    tealMat(1.35)
  )
  outer.rotation.x = Math.PI / 2
  group.add(outer)

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.43, 0.43, 0.12, 64),
    dark(0x102526)
  )
  core.rotation.x = Math.PI / 2
  group.add(core)

  const wrench = new THREE.Group()
  const shaft = box(0.12, 0.72, 0.08, lightMetal(0xc5d2d0))
  shaft.rotation.z = -0.7
  const head = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.055, 12, 32, Math.PI * 1.4),
    lightMetal(0xc5d2d0)
  )
  head.rotation.z = 0.9
  head.position.set(-0.23, 0.26, 0.04)
  wrench.add(shaft, head)
  wrench.position.z = 0.12
  group.add(wrench)

  group.position.set(0.1, -0.15, 1.15)
  group.rotation.x = 0.06
  return group
}

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(31, 1, 0.1, 60)
  camera.position.set(0.15, 0.08, 8.6)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  wrap.value.appendChild(renderer.domElement)

  rig = new THREE.Group()
  fridge = buildFridge()
  washer = buildWasher()
  microwave = buildMicrowave()
  rig.add(fridge, washer, microwave)
  scene.add(rig)

  const rings = buildOrbitRings()
  scene.add(rings)

  const badge = buildCenterBadge()
  scene.add(badge)

  const ambient = new THREE.HemisphereLight(0xe5ffff, 0x071011, 2.25)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 4.3)
  key.position.set(-3.6, 5.2, 5.8)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  scene.add(key)

  const teal = new THREE.PointLight(0x13efd1, 15, 11)
  teal.position.set(3.1, 1.2, 3.7)
  scene.add(teal)

  const blue = new THREE.PointLight(0x4f8cff, 8.5, 10)
  blue.position.set(-3.2, -1.2, 2.4)
  scene.add(blue)

  const floorGlow = new THREE.Mesh(
    new THREE.CircleGeometry(2.65, 72),
    new THREE.MeshBasicMaterial({
      color: 0x0adac1,
      transparent: true,
      opacity: 0.12,
      depthWrite: false
    })
  )
  floorGlow.scale.y = 0.25
  floorGlow.rotation.x = -Math.PI / 2
  floorGlow.position.set(0.1, -1.95, 0.2)
  scene.add(floorGlow)

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.45, 72),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.24 })
  )
  floor.scale.y = 0.24
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0.1, -1.98, 0.18)
  floor.receiveShadow = true
  scene.add(floor)

  const resize = () => {
    if (!wrap.value || !renderer) return
    const width = wrap.value.clientWidth || 1
    const height = wrap.value.clientHeight || 1
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(wrap.value)
  resize()

  onPointerMove = (event) => {
    const rect = wrap.value.getBoundingClientRect()
    targetPointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    targetPointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  }

  onPointerLeave = () => {
    targetPointerX = 0
    targetPointerY = 0
  }

  wrap.value.addEventListener('pointermove', onPointerMove, { passive: true })
  wrap.value.addEventListener('pointerleave', onPointerLeave, { passive: true })

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const clock = new THREE.Clock()

  const animate = () => {
    const t = clock.getElapsedTime()

    pointerX += (targetPointerX - pointerX) * 0.045
    pointerY += (targetPointerY - pointerY) * 0.045

    rig.rotation.y += ((pointerX * 0.105) - rig.rotation.y) * 0.045
    rig.rotation.x += ((-pointerY * 0.045) - rig.rotation.x) * 0.045

    if (!reduceMotion) {
      fridge.position.y = 0.24 + Math.sin(t * 0.92) * 0.055
      washer.position.y = -0.72 + Math.sin(t * 1.08 + 1.2) * 0.045
      microwave.position.y = -1.05 + Math.sin(t * 1.18 + 2.1) * 0.045
      rings.rotation.z = t * 0.045
      rings.rotation.y = t * 0.018
      badge.rotation.z = Math.sin(t * 0.55) * 0.045
    }

    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }

  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  wrap.value?.removeEventListener('pointermove', onPointerMove)
  wrap.value?.removeEventListener('pointerleave', onPointerLeave)

  scene?.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose?.()
    if (obj.material) {
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      materials.forEach((material) => material.dispose?.())
    }
  })

  renderer?.dispose()
})
</script>

<style scoped>
.appliance-showcase3d {
  position: relative;
  width: 100%;
  min-height: 600px;
  overflow: hidden;
  border-radius: 34px;
  background:
    radial-gradient(circle at 64% 34%, rgba(34,240,208,.18), transparent 35%),
    rgba(255,255,255,.025);
}

.appliance-showcase3d__canvas {
  position: absolute;
  inset: 0;
}

.appliance-showcase3d__chip {
  position: absolute;
  z-index: 3;
  padding: 9px 13px;
  border: 1px solid rgba(11, 36, 36, .12);
  border-radius: 999px;
  color: #38514d;
  background: rgba(255,255,255,.64);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 30px rgba(29,55,50,.07);
  font: 600 10px/1 'Inter', system-ui, sans-serif;
  letter-spacing: .08em;
  text-transform: uppercase;
  pointer-events: none;
}

.chip-a { top: 14%; right: 5%; }
.chip-b { bottom: 17%; left: 4%; }
.chip-c { bottom: 12%; right: 10%; }

@media (max-width: 980px) {
  .appliance-showcase3d {
    min-height: 540px;
  }
}

@media (max-width: 640px) {
  .appliance-showcase3d {
    min-height: 430px;
    border-radius: 24px;
  }

  .appliance-showcase3d__chip {
    padding: 7px 10px;
    font-size: 8px;
  }

  .chip-a { top: 8%; right: 2%; }
  .chip-b { bottom: 14%; left: 2%; }
  .chip-c { bottom: 8%; right: 3%; }
}
</style>
