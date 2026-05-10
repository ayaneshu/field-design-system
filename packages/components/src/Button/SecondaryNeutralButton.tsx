import { colour } from "@field-ds/tokens";

import { RectButton, type RectButtonBaseProps, type RectButtonTone } from "./_RectButton";

// Sizes per Figma `M-SecondaryNeutralButton` (944:12577).
export type SecondaryNeutralButtonSize =
  | "H56"
  | "H52"
  | "H48"
  | "H40"
  | "H36";

const TONE: RectButtonTone = {
  bg: colour.surface.primary,
  bgPressed: colour.surface.secondary,
  bgDisabled: colour.surface.primary,
  border: colour.border.primary,
  borderPressed: colour.border.primary,
  borderDisabled: colour.border.primary,
  fg: colour["text-n-icon"].primary,
  fgPressed: colour["text-n-icon"].secondary,
  fgDisabled: colour["text-n-icon"].muted,
  fgToken: "colour.text-n-icon.primary",
  fgPressedToken: "colour.text-n-icon.secondary",
};

export type SecondaryNeutralButtonProps = RectButtonBaseProps & {
  size?: SecondaryNeutralButtonSize;
};

/**
 * M-SecondaryNeutralButton — outline neutral CTA. White surface with a
 * subtle neutral border; label/icon shift to text-n-icon/secondary on press.
 * Use as a quiet adjacent action where a blue outline would compete with
 * the primary CTA.
 *
 *   <SecondaryNeutralButton label="Skip" />
 *   <SecondaryNeutralButton label="Manage" iconLeft="system-edit" />
 */
export function SecondaryNeutralButton({
  size = "H56",
  ...rest
}: SecondaryNeutralButtonProps) {
  return (
    <RectButton
      {...rest}
      size={size}
      tone={TONE}
      variantKey="secondary-neutral"
      componentName="SecondaryNeutralButton"
    />
  );
}
