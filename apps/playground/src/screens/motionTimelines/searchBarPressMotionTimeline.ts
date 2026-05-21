import { SEARCHBAR_PRESS_SCALE } from "@field-ds/components";
import { motion } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Motion spec for the SearchBar press interaction.
 *
 * Token-driven: every number on the timesheet is computed from the same
 * `motion.*` tokens and `SEARCHBAR_PRESS_SCALE` constant consumed by
 * `packages/components/src/SearchBar/SearchBar.tsx`. Edit the tokens or
 * scale constant, rebuild, and this timesheet updates.
 */
export const SEARCH_PRESS_IN_MS = motion.duration.xs;
export const SEARCH_PRESS_OUT_MS = motion.duration.sm;
/** Synthetic "finger held" interval between press-in and press-out. */
export const SEARCH_HOLD_MS = motion.duration.lg;
export const SEARCH_PRESS_OUT_START_MS =
  SEARCH_PRESS_IN_MS + SEARCH_HOLD_MS;
export const SEARCH_AXIS_MS =
  SEARCH_PRESS_OUT_START_MS + SEARCH_PRESS_OUT_MS;

const PRESS_IN_MS = SEARCH_PRESS_IN_MS;
const PRESS_OUT_MS = SEARCH_PRESS_OUT_MS;
const HOLD_MS = SEARCH_HOLD_MS;
const PRESS_OUT_START_MS = SEARCH_PRESS_OUT_START_MS;
const AXIS_MS = SEARCH_AXIS_MS;

const SCALE_DOWN_PCT = Math.round(SEARCHBAR_PRESS_SCALE * 100);

export const searchBarPressMotionTimeline: MotionTimesheetProps = {
  heading: "Press interaction",
  intro:
    "Touchdown shrinks the search bar to 98% with a timing curve; release tweens back to 100% on the standard easing. The hold lane below is illustrative — the user controls its actual length.",
  tokenRows: [
    { appliedTo: "Press-in · duration", token: "motion.duration.xs" },
    { appliedTo: "Press-in · easing", token: "motion.easing.standard" },
    { appliedTo: "Press-out · duration", token: "motion.duration.sm" },
    { appliedTo: "Press-out · easing", token: "motion.easing.standard" },
    {
      appliedTo: "Container · scale @ pressed",
      token: `SEARCHBAR_PRESS_SCALE (${SEARCHBAR_PRESS_SCALE})`,
    },
  ],
  axisMaxMs: AXIS_MS,
  tickMs: AXIS_MS >= 400 ? 100 : 50,
  rows: [
    {
      label: "Press-in driver",
      startMs: 0,
      endMs: PRESS_IN_MS,
      barKind: "solid",
      caption: `progress 0 → 1`,
    },
    {
      label: "Scale ↓",
      startMs: 0,
      endMs: PRESS_IN_MS,
      barKind: "linearRamp",
      caption: `100% → ${SCALE_DOWN_PCT}%`,
    },
    {
      label: "Hold",
      startMs: PRESS_IN_MS,
      endMs: PRESS_OUT_START_MS,
      barKind: "solid",
      caption: `@ ${SCALE_DOWN_PCT}% (illustrative)`,
    },
    {
      label: "Press-out driver",
      startMs: PRESS_OUT_START_MS,
      endMs: AXIS_MS,
      barKind: "solid",
      caption: `progress 1 → 0`,
    },
    {
      label: "Scale ↑",
      startMs: PRESS_OUT_START_MS,
      endMs: AXIS_MS,
      barKind: "linearRamp",
      caption: `${SCALE_DOWN_PCT}% → 100%`,
    },
  ],
};
