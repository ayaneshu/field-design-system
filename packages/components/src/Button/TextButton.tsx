import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon, type IconName } from "@field-ds/icons";
import {
  colour,
  radius,
  space,
  textStyles,
  type FieldTextStyle,
} from "@field-ds/tokens";

import { PRESS_TRANSITION, noFauxBold } from "./sizing";

// Maps to Figma M-TextButtonBlue (1363:208) and M-TextButtonNeutral (1363:245).
// Two sizes per Figma:
//   A14 — pairs with H48/H44 filled buttons.
//   A12 — pairs with H36 filled buttons.
export type TextButtonTone = "blue" | "neutral";
export type TextButtonSize = "A14" | "A12";

type TextSpec = {
  paddingX: number;
  paddingY: number;
  gap: number;
  iconSize: number;
  text: FieldTextStyle;
};

const TEXT_SIZE: Record<TextButtonSize, TextSpec> = {
  A14: {
    paddingX: space["8"],
    paddingY: space["4"],
    gap: space["4"],
    iconSize: 20,
    text: textStyles.Action_A14_SemiBold,
  },
  A12: {
    paddingX: space["8"],
    paddingY: space["4"],
    gap: space["4"],
    iconSize: 16,
    text: textStyles.Action_A12_SemiBold,
  },
};

const TONE: Record<TextButtonTone, {
  fg: string;
  fgDisabled: string;
  bgPressed: string;
}> = {
  blue: {
    fg: colour["text-n-icon"].action,
    fgDisabled: colour["text-n-icon"].muted,
    bgPressed: colour.surface["action-subtle"],
  },
  neutral: {
    fg: colour["text-n-icon"].primary,
    fgDisabled: colour["text-n-icon"].muted,
    bgPressed: colour.surface.secondary,
  },
};

export type TextButtonProps = {
  label: string;
  /** Defaults to `blue` (M-Button/Text-Blue). Use `neutral` on coloured /
   *  inverted surfaces or when the action should sit quietly. */
  tone?: TextButtonTone;
  size?: TextButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-TextButtonBlue / M-TextButtonNeutral — low-emphasis CTA. Transparent
 * surface with optional left/right icons, picking up a subtle tint on press.
 * Use for inline supportive actions ("View all", row-level "Edit", toolbar
 * links) — never as the only action on a screen.
 *
 *   <TextButton label="View all" />
 *   <TextButton label="Edit" tone="neutral" iconLeft="system-plus" size="A12" />
 */
export function TextButton({
  label,
  tone = "blue",
  size = "A14",
  iconLeft,
  iconRight,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: TextButtonProps) {
  const spec = TEXT_SIZE[size];
  const t = TONE[tone];
  const fg = disabled ? t.fgDisabled : t.fg;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "TextButton",
        tone,
        size,
        state: disabled ? "disabled" : "default",
      }}
      style={({ pressed }) => [
        {
          paddingHorizontal: spec.paddingX,
          paddingVertical: spec.paddingY,
          borderRadius: radius["6"],
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spec.gap,
          backgroundColor: pressed && !disabled ? t.bgPressed : "transparent",
          ...PRESS_TRANSITION,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spec.gap,
        }}
      >
        {iconLeft ? (
          <Icon name={iconLeft} size={spec.iconSize} color={fg} />
        ) : null}
        <Text
          numberOfLines={1}
          // @ts-expect-error — dataSet on Text on web
          dataSet={{
            tokenTextStyle:
              size === "A14"
                ? "textStyles.Action_A14_SemiBold"
                : "textStyles.Action_A12_SemiBold",
            tokenColor:
              tone === "blue"
                ? "colour.text-n-icon.action"
                : "colour.text-n-icon.primary",
          }}
          style={[noFauxBold(spec.text), { color: fg }]}
        >
          {label}
        </Text>
        {iconRight ? (
          <Icon name={iconRight} size={spec.iconSize} color={fg} />
        ) : null}
      </View>
    </Pressable>
  );
}
