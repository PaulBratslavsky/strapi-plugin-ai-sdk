import * as THREE from 'three';

export interface AnimatableRefs {
  root: THREE.Object3D;
  hips: THREE.Object3D;
  head: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
}

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
  update(delta: number): boolean;
  reset(): void;
}

export type AnimationFactory = (refs: AnimatableRefs, rest: RestPose) => AnimationClip;

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

const speak: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  return {
    update(delta) {
      elapsed += delta;
      const env = Math.min(elapsed / 0.5, 1);
      const nod = Math.sin(elapsed * 3.5) * 0.12 * env;
      const turn = Math.sin(elapsed * 1.8) * 0.1 * env;
      const tilt = Math.sin(elapsed * 2.3) * 0.06 * env;
      applyAdditiveRotation(refs.head, rest.head, nod, turn, tilt);
      const rz = Math.sin(elapsed * 0.8) * 0.06 * env;
      const rx = Math.sin(elapsed * 0.6) * 0.04 * env;
      applyAdditiveRotation(refs.rightArm, rest.rightArm, rx, 0, rz);
      const lz = Math.sin(elapsed * 0.7 + 1) * 0.04 * env;
      const lx = Math.sin(elapsed * 0.5 + 0.5) * 0.03 * env;
      applyAdditiveRotation(refs.leftArm, rest.leftArm, lx, 0, -lz);
      refs.root.position.y = rest.rootY + Math.sin(elapsed * 2.5) * 0.008 * env;
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

const wave: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 2.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      let rx = 0, ry = 0, rz = 0;
      if (t < 0.2) {
        const f = t / 0.2;
        rx = -f * 1.4;
        rz = f * 1.3;
      } else if (t < 0.8) {
        const w = (t - 0.2) / 0.6;
        rx = -1.4;
        rz = 1.3;
        ry = Math.sin(w * Math.PI * 6) * 0.5;
      } else {
        const f = 1 - (t - 0.8) / 0.2;
        rx = -1.4 * f;
        rz = 1.3 * f;
      }
      applyAdditiveRotation(refs.rightArm, rest.rightArm, rx, ry, rz);
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

const nod: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 1.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env = t < 0.3 ? t / 0.3 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
      applyAdditiveRotation(refs.head, rest.head, Math.sin(elapsed * 6) * 0.15 * env, 0, 0);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
    },
  };
};

const think: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  return {
    update(delta) {
      elapsed += delta;
      const env = Math.min(elapsed / 0.4, 1);
      applyAdditiveRotation(refs.head, rest.head,
        Math.sin(elapsed * 0.4) * 0.08 * env,
        Math.sin(elapsed * 0.25) * 0.12 * env,
        0.06 * env
      );
      applyAdditiveRotation(refs.rightArm, rest.rightArm,
        -0.3 * env, 0, 0.15 * env
      );
      return false;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
      refs.rightArm.quaternion.copy(rest.rightArm);
    },
  };
};

const celebrate: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 2.0;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env = t < 0.2 ? t / 0.2 : t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
      applyAdditiveRotation(refs.leftArm, rest.leftArm, -1.5 * env, 0, -0.3 * env);
      applyAdditiveRotation(refs.rightArm, rest.rightArm, -1.5 * env, 0, 0.3 * env);
      refs.root.position.y = rest.rootY + Math.abs(Math.sin(elapsed * 5)) * 0.04 * env;
      applyAdditiveRotation(refs.head, rest.head, 0, Math.sin(elapsed * 3) * 0.1 * env, 0);
      return elapsed >= duration;
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

const shake: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 1.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const env = t < 0.2 ? t / 0.2 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
      applyAdditiveRotation(refs.head, rest.head, 0, Math.sin(elapsed * 8) * 0.2 * env, 0);
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.head.quaternion.copy(rest.head);
    },
  };
};

const spin: AnimationFactory = (refs, rest) => {
  let elapsed = 0;
  const duration = 1.5;
  return {
    update(delta) {
      elapsed += delta;
      const t = Math.min(elapsed / duration, 1);
      const angle = t * Math.PI * 2;
      refs.root.rotation.y = angle;
      refs.root.position.y = rest.rootY + Math.sin(t * Math.PI) * 0.05;
      return elapsed >= duration;
    },
    reset() {
      elapsed = 0;
      refs.root.rotation.y = 0;
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
