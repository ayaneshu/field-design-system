import * as React from "react";
import { ActivityIndicator, I18nManager, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
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

// Pill-shaped neutral CTA — white surface, neutral 1px border, fully rounded.
// Maps to Figma M-NeutralRoundButton (1304:266). Two heights only.
export type RoundButtonSize = "H40" | "H36";

type RoundSpec = {
  height: number;
  paddingX: number;
  paddingY: number;
  gap: number;
  iconSize: number;
  spinnerSize: number;
  text: FieldTextStyle;
};

const ROUND_SIZE: Record<RoundButtonSize, RoundSpec> = {
  H40: {
    height: 40,
    paddingX: space["16"],
    paddingY: space["10"],
    gap: space["6"],
    iconSize: 20,
    spinnerSize: 20,
    text: textStyles.A14_SemiBold,
  },
  H36: {
    height: 36,
    paddingX: space["12"],
    paddingY: space["10"],
    gap: space["4"],
    iconSize: 16,
    spinnerSize: 16,
    text: textStyles.A12_SemiBold,
  },
};

export type RoundButtonRef = React.ElementRef<typeof Pressable>;

export type RoundButtonProps = {
  label: string;
  size?: RoundButtonSize;
  iconLeft?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-NeutralRoundButton — pill-shaped outline CTA. Same colour semantics as
 * `Button variant="secondary-neutral"` but with a fully rounded border. Use
 * for compact toolbar / map-chip / sticky header actions where a pill reads
 * better than a rectangular outline button.
 *
 *   <RoundButton label="Filter" iconLeft="system-plus" />
 *   <RoundButton label="Save" loading />
 */
export const RoundButton = React.forwardRef<RoundButtonRef, RoundButtonProps>(
  function RoundButton(
    {
      label,
      size = "H40",
      iconLeft,
      iconRight,
      loading = false,
      disabled = false,
      fullWidth = false,
      onPress,
      accessibilityLabel,
      style,
    },
    ref,
  ) {
  const spec = ROUND_SIZE[size];
  const isInert = disabled || loading;
  const tokenTextStyle =
    size === "H40"
      ? "textStyles.A14_SemiBold"
      : "textStyles.A12_SemiBold";

  const press = usePressScale(isInert);

  return (
    <Animated.View
      style={[
        press.animatedStyle,
        { alignSelf: fullWidth ? "stretch" : "flex-start" },
        style,
      ]}
    >
    <Pressable
      ref={ref}
      onPress={isInert ? undefined : onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={isInert}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInert, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? label}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "RoundButton",
        size,
        state: disabled ? "disabled" : loading ? "loader" : "default",
      }}
      style={({ pressed }) => ({
        minHeight: spec.height,
        maxHeight: spec.height,
        paddingHorizontal: spec.paddingX,
        paddingVertical: spec.paddingY,
        borderRadius: radius.rounded,
        alignSelf: fullWidth ? "stretch" : "flex-start",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spec.gap,
        backgroundColor: pressed && !isInert
          ? colour.surface.secondary
          : colour.surface.primary,
        borderWidth: 1,
        borderColor: colour.border.primary,
        ...PRESS_TRANSITION,
      })}
    >
      {({ pressed }) => {
        const fg = disabled
          ? colour["text-n-icon"].muted
          : pressed
            ? colour["text-n-icon"].secondary
            : colour["text-n-icon"].primary;
        const tokenColor = disabled
          ? "colour.text-n-icon.muted"
          : pressed
            ? "colour.text-n-icon.secondary"
            : "colour.text-n-icon.primary";

        return (
          <>
            <View
              aria-hidden={loading || undefined}
              style={{
                // Logical ordering: under RTL the row reverses so the
                // `iconLeft` slot lands on the visual start and `iconRight`
                // on the visual end. Prop names stay stable.
                flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
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
                  tokenTextStyle,
                  tokenColor,
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
                <View
                  style={[
                    {
                      width: spec.spinnerSize,
                      height: spec.spinnerSize,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    // Web: kill inline baseline descent under the SVG so the
                    // rotation centroid actually sits on the wrapper's center.
                    { lineHeight: 0 } as unknown as ViewStyle,
                  ]}
                >
                  <ActivityIndicator size={spec.spinnerSize} color={fg} />
                </View>
              </View>
            ) : null}
          </>
        );
      }}
    </Pressable>
    </Animated.View>
  );
  },
);
