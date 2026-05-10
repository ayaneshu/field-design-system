import { colour } from "@field-ds/tokens";

import { RectButton, type RectButtonBaseProps, type RectButtonTone } from "./_RectButton";

// Sizes per Figma `M-NeutralButton` (752:70). Adds H32 — only this family
// ships the dense toolbar height per the DS.
export type NeutralButtonSize =
  | "H56"
  | "H52"
  | "H48"
  | "H40"
  | "H36"
  | "H32";

const TONE: RectButtonTone = {
  bg: colour.surface["primary-inverted"],
  bgPressed: colour.surface["secondary-inverted"],
  bgDisabled: colour.surface.muted,
  fg: colour["text-n-icon"]["on-surface-bold"],
  fgDisabled: colour["text-n-icon"].muted,
  fgToken: "colour.text-n-icon.on-surface-bold",
};

export type NeutralButtonProps = RectButtonBaseProps & {
  size?: NeutralButtonSize;
};

/**
 * M-NeutralButton — filled near-black CTA. Visually quieter than
 * `PrimaryButton` — use when multiple actions coexist on light surfaces
 * (e.g. "Schedule", "Select location", "Login/Sign up") or when the page
 * already has a primary action elsewhere.
 *
 *   <NeutralButton label="Schedule" />
 *   <NeutralButton label="Login" size="H40" />
 *   <NeutralButton label="Compact" size="H32" />
 */
export function NeutralButton({
  size = "H56",
  ...rest
}: NeutralButtonProps) {
  return (
    <RectButton
      {...rest}
      size={size}
      tone={TONE}
      variantKey="neutral"
      componentName="NeutralButton"
    />
  );
}
