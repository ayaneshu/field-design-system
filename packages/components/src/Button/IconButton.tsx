import { Pressable, type StyleProp, type ViewStyle } from "react-native";

import { Icon, type IconName } from "@field-ds/icons";
import { colour, radius, space } from "@field-ds/tokens";

import { PRESS_TRANSITION } from "./sizing";

// Maps to Figma M-IconButton (1051:10843). Circular, icon-only, two heights.
// Three emphasis levels (Default / Ghost / Action) × three states (Default /
// Pressed / Disabled).
export type IconButtonSize = "H40" | "H36";
export type IconButtonEmphasis = "default" | "ghost" | "action";

type EmphasisSpec = {
  bg: string;
  bgPressed: string;
  bgDisabled: string;
  border?: string;
  borderPressed?: string;
  borderDisabled?: string;
  fg: string;
  fgDisabled: string;
};

// State colours sourced verbatim from Figma M-IconButton (1051:10843).
//   - Default emphasis keeps surface.primary → surface.secondary on press;
//     border stays at border/subtle through every state, including disabled.
//   - Ghost emphasis is borderless throughout. Surface flips to secondary
//     on press AND disabled.
//   - Action emphasis keeps the action-subtle / border.action pairing
//     identical between default and pressed (the press feedback comes from
//     the icon press behaviour, not a colour shift). Disabled swaps surface
//     to surface.secondary and border to border.subtle.
const EMPHASIS: Record<IconButtonEmphasis, EmphasisSpec> = {
  default: {
    bg: colour.surface.primary,
    bgPressed: colour.surface.secondary,
    bgDisabled: colour.surface.secondary,
    border: colour.border.subtle,
    borderPressed: colour.border.subtle,
    borderDisabled: colour.border.subtle,
    fg: colour["text-n-icon"].primary,
    fgDisabled: colour["text-n-icon"].muted,
  },
  ghost: {
    bg: colour.surface.primary,
    bgPressed: colour.surface.secondary,
    bgDisabled: colour.surface.secondary,
    fg: colour["text-n-icon"].primary,
    fgDisabled: colour["text-n-icon"].muted,
  },
  action: {
    bg: colour.surface["action-subtle"],
    bgPressed: colour.surface["action-subtle"],
    bgDisabled: colour.surface.secondary,
    border: colour.border.action,
    borderPressed: colour.border.action,
    borderDisabled: colour.border.subtle,
    fg: colour["text-n-icon"].action,
    fgDisabled: colour["text-n-icon"].muted,
  },
};

type IconBoxSpec = {
  size: number;
  iconSize: number;
  padding: number;
};

const SIZE: Record<IconButtonSize, IconBoxSpec> = {
  H40: { size: 40, iconSize: 20, padding: space["10"] },
  H36: { size: 36, iconSize: 20, padding: space["8"] },
};

export type IconButtonProps = {
  /** Required — icon-only buttons have no visible label. */
  icon: IconName;
  size?: IconButtonSize;
  emphasis?: IconButtonEmphasis;
  disabled?: boolean;
  onPress?: () => void;
  /** Required for accessibility — icon-only buttons are opaque to screen
   *  readers without a label. */
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-IconButton — square circular icon-only button. Three emphasis levels:
 *   - default — neutral baseline (white surface + subtle border)
 *   - ghost   — same surface, no border (use on busy backgrounds)
 *   - action  — action-subtle surface + action border (the screen's primary
 *               icon CTA — only one per region)
 *
 *   <IconButton icon="system-arrow-right" accessibilityLabel="Next" />
 *   <IconButton icon="system-plus" emphasis="action" accessibilityLabel="Add" />
 */
export function IconButton({
  icon,
  size = "H40",
  emphasis = "default",
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const box = SIZE[size];
  const e = EMPHASIS[emphasis];
  const fg = disabled ? e.fgDisabled : e.fg;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "IconButton",
        emphasis,
        size,
        state: disabled ? "disabled" : "default",
      }}
      style={({ pressed }) => [
        {
          width: box.size,
          height: box.size,
          padding: box.padding,
          borderRadius: radius.rounded,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: disabled
            ? e.bgDisabled
            : pressed
              ? e.bgPressed
              : e.bg,
          borderWidth: e.border ? 1 : 0,
          borderColor: disabled
            ? e.borderDisabled
            : pressed
              ? e.borderPressed
              : e.border,
          ...PRESS_TRANSITION,
        },
        style,
      ]}
    >
      <Icon name={icon} size={box.iconSize} color={fg} />
    </Pressable>
  );
}
