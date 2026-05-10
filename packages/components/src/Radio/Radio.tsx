import { useEffect, useState } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { colour } from "@field-ds/tokens";

// Figma: M-Radio — three sizes, three visual states.
//   H24 default · H20 dense lists · H16 compact tables only.
const SIZE_PX = { H16: 16, H20: 20, H24: 24 } as const;

export type RadioSize = keyof typeof SIZE_PX;

// Apple-style ease-out — same curve used in M-Checkbox so the family animates
// in lock-step.
const APPLE_EASE = Easing.bezier(0.32, 0.72, 0, 1);
const SELECT_DURATION = 220;
const DESELECT_DURATION = 180;

// Filled-disc-with-check-cutout paths exported verbatim from the Figma
// M-Radio source (one per size — the proportions are hand-tuned per size, not
// a uniform scale). Fill-rule even-odd carves the checkmark out of the disc.
const SELECTED_D: Record<RadioSize, string> = {
  H24:
    "M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM16.4434 9.7673C16.7398 9.35245 16.6437 8.77595 16.2288 8.47963C15.814 8.18331 15.2375 8.2794 14.9412 8.69424L10.9591 14.2691L8.96041 12.2704C8.59992 11.9099 8.01546 11.9099 7.65498 12.2704C7.2945 12.6308 7.2945 13.2153 7.65498 13.5758L10.4242 16.345C10.6161 16.5369 10.8826 16.6346 11.1531 16.6122C11.4235 16.5899 11.6703 16.4496 11.8281 16.2288L16.4434 9.7673Z",
  H20:
    "M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM13.7029 8.13941C13.9498 7.79371 13.8697 7.31329 13.524 7.06636C13.1783 6.81943 12.6979 6.8995 12.451 7.2452L9.13261 11.8909L7.46701 10.2253C7.1666 9.9249 6.67955 9.9249 6.37915 10.2253C6.07875 10.5257 6.07875 11.0128 6.37915 11.3132L8.68684 13.6209C8.84673 13.7807 9.06887 13.8622 9.29422 13.8435C9.51956 13.8249 9.72529 13.708 9.85672 13.524L13.7029 8.13941Z",
  H16:
    "M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM10.9623 6.51153C11.1598 6.23497 11.0958 5.85063 10.8192 5.65309C10.5427 5.45554 10.1583 5.5196 9.96078 5.79616L7.30609 9.51273L5.9736 8.18024C5.73328 7.93992 5.34364 7.93992 5.10332 8.18024C4.863 8.42056 4.863 8.8102 5.10332 9.05053L6.94947 10.8967C7.07738 11.0246 7.2551 11.0897 7.43537 11.0748C7.61565 11.0599 7.78023 10.9664 7.88537 10.8192L10.9623 6.51153Z",
};

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
 * Selection animates with the same Apple-style ease-out as M-Checkbox: the
 * outline ring fades out and the filled disc-with-check-cutout scales in.
 * The check shape is carved out of the disc via SVG even-odd fill so the
 * underlying surface shows through — matching the Figma source exactly.
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
      duration: selected ? SELECT_DURATION : DESELECT_DURATION,
      easing: APPLE_EASE,
    });
  }, [selected, progress]);

  const unselectedFill = disabled
    ? colour.surface.secondary
    : colour.surface.primary;
  const selectedFill = disabled
    ? colour["text-n-icon"].muted
    : colour["text-n-icon"].action;

  // Outline ring fades out as the selected disc swells in.
  // Explicit dep array — Reanimated requires it on web without the Babel plugin.
  const outlineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6], [1, 0], "clamp"),
  }), [progress]);

  // Filled disc-with-check-cutout scales from 70% → 100% with a snappy fade.
  // Same shape as the M-Checkbox fill animation so the family reads as one.
  const fillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4], [0, 1], "clamp"),
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.7, 1], "clamp") },
    ],
  }), [progress]);

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
          // @ts-expect-error rn-web passes through to DOM
          transitionProperty: "opacity",
          transitionDuration: "120ms",
          transitionTimingFunction: "ease-out",
        },
        style,
      ]}
    >
      {/* Background disc — always present, holds the unselected fill colour
          so the check cutout in the selected layer reveals the right surface. */}
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

      {/* Selected fill — disc with checkmark cutout, scales in. */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", width: px, height: px },
          fillStyle,
        ]}
      >
        <Svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} fill="none">
          <Path d={SELECTED_D[size]} fill={selectedFill} fillRule="evenodd" />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}
