import { colour } from "@field-ds/tokens";

import { RectButton, type RectButtonBaseProps, type RectButtonTone } from "./_RectButton";

// Sizes per Figma `M-SecondaryButton` (610:188).
export type SecondaryButtonSize = "H56" | "H52" | "H48" | "H40" | "H36";

const TONE: RectButtonTone = {
  bg: colour.surface.primary,
  bgPressed: colour.surface["action-subtle"],
  bgDisabled: colour.surface.muted,
  border: colour.border.action,
  borderPressed: colour.border.action,
  borderDisabled: colour.border.subtle,
  fg: colour["text-n-icon"].action,
  fgDisabled: colour["text-n-icon"].muted,
  fgToken: "colour.text-n-icon.action",
};

export type SecondaryButtonProps = RectButtonBaseProps & {
  size?: SecondaryButtonSize;
};

/**
 * M-SecondaryButton — outline blue CTA. Lower visual weight than
 * `PrimaryButton`; pair with a primary when you need a supportive action
 * ("Cancel" next to "Save", "Shop more" next to "Add to cart").
 *
 *   <SecondaryButton label="Cancel" />
 *   <SecondaryButton label="Edit" iconLeft="system-edit" />
 */
export function SecondaryButton({
  size = "H56",
  ...rest
}: SecondaryButtonProps) {
  return (
    <RectButton
      {...rest}
      size={size}
      tone={TONE}
      variantKey="secondary"
      componentName="SecondaryButton"
    />
  );
}
