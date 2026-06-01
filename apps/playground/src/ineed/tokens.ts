/**
 * Field DS token adapter for the I NEED… port — React Native flavour.
 *
 * The original web app shipped a `c` colour-alias map and a `ts()` helper that
 * returned web CSS. Here we read the same semantic tokens from
 * `@field-ds/tokens` but return React Native `TextStyle` objects (numeric
 * lineHeight, no fontWeight — each Noontree weight is its own font family, so
 * setting fontWeight would risk faux-bold).
 */
import type { TextStyle } from "react-native";

import { colour, textStyles } from "@field-ds/tokens";

export type TextStyleName = keyof typeof textStyles;

/** Convert a Field DS text style into a React Native TextStyle. */
export function ts(name: TextStyleName): TextStyle {
  const s = textStyles[name] as {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    textTransform?: TextStyle["textTransform"];
    textDecorationLine?: TextStyle["textDecorationLine"];
  };
  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    ...(s.textTransform ? { textTransform: s.textTransform } : null),
    ...(s.textDecorationLine && s.textDecorationLine !== "none"
      ? { textDecorationLine: s.textDecorationLine }
      : null),
  };
}

/** Quick semantic colour aliases used across the I NEED… screens. */
export const c = {
  textPrimary: colour["text-n-icon"].primary, // #1d2539
  textSecondary: colour["text-n-icon"].secondary, // #475067
  textTertiary: colour["text-n-icon"].tertiary, // #666d85
  textMuted: colour["text-n-icon"].muted, // #989fb3
  action: colour["text-n-icon"].action, // #0f61ff
  error: colour["text-n-icon"].error, // #d92626
  success: colour["text-n-icon"].success, // #0f8857
  surfacePrimary: colour.surface.primary, // #ffffff
  surfaceSecondary: colour.surface.secondary, // #f9f9fb
  surfaceTertiary: colour.surface.tertiary, // #f2f3f7
  surfaceMuted: colour.surface.muted, // #eaecf0
  surfaceInverted: colour.surface["primary-inverted"], // #101628
  black: colour.surface.absolute_black, // #000000
  borderPrimary: colour.border.primary, // #eaecf0
  borderSubtle: colour.border.subtle, // #f2f3f7
  borderMedium: colour.border.medium, // #d0d4dd
  borderBold: colour.border.bold, // #666d85
  fieldFill: "rgba(0,0,0,0.04)", // base/colour/alpha-dark/4
  whiteAlpha50: "rgba(255,255,255,0.5)", // base/colour/alpha-light/50
} as const;
