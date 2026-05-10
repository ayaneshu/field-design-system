import { useEffect, useState } from "react";
import {
  I18nManager,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colour, radius, space } from "@field-ds/tokens";

// Figma: M-Toggle — binary on/off thumb-slide.
//   H16 compact · H20 standard · H24 prominent.
// Pair with a visible label; the component renders no text of its own.

const APPLE_EASE = Easing.bezier(0.32, 0.72, 0, 1);
const SLIDE_DURATION = 220;

const SIZE_CFG = {
  H16: { trackW: 28, trackH: 16, thumb: space["12"], shadowRadius: 3.84 },
  H20: { trackW: 34, trackH: 20, thumb: space["16"], shadowRadius: 4.8 },
  H24: { trackW: 42, trackH: 24, thumb: space["20"], shadowRadius: 4.8 },
} as const;

const PADDING = space["2"];

export type ToggleSize = keyof typeof SIZE_CFG;

export type ToggleProps = {
  /** Controlled value. Omit to use uncontrolled mode with `defaultOn`. */
  on?: boolean;
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
  size?: ToggleSize;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Toggle — binary on/off control with a sliding thumb.
 *
 *   <Toggle defaultOn={false} onChange={setEnabled} accessibilityLabel="Notifications" />
 *
 * Honors `useReducedMotion()` by snapping instead of sliding.
 */
export function Toggle({
  on: controlledOn,
  defaultOn = false,
  onChange,
  size = "H20",
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
}: ToggleProps) {
  const isControlled = controlledOn !== undefined;
  const [internal, setInternal] = useState<boolean>(defaultOn);
  const value = isControlled ? controlledOn : internal;

  const cfg = SIZE_CFG[size];
  const travel = cfg.trackW - PADDING * 2 - cfg.thumb;
  const reducedMotion = useReducedMotion();

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    const target = value ? 1 : 0;
    if (reducedMotion) {
      progress.value = target;
    } else {
      progress.value = withTiming(target, {
        duration: SLIDE_DURATION,
        easing: APPLE_EASE,
      });
    }
  }, [value, progress, reducedMotion]);

  const trackOnColor = disabled
    ? colour.surface.muted
    : colour.surface["secondary-inverted"];
  const trackOffColor = colour.surface.muted;
  const thumbColor = disabled
    ? colour.surface.tertiary
    : colour.surface.primary;

  const trackAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [trackOffColor, trackOnColor],
      ),
    }),
    [trackOffColor, trackOnColor],
  );

  const direction = I18nManager.isRTL ? -1 : 1;
  const thumbAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: progress.value * travel * direction }],
    }),
    [travel, direction],
  );

  const handlePress = () => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={8}
      testID={testID}
      style={style}
    >
      <Animated.View
        style={[
          {
            width: cfg.trackW,
            height: cfg.trackH,
            padding: PADDING,
            borderRadius: radius.rounded,
            justifyContent: "center",
          },
          trackAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: cfg.thumb,
              height: cfg.thumb,
              borderRadius: radius.rounded,
              backgroundColor: thumbColor,
              // Figma source: ⚠️ Alpha/grey/300 — not yet a published semantic token.
              shadowColor: "#0e0e0e",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.07,
              shadowRadius: cfg.shadowRadius,
              elevation: 1,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
