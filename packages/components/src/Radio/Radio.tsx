import { useEffect, useState } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

import { colour, motion } from "@field-ds/tokens";

import { fieldEasingStandard } from "../fieldMotion";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ─── Motion constants exposed for the motion timeline ───
/** Duration of the select-in driver (outline → filled). */
export const RADIO_SELECT_IN_MS = motion.duration.emphasized;
/** Duration of the unselect-out driver (filled → outline). */
export const RADIO_RECEDE_MS = motion.duration.recede;
/** Delay before the tick begins drawing (after the disc has landed). */
export const RADIO_TICK_DELAY_MS = motion.delay.beat;

// Figma: M-Radio — three sizes, three visual states.
//   H24 default · H20 dense lists · H16 compact tables only.
const SIZE_PX = { H16: 16, H20: 20, H24: 24 } as const;

export type RadioSize = keyof typeof SIZE_PX;

// Centerline of the check tick in the 24×24 viewBox — same coordinates as
// M-Checkbox so the family reads coherently. Drawn as a stroke so the
// trim-path animation (via `strokeDashoffset`) makes the tick appear to be
// drawn rather than scale in.
const CHECK_STROKE_D = "M 8 12 L 10.5 14.5 L 16 9.5";
const CHECK_PATH_LENGTH = 11;

export type RadioProps = {
  /** Controlled selected state. Omit to use uncontrolled mode with `defaultSelected`. */
  selected?: boolean;
  defaultSelected?: boolean;
  /** Fires only on transitions to `true` — tapping an already-selected radio is a no-op. */
  onChange?: (next: boolean) => void;
  size?: RadioSize;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-Radio — single-select control for mutually exclusive choices. Always
 * render in a group of two or more, always paired with a label.
 *
 *   <Radio selected={value === "fast"} onChange={() => setValue("fast")} />
 *   <Radio size="H20" defaultSelected />
 *
 * Selection animates with the same pattern as M-Checkbox: the outline ring
 * fades out, the filled disc fades in (no scale), and the tick is drawn on
 * top via a trim-path animation after a `motion.delay.beat` pause.
 */
export function Radio({
  selected: controlledSelected,
  defaultSelected = false,
  onChange,
  size = "H24",
  disabled = false,
  accessibilityLabel,
  style,
}: RadioProps) {
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selected = isControlled ? controlledSelected : internalSelected;

  const px = SIZE_PX[size];

  // 0 = unselected, 1 = selected.
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {
      duration: selected
        ? motion.duration.emphasized
        : motion.duration.recede,
      easing: fieldEasingStandard,
    });
  }, [selected, progress]);

  // Fraction of the check-in driver that the tick waits before it starts
  // drawing — token-driven (`motion.delay.beat / motion.duration.emphasized`).
  const TICK_START_FRACTION =
    motion.delay.beat / motion.duration.emphasized;

  const unselectedFill = disabled
    ? colour.surface.secondary
    : colour.surface.primary;
  const selectedFill = disabled
    ? colour["text-n-icon"].muted
    : colour["text-n-icon"].action;

  // Outline ring fades out as the selected disc swells in.
  const outlineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6], [1, 0], "clamp"),
  }), [progress]);

  // Filled disc — opacity-only fade-in (no scale). The disc appears in place
  // and the tick draws on top after the beat-token delay.
  const fillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [0, 1], "clamp"),
  }), [progress]);

  // Tick is opacity-stable; the line is drawn via `strokeDashoffset` once
  // progress has passed `TICK_START_FRACTION` — same trim-path pattern the
  // Checkbox uses.
  const checkAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      progress.value,
      [TICK_START_FRACTION, 1],
      [CHECK_PATH_LENGTH, 0],
      "clamp",
    ),
  }), [progress, TICK_START_FRACTION]);

  const select = () => {
    if (disabled || selected) return;
    if (!isControlled) setInternalSelected(true);
    onChange?.(true);
  };

  return (
    <Pressable
      onPress={select}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={size === "H16" ? 8 : 4}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "Radio",
        tokenColor: selected
          ? disabled
            ? "colour.text-n-icon.muted"
            : "colour.text-n-icon.action"
          : disabled
            ? "colour.surface.secondary"
            : "colour.surface.primary",
      }}
      style={({ pressed }) => [
        {
          width: px,
          height: px,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed && !disabled ? 0.85 : 1,
          transitionProperty: "opacity",
          transitionDuration: "120ms",
          transitionTimingFunction: "ease-out",
        },
        style,
      ]}
    >
      {/* Background disc — always present, holds the unselected fill colour. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: px,
          height: px,
          borderRadius: px / 2,
          backgroundColor: unselectedFill,
        }}
      />

      {/* Outline ring (1px) — fades out on select. */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: px,
            height: px,
            borderRadius: px / 2,
            borderWidth: 1,
            borderColor: colour.border.medium,
          },
          outlineStyle,
        ]}
      />

      {/* Selected disc — flat fill, opacity-only fade-in. */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", width: px, height: px },
          fillStyle,
        ]}
      >
        <Svg width={px} height={px} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={12} fill={selectedFill} />
        </Svg>
      </Animated.View>

      {/* Tick — stroke path that "draws itself" via strokeDashoffset (trim
          path animation). Rounded caps/joints so the corner reads clean at
          every size. */}
      <Animated.View
        pointerEvents="none"
        style={{ position: "absolute", width: px, height: px }}
      >
        <Svg width={px} height={px} viewBox="0 0 24 24" fill="none">
          <AnimatedPath
            d={CHECK_STROKE_D}
            stroke={colour.surface.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={CHECK_PATH_LENGTH}
            animatedProps={checkAnimatedProps}
          />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}
