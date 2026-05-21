import { approximateSpringSettleMs } from "@field-ds/components";
import { motion } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Motion spec for the BottomSheet entry animation.
 *
 * Token-driven: the axis is `approximateSpringSettleMs(motion.spring.springLight)`
 * — the same spring `packages/components/src/BottomSheet/BottomSheet.tsx`
 * passes to `withSpring`. Edit the spring token, rebuild, and this sheet
 * updates.
 */
const ENTRY_SETTLE_MS = approximateSpringSettleMs({
  stiffness: motion.spring.springLight.stiffness,
  damping: motion.spring.springLight.damping,
  mass: motion.spring.springLight.mass,
});

export const BOTTOM_SHEET_AXIS_MS = ENTRY_SETTLE_MS;

export const bottomSheetEntryMotionTimeline: MotionTimesheetProps = {
  heading: "Entry",
  intro:
    "Tapping the trigger springs the sheet up from the bottom on `motion.spring.springLight` (shared with the M-Switch slot transition); the scrim fades in alongside the slide so both lanes share one rhythm. Reduced motion snaps both.",
  tokenRows: [
    { appliedTo: "Driver · spring", token: "motion.spring.springLight" },
    {
      appliedTo: "Sheet · translateY",
      token: "containerH → 0 (slides up from below the frame)",
    },
    { appliedTo: "Scrim · opacity", token: "interp 0 → 1" },
  ],
  axisMaxMs: BOTTOM_SHEET_AXIS_MS,
  tickMs: BOTTOM_SHEET_AXIS_MS >= 300 ? 50 : 25,
  rows: [
    {
      label: "Driver",
      startMs: 0,
      endMs: ENTRY_SETTLE_MS,
      barKind: "peakRamp",
      caption: `spring · settle ~${ENTRY_SETTLE_MS}ms`,
    },
    {
      label: "Sheet · translateY",
      startMs: 0,
      endMs: ENTRY_SETTLE_MS,
      barKind: "peakRamp",
      caption: `containerH → 0 (spring)`,
    },
    {
      label: "Scrim · opacity",
      startMs: 0,
      endMs: ENTRY_SETTLE_MS,
      barKind: "linearRamp",
      caption: `0 → 100%`,
    },
  ],
};
