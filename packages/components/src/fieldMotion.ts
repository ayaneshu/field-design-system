import { Easing } from "react-native-reanimated";

import { motion } from "@field-ds/tokens";

const std = motion.easing.standard;

/** System default timing curve — matches `motion.easing.standard` tokens. */
export const fieldEasingStandard = Easing.bezier(std[0], std[1], std[2], std[3]);

/** `{ stiffness, damping, mass }` as used by Reanimated `withSpring` / motion tokens. */
export type SpringPhysicsParams = {
  stiffness: number;
  damping: number;
  mass: number;
};

/**
 * Rough **milliseconds** until the displacement envelope falls below **`epsilon`** times the initial step,
 * for the linear mass–spring–damper matching {@link SpringPhysicsParams}.
 *
 * **Caveats**
 * - Real **`withSpring`** runs until velocity/displacement pass internal rest thresholds — there is **no single guaranteed duration** in the API.
 * - This uses continuous-time damping ratios; Reanimated’s discrete solver can differ slightly.
 * - Default **`epsilon`** ≈ **1%** amplitude is for **documentation / comparisons** (motion specs, foundations tables), not frame‑critical deadlines.
 */
export function approximateSpringSettleMs(
  spring: SpringPhysicsParams,
  epsilon = 0.01,
): number {
  const { stiffness: k, damping: c, mass: m } = spring;
  if (!(k > 0 && m > 0 && c >= 0 && epsilon > 0 && epsilon < 1)) {
    return NaN;
  }

  const omega0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(m * k));

  let tauSeconds: number;

  if (zeta > 1 + 1e-6) {
    const disc = Math.sqrt(zeta * zeta - 1);
    const slowRate = omega0 * (zeta - disc);
    tauSeconds = 1 / slowRate;
  } else if (zeta < 1 - 1e-6) {
    tauSeconds = 1 / (zeta * omega0);
  } else {
    // Near–critical damping — polynomial × exponential envelope; conservative heuristic.
    tauSeconds = 2 / omega0;
  }

  const tSeconds = tauSeconds * Math.log(1 / epsilon);
  const ms = Math.round(tSeconds * 1000);
  return Math.min(Math.max(ms, 16), 6000);
}
