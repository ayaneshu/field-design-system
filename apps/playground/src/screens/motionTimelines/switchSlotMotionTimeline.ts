import { approximateSpringSettleMs } from "@field-ds/components";
import { motion } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Motion spec for the Switch slot transition (white thumb moving between
 * adjacent option slots).
 *
 * Token-driven: every number on the timesheet comes from `motion.spring.springLight`
 * — the same spring `packages/components/src/Switch/Switch.tsx` passes to
 * `withSpring`. Settle time is estimated by `approximateSpringSettleMs`
 * (continuous mass-spring-damper, ε = 1%).
 */
export const SWITCH_SETTLE_MS = approximateSpringSettleMs({
  stiffness: motion.spring.springLight.stiffness,
  damping: motion.spring.springLight.damping,
  mass: motion.spring.springLight.mass,
});
export const SWITCH_AXIS_MS = SWITCH_SETTLE_MS;

const SETTLE_MS = SWITCH_SETTLE_MS;
const AXIS_MS = SWITCH_AXIS_MS;

export const switchSlotMotionTimeline: MotionTimesheetProps = {
  heading: "Slot transition",
  intro:
    "Tapping a different option springs the white thumb between adjacent slots. The driver is the option index — a 0 → 1 move (or any Δ) handed to withSpring. Reduced motion assigns the index instantly.",
  tokenRows: [
    { appliedTo: "Driver · spring", token: "motion.spring.springLight" },
    {
      appliedTo: "Thumb · translateX",
      token: "spring·springLight (prev slot → next slot)",
    },
  ],
  axisMaxMs: AXIS_MS,
  tickMs: AXIS_MS >= 300 ? 50 : 25,
  rows: [
    {
      label: "Driver",
      startMs: 0,
      endMs: SETTLE_MS,
      barKind: "solid",
      caption: `index prev → next · ~${SETTLE_MS}ms settle`,
    },
    {
      label: "Thumb · translateX",
      startMs: 0,
      endMs: SETTLE_MS,
      barKind: "peakRamp",
      caption: `spring·springLight · settle ε=1%`,
    },
  ],
};
