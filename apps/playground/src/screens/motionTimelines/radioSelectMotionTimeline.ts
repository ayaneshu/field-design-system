import {
  RADIO_SELECT_IN_MS,
  RADIO_TICK_DELAY_MS,
} from "@field-ds/components";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Motion spec for the Radio unselected → selected transition. Mirrors the
 * Checkbox spec: outline ring fades, filled disc fades in, and the tick is
 * drawn on top after a `motion.delay.beat` pause.
 */
const TOTAL_MS = RADIO_SELECT_IN_MS;
const OUTLINE_END_MS = Math.round(TOTAL_MS * 0.6);
const FILL_END_MS = Math.round(TOTAL_MS * 0.5);
const TICK_START_MS = RADIO_TICK_DELAY_MS;

export const RADIO_AXIS_MS = TOTAL_MS;

export const radioSelectMotionTimeline: MotionTimesheetProps = {
  heading: "Select transition",
  intro:
    "Tapping a Radio drives a single 0 → 1 progress over `motion.duration.emphasized` — the same motion pattern as M-Checkbox. Outline ring fades out, the filled disc fades in (no scale), and after a `motion.delay.beat` pause the tick is drawn on top via a trim-path animation (strokeDashoffset → 0).",
  tokenRows: [
    { appliedTo: "Driver · duration", token: "motion.duration.emphasized" },
    { appliedTo: "Driver · easing", token: "motion.easing.standard" },
    { appliedTo: "Tick · delay", token: "motion.delay.beat" },
    { appliedTo: "Outline · opacity", token: "interp 1 → 0" },
    { appliedTo: "Fill · opacity", token: "interp 0 → 1" },
    { appliedTo: "Tick · strokeDashoffset", token: "interp length → 0" },
  ],
  axisMaxMs: TOTAL_MS,
  tickMs: TOTAL_MS >= 200 ? 40 : 20,
  rows: [
    {
      label: "Driver",
      startMs: 0,
      endMs: TOTAL_MS,
      barKind: "solid",
      caption: `progress 0 → 1`,
    },
    {
      label: "Outline · opacity",
      startMs: 0,
      endMs: OUTLINE_END_MS,
      barKind: "linearRamp",
      caption: `100% → 0%`,
    },
    {
      label: "Fill · opacity",
      startMs: 0,
      endMs: FILL_END_MS,
      barKind: "linearRamp",
      caption: `0% → 100%`,
    },
    {
      label: "Tick delay",
      startMs: 0,
      endMs: TICK_START_MS,
      barKind: "solid",
      caption: `wait motion.delay.beat`,
    },
    {
      label: "Tick · draw",
      startMs: TICK_START_MS,
      endMs: TOTAL_MS,
      barKind: "linearRamp",
      caption: `strokeDashoffset length → 0`,
    },
  ],
};
