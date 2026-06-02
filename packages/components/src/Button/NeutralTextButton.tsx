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

// Maps to Figma M-TextButtonNeutral (1363:245).
// Two sizes per Figma:
//   A14 — pairs with H48/H44 filled buttons.
//   A12 — pairs with H36 filled buttons.
export type NeutralTextButtonSize = "A14" | "A12";

type TextSpec = {
  height: number;
  paddingX: number;
  paddingY: number;
  gap: number;
  radius: number;
  iconSize: number;
  text: FieldTextStyle;
};

const TEXT_SIZE: Record<NeutralTextButtonSize, TextSpec> = {
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

const FG = colour["text-n-icon"].primary;
const FG_DISABLED = colour["text-n-icon"].muted;
const BG_PRESSED = colour.surface.secondary;

export type NeutralTextButtonProps = {
  label: string;
  size?: NeutralTextButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-TextButtonNeutral — low-emphasis CTA in the neutral text tone.
 * Transparent surface with a near-black label and optional icons, picking up
 * a subtle neutral tint on press. Use on coloured / inverted surfaces or
 * when a blue link would compete with the surrounding content. For the
 * default blue text link, reach for `TextButton` instead.
 *
 *   <NeutralTextButton label="Dismiss" />
 *   <NeutralTextButton label="Edit" iconLeft="system-edit" size="A12" />
 */
export function NeutralTextButton({
  label,
  size = "A14",
  iconLeft,
  iconRight,
  disabled = false,
  onPress,
  accessibilityLabel,
  style,
}: NeutralTextButtonProps) {
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
        component: "NeutralTextButton",
        tone: "neutral",
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
            tokenColor: "colour.text-n-icon.primary",
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
