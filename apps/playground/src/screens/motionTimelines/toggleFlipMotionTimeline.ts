import { motion, space } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/** Aligned with packages/components/src/Toggle/Toggle.tsx (H20 footprint). */
const LG = motion.duration.lg;
const pad = space["2"];
const H20 = { trackW: 34 as const, thumb: space["16"] as number };
const TRAVEL_H20 = H20.trackW - pad * 2 - H20.thumb;
const THUMB_W_H20 = H20.thumb;
const DELTA_W_SCALE_PEAK = Math.round(THUMB_W_H20 * (1.5 - 1)); // scaleX 100%→150%→100%

/**
 * Structured motion doc for Toggle — feeds {@link MotionTimesheet} via PageScaffold.
 */
export const toggleFlipMotionTimeline: MotionTimesheetProps = {
  heading: "Flip transition",
  tokenRows: [
    { appliedTo: "Driver · duration", token: "motion.duration.lg" },
    { appliedTo: "Driver · easing", token: "motion.easing.decelerate" },
    {
      appliedTo: "Track · fill @ u = 0",
      token: "colour.surface.muted",
    },
    {
      appliedTo: "Track · fill @ u = 1 (enabled)",
      token: "colour.surface.secondary-inverted",
    },
  ],
  axisMaxMs: LG,
  tickMs: LG >= 260 ? 100 : 50,
  rows: [
    {
      label: "Driver (progress)",
      startMs: 0,
      endMs: LG,
      barKind: "solid",
      caption: `dec·lg: progress(0%/initial→100%/final)`,
    },
    {
      label: "Track fill",
      startMs: 0,
      endMs: LG,
      barKind: "linearRamp",
      caption: `linear·u: fill(0%/muted→100%/secondary-inverted)`,
    },
    {
      label: "Thumb · translateX",
      startMs: 0,
      endMs: LG,
      barKind: "linearRamp",
      caption: `linear·u: position(0%/start→100%/final) · 0→${TRAVEL_H20}px (H20)`,
    },
    {
      label: "Thumb · scaleX",
      startMs: 0,
      endMs: LG,
      barKind: "peakRamp",
      caption: `interp·keys·u [0,.5,1]: scaleX (100→150→100)% · Δ${DELTA_W_SCALE_PEAK}px @ u=.5 (H20)`,
    },
  ],
};
