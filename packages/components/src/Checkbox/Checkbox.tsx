import { forwardRef, useEffect, useState } from "react";
import type { ElementRef } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { colour, motion } from "@field-ds/tokens";

import { fieldEasingStandard } from "../fieldMotion";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ─── Motion constants exposed for the motion timeline ───
/** Duration of the check-in driver (outline → filled). */
export const CHECKBOX_CHECK_IN_MS = motion.duration.emphasized;
/** Duration of the uncheck-out driver (filled → outline). */
export const CHECKBOX_RECEDE_MS = motion.duration.recede;
/** Delay before the tick begins drawing (after the box has landed). */
export const CHECKBOX_TICK_DELAY_MS = motion.delay.beat;

// Figma: M-Checkbox — three sizes, three visual states.
//   H24 default · H20 dense lists · H16 compact tables only.
const SIZE_PX = { H16: 16, H20: 20, H24: 24 } as const;

export type CheckboxSize = keyof typeof SIZE_PX;

// Easing + durations from `motion` tokens (Field DS motion foundation).

// Path data lifted verbatim from the Figma M-Checkbox export so the rounded
// "squircle" frame matches the design 1:1.
const OUTLINE_D =
  "M12 21.3925C10.07 21.3925 8.13875 21.2725 6.2225 21.0325C4.51875 20.82 3.18 19.48 2.96625 17.7762C2.4875 13.9425 2.4875 10.055 2.96625 6.22125C3.17875 4.5175 4.51875 3.17875 6.2225 2.965C10.0562 2.48625 13.9437 2.48625 17.7775 2.965C19.4812 3.1775 20.82 4.51625 21.0337 6.22125C21.5125 10.055 21.5125 13.9425 21.0337 17.7762C20.8212 19.48 19.4812 20.8187 17.7775 21.0325C15.86 21.2725 13.93 21.3925 12 21.3925ZM12 4.1075C10.1312 4.1075 8.26375 4.22375 6.40875 4.455C5.38625 4.5825 4.5825 5.38625 4.455 6.40875C3.99125 10.1187 3.99125 13.8812 4.455 17.5925C4.5825 18.615 5.38625 19.4187 6.40875 19.5462C10.1187 20.01 13.8812 20.01 17.5925 19.5462C18.615 19.4187 19.4187 18.615 19.5462 17.5925C20.01 13.8825 20.01 10.12 19.5462 6.40875C19.4187 5.38625 18.615 4.5825 17.5925 4.455C15.7375 4.2225 13.8687 4.1075 12.0012 4.1075H12Z";

const FILL_BOX_D =
  "M21.0337 6.22225C20.8212 4.5185 19.4812 3.17975 17.7775 2.966C13.9437 2.48725 10.0562 2.48725 6.22249 2.966C4.51874 3.1785 3.17999 4.5185 2.96624 6.22225C2.48749 10.056 2.48749 13.9435 2.96624 17.7773C3.17874 19.481 4.51874 20.8198 6.22249 21.0335C8.13874 21.2735 10.07 21.3935 12 21.3935C13.93 21.3935 15.8612 21.2735 17.7775 21.0335C19.4812 20.821 20.82 19.481 21.0337 17.7773C21.5125 13.9435 21.5125 10.056 21.0337 6.22225Z";

// Stroke path traced down the centreline of the Figma check glyph. Drawn as
// a stroke (not a filled shape) so we can run a trim-path animation via
// `strokeDashoffset`. Path length is precomputed from the two segments
// (8,12 → 10.5,14.5 → 16,9.5 ≈ 3.54 + 7.43 ≈ 10.97 in viewBox units).
const CHECK_STROKE_D = "M 8 12 L 10.5 14.5 L 16 9.5";
const CHECK_PATH_LENGTH = 11;

export type CheckboxRef = ElementRef<typeof Pressable>;

export type CheckboxProps = {
  /** Controlled selected state. Omit to use uncontrolled mode with `defaultSelected`. */
  selected?: boolean;
  defaultSelected?: boolean;
  onChange?: (next: boolean) => void;
  size?: CheckboxSize;
  disabled?: boolean;
  /** Accessible label for screen readers when there's no visible label nearby. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-Checkbox — selection control for toggling items on or off.
 *
 *   <Checkbox selected={agreed} onChange={setAgreed} />
 *   <Checkbox size="H20" defaultSelected />
 *
 * Selection animates with the same Apple-style ease-out used elsewhere in
 * the system: outline cross-fades into the filled box, the tick scales in
 * from the centre, and the box gives a tiny lift on selection.
 */
export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(function Checkbox(
  {
    selected: controlledSelected,
    defaultSelected = false,
    onChange,
    size = "H24",
    disabled = false,
    accessibilityLabel,
    style,
  },
  ref,
) {
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
  // drawing — token-driven (`motion.delay.beat / motion.duration.emphasized`)
  // so any change to either token propagates without touching the component.
  const TICK_START_FRACTION =
    motion.delay.beat / motion.duration.emphasized;

  // Outline ring fades out as the fill box swells in.
  // Explicit dep array — Reanimated requires it on web without the Babel plugin.
  const outlineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6], [1, 0], "clamp"),
  }), [progress]);

  // Filled box opacity-only fade-in — no scale, the box appears in place.
  const fillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [0, 1], "clamp"),
  }), [progress]);

  // Tick is opacity-stable; the line is drawn via `strokeDashoffset`. With
  // `strokeDasharray = CHECK_PATH_LENGTH`, an offset equal to the length
  // hides the path and 0 reveals it fully — same effect as After Effects'
  // trim-path. The draw waits `motion.delay.beat` (≈55% of the
  // check-in driver) so the box appears first, then the tick draws on top.
  const checkAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(
      progress.value,
      [TICK_START_FRACTION, 1],
      [CHECK_PATH_LENGTH, 0],
      "clamp",
    ),
  }), [progress, TICK_START_FRACTION]);

  const fillColor = selected
    ? disabled
      ? colour["text-n-icon"].muted
      : colour["text-n-icon"].primary
    : disabled
      ? colour.border.medium
      : colour["text-n-icon"].tertiary;

  const toggle = () => {
    if (disabled) return;
    const next = !selected;
    if (!isControlled) setInternalSelected(next);
    onChange?.(next);
  };

  return (
    <Pressable
      ref={ref}
      onPress={toggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      // hitSlop sized from the box so the effective touch target reaches
      // ~44px on each axis: H16 → 16+14*2=44, H20 → 20+12*2=44. Visual box
      // size is unchanged.
      hitSlop={size === "H16" ? 14 : size === "H20" ? 12 : 4}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "Checkbox",
        tokenColor: selected
          ? disabled
            ? "colour.text-n-icon.muted"
            : "colour.text-n-icon.primary"
          : disabled
            ? "colour.border.medium"
            : "colour.text-n-icon.tertiary",
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
      {/* Outline ring (fades out on select) */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", width: px, height: px },
          outlineStyle,
        ]}
      >
        <Svg width={px} height={px} viewBox="0 0 24 24" fill="none">
          <Path
            d={OUTLINE_D}
            fill={
              disabled
                ? colour.border.medium
                : colour["text-n-icon"].tertiary
            }
            fillRule="evenodd"
          />
        </Svg>
      </Animated.View>

      {/* Filled box (scales in on select) */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", width: px, height: px },
          fillStyle,
        ]}
      >
        <Svg width={px} height={px} viewBox="0 0 24 24" fill="none">
          <Path d={FILL_BOX_D} fill={fillColor} />
        </Svg>
      </Animated.View>

      {/* Tick — stroke path that "draws itself" via strokeDashoffset (trim
          path animation). Rounded caps/joints so the corners read clean
          at every size. */}
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
});
