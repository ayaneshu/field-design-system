import { approximateSpringSettleMs } from "@field-ds/components";
import { motion, space } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/** Aligned with packages/components/src/Toggle/Toggle.tsx (H20 footprint). */
const pad = space["2"];
const H20 = { trackW: 34 as const, thumb: space["16"] as number };
const TRAVEL_H20 = H20.trackW - pad * 2 - H20.thumb;
const THUMB_PEAK_W_MULT = 1.3;
const PEAK_W_PX = Math.round(H20.thumb * THUMB_PEAK_W_MULT);

const SPRING_SETTLE_MS = approximateSpringSettleMs({
  stiffness: motion.spring.springLight.stiffness,
  damping: motion.spring.springLight.damping,
  mass: motion.spring.springLight.mass,
});

export const TOGGLE_AXIS_MS = SPRING_SETTLE_MS;

/**
 * Motion spec for the Toggle on ↔ off flip.
 *
 * Token-driven: every value is computed from `motion.spring.springLight`
 * (shared with M-Switch) and shape constants in `Toggle.tsx`. Edit a token,
 * rebuild, and this sheet updates.
 */
export const toggleFlipMotionTimeline: MotionTimesheetProps = {
  heading: "Flip transition",
  intro:
    "Tapping the toggle drives a 0 → 1 spring on the same `motion.spring.springLight` token as the M-Switch slot transition. The thumb's width morphs from a rounded square into a pill at the midpoint of travel, then settles back, and the track colour fades. Touch-down scales the whole track to 98%.",
  tokenRows: [
    { appliedTo: "Driver · spring", token: "motion.spring.springLight" },
    {
      appliedTo: "Track · backgroundColor",
      token: "colour.surface.muted → colour.surface.secondary-inverted",
    },
    { appliedTo: "Track · scale @ pressed", token: "0.98" },
    {
      appliedTo: "Thumb · translateX",
      token: `0 → ${TRAVEL_H20}px (H20)`,
    },
    {
      appliedTo: "Thumb · width",
      token: `${H20.thumb} → ${PEAK_W_PX} → ${H20.thumb}px (peak @ u=.5)`,
    },
  ],
  axisMaxMs: TOGGLE_AXIS_MS,
  tickMs: TOGGLE_AXIS_MS >= 300 ? 50 : 25,
  rows: [
    {
      label: "Driver",
      startMs: 0,
      endMs: TOGGLE_AXIS_MS,
      barKind: "peakRamp",
      caption: `spring · settle ~${SPRING_SETTLE_MS}ms`,
    },
    {
      label: "Track fill",
      startMs: 0,
      endMs: TOGGLE_AXIS_MS,
      barKind: "linearRamp",
      caption: `muted → secondary-inverted`,
    },
    {
      label: "Thumb · translateX",
      startMs: 0,
      endMs: TOGGLE_AXIS_MS,
      barKind: "linearRamp",
      caption: `0 → ${TRAVEL_H20}px`,
    },
    {
      label: "Thumb · width",
      startMs: 0,
      endMs: TOGGLE_AXIS_MS,
      barKind: "peakRamp",
      caption: `${H20.thumb} → ${PEAK_W_PX} → ${H20.thumb}px`,
    },
  ],
};
