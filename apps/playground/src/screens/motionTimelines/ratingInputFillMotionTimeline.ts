import {
  RATING_BOUNCE_PEAK_SCALE,
  RATING_BOUNCE_RAMP_MS,
  RATING_BOUNCE_SPRING,
  RATING_FADE_MS,
  RATING_STAGGER_MS,
  RATING_STAR_COUNT,
  approximateSpringSettleMs,
} from "@field-ds/components";

import type {
  MotionTimesheetProps,
  MotionTimesheetRowModel,
} from "../../components/motionTimesheet/types";

/**
 * Motion spec for the RatingInput fill sweep.
 *
 * Token-driven: every duration / scale value is computed from the same
 * `motion.*` tokens and `RATING_*` constants exported by
 * `packages/components/src/RatingInput/RatingInput.tsx`. Edit a token,
 * rebuild, and this timesheet updates.
 *
 * Two animations fire per star whenever it transitions to the "filled"
 * mode, delayed by `RATING_STAGGER_MS × (index − 1)` so the rating fills
 * left → right as a soft sweep:
 *   - opacity 0 → 1 over `RATING_FADE_MS` on the standard easing
 *   - scale 1 → peak → 1 (ramp `RATING_BOUNCE_RAMP_MS`, settle on `springLight`)
 */
const BOUNCE_SETTLE_MS = approximateSpringSettleMs({
  stiffness: RATING_BOUNCE_SPRING.stiffness,
  damping: RATING_BOUNCE_SPRING.damping,
  mass: RATING_BOUNCE_SPRING.mass,
});

/** Per-star animation window: bounce is longer than the opacity fade. */
const STAR_WINDOW_MS = Math.max(
  RATING_FADE_MS,
  RATING_BOUNCE_RAMP_MS + BOUNCE_SETTLE_MS,
);

const LAST_STAR_OFFSET_MS = RATING_STAGGER_MS * (RATING_STAR_COUNT - 1);

export const RATING_INPUT_AXIS_MS = LAST_STAR_OFFSET_MS + STAR_WINDOW_MS;

const PEAK_PCT = Math.round(RATING_BOUNCE_PEAK_SCALE * 100);

const starRows: MotionTimesheetRowModel[] = Array.from(
  { length: RATING_STAR_COUNT },
  (_, i) => {
    const startMs = i * RATING_STAGGER_MS;
    return {
      label: `Star ${i + 1}`,
      startMs,
      endMs: startMs + STAR_WINDOW_MS,
      barKind: "peakRamp" as const,
      caption: `opacity 0 → 100% (base) · scale 100 → ${PEAK_PCT} → 100%`,
    };
  },
);

export const ratingInputFillMotionTimeline: MotionTimesheetProps = {
  heading: "Fill sweep",
  intro:
    "Tapping a rating drives a per-star cross-fade plus a scale pop. The stagger is direction-aware: filling sweeps left → right (star 1 leads), un-filling sweeps right → left (star 5 leads). The bounce only fires on fill-in, so the un-fill is just a quiet reverse cascade of opacity fades.",
  tokenRows: [
    {
      appliedTo: "Per-star delay (fill / un-fill)",
      token: "motion.delay.stagger (LTR / RTL)",
    },
    { appliedTo: "Opacity · duration", token: "motion.duration.base" },
    { appliedTo: "Opacity · easing", token: "motion.easing.standard" },
    { appliedTo: "Scale · ramp duration", token: "motion.duration.xs" },
    { appliedTo: "Scale · settle spring", token: "motion.spring.springLight" },
    {
      appliedTo: "Scale · peak",
      token: `${RATING_BOUNCE_PEAK_SCALE} (×100% → ${PEAK_PCT}%)`,
    },
  ],
  axisMaxMs: RATING_INPUT_AXIS_MS,
  tickMs: RATING_INPUT_AXIS_MS >= 400 ? 100 : 50,
  rows: starRows,
};
