import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon, type IconName } from "@field-ds/icons";
import { motion } from "@field-ds/tokens";

import {
  PRESS_TRANSITION,
  getButtonSpec,
  noFauxBold,
  type ButtonSize,
  type RectButtonVariant,
} from "./sizing";

const PRIMARY_TOUCH_SCALE = 0.98;

// Tone descriptor consumed by RectButton. Each public component
// (PrimaryButton, SecondaryButton, SecondaryNeutralButton, NeutralButton)
// owns one of these and passes it in.
export type RectButtonTone = {
  bg: string;
  bgPressed: string;
  bgDisabled: string;
  border?: string;
  borderPressed?: string;
  borderDisabled?: string;
  fg: string;
  // Optional press-state foreground. Only set when the variant shifts the
  // label/icon colour on press (e.g. secondary-neutral fades to
  // text-n-icon/secondary).
  fgPressed?: string;
  fgDisabled: string;
  // Token name emitted on the Text dataSet for the design-system audit tool.
  fgToken: string;
  fgPressedToken?: string;
};

// Props common to every rectangular button. Public components extend this
// and narrow `size` to the set their family supports in Figma.
export type RectButtonBaseProps = {
  /** Visible label. Verb-first, short ("Continue", "Add to cart"). */
  label: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Loader state — content is hidden behind a centred spinner. Footprint
   *  is preserved so the layout doesn't reflow. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to fill the parent's width. Off by default. */
  fullWidth?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type Props = RectButtonBaseProps & {
  size: ButtonSize;
  tone: RectButtonTone;
  variantKey: RectButtonVariant;
  // dataSet `component` value — distinct per public wrapper so audit /
  // testing tooling can target each family independently.
  componentName:
    | "PrimaryButton"
    | "SecondaryButton"
    | "SecondaryNeutralButton"
    | "NeutralButton";
};

/**
 * Internal renderer shared by `PrimaryButton`, `SecondaryButton`,
 * `SecondaryNeutralButton`, and `NeutralButton`. Not exported from the
 * package — callers use the dedicated public components so each family's
 * size + tone are narrowly typed.
 */
export function RectButton({
  label,
  size,
  tone,
  variantKey,
  componentName,
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
  style,
}: Props) {
  const spec = getButtonSpec(variantKey, size);
  const isInert = disabled || loading;

  const primaryPressScale = useSharedValue(1);
  const isPrimary = variantKey === "primary";

  const primaryScaleStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: isPrimary ? primaryPressScale.value : 1 }],
    }),
    [isPrimary],
  );

  useEffect(() => {
    if (!isPrimary || !isInert) return;
    cancelAnimation(primaryPressScale);
    primaryPressScale.value = 1;
  }, [isInert, isPrimary, primaryPressScale]);

  const handlePrimaryPressIn = () => {
    if (!isPrimary || isInert) return;
    primaryPressScale.value = withTiming(PRIMARY_TOUCH_SCALE, {
      duration: motion.duration.xs,
    });
  };

  const handlePrimaryPressOut = () => {
    if (!isPrimary || isInert) return;
    primaryPressScale.value = withSpring(1, motion.spring.snappy);
  };

  const pressableNode = (
    <Pressable
      onPress={isInert ? undefined : onPress}
      onPressIn={isPrimary ? handlePrimaryPressIn : undefined}
      onPressOut={isPrimary ? handlePrimaryPressOut : undefined}
      disabled={isInert}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInert, busy: loading }}
      accessibilityLabel={accessibilityLabel ?? label}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: componentName,
        variant: variantKey,
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
          alignSelf: isPrimary
            ? fullWidth
              ? "stretch"
              : undefined
            : fullWidth
              ? "stretch"
              : "flex-start",
          width: isPrimary && fullWidth ? ("100%" as const) : undefined,
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
        ...(isPrimary ? [] : [style]),
      ]}
    >
      {({ pressed }) => {
        const fg = disabled
          ? tone.fgDisabled
          : pressed && tone.fgPressed
            ? tone.fgPressed
            : tone.fg;
        const fgToken = disabled
          ? "colour.text-n-icon.muted"
          : pressed && tone.fgPressedToken
            ? tone.fgPressedToken
            : tone.fgToken;

        return (
          <>
            {/* Content row — opacity drops to 0 in loader state so the
                spinner can take centre stage without changing the
                button's intrinsic width. */}
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
                  tokenTextStyle: spec.textStyleName,
                  tokenColor: fgToken,
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
          </>
        );
      }}
    </Pressable>
  );

  if (!isPrimary) {
    return pressableNode;
  }

  return (
    <Animated.View
      style={[
        primaryScaleStyle,
        { alignSelf: fullWidth ? "stretch" : "flex-start" },
        style,
      ]}
    >
      {pressableNode}
    </Animated.View>
  );
}
