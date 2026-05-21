/**
 * Convert prototype-style **tension / friction** springs into Reanimated **`withSpring`** config.
 *
 * Field DS maps **one-to-one** into the mass–normalised stiffness–damper form used by Reanimated:
 *
 * - **`stiffness`** ← **`tension`**
 * - **`damping`** ← **`friction`**
 * - **`mass`** defaults to **`1`**
 *
 * This matches tools that expose **tension** & **friction** only (e.g. some Figma / RN Animated–style prototypes).
 * If your prototype vendor scales friction differently, adjust values at the source or add a calibrated wrapper here.
 *
 * Rest termination defaults align with motion presets (`overshootClamping`, displacement/speed thresholds).
 */
export type TensionFrictionSpringSource = {
  tension: number;
  friction: number;
  mass?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
};

/** Expanded preset compatible with Reanimated `withSpring` config object. */
export type ResolvedSpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
  overshootClamping: boolean;
  restDisplacementThreshold: number;
  restSpeedThreshold: number;
};

export const TENSION_FRICTION_SPRING_DEFAULTS = {
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

export function springFromTensionFriction(tf: TensionFrictionSpringSource): ResolvedSpringConfig {
  const mass = tf.mass ?? TENSION_FRICTION_SPRING_DEFAULTS.mass;
  return {
    stiffness: tf.tension,
    damping: tf.friction,
    mass,
    overshootClamping: tf.overshootClamping ?? TENSION_FRICTION_SPRING_DEFAULTS.overshootClamping,
    restDisplacementThreshold:
      tf.restDisplacementThreshold ?? TENSION_FRICTION_SPRING_DEFAULTS.restDisplacementThreshold,
    restSpeedThreshold: tf.restSpeedThreshold ?? TENSION_FRICTION_SPRING_DEFAULTS.restSpeedThreshold,
  };
}
