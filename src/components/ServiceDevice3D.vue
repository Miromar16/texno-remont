<template>
  <div
    ref="wrap"
    class="service-device3d"
    :aria-label="ariaLabel"
    role="img"
  ></div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  type: { type: String, required: true }
})

const labels = {
  fridge: '3D-модель холодильника',
  washer: '3D-модель стиральной машины',
  freezer: '3D-модель морозильника',
  microwave: '3D-модель бытовой техники'
}

const ariaLabel = computed(() => labels[props.type] || '3D-модель бытовой техники')
const wrap = ref(null)

let renderer
let scene
let camera
let device
let frameId
let resizeObserver
let onPointerMove
let onPointerLeave
let targetX = -0.28
let targetY = 0.06
let pointerX = 0
let pointerY = 0

const graphite = (color = 0x263234) => new THREE.MeshPhysicalMaterial({
  color,
  metalness: 0.72,
  roughness: 0.24,
  clearcoat: 0.55,
  clearcoatRoughness: 0.2
})

const dark = (color = 0x0a1112) => new THREE.MeshPhysicalMaterial({
  color,
  metalness: 0.5,
  roughness: 0.2,
  clearcoat: 0.45
})

const tealMat = () => new THREE.MeshStandardMaterial({
  color: 0x0b3b38,
  emissive: 0x18efd1,
  emissiveIntensity: 1.65,
  metalness: 0.24,
  roughness: 0.2
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
  return mesh
}

function buildFridge() {
  const g = new THREE.Group()
  const body = box(1.55, 2.85, 1.08, graphite(0x354345))
  g.add(body)

  const topDoor = box(1.48, 1.75, 0.09, graphite(0x414f51), 0, 0.48, 0.575)
  const bottomDoor = box(1.48, 0.88, 0.09, graphite(0x303d3f), 0, -0.9, 0.575)
  g.add(topDoor, bottomDoor)

  const seam = box(1.42, 0.025, 0.04, dark(), 0, -0.38, 0.64)
  g.add(seam)

  const handleMaterial = graphite(0x8b9898)
  const h1 = box(0.06, 1.03, 0.08, handleMaterial, 0.55, 0.48, 0.69)
  const h2 = box(0.06, 0.47, 0.08, handleMaterial, 0.55, -0.91, 0.69)
  g.add(h1, h2)

  const display = box(0.42, 0.21, 0.025, dark(0x031010), -0.28, 0.78, 0.645)
  const displayGlow = box(0.26, 0.025, 0.01, tealMat(), -0.28, 0.78, 0.665)
  g.add(display, displayGlow)

  g.rotation.y = -0.31
  g.scale.setScalar(1.12)
  return g
}

function buildWasher() {
  const g = new THREE.Group()
  const body = box(2.05, 2.25, 1.35, graphite(0x344144))
  body.position.y = -0.03
  g.add(body)

  const fascia = box(1.96, 0.47, 0.08, graphite(0x465456), 0, 0.78, 0.72)
  g.add(fascia)

  const doorFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.67, 0.12, 22, 64),
    graphite(0x667476)
  )
  doorFrame.position.set(0, -0.25, 0.76)
  g.add(doorFrame)

  const neonRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.026, 16, 64),
    tealMat()
  )
  neonRing.position.set(0, -0.25, 0.895)
  g.add(neonRing)

  const glass = cylinder(0.54, 0.08, new THREE.MeshPhysicalMaterial({
    color: 0x071719,
    transparent: true,
    opacity: 0.82,
    roughness: 0.08,
    metalness: 0.12,
    transmission: 0.12
  }), 0, -0.25, 0.79)
  g.add(glass)

  const drum = cylinder(0.42, 0.16, graphite(0x182728), 0, -0.25, 0.72)
  g.add(drum)

  const knob = cylinder(0.14, 0.11, graphite(0xb4c0bf), 0.43, 0.8, 0.82)
  g.add(knob)

  const screen = box(0.36, 0.17, 0.025, dark(0x021112), 0.72, 0.8, 0.82)
  const screenLine = box(0.2, 0.022, 0.01, tealMat(), 0.72, 0.8, 0.84)
  g.add(screen, screenLine)

  g.rotation.y = -0.27
  g.rotation.x = 0.035
  g.scale.setScalar(0.98)
  return g
}

function buildFreezer() {
  const g = new THREE.Group()
  const body = box(1.55, 2.82, 1.12, graphite(0x2f3e40))
  g.add(body)

  const door = box(1.47, 2.67, 0.09, graphite(0x3d4b4d), 0, 0.02, 0.59)
  g.add(door)

  const handle = box(0.065, 1.12, 0.08, graphite(0x9ba6a6), -0.54, 0.25, 0.69)
  g.add(handle)

  const screen = box(0.43, 0.25, 0.035, dark(0x020d0e), 0.25, 0.74, 0.655)
  const minus = box(0.12, 0.025, 0.008, tealMat(), 0.18, 0.74, 0.678)
  const one = box(0.025, 0.11, 0.008, tealMat(), 0.28, 0.74, 0.678)
  const eightTop = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 24), tealMat())
  eightTop.position.set(0.37, 0.785, 0.682)
  const eightBottom = eightTop.clone()
  eightBottom.position.y = 0.695
  g.add(screen, minus, one, eightTop, eightBottom)

  const ventMaterial = dark(0x10191a)
  for (let i = 0; i < 5; i++) {
    g.add(box(0.035, 0.26, 0.02, ventMaterial, 0.48 + i * 0.08, -1.08, 0.65))
  }

  g.rotation.y = 0.3
  g.scale.setScalar(1.08)
  return g
}

function buildMicrowave() {
  const g = new THREE.Group()
  const body = box(2.35, 1.45, 1.25, graphite(0x313f41))
  g.add(body)

  const door = box(1.55, 1.12, 0.08, dark(0x071011), -0.27, 0, 0.665)
  g.add(door)

  const windowGlow = box(1.23, 0.76, 0.018, new THREE.MeshStandardMaterial({
    color: 0x082220,
    emissive: 0x0f796e,
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.72
  }), -0.27, 0, 0.715)
  g.add(windowGlow)

  const panel = box(0.48, 1.12, 0.06, graphite(0x1d292b), 0.83, 0, 0.68)
  g.add(panel)

  const screen = box(0.3, 0.19, 0.025, dark(0x020f10), 0.83, 0.36, 0.72)
  const screenLine = box(0.18, 0.023, 0.01, tealMat(), 0.83, 0.36, 0.742)
  g.add(screen, screenLine)

  ;[0.13, -0.03, -0.19].forEach((y) => {
    const b = cylinder(0.045, 0.035, graphite(0xaab5b4), 0.83, y, 0.735)
    g.add(b)
  })

  const knob = cylinder(0.16, 0.09, graphite(0xa7b1b0), 0.83, -0.43, 0.73)
  g.add(knob)

  for (let i = 0; i < 5; i++) {
    const vent = box(0.035, 0.2, 0.018, dark(0x10191a), 1.05, -0.34 + i * 0.12, 0.1)
    vent.rotation.y = Math.PI / 2
    g.add(vent)
  }

  g.rotation.y = -0.2
  g.rotation.x = 0.02
  g.scale.setScalar(1.0)
  return g
}

function buildDevice() {
  if (props.type === 'washer') return buildWasher()
  if (props.type === 'freezer') return buildFreezer()
  if (props.type === 'microwave') return buildMicrowave()
  return buildFridge()
}

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50)
  camera.position.set(0, 0.05, props.type === 'microwave' ? 6.7 : 6.25)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  wrap.value.appendChild(renderer.domElement)

  device = buildDevice()
  scene.add(device)

  scene.add(new THREE.HemisphereLight(0xd8ffff, 0x020707, 2.1))

  const key = new THREE.DirectionalLight(0xffffff, 4.5)
  key.position.set(-3.5, 4.5, 5.5)
  key.castShadow = true
  scene.add(key)

  const teal = new THREE.PointLight(0x10efd1, 18, 9)
  teal.position.set(-2.5, -0.4, 3.4)
  scene.add(teal)

  const rim = new THREE.PointLight(0x4e91ff, 7.5, 8)
  rim.position.set(2.4, 1.4, 1.3)
  scene.add(rim)

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(props.type === 'microwave' ? 1.55 : 1.3, 64),
    new THREE.MeshBasicMaterial({ color: 0x0adac1, transparent: true, opacity: 0.16, depthWrite: false })
  )
  glow.scale.y = 0.24
  glow.rotation.x = -Math.PI / 2
  glow.position.y = props.type === 'microwave' ? -0.88 : -1.68
  glow.position.z = 0.1
  scene.add(glow)

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(props.type === 'microwave' ? 1.55 : 1.3, 64),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.28 })
  )
  floor.scale.y = 0.26
  floor.rotation.x = -Math.PI / 2
  floor.position.y = props.type === 'microwave' ? -0.9 : -1.7
  floor.receiveShadow = true
  scene.add(floor)

  const resize = () => {
    if (!wrap.value || !renderer) return
    const w = wrap.value.clientWidth || 1
    const h = wrap.value.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(wrap.value)
  resize()

  onPointerMove = (event) => {
    const rect = wrap.value.getBoundingClientRect()
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  }

  onPointerLeave = () => {
    pointerX = 0
    pointerY = 0
  }

  wrap.value.addEventListener('pointermove', onPointerMove, { passive: true })
  wrap.value.addEventListener('pointerleave', onPointerLeave, { passive: true })

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const clock = new THREE.Clock()

  const animate = () => {
    const t = clock.getElapsedTime()
    targetX += ((0.06 - pointerY * 0.08) - targetX) * 0.055
    targetY += ((-0.28 + pointerX * 0.2) - targetY) * 0.055

    device.rotation.x = targetX
    device.rotation.y = targetY
    device.position.y = reduceMotion ? 0 : Math.sin(t * 1.35) * 0.055

    renderer.render(scene, camera)
    frameId = requestAnimationFrame(animate)
  }
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  if (wrap.value) {
    wrap.value.removeEventListener('pointermove', onPointerMove)
    wrap.value.removeEventListener('pointerleave', onPointerLeave)
  }
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
