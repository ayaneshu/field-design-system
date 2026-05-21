import { useEffect, useState } from "react";
import {
  I18nManager,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colour, motion, radius, space } from "@field-ds/tokens";

// Figma: M-Toggle — binary on/off thumb-slide.
//   H16 compact · H20 standard · H24 prominent.
// Pair with a visible label; the component renders no text of its own.

const SIZE_CFG = {
  H16: { trackW: 28, trackH: 16, thumb: space["12"], shadowRadius: 3.84 },
  H20: { trackW: 34, trackH: 20, thumb: space["16"], shadowRadius: 4.8 },
  H24: { trackW: 42, trackH: 24, thumb: space["20"], shadowRadius: 4.8 },
} as const;

/** Mid-slide peak width multiplier — the thumb widens as it travels, then
 *  returns to its square footprint at the destination. Animating `width`
 *  (not `scaleX`) keeps the rounded-pill corners crisp at every frame. */
const THUMB_PEAK_W_MULT = 1.3;
/** Touch-down feedback on the whole track. */
const TRACK_PRESS_SCALE = 0.98;

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
 * The thumb slides on `motion.spring.springLight` (shared with M-Switch),
 * its width briefly widens mid-travel to give the move weight, and the
 * whole track scales down to `TRACK_PRESS_SCALE` while held. Honours
 * `useReducedMotion()` by snapping instead of animating.
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

  /** 0 ↔ 1 while flipping — drives translateX, width morph, and track colour. */
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    const target = value ? 1 : 0;
    if (reducedMotion) {
      progress.value = target;
      return;
    }
    progress.value = withSpring(target, motion.spring.springLight);
  }, [value, reducedMotion, progress]);

  /** Touch-down feedback for the whole track. */
  const pressScale = useSharedValue(1);
  const handlePressIn = () => {
    if (disabled) return;
    if (reducedMotion) {
      pressScale.value = TRACK_PRESS_SCALE;
      return;
    }
    pressScale.value = withSpring(TRACK_PRESS_SCALE, motion.spring.springLight);
  };
  const handlePressOut = () => {
    if (reducedMotion) {
      pressScale.value = 1;
      return;
    }
    pressScale.value = withSpring(1, motion.spring.springLight);
  };

  const trackOnColor = disabled
    ? colour.surface.muted
    : colour.surface["secondary-inverted"];
  const trackOffColor = colour.surface.muted;
  const thumbColor = disabled
    ? colour.surface.tertiary
    : colour.surface.primary;

  const direction = I18nManager.isRTL ? -1 : 1;

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [trackOffColor, trackOnColor],
    ),
    transform: [{ scale: pressScale.value }],
  }));

  const thumbAnimatedStyle = useAnimatedStyle(
    () => {
      const p = progress.value;
      // Width morph: rounded square → wider rounded rectangle (pill) → square.
      // Border-radius stays at `radius.rounded`, so the corners stay perfect
      // half-circles at every width.
      const width = interpolate(
        p,
        [0, 0.5, 1],
        [cfg.thumb, cfg.thumb * THUMB_PEAK_W_MULT, cfg.thumb],
        Extrapolation.CLAMP,
      );
      return {
        width,
        transform: [{ translateX: p * travel * direction }],
      };
    },
    [travel, direction, cfg.thumb],
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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
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
