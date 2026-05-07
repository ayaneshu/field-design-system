import { ActivityIndicator, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon, type IconName } from "@field-ds/icons";
import { colour } from "@field-ds/tokens";

import {
  BUTTON_SIZE,
  PRESS_TRANSITION,
  noFauxBold,
  type ButtonSize,
} from "./sizing";

// Maps to the four rectangular families in Figma (Button page, node 178:2):
//   primary           → M-PrimaryButton          (filled blue)
//   secondary         → M-SecondaryButton        (white + blue outline)
//   secondary-neutral → M-SecondaryNeutralButton (white + neutral outline)
//   neutral           → M-NeutralButton          (filled near-black)
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-neutral"
  | "neutral";

type Tone = {
  bg: string;
  bgPressed: string;
  bgDisabled: string;
  border?: string;
  borderPressed?: string;
  borderDisabled?: string;
  fg: string;
  fgDisabled: string;
};

const TONES: Record<ButtonVariant, Tone> = {
  primary: {
    bg: colour.surface["action-bold"],
    bgPressed: colour.surface["action-extrabold"],
    bgDisabled: colour.surface.secondary,
    fg: colour["text-n-icon"]["on-surface-bold"],
    fgDisabled: colour["text-n-icon"].muted,
  },
  secondary: {
    bg: colour.surface.primary,
    bgPressed: colour.surface["action-subtle"],
    bgDisabled: colour.surface.secondary,
    border: colour.border.action,
    borderPressed: colour.border.action,
    borderDisabled: colour.border.subtle,
    fg: colour["text-n-icon"].action,
    fgDisabled: colour["text-n-icon"].muted,
  },
  "secondary-neutral": {
    bg: colour.surface.primary,
    bgPressed: colour.surface.secondary,
    bgDisabled: colour.surface.secondary,
    border: colour.border.primary,
    borderPressed: colour.border.primary,
    borderDisabled: colour.border.subtle,
    fg: colour["text-n-icon"].primary,
    fgDisabled: colour["text-n-icon"].muted,
  },
  neutral: {
    bg: colour.surface["primary-inverted"],
    bgPressed: colour.surface["secondary-inverted"],
    bgDisabled: colour.surface.secondary,
    fg: colour["text-n-icon"]["on-surface-bold"],
    fgDisabled: colour["text-n-icon"].muted,
  },
};

export type ButtonProps = {
  /** Visible label. Verb-first, short ("Continue", "Add to cart"). */
  label: string;
  variant?: ButtonVariant;
  /**
   * Height token. H56 for sheet/full-width CTAs; H52/H48 for inline content
   * actions; H40 for dense inline; H36 for rows/tables; H32 only on `neutral`
   * for compact toolbars.
   */
  size?: ButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Loader state — content is hidden behind a centred spinner. Footprint is
   *  preserved so the layout doesn't reflow. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to fill the parent's width. Off by default. */
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Rectangular text+icon button. Maps to Figma's M-PrimaryButton,
 * M-SecondaryButton, M-SecondaryNeutralButton, and M-NeutralButton.
 * Heights, paddings and type sizes are token-driven via {@link BUTTON_SIZE}.
 *
 *   <Button label="Continue" variant="primary" />
 *   <Button label="Cancel" variant="secondary" iconLeft="system-arrow-right" />
 *   <Button label="Saving" variant="primary" loading />
 *   <Button label="Unavailable" variant="primary" disabled />
 *
 * Loader state preserves the button's footprint by stamping a centred spinner
 * over the content (label + icons stay rendered at opacity 0).
 */
export function Button({
  label,
  variant = "primary",
  size = "H56",
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const spec = BUTTON_SIZE[size];
  const tone = TONES[variant];

  const isInert = disabled || loading;
  const fg = disabled ? tone.fgDisabled : tone.fg;

  return (
    <Pressable
      onPress={isInert ? undefined : onPress}
      disabled={isInert}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInert, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? label}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "Button",
        variant,
        size,
        state: disabled ? "disabled" : loading ? "loader" : "default",
      }}
      style={({ pressed }) => [
        {
          minHeight: spec.height,
          maxHeight: spec.height,
          paddingHorizontal: spec.paddingX,
          paddingVertical: spec.paddingY,
          borderRadius: spec.radius,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spec.gap,
          backgroundColor: disabled
            ? tone.bgDisabled
            : pressed
              ? tone.bgPressed
              : tone.bg,
          borderWidth: tone.border ? 1 : 0,
          borderColor: disabled
            ? tone.borderDisabled
            : pressed
              ? tone.borderPressed
              : tone.border,
          ...PRESS_TRANSITION,
        },
        style,
      ]}
    >
      {/* Content row — opacity drops to 0 in loader state so the spinner can
          take centre stage without changing the button's intrinsic width. */}
      <View
        aria-hidden={loading || undefined}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spec.gap,
          opacity: loading ? 0 : 1,
        }}
      >
        {iconLeft ? (
          <Icon name={iconLeft} size={spec.iconSize} color={fg} />
        ) : null}
        <Text
          numberOfLines={1}
          // @ts-expect-error — dataSet on Text on web
          dataSet={{
            tokenTextStyle: textStyleTokenName(size),
            tokenColor: variant === "secondary"
              ? "colour.text-n-icon.action"
              : variant === "secondary-neutral"
                ? "colour.text-n-icon.primary"
                : "colour.text-n-icon.on-surface-bold",
          }}
          style={[noFauxBold(spec.text), { color: fg }]}
        >
          {label}
        </Text>
        {iconRight ? (
          <Icon name={iconRight} size={spec.iconSize} color={fg} />
        ) : null}
      </View>

      {loading ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color={fg} />
        </View>
      ) : null}
    </Pressable>
  );
}

// Maps a button height to its text-style token name for the dataSet attribute
// (used by the design system audit tooling).
function textStyleTokenName(size: ButtonSize) {
  switch (size) {
    case "H56":
      return "textStyles.Action_A17_SemiBold";
    case "H52":
      return "textStyles.Action_A16_SemiBold";
    case "H48":
      return "textStyles.Action_A14_SemiBold";
    default:
      return "textStyles.Action_A12_SemiBold";
  }
}
