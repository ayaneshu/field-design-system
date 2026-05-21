/**
 * Declarative model for playground motion timesheets — Gantt-like bars on an
 * explicit millisecond axis. Token strings in captions surface design-system paths.
 */

import type { ReactNode } from "react";
import type { SharedValue } from "react-native-reanimated";

export type MotionTimesheetBarKind =
  | "solid"
  | /** rising wedge L→R (linear‑in‑u metaphor) */ "linearRamp"
  | /** symmetric wedge — peak mid‑bar (e.g. scale up then down) */ "peakRamp";

/** One row in the tokens table — must correspond to something that **animates** on this interaction (timing curve or interpolated token endpoints). Omit static layout / paint that does not change with the driver. */
export type MotionTimesheetTokenRow = {
  /** Animated layer · attribute (or driver lane), aligned with timeline rows. */
  appliedTo: string;
  /** Semantic token path(s) from `@field-ds/tokens` read by that animation (e.g. `motion.duration.lg`). */
  token: string;
};

export type MotionTimesheetRowModel = {
  /** Left‑gutter label (element / layer). */
  label: string;
  startMs: number;
  endMs: number;
  /** Short line inside bar: `interpolation flavour: property(change)` (token paths ok). */
  caption: string;
  /** Bar fill metaphor — default `solid`. */
  barKind?: MotionTimesheetBarKind;
};

export type MotionTimesheetProps = {
  /** Bold title above the sheet (transition / interaction name). */
  heading: string;
  /** Optional narrative below the heading and above the token / timeline row. */
  intro?: string;
  /** Tokens involved **only** in motion on this sheet (timing / easing / interpolated values). Omit static layout or fills that do not change with `u`. */
  tokenRows?: MotionTimesheetTokenRow[];
  /** Legacy prose token line; used only when {@link tokenRows} is absent. */
  tokenSummary?: string;
  /**
   * Explanation of **`u`** (normalized driver progress). Rendered below the token table / legacy token line.
   * Omit for built-in default copy on `MotionTimesheet`. Pass `""` to hide this block.
   */
  progressDriverNote?: string;
  /** Highest tick shown on the bottom axis — automatically extended past any row.endMs when needed. */
  axisMaxMs: number;
  /** Vertical ticks + labels — default every 100ms. */
  tickMs?: number;
  rows: MotionTimesheetRowModel[];
  /**
   * Component preview rendered to the right of the timeline — usually a
   * miniature of the component in the state this sheet documents (e.g. the
   * button caught mid-press for the Press interaction sheet).
   */
  preview?: ReactNode;
  /**
   * Normalised 0..1 playback head, shared between the preview animation and a
   * vertical line drawn over the timesheet. Mirrors an After Effects timeline
   * cursor — drive it from a loop in the consuming screen.
   */
  playhead?: SharedValue<number>;
};
