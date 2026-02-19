import * as THREE from 'three';
import type { AnimatableRefs } from './animations';

// --- Anime / chibi color palette ---
const SKIN = 0xffe0cc;
const SKIN_SHADOW = 0xf0c8b0;
const HAIR_MAIN = 0x5b3a8c; // Purple anime hair
const HAIR_HIGHLIGHT = 0x7e52b5;
const SHIRT = 0x4945ff; // Strapi indigo
const SHIRT_ACCENT = 0x6c69ff;
const EYE_IRIS = 0x4488ff; // Bright blue iris
const EYE_IRIS_INNER = 0x66aaff;
const EYE_PUPIL = 0x1a1a2e;
const EYE_WHITE = 0xffffff;
const EYE_HIGHLIGHT = 0xffffff;
const CHEEK = 0xff9999;
const MOUTH = 0xe07070;
const EYEBROW = 0x3a2266;

function toon(color: number) {
  const gradientMap = new THREE.DataTexture(
    new Uint8Array([80, 160, 255]),
    3, 1, THREE.RedFormat
  );
  gradientMap.needsUpdate = true;
  return new THREE.MeshToonMaterial({ color, gradientMap });
}

function basic(color: number, opts?: Partial<THREE.MeshBasicMaterialParameters>) {
  return new THREE.MeshBasicMaterial({ color, ...opts });
}

function phong(color: number, opts?: Partial<THREE.MeshPhongMaterialParameters>) {
  return new THREE.MeshPhongMaterial({ color, shininess: 20, ...opts });
}

function sphere(r: number, w = 16, h = 16) {
  return new THREE.SphereGeometry(r, w, h);
}

function add(
  parent: THREE.Object3D,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos?: [number, number, number],
  scale?: [number, number, number],
  rot?: [number, number, number]
) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (scale) m.scale.set(...scale);
  if (rot) m.rotation.set(...rot);
  parent.add(m);
  return m;
}

// Build a single anime eye
function buildEye(parent: THREE.Object3D, x: number) {
  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(x, 0.04, 0.26);
  parent.add(eyeGroup);

  // Eye white (slightly tall oval)
  add(eyeGroup, sphere(0.065, 16, 16), basic(EYE_WHITE), undefined, [0.8, 1.0, 0.5]);

  // Iris — large colored circle
  add(eyeGroup, sphere(0.048, 16, 16), phong(EYE_IRIS, { shininess: 60 }), [0, -0.005, 0.025], [0.85, 1.0, 0.6]);

  // Inner iris gradient
  add(eyeGroup, sphere(0.032, 12, 12), phong(EYE_IRIS_INNER, { shininess: 80 }), [0, 0.005, 0.035], [0.85, 0.9, 0.5]);

  // Pupil
  add(eyeGroup, sphere(0.02, 10, 10), basic(EYE_PUPIL), [0, -0.005, 0.04], [0.8, 1.0, 0.5]);

  // Large highlight (top-right)
  add(eyeGroup, sphere(0.015, 8, 8), basic(EYE_HIGHLIGHT), [0.015, 0.02, 0.05]);

  // Small highlight (bottom-left)
  add(eyeGroup, sphere(0.008, 6, 6), basic(EYE_HIGHLIGHT), [-0.01, -0.015, 0.05]);

  // Upper eyelid line (eyebrow-like shadow)
  add(eyeGroup, new THREE.TorusGeometry(0.055, 0.008, 8, 16, Math.PI),
    basic(EYEBROW), [0, 0.04, 0.02], undefined, [Math.PI, 0, 0]);

  return eyeGroup;
}

export function buildPlaceholderModel(): { scene: THREE.Group; refs: AnimatableRefs } {
  const root = new THREE.Group();

  // === TORSO (smaller for chibi proportions) ===
  // Main body
  add(root, new THREE.CylinderGeometry(0.28, 0.24, 0.5, 16), toon(SHIRT), [0, -0.5, 0]);
  // Collar/neckline detail
  add(root, new THREE.CylinderGeometry(0.14, 0.28, 0.12, 16), toon(SHIRT_ACCENT), [0, -0.22, 0]);
  // Shoulder roundness
  add(root, sphere(0.1, 12, 12), toon(SHIRT), [-0.28, -0.28, 0]);
  add(root, sphere(0.1, 12, 12), toon(SHIRT), [0.28, -0.28, 0]);

  // === NECK ===
  add(root, new THREE.CylinderGeometry(0.07, 0.09, 0.12, 8), toon(SKIN), [0, -0.1, 0]);

  // === HEAD GROUP (large for chibi) ===
  const head = new THREE.Group();
  head.position.set(0, 0.28, 0);
  root.add(head);

  // Head — big round sphere (chibi = head ~60% of body)
  add(head, sphere(0.34, 32, 32), toon(SKIN), undefined, [1.0, 1.05, 0.95]);

  // Face shadow under chin
  add(head, sphere(0.2, 16, 16), phong(SKIN_SHADOW, { transparent: true, opacity: 0.3 }),
    [0, -0.18, 0.12], [1.4, 0.5, 1.0]);

  // === EYES (large anime eyes) ===
  buildEye(head, -0.11);
  buildEye(head, 0.11);

  // === EYEBROWS ===
  add(head, new THREE.CapsuleGeometry(0.012, 0.06, 4, 8), basic(EYEBROW),
    [-0.11, 0.12, 0.28], undefined, [0, 0, 0.15]);
  add(head, new THREE.CapsuleGeometry(0.012, 0.06, 4, 8), basic(EYEBROW),
    [0.11, 0.12, 0.28], undefined, [0, 0, -0.15]);

  // === NOSE (tiny anime triangle) ===
  add(head, sphere(0.012, 6, 6), phong(SKIN_SHADOW), [0, -0.04, 0.32]);

  // === MOUTH (small cat-like smile) ===
  // Center dip
  add(head, new THREE.TorusGeometry(0.025, 0.006, 8, 12, Math.PI),
    basic(MOUTH), [0, -0.1, 0.3], undefined, [0.15, 0, 0]);

  // === CHEEKS (anime blush marks) ===
  // Horizontal oval blush patches
  add(head, sphere(0.04, 8, 8), basic(CHEEK, { transparent: true, opacity: 0.35 }),
    [-0.19, -0.04, 0.22], [1.3, 0.7, 0.5]);
  add(head, sphere(0.04, 8, 8), basic(CHEEK, { transparent: true, opacity: 0.35 }),
    [0.19, -0.04, 0.22], [1.3, 0.7, 0.5]);

  // === HAIR ===
  const hairMat = toon(HAIR_MAIN);
  const hairHiMat = toon(HAIR_HIGHLIGHT);

  // Back hair volume (big dome)
  add(head, sphere(0.36, 24, 24), hairMat, [0, 0.08, -0.06], [1.05, 1.0, 1.0]);

  // Top hair volume
  add(head, sphere(0.28, 20, 20), hairHiMat, [0, 0.22, 0.0], [1.1, 0.7, 0.95]);

  // Bangs — overlapping locks across forehead
  add(head, sphere(0.1, 12, 12), hairMat, [-0.18, 0.2, 0.2], [0.9, 0.7, 0.7]);
  add(head, sphere(0.12, 12, 12), hairHiMat, [-0.06, 0.22, 0.22], [0.8, 0.65, 0.7]);
  add(head, sphere(0.11, 12, 12), hairMat, [0.08, 0.23, 0.2], [0.85, 0.6, 0.7]);
  add(head, sphere(0.09, 12, 12), hairHiMat, [0.19, 0.19, 0.18], [0.8, 0.65, 0.65]);

  // Side hair strands (frame the face, longer)
  add(head, sphere(0.09, 12, 12), hairMat, [-0.3, 0.0, 0.05], [0.5, 1.4, 0.6]);
  add(head, sphere(0.08, 12, 12), hairHiMat, [-0.28, -0.15, 0.08], [0.45, 1.0, 0.55]);
  add(head, sphere(0.09, 12, 12), hairMat, [0.3, 0.0, 0.05], [0.5, 1.4, 0.6]);
  add(head, sphere(0.08, 12, 12), hairHiMat, [0.28, -0.15, 0.08], [0.45, 1.0, 0.55]);

  // Hair ahoge (antenna strand on top - classic anime touch)
  const ahoge = new THREE.Group();
  ahoge.position.set(0.02, 0.38, 0.1);
  ahoge.rotation.set(-0.3, 0, 0.2);
  head.add(ahoge);
  add(ahoge, new THREE.ConeGeometry(0.02, 0.15, 6), hairHiMat, [0, 0.07, 0]);

  // === ARMS ===
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, -0.3, 0);
  root.add(leftArm);
  // Upper arm (shirt)
  add(leftArm, new THREE.CapsuleGeometry(0.06, 0.18, 8, 8), toon(SHIRT), [0, -0.12, 0]);
  // Hand
  add(leftArm, sphere(0.055, 10, 10), toon(SKIN), [0, -0.28, 0]);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, -0.3, 0);
  root.add(rightArm);
  // Upper arm (shirt)
  add(rightArm, new THREE.CapsuleGeometry(0.06, 0.18, 8, 8), toon(SHIRT), [0, -0.12, 0]);
  // Hand
  add(rightArm, sphere(0.055, 10, 10), toon(SKIN), [0, -0.28, 0]);

  return { scene: root, refs: { root, hips: root, head, leftArm, rightArm } };
}
