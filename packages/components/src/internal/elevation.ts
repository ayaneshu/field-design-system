import { Platform, type ViewStyle } from "react-native";

import { colour } from "@field-ds/tokens";

// Shared elevation helpers.
//
// The foundations team has not published a dedicated shadow-colour token yet,
// so every elevation in the system shares ONE tint — the absolute-black surface
// token at low opacity. This is visually identical to the hand-tuned near-black
// tints that were previously inlined across components (#0e0e0e / #222222 /
// #0b0c0e / #000000) but keeps the value in one token-backed place instead of
// scattered hex literals. When a shadow token ships, only this file changes.

/** Canonical shadow tint — use in place of inlined `shadowColor` hex. */
export const SHADOW_TINT = colour.surface.absolute_black;

export type ElevationLevel = "sm" | "md" | "lg";

const SPECS: Record<
  ElevationLevel,
  { offsetY: number; radius: number; opacity: number; elevation: number }
> = {
  // Thumbs / chips — a tight contact shadow.
  sm: { offsetY: 1, radius: 4, opacity: 0.12, elevation: 2 },
  // Raised surfaces — search bars, floating controls.
  md: { offsetY: 6, radius: 12, opacity: 0.12, elevation: 6 },
  // Overlays — toasts, bottom sheets.
  lg: { offsetY: 12, radius: 16, opacity: 0.12, elevation: 12 },
};

/**
 * A cross-platform elevation style: iOS/web get token-tinted `shadow*`, Android
 * gets `elevation`. Spread into a component's container style.
 *
 *   style={[{ borderRadius: radius["16"] }, elevation("lg")]}
 */
export function elevation(level: ElevationLevel): ViewStyle {
  const s = SPECS[level];
  return Platform.select<ViewStyle>({
    android: { elevation: s.elevation },
    default: {
      shadowColor: SHADOW_TINT,
      shadowOffset: { width: 0, height: s.offsetY },
      shadowOpacity: s.opacity,
      shadowRadius: s.radius,
    },
  }) as ViewStyle;
}
