import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useAvatarAnimation } from '../../context/AvatarAnimationContext';
import {
  animationRegistry,
  captureRestPose,
  type AnimationClip,
  type AnimatableRefs,
  type RestPose,
} from './animations';
import { buildPlaceholderModel } from './PlaceholderModel';

/**
 * Path to a .glb model served from Strapi's public folder.
 * Place your model at: server/public/models/avatar.glb
 * Set to null to use the procedural anime model instead.
 */
const MODEL_PATH: string | null = '/models/avatar.glb';

/**
 * Collect all skeleton bones from every SkinnedMesh in the model.
 * These are the actual THREE.Bone instances that drive mesh deformation —
 * rotating scene-graph nodes found via traverse() does NOT deform the mesh.
 */
function collectSkeletonBones(root: THREE.Object3D): THREE.Bone[] {
  const bones: THREE.Bone[] = [];
  const seen = new Set<number>();
  root.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
      const skeleton = (child as THREE.SkinnedMesh).skeleton;
      if (skeleton) {
        for (const bone of skeleton.bones) {
          if (!seen.has(bone.id)) {
            seen.add(bone.id);
            bones.push(bone);
          }
        }
      }
    }
  });
  return bones;
}

/**
 * Find a bone by name from the skeleton's bone array.
 * Tries exact match first, then startsWith (bones often have suffixes like _47),
 * then case-insensitive startsWith.
 */
function findBone(bones: THREE.Bone[], names: string[]): THREE.Bone | null {
  // Pass 1: exact match
  for (const bone of bones) {
    if (names.includes(bone.name)) return bone;
  }
  // Pass 2: bone.name starts with one of the names (handles suffixes like "Head_47")
  for (const bone of bones) {
    for (const name of names) {
      if (bone.name.startsWith(name)) return bone;
    }
  }
  // Pass 3: case-insensitive startsWith
  const lower = names.map((n) => n.toLowerCase());
  for (const bone of bones) {
    const boneLower = bone.name.toLowerCase();
    for (const name of lower) {
      if (boneLower.startsWith(name)) return bone;
    }
  }
  return null;
}

/**
 * Extract animation refs from a loaded GLTF by searching skeleton bones.
 * Uses the actual THREE.Bone instances from SkinnedMesh.skeleton.bones[]
 * so that rotating them actually deforms the skinned mesh.
 */
function extractRefsFromGLTF(model: THREE.Group): AnimatableRefs {
  const bones = collectSkeletonBones(model);

  const hips = findBone(bones, [
    'Hips', 'hips', 'J_Bip_C_Hips', 'mixamorigHips',
    'Pelvis', 'pelvis', 'Root', 'root',
  ]);

  const head = findBone(bones, [
    'Head', 'head', 'J_Bip_C_Head', 'mixamorigHead',
  ]);

  const leftArm = findBone(bones, [
    'Left arm', 'Left_arm', 'LeftArm', 'leftArm',
    'J_Bip_L_UpperArm', 'mixamorigLeftArm', 'arm_L', 'Arm.L',
    'Left shoulder', 'Left_shoulder',
  ]);

  const rightArm = findBone(bones, [
    'Right arm', 'Right_arm', 'RightArm', 'rightArm',
    'J_Bip_R_UpperArm', 'mixamorigRightArm', 'arm_R', 'Arm.R',
    'Right shoulder', 'Right_shoulder',
  ]);

  return {
    root: model,
    hips: hips ?? model,
    head: head ?? model,
    leftArm: leftArm ?? model,
    rightArm: rightArm ?? model,
  };
}

export function Avatar3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentAnimation, requestId, clearAnimation } = useAvatarAnimation();

  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    refs: AnimatableRefs;
    rest: RestPose;
    idleClip: AnimationClip;
    activeClip: AnimationClip | null;
    lastRequestId: number;
    animationFrameId: number;
    clock: THREE.Clock;
  } | null>(null);

  // Initialize Three.js scene once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = el.clientWidth;
    const height = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e6f0);

    // Camera — will be repositioned after model loads
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.85, -1.8); // default, overridden on model load

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(1, 2, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.3);
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xaaccff, 0.4);
    rimLight.position.set(0, 1, -3);
    scene.add(rimLight);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1.0;
    controls.maxDistance = 3.5;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minAzimuthAngle = -Math.PI / 6;
    controls.maxAzimuthAngle = Math.PI / 6;

    const clock = new THREE.Clock();

    function setupAnimations(refs: AnimatableRefs) {
      const rest = captureRestPose(refs);
      const idleClip = animationRegistry.idle(refs, rest);
      const state = {
        renderer, scene, camera, controls, refs, rest, idleClip,
        activeClip: null as AnimationClip | null,
        lastRequestId: -1, animationFrameId: 0, clock,
      };
      stateRef.current = state;

      function animate() {
        state.animationFrameId = requestAnimationFrame(animate);
        const delta = Math.min(state.clock.getDelta(), 0.1);
        state.idleClip.update(delta);
        if (state.activeClip) {
          const done = state.activeClip.update(delta);
          if (done) {
            state.activeClip.reset();
            state.activeClip = null;
          }
        }
        state.controls.update();
        renderer.render(scene, camera);
      }
      animate();
    }

    // Load model or use procedural fallback
    if (MODEL_PATH) {
      // Temporarily disable createImageBitmap — it fails silently in
      // Strapi's admin CSP context, causing all GLB textures to be null.
      // The classic Image element path works fine.
      const savedCreateImageBitmap = window.createImageBitmap;
      (window as any).createImageBitmap = undefined;

      const loader = new GLTFLoader();
      loader.load(
        MODEL_PATH,
        (gltf) => {
          const model = gltf.scene;

          // Auto-scale to fit in view
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.2 / maxDim;
          model.scale.setScalar(scale);

          // Correct slight leftward facing
          model.rotation.y = 0.45;

          // Center horizontally, keep feet near bottom
          const scaledBox = new THREE.Box3().setFromObject(model);
          const center = scaledBox.getCenter(new THREE.Vector3());
          model.position.x -= center.x;
          model.position.z -= center.z;

          // Restore createImageBitmap now that textures are decoded
          window.createImageBitmap = savedCreateImageBitmap;

          // Wrap model in a group so we can spin the entire thing
          // (rotating a SkinnedMesh parent bone only deforms vertices,
          //  but rotating a wrapper group spins mesh + skeleton together)
          const wrapper = new THREE.Group();
          wrapper.add(model);
          scene.add(wrapper);

          // Auto-frame camera on upper body (top 40% of model)
          const finalBox = new THREE.Box3().setFromObject(wrapper);
          const min = finalBox.min;
          const max = finalBox.max;
          const modelHeight = max.y - min.y;
          const faceY = min.y + modelHeight * 0.78; // face height
          camera.position.set(0, faceY, -modelHeight * 0.9); // closer zoom
          controls.target.set(0, faceY, 0);
          controls.update();

          const refs = extractRefsFromGLTF(model);
          // Use the wrapper as root + hips so spin rotates everything
          refs.root = wrapper;
          refs.hips = wrapper;
          setupAnimations(refs);
        },
        undefined,
        () => {
          window.createImageBitmap = savedCreateImageBitmap;
          const { scene: model, refs } = buildPlaceholderModel();
          scene.add(model);
          setupAnimations(refs);
        }
      );
    } else {
      const { scene: model, refs } = buildPlaceholderModel();
      scene.add(model);
      setupAnimations(refs);
    }

    // Resize observer
    const observer = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      const s = stateRef.current;
      if (s) cancelAnimationFrame(s.animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      stateRef.current = null;
    };
  }, []);

  // React to animation changes
  useEffect(() => {
    const state = stateRef.current;
    if (!state || requestId === state.lastRequestId) return;
    state.lastRequestId = requestId;

    if (state.activeClip) {
      state.activeClip.reset();
      state.activeClip = null;
    }

    if (currentAnimation !== 'idle') {
      const factory = animationRegistry[currentAnimation];
      if (factory) {
        state.activeClip = factory(state.refs, state.rest);
      }
    }
  }, [currentAnimation, requestId]);

  // Detect when active clip finishes
  useEffect(() => {
    if (currentAnimation === 'idle') return;
    const interval = setInterval(() => {
      const state = stateRef.current;
      if (state && state.activeClip === null) clearAnimation();
    }, 100);
    return () => clearInterval(interval);
  }, [currentAnimation, clearAnimation]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
