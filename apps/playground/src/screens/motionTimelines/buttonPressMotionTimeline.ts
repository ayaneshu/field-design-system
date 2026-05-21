import { BUTTON_PRESS_SCALE, approximateSpringSettleMs } from "@field-ds/components";
import { motion } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Shared motion spec for every Button-family press interaction. Each variant
 * (Primary, Secondary, SecondaryNeutral, Neutral, Icon, Round, Text,
 * NeutralText) consumes the same `usePressScale` hook, so they all share
 * one timesheet.
 */
export const BUTTON_PRESS_IN_MS = motion.duration.xs;
export const BUTTON_RELEASE_SETTLE_MS = approximateSpringSettleMs({
  stiffness: motion.spring.snappy.stiffness,
  damping: motion.spring.snappy.damping,
  mass: motion.spring.snappy.mass,
});
/** Synthetic "finger held" interval so the timesheet shows a hold before release. */
export const BUTTON_HOLD_MS = motion.duration.lg;
export const BUTTON_RELEASE_START_MS = BUTTON_PRESS_IN_MS + BUTTON_HOLD_MS;
export const BUTTON_AXIS_MS = BUTTON_RELEASE_START_MS + BUTTON_RELEASE_SETTLE_MS;

const SCALE_DOWN_PCT = Math.round(BUTTON_PRESS_SCALE * 100);

export const buttonPressMotionTimeline: MotionTimesheetProps = {
  heading: "Press interaction",
  intro:
    "Touchdown shrinks the button to 98% with a timing curve; release springs back to 100%. The hold lane below is illustrative — the user controls its actual length.",
  tokenRows: [
    { appliedTo: "Press-in · duration", token: "motion.duration.xs" },
    {
      appliedTo: "Press-in · easing",
      token: "withTiming default (no easing token)",
    },
    { appliedTo: "Press-out · spring", token: "motion.spring.snappy" },
    {
      appliedTo: "Container · scale @ pressed",
      token: `BUTTON_PRESS_SCALE (${BUTTON_PRESS_SCALE})`,
    },
  ],
  axisMaxMs: BUTTON_AXIS_MS,
  tickMs: BUTTON_AXIS_MS >= 600 ? 100 : 50,
  rows: [
    {
      label: "Press-in driver",
      startMs: 0,
      endMs: BUTTON_PRESS_IN_MS,
      barKind: "solid",
      caption: `progress 0 → 1`,
    },
    {
      label: "Scale ↓",
      startMs: 0,
      endMs: BUTTON_PRESS_IN_MS,
      barKind: "linearRamp",
      caption: `100% → ${SCALE_DOWN_PCT}%`,
    },
    {
      label: "Hold",
      startMs: BUTTON_PRESS_IN_MS,
      endMs: BUTTON_RELEASE_START_MS,
      barKind: "solid",
      caption: `@ ${SCALE_DOWN_PCT}% (illustrative)`,
    },
    {
      label: "Press-out driver",
      startMs: BUTTON_RELEASE_START_MS,
      endMs: BUTTON_AXIS_MS,
      barKind: "solid",
      caption: `progress 1 → 0`,
    },
    {
      label: "Scale ↑",
      startMs: BUTTON_RELEASE_START_MS,
      endMs: BUTTON_AXIS_MS,
      barKind: "peakRamp",
      caption: `${SCALE_DOWN_PCT}% → 100% · settle ~${BUTTON_RELEASE_SETTLE_MS}ms`,
    },
  ],
};
