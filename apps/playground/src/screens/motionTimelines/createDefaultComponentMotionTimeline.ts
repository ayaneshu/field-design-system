import { motion } from "@field-ds/tokens";

import type { MotionTimesheetProps } from "../../components/motionTimesheet/types";

/** Reference axis length for auto-generated stubs (canonical token-backed duration). */
const STUB_DURATION_MS = motion.duration.base;

/**
 * Title shown in the mega heading — capitalize words from the scaffold `title` slug.
 *
 * Examples: `"toggle"` → `Toggle`; `"primary button"` → `Primary Button`.
 */
export function formatMotionPageHeadingTitle(slugTitle: string): string {
  const t = slugTitle.trim();
  if (!t) return "Component";
  return t.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/**
 * Procedural Motion tab content for component detail screens.
 *
 * `PageScaffold` injects this whenever `motionTimeline` and `motionSpecs` are
 * omitted: every component with `repoUrl` gets a deterministic timesheet so the
 * Motion specs tab never ships blank.
 *
 * **New components:** add the stack route and screen file; pass `repoUrl` on the
 * screen. Optionally pass `motionTimeline` with hand-authored rows (see
 * `toggleFlipMotionTimeline.ts`) to replace the stub.
 */
export function createDefaultComponentMotionTimeline(slugTitle: string): MotionTimesheetProps {
  const name = formatMotionPageHeadingTitle(slugTitle);
  const d = STUB_DURATION_MS;
  const tickMs = d >= 200 ? 50 : 100;

  return {
    heading: `${name} — motion baseline`,
    intro:
      "Stub timeline — replace with PageScaffold motionTimeline when this component defines motion in code.",
    tokenRows: [
      { appliedTo: "Driver · duration", token: "motion.duration.base" },
      { appliedTo: "Driver · easing", token: "motion.easing.standard" },
    ],
    axisMaxMs: d,
    tickMs,
    rows: [
      {
        label: "Driver · u",
        startMs: 0,
        endMs: d,
        barKind: "solid",
        caption: `standard·base: u(0%/initial→100%/final)`,
      },
      {
        label: "State / layout",
        startMs: 0,
        endMs: d,
        barKind: "linearRamp",
        caption: `linear·u: document layout & token-driven changes`,
      },
      {
        label: "Focus / semantics",
        startMs: 0,
        endMs: d,
        barKind: "linearRamp",
        caption: `linear·u: a11y + focus ring (if any)`,
      },
    ],
  };
}
