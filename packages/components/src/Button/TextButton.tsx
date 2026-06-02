import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Icon, type IconName } from "@field-ds/icons";
import {
  colour,
  radius,
  space,
  textStyles,
  type FieldTextStyle,
} from "@field-ds/tokens";

import { PRESS_TRANSITION, noFauxBold } from "./sizing";
import { usePressScale } from "./usePressScale";

// Maps to Figma M-TextButtonBlue (1363:208).
// Two sizes per Figma:
//   A14 — pairs with H48/H44 filled buttons.
//   A12 — pairs with H36 filled buttons.
export type TextButtonSize = "A14" | "A12";

type TextSpec = {
  height: number;
  paddingX: number;
  paddingY: number;
  gap: number;
  radius: number;
  iconSize: number;
  text: FieldTextStyle;
};

const TEXT_SIZE: Record<TextButtonSize, TextSpec> = {
  A14: {
    height: 28,
    paddingX: space["8"],
    paddingY: space["4"],
    gap: space["4"],
    radius: radius["6"],
    iconSize: 20,
    text: textStyles.A14_SemiBold,
  },
  A12: {
    height: 24,
    paddingX: space["6"],
    paddingY: space["4"],
    gap: space["4"],
    radius: radius["4"],
    iconSize: 16,
    text: textStyles.A12_SemiBold,
  },
};

const FG = colour["text-n-icon"].action;
const FG_DISABLED = colour["text-n-icon"].muted;
const BG_PRESSED = colour.surface["action-subtle"];

export type TextButtonProps = {
  label: string;
  size?: TextButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-TextButtonBlue — low-emphasis CTA. Transparent surface with a blue label
 * and optional left/right icons, picking up a subtle action tint on press.
 * Use for inline supportive actions ("View all", row-level "Edit", toolbar
 * links) — never as the only action on a screen. For quiet actions on
 * coloured / inverted surfaces, reach for `NeutralTextButton` instead.
 *
 *   <TextButton label="View all" />
 *   <TextButton label="Edit" iconLeft="system-plus" size="A12" />
 */
export function TextButton({
  label,
  size = "A14",
  iconLeft,
  iconRight,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: TextButtonProps) {
  const spec = TEXT_SIZE[size];
  const fg = disabled ? FG_DISABLED : FG;

  const press = usePressScale(disabled);

  return (
    <Animated.View
      style={[press.animatedStyle, { alignSelf: "flex-start" }, style]}
    >
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "TextButton",
        tone: "blue",
        size,
        state: disabled ? "disabled" : "default",
      }}
      style={({ pressed }) => ({
        minHeight: spec.height,
        maxHeight: spec.height,
        paddingHorizontal: spec.paddingX,
        paddingVertical: spec.paddingY,
        borderRadius: spec.radius,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spec.gap,
        backgroundColor: pressed && !disabled ? BG_PRESSED : "transparent",
        ...PRESS_TRANSITION,
      })}
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
                ? "textStyles.A14_SemiBold"
                : "textStyles.A12_SemiBold",
            tokenColor: "colour.text-n-icon.action",
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
    </Animated.View>
  );
}
