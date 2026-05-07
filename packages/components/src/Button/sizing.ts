import { radius, space, textStyles, type FieldTextStyle } from "@field-ds/tokens";

// Field DS button height tokens.
// H32 only ships on M-Button/Neutral; the table below carries it for reuse but
// the rectangular Button enforces it via the variant/size combinations.
export type ButtonSize = "H56" | "H52" | "H48" | "H40" | "H36" | "H32";

export type ButtonSizeSpec = {
  height: number;
  paddingX: number;
  paddingY: number;
  radius: number;
  gap: number;
  iconSize: number;
  spinnerSize: number;
  text: FieldTextStyle;
};

// One row per Figma height variant. Padding/radius/icon/text values lifted
// verbatim from M-Button/Primary-Button (Figma 596:201) — every other rect
// variant inherits the same dimensions, only the surface/border/text colour
// changes per variant.
export const BUTTON_SIZE: Record<ButtonSize, ButtonSizeSpec> = {
  H56: {
    height: 56,
    paddingX: space["24"],
    paddingY: space["16"],
    radius: radius["12"],
    gap: space["8"],
    iconSize: 24,
    spinnerSize: 24,
    text: textStyles.Action_A17_SemiBold,
  },
  H52: {
    height: 52,
    paddingX: space["20"],
    paddingY: space["14"],
    radius: radius["12"],
    gap: space["8"],
    iconSize: 24,
    spinnerSize: 24,
    text: textStyles.Action_A16_SemiBold,
  },
  H48: {
    height: 48,
    paddingX: space["16"],
    paddingY: space["14"],
    radius: radius["10"],
    gap: space["6"],
    iconSize: 20,
    spinnerSize: 20,
    text: textStyles.Action_A14_SemiBold,
  },
  H40: {
    height: 40,
    paddingX: space["12"],
    paddingY: space["12"],
    radius: radius["8"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.Action_A12_SemiBold,
  },
  H36: {
    height: 36,
    paddingX: space["12"],
    paddingY: space["10"],
    radius: radius["8"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.Action_A12_SemiBold,
  },
  H32: {
    height: 32,
    paddingX: space["10"],
    paddingY: space["8"],
    radius: radius["6"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.Action_A12_SemiBold,
  },
};

// CSS-only press transition. Native ignores these — the press surface there
// just snaps. Matches the curve used elsewhere (Accordion / Checkbox). Cast
// to any so the rn-web-only properties don't trip ViewStyle typechecking
// at the call sites.
export const PRESS_TRANSITION = {
  transitionProperty: "background-color, border-color, opacity",
  transitionDuration: "120ms",
  transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
} as Record<string, string>;

/**
 * Strip the explicit fontWeight from a text style so web browsers don't
 * synthesize faux-bold over an already-weighted family name.
 *
 * The Field DS fonts are loaded as discrete families (`Noontree-SemiBold`,
 * `Noontree-Bold`, ...) each registered with `@font-face { font-weight: normal }`
 * (Expo Font's default). When a text style sets `fontWeight: "600"` on top of
 * `fontFamily: "Noontree-SemiBold"`, the browser asks for weight 600 in a
 * family that only ships weight 400 → it adds faux-bold, which makes the
 * label render heavier than the Figma source.
 *
 * Forcing `fontWeight: "400"` here matches the @font-face declaration; the
 * glyphs already encode SemiBold via the family name, so the visual weight
 * stays correct.
 */
export function noFauxBold(t: FieldTextStyle): FieldTextStyle {
  return { ...t, fontWeight: "400" };
}
