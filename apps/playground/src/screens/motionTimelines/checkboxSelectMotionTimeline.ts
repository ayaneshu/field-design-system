import {
  CHECKBOX_CHECK_IN_MS,
  CHECKBOX_TICK_DELAY_MS,
} from "@field-ds/components";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Motion spec for the Checkbox unchecked → checked transition.
 *
 * Token-driven: every value on the timesheet is computed from `motion.*`
 * tokens (`emphasized` + `delay.beat` + `easing.standard`). Edit a token,
 * rebuild, and this sheet updates.
 *
 * Three lanes share the same driver:
 *   - outline ring opacity fades 1 → 0 over the first 60% of the driver
 *   - filled box opacity fades 0 → 1 over the first 50% of the driver
 *   - tick stroke draws (strokeDashoffset → 0) after a `motion.delay.beat`
 *     pause so the box lands before the line is drawn on top
 */
const TOTAL_MS = CHECKBOX_CHECK_IN_MS;
const OUTLINE_END_MS = Math.round(TOTAL_MS * 0.6);
const FILL_END_MS = Math.round(TOTAL_MS * 0.5);
const TICK_START_MS = CHECKBOX_TICK_DELAY_MS;

export const CHECKBOX_AXIS_MS = TOTAL_MS;

export const checkboxSelectMotionTimeline: MotionTimesheetProps = {
  heading: "Select transition",
  intro:
    "Tapping the checkbox drives a single 0 → 1 progress over `motion.duration.emphasized`. The outline ring fades out, the filled box fades in (no scale), and after a `motion.delay.beat` pause the tick is drawn on top via a trim-path animation (strokeDashoffset → 0). Honours reduced motion by snapping.",
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
