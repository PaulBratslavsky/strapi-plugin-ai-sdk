import * as THREE from 'three';

export interface AnimatableRefs {
  root: THREE.Object3D;
  hips: THREE.Object3D;
  head: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
}

/** Saved rest-pose quaternions/positions so animations are additive. */
export interface RestPose {
  rootY: number;
  hips: THREE.Quaternion;
  head: THREE.Quaternion;
  leftArm: THREE.Quaternion;
  rightArm: THREE.Quaternion;
}

export function captureRestPose(refs: AnimatableRefs): RestPose {
  return {
    rootY: refs.root.position.y,
    hips: refs.hips.quaternion.clone(),
    head: refs.head.quaternion.clone(),
    leftArm: refs.leftArm.quaternion.clone(),
    rightArm: refs.rightArm.quaternion.clone(),
  };
}

export interface AnimationClip {
  update(delta: number): boolean; // return true when done
  reset(): void;
}

export type AnimationFactory = (refs: AnimatableRefs, rest: RestPose) => AnimationClip;

// Helper: apply an additive euler rotation on top of a rest quaternion
const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();

function applyAdditiveRotation(
  target: THREE.Object3D,
  restQ: THREE.Quaternion,
  x: number,
  y: number,
  z: number
) {
  _euler.set(x, y, z);
  _quat.setFromEuler(_euler);
  target.quaternion.copy(restQ).multiply(_quat);
}

// --- Idle: breathing bob + gentle head sway + subtle arm drift (loops forever) ---
const idle: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  return {
    update(delta) {
      elapsed += delta;
      refs.root.position.y = rest.rootY + Math.sin(elapsed * 1.2) * 0.012;
      applyAdditiveRotation(refs.head, rest.head,
        Math.sin(elapsed * 0.5) * 0.06,
        Math.sin(elapsed * 0.3) * 0.05,
        Math.sin(elapsed * 0.7) * 0.05
      );
      applyAdditiveRotation(refs.leftArm, rest.leftArm,
        Math.sin(elapsed * 0.3) * 0.015, 0, Math.sin(elapsed * 0.4) * 0.01);
      applyAdditiveRotation(refs.rightArm, rest.rightArm,
        Math.sin(elapsed * 0.35) * 0.015, 0, Math.sin(elapsed * 0.35) * -0.01);
      return false;
    },
    reset() {
      elapsed = 0;
      refs.root.position.y = rest.rootY;
      refs.head.quaternion.copy(rest.head);
      refs.leftArm.quaternion.copy(rest.leftArm);
      refs.rightArm.quaternion.copy(rest.rightArm);
    },
  };
};

// --- Speak: animated head + arm gestures mimicking talking (loops while streaming) ---
const speak: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  return {
    update(delta) {
      elapsed += delta;
      // Fade in over first 0.5s
      const env = Math.min(elapsed / 0.5, 1);

      // Head: rhythmic nodding like speaking emphasis + slight turns
      const nod = Math.sin(elapsed * 3.5) * 0.12 * env;
      const turn = Math.sin(elapsed * 1.8) * 0.1 * env;
      const tilt = Math.sin(elapsed * 2.3) * 0.06 * env;
      applyAdditiveRotation(refs.head, rest.head, nod, turn, tilt);

      // Right arm: gentle sway, slow and smooth
      const rz = Math.sin(elapsed * 0.8) * 0.06 * env;
      const rx = Math.sin(elapsed * 0.6) * 0.04 * env;
      applyAdditiveRotation(refs.rightArm, rest.rightArm, rx, 0, rz);

      // Left arm: subtle mirror drift
      const lz = Math.sin(elapsed * 0.7 + 1) * 0.04 * env;
      const lx = Math.sin(elapsed * 0.5 + 0.5) * 0.03 * env;
      applyAdditiveRotation(refs.leftArm, rest.leftArm, lx, 0, -lz);

      // Slight body bob for energy
      refs.root.position.y = rest.rootY + Math.sin(elapsed * 2.5) * 0.008 * env;

      return false; // loops until cleared by stream end
    },
    reset() {
      elapsed = 0;
      refs.root.position.y = rest.rootY;
      refs.head.quaternion.copy(rest.head);
      refs.leftArm.quaternion.copy(rest.leftArm);
      refs.rightArm.quaternion.copy(rest.rightArm);
    },
  };
};

// --- Wave: right arm raises forward + oscillates 3x (~2.5s) ---
const wave: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 2.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      // rx = forward raise, ry = wave side-to-side, rz = raise outward
      let rx = 0;
      let ry = 0;
      let rz = 0;
      if (t < 0.2) {
        const f = t / 0.2;
        rx = -f * 1.4;   // raise forward and up high
        rz = f * 1.3;    // raise outward
      } else if (t < 0.8) {
        const w = (t - 0.2) / 0.6;
        rx = -1.4;
        rz = 1.3;
        ry = Math.sin(w * Math.PI * 6) * 0.5;  // wave side to side
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        rx = -1.4 * f;
        rz = 1.3 * f;
      }
      applyAdditiveRotation(refs.rightArm, rest.rightArm, rx, ry, rz);
      // Head tilts slightly toward the wave
      const headTilt = t < 0.8 ? Math.sin(t * Math.PI * 4) * 0.08 : 0;
      applyAdditiveRotation(refs.head, rest.head, 0, 0, headTilt);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.rightArm.quaternion.copy(rest.rightArm);
      refs.head.quaternion.copy(rest.head);
    },
  };
};

// --- Nod: head tilts forward and back 3x (~2s) ---
const nod: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 2;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env = t > 0.85 ? (1 - t) / 0.15 : 1;
      applyAdditiveRotation(refs.head, rest.head,
        Math.sin(t * Math.PI * 6) * 0.18 * env, 0, 0);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
    },
  };
};

// --- Think: head tilts, arm to chin (~3.5s) ---
const think: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 3.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      let hx = 0, hz = 0, ax = 0, az = 0;
      if (t < 0.2) {
        const f = t / 0.2;
        hz = f * 0.2;
        hx = f * 0.12;
      } else if (t > 0.8) {
        const f = 1 - (t - 0.8) / 0.2;
        hz = 0.2 * f;
        hx = 0.12 * f;
      } else {
        hz = 0.2 + Math.sin(elapsed * 0.8) * 0.03;
        hx = 0.12;
      }
      if (t < 0.2) {
        const f = t / 0.2;
        az = -f * 0.6;
        ax = f * 0.35;
      } else if (t < 0.8) {
        const hold = (t - 0.2) / 0.6;
        az = -0.6 + Math.sin(hold * Math.PI * 2) * 0.06;
        ax = 0.35;
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        az = -0.6 * f;
        ax = 0.35 * f;
      }
      applyAdditiveRotation(refs.head, rest.head, hx, 0, hz);
      applyAdditiveRotation(refs.rightArm, rest.rightArm, ax, 0, az);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
      refs.rightArm.quaternion.copy(rest.rightArm);
    },
  };
};

// --- Celebrate: both arms up, root bounces (~3s) ---
const celebrate: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 3;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env = t > 0.8 ? (1 - t) / 0.2 : 1;
      const bounce = Math.abs(Math.sin(t * Math.PI * 6)) * 0.05 * env;
      refs.root.position.y = rest.rootY + bounce;

      let lz = 0, rz = 0;
      if (t < 0.15) {
        const f = t / 0.15;
        lz = f * 1.2;
        rz = -f * 1.2;
      } else if (t < 0.8) {
        const w = (t - 0.15) / 0.65;
        lz = 1.2 + Math.sin(w * Math.PI * 8) * 0.25;
        rz = -1.2 - Math.sin(w * Math.PI * 8) * 0.25;
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        lz = 1.2 * f;
        rz = -1.2 * f;
      }
      applyAdditiveRotation(refs.leftArm, rest.leftArm, 0, 0, lz);
      applyAdditiveRotation(refs.rightArm, rest.rightArm, 0, 0, rz);
      // Happy head bob
      applyAdditiveRotation(refs.head, rest.head,
        Math.sin(elapsed * 4) * 0.1 * env, 0, Math.sin(elapsed * 3) * 0.06 * env);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.root.position.y = rest.rootY;
      refs.leftArm.quaternion.copy(rest.leftArm);
      refs.rightArm.quaternion.copy(rest.rightArm);
      refs.head.quaternion.copy(rest.head);
    },
  };
};

// --- Shake: head rotates left-right-left (~1.5s) ---
const shake: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 1.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env = t > 0.8 ? (1 - t) / 0.2 : 1;
      applyAdditiveRotation(refs.head, rest.head,
        0, Math.sin(t * Math.PI * 6) * 0.3 * env, 0);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
    },
  };
};

// --- Spin: full 360° rotation via wrapper group (~2s) ---
const spin: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 2;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      // Smooth ease-in-out
      const ease = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
      // Rotate the wrapper group (refs.hips) so everything spins together
      _euler.set(0, ease * Math.PI * 2, 0);
      _quat.setFromEuler(_euler);
      refs.hips.quaternion.copy(rest.hips).multiply(_quat);
      // Small bounce while spinning
      refs.root.position.y = rest.rootY + Math.sin(t * Math.PI) * 0.03;
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.hips.quaternion.copy(rest.hips);
      refs.root.position.y = rest.rootY;
    },
  };
};

export const animationRegistry: Record<string, AnimationFactory> = {
  idle,
  speak,
  wave,
  nod,
  think,
  celebrate,
  shake,
  spin,
};
