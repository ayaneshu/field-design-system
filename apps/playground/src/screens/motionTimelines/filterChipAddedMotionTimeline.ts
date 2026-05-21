import {
  FILTER_CHIP_CLEAR_TRANSLATE_FROM,
  FILTER_CHIP_CLEAR_ZONE_W,
  FILTER_CHIP_COUNT_MAX_W,
  FILTER_CHIP_SHAPE_EASING_TOKEN,
  FILTER_CHIP_TRANSITION_MS,
} from "@field-ds/components";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/**
 * Motion spec for the FilterChip default ↔ added state transition.
 *
 * Token-driven: every duration / extent on the timesheet is computed from
 * `motion.*` tokens and the `FILTER_CHIP_*` constants exported by
 * `packages/components/src/FilterChip/FilterChip.tsx`. Edit the tokens (or
 * the layout constants), rebuild, and this sheet updates.
 *
 * Two timing drivers run in parallel at the same duration:
 *   - opacity + border colour → `motion.easing.easeInOut`
 *   - shape (width, translateX) → `motion.easing.loft`
 */
export const FILTER_CHIP_AXIS_MS = FILTER_CHIP_TRANSITION_MS;

export const filterChipAddedMotionTimeline: MotionTimesheetProps = {
  heading: "State transition · default ↔ added",
  intro:
    "Tapping the chip drives two timing curves over the same duration: an easeInOut curve fades the border colour and the count / clear-zone opacity, and a `loft` curve drives the chip resize + cross slide-in so the shape morph reads as a separate gesture. Reduced motion snaps both drivers.",
  tokenRows: [
    { appliedTo: "Driver · duration", token: "motion.duration.emphasized" },
    { appliedTo: "Opacity / colour · easing", token: "motion.easing.easeInOut" },
    {
      appliedTo: "Shape / translate · easing",
      token: FILTER_CHIP_SHAPE_EASING_TOKEN,
    },
    {
      appliedTo: "Container · borderColor",
      token: "colour.border.subtle → colour.border.extrabold",
    },
    {
      appliedTo: "Count · opacity + maxWidth",
      token: `interp 0 → 1 · width 0 → ${FILTER_CHIP_COUNT_MAX_W}px`,
    },
    {
      appliedTo: "Clear zone · maxWidth",
      token: `interp 0 → ${FILTER_CHIP_CLEAR_ZONE_W}px`,
    },
    {
      appliedTo: "Cross · translateX",
      token: `interp ${FILTER_CHIP_CLEAR_TRANSLATE_FROM}px → 0`,
    },
  ],
  axisMaxMs: FILTER_CHIP_AXIS_MS,
  tickMs: FILTER_CHIP_AXIS_MS >= 200 ? 40 : 25,
  rows: [
    {
      label: "Driver",
      startMs: 0,
      endMs: FILTER_CHIP_AXIS_MS,
      barKind: "solid",
      caption: `progress 0 → 1`,
    },
    {
      label: "Border colour",
      startMs: 0,
      endMs: FILTER_CHIP_AXIS_MS,
      barKind: "linearRamp",
      caption: `subtle → extrabold (easeInOut)`,
    },
    {
      label: "Count · opacity",
      startMs: 0,
      endMs: FILTER_CHIP_AXIS_MS,
      barKind: "linearRamp",
      caption: `0 → 100% (easeInOut)`,
    },
    {
      label: "Count · width",
      startMs: 0,
      endMs: FILTER_CHIP_AXIS_MS,
      barKind: "linearRamp",
      caption: `0 → ${FILTER_CHIP_COUNT_MAX_W}px (loft)`,
    },
    {
      label: "Clear · width",
      startMs: 0,
      endMs: FILTER_CHIP_AXIS_MS,
      barKind: "linearRamp",
      caption: `0 → ${FILTER_CHIP_CLEAR_ZONE_W}px (loft)`,
    },
    {
      label: "Cross · translateX",
      startMs: 0,
      endMs: FILTER_CHIP_AXIS_MS,
      barKind: "linearRamp",
      caption: `${FILTER_CHIP_CLEAR_TRANSLATE_FROM}px → 0 (loft)`,
    },
  ],
};
