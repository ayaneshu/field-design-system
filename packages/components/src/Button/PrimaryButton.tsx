import * as React from "react";

import { colour } from "@field-ds/tokens";

import {
  RectButton,
  type RectButtonBaseProps,
  type RectButtonRef,
  type RectButtonTone,
} from "./_RectButton";

export type PrimaryButtonRef = RectButtonRef;

// Sizes per Figma `M-PrimaryButton` (596:201). H32 only ships on
// `NeutralButton`, so it's omitted here.
export type PrimaryButtonSize = "H56" | "H52" | "H48" | "H40" | "H36";

const TONE: RectButtonTone = {
  bg: colour.surface["action-bold"],
  bgPressed: colour.surface["action-extrabold"],
  bgDisabled: colour.surface.muted,
  fg: colour["text-n-icon"]["on-surface-bold"],
  fgDisabled: colour["text-n-icon"].muted,
  fgToken: "colour.text-n-icon.on-surface-bold",
};

export type PrimaryButtonProps = RectButtonBaseProps & {
  size?: PrimaryButtonSize;
};

/**
 * M-PrimaryButton — high-emphasis filled blue CTA. Use for the single most
 * important action on a screen (Save, Continue, Checkout). Only one primary
 * button per context.
 *
 *   <PrimaryButton label="Continue" />
 *   <PrimaryButton label="Saving" loading />
 *   <PrimaryButton label="Unavailable" disabled />
 */
export const PrimaryButton = React.forwardRef<
  PrimaryButtonRef,
  PrimaryButtonProps
>(function PrimaryButton({ size = "H56", ...rest }, ref) {
  return (
    <RectButton
      {...rest}
      ref={ref}
      size={size}
      tone={TONE}
      variantKey="primary"
      componentName="PrimaryButton"
    />
  );
});
