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
export declare function captureRestPose(refs: AnimatableRefs): RestPose;
export interface AnimationClip {
    update(delta: number): boolean;
    reset(): void;
}
export type AnimationFactory = (refs: AnimatableRefs, rest: RestPose) => AnimationClip;
export declare const animationRegistry: Record<string, AnimationFactory>;
