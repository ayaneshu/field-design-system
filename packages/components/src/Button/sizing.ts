import { radius, space, textStyles, type FieldTextStyle } from "@field-ds/tokens";

// Field DS button height tokens.
// H32 only ships on M-Button/Neutral; the table below carries it for reuse but
// the rectangular Button enforces it via the variant/size combinations.
export type ButtonSize = "H56" | "H52" | "H48" | "H40" | "H36" | "H32";

// Variants of the rectangular Button (mirrors ButtonVariant in Button.tsx).
// Kept in sizing.ts so getButtonSpec() can resolve the per-variant H40 override
// without importing from Button.tsx (would be a cycle).
export type RectButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-neutral"
  | "neutral";

export type ButtonSizeSpec = {
  height: number;
  paddingX: number;
  paddingY: number;
  radius: number;
  gap: number;
  iconSize: number;
  spinnerSize: number;
  text: FieldTextStyle;
  // Token name (e.g. "textStyles.A14_SemiBold") emitted as a dataSet
  // attribute for the design-system audit tooling.
  textStyleName: string;
};

// Default per-size spec. H56/H52/H48/H36/H32 are uniform across all rectangular
// variants. H40 is the odd one out — Primary uses tighter padding/radius/icon
// than the outline + neutral variants — and is overridden via getButtonSpec().
export const BUTTON_SIZE: Record<ButtonSize, ButtonSizeSpec> = {
  H56: {
    height: 56,
    paddingX: space["24"],
    paddingY: space["16"],
    radius: radius["12"],
    gap: space["8"],
    iconSize: 24,
    spinnerSize: 24,
    text: textStyles.A17_SemiBold,
    textStyleName: "textStyles.A17_SemiBold",
  },
  H52: {
    height: 52,
    paddingX: space["20"],
    paddingY: space["14"],
    radius: radius["12"],
    gap: space["8"],
    iconSize: 24,
    spinnerSize: 24,
    text: textStyles.A16_SemiBold,
    textStyleName: "textStyles.A16_SemiBold",
  },
  H48: {
    height: 48,
    paddingX: space["16"],
    paddingY: space["14"],
    radius: radius["10"],
    gap: space["6"],
    iconSize: 20,
    spinnerSize: 20,
    text: textStyles.A14_SemiBold,
    textStyleName: "textStyles.A14_SemiBold",
  },
  // Default H40 = Primary footprint (12px padding, gap 4, radius 8, 16px icon).
  // Other variants override via BUTTON_SIZE_H40_OVERRIDES.
  H40: {
    height: 40,
    paddingX: space["12"],
    paddingY: space["12"],
    radius: radius["8"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.A12_SemiBold,
    textStyleName: "textStyles.A12_SemiBold",
  },
  H36: {
    height: 36,
    paddingX: space["12"],
    paddingY: space["10"],
    radius: radius["8"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.A12_SemiBold,
    textStyleName: "textStyles.A12_SemiBold",
  },
  H32: {
    height: 32,
    paddingX: space["10"],
    paddingY: space["8"],
    radius: radius["6"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.A12_SemiBold,
    textStyleName: "textStyles.A12_SemiBold",
  },
};

// Per-variant H40 overrides. Lifted from Figma Button page (node 178:2):
//   secondary         → 16×10 padding, gap 6, radius 10, 20px icon, A12 text
//   secondary-neutral → 16×12 padding, gap 6, radius 10, 20px icon, A14 text
//   neutral           → 16×12 padding, gap 6, radius 10, 20px icon, A14 text
const BUTTON_SIZE_H40_OVERRIDES: Partial<
  Record<RectButtonVariant, ButtonSizeSpec>
> = {
  secondary: {
    height: 40,
    paddingX: space["16"],
    paddingY: space["10"],
    radius: radius["10"],
    gap: space["6"],
    iconSize: 20,
    spinnerSize: 18,
    text: textStyles.A12_SemiBold,
    textStyleName: "textStyles.A12_SemiBold",
  },
  "secondary-neutral": {
    height: 40,
    paddingX: space["16"],
    paddingY: space["12"],
    radius: radius["10"],
    gap: space["6"],
    iconSize: 20,
    spinnerSize: 18,
    text: textStyles.A14_SemiBold,
    textStyleName: "textStyles.A14_SemiBold",
  },
  neutral: {
    height: 40,
    paddingX: space["16"],
    paddingY: space["12"],
    radius: radius["10"],
    gap: space["6"],
    iconSize: 20,
    spinnerSize: 20,
    text: textStyles.A14_SemiBold,
    textStyleName: "textStyles.A14_SemiBold",
  },
};

export function getButtonSpec(
  variant: RectButtonVariant,
  size: ButtonSize,
): ButtonSizeSpec {
  if (size === "H40") {
    const override = BUTTON_SIZE_H40_OVERRIDES[variant];
    if (override) return override;
  }
  return BUTTON_SIZE[size];
}

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
