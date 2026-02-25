import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  animationRegistry,
  captureRestPose,
  type AnimationClip,
  type AnimatableRefs,
  type RestPose,
} from './animations'
import { buildPlaceholderModel } from './placeholder-model'

function collectSkeletonBones(root: THREE.Object3D): THREE.Bone[] {
  const bones: THREE.Bone[] = []
  const seen = new Set<number>()
  root.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
      const skeleton = (child as THREE.SkinnedMesh).skeleton
      if (skeleton) {
        for (const bone of skeleton.bones) {
          if (!seen.has(bone.id)) {
            seen.add(bone.id)
            bones.push(bone)
          }
        }
      }
    }
  })
  return bones
}

function findBone(bones: THREE.Bone[], names: string[]): THREE.Bone | null {
  for (const bone of bones) {
    if (names.includes(bone.name)) return bone
  }
  for (const bone of bones) {
    for (const name of names) {
      if (bone.name.startsWith(name)) return bone
    }
  }
  const lower = names.map((n) => n.toLowerCase())
  for (const bone of bones) {
    const boneLower = bone.name.toLowerCase()
    for (const name of lower) {
      if (boneLower.startsWith(name)) return bone
    }
  }
  return null
}

function extractRefsFromGLTF(model: THREE.Group): AnimatableRefs {
  const bones = collectSkeletonBones(model)
  const hips = findBone(bones, [
    'Hips', 'hips', 'J_Bip_C_Hips', 'mixamorigHips',
    'Pelvis', 'pelvis', 'Root', 'root',
  ])
  const head = findBone(bones, [
    'Head', 'head', 'J_Bip_C_Head', 'mixamorigHead',
  ])
  const leftArm = findBone(bones, [
    'Left arm', 'Left_arm', 'LeftArm', 'leftArm',
    'J_Bip_L_UpperArm', 'mixamorigLeftArm', 'arm_L', 'Arm.L',
    'Left shoulder', 'Left_shoulder',
  ])
  const rightArm = findBone(bones, [
    'Right arm', 'Right_arm', 'RightArm', 'rightArm',
    'J_Bip_R_UpperArm', 'mixamorigRightArm', 'arm_R', 'Arm.R',
    'Right shoulder', 'Right_shoulder',
  ])
  return {
    root: model,
    hips: hips ?? model,
    head: head ?? model,
    leftArm: leftArm ?? model,
    rightArm: rightArm ?? model,
  }
}

interface Avatar3DProps {
  animation?: string
  modelUrl?: string | null
}

export function Avatar3D({ animation = 'idle', modelUrl }: Avatar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    refs: AnimatableRefs
    rest: RestPose
    idleClip: AnimationClip
    activeClip: AnimationClip | null
    animationFrameId: number
    clock: THREE.Clock
    currentAnimation: string
  } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const width = el.clientWidth
    const height = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.NoToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100)
    camera.position.set(0, 0.85, 1.8)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9)
    keyLight.position.set(1, 2, 3)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.3)
    fillLight.position.set(-2, 1, -1)
    scene.add(fillLight)

    const clock = new THREE.Clock()

    function setupAnimations(refs: AnimatableRefs) {
      const rest = captureRestPose(refs)
      const idleClip = animationRegistry.idle(refs, rest)
      const initialAnimation = animation
      const state = {
        renderer, scene, camera, refs, rest, idleClip,
        activeClip: null as AnimationClip | null,
        animationFrameId: 0, clock, currentAnimation: initialAnimation,
      }
      if (initialAnimation !== 'idle') {
        const factory = animationRegistry[initialAnimation]
        if (factory) {
          state.activeClip = factory(refs, rest)
        }
      }
      stateRef.current = state

      function animate() {
        state.animationFrameId = requestAnimationFrame(animate)
        const delta = Math.min(state.clock.getDelta(), 0.1)
        state.idleClip.update(delta)
        if (state.activeClip) {
          const done = state.activeClip.update(delta)
          if (done) {
            state.activeClip.reset()
            state.activeClip = null
          }
        }
        renderer.render(scene, camera)
      }
      animate()
    }

    if (modelUrl) {
      const loader = new GLTFLoader()
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 1.2 / maxDim
          model.scale.setScalar(scale)
          model.rotation.y = 0.45
          const scaledBox = new THREE.Box3().setFromObject(model)
          const center = scaledBox.getCenter(new THREE.Vector3())
          model.position.x -= center.x
          model.position.z -= center.z

          const wrapper = new THREE.Group()
          wrapper.add(model)
          scene.add(wrapper)

          const finalBox = new THREE.Box3().setFromObject(wrapper)
          const min = finalBox.min
          const max = finalBox.max
          const modelHeight = max.y - min.y
          const faceY = min.y + modelHeight * 0.78
          camera.position.set(0, faceY, modelHeight * 0.9)
          camera.lookAt(0, faceY, 0)

          const refs = extractRefsFromGLTF(model)
          refs.root = wrapper
          refs.hips = wrapper
          setupAnimations(refs)
        },
        undefined,
        () => {
          const { scene: model, refs } = buildPlaceholderModel()
          scene.add(model)
          setupAnimations(refs)
        }
      )
    } else {
      const { scene: model, refs } = buildPlaceholderModel()
      scene.add(model)
      setupAnimations(refs)
    }

    const observer = new ResizeObserver(() => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    observer.observe(el)

    return () => {
      observer.disconnect()
      const s = stateRef.current
      if (s) cancelAnimationFrame(s.animationFrameId)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [modelUrl])

  useEffect(() => {
    const state = stateRef.current
    if (!state) return
    if (animation === state.currentAnimation) return
    state.currentAnimation = animation

    if (state.activeClip) {
      state.activeClip.reset()
      state.activeClip = null
    }

    if (animation !== 'idle') {
      const factory = animationRegistry[animation]
      if (factory) {
        state.activeClip = factory(state.refs, state.rest)
      }
    }
  }, [animation])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
