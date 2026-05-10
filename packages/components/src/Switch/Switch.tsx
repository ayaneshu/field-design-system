import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colour, radius, space, textStyles } from "@field-ds/tokens";

// Figma: M-Switch — pill-shaped segmented control.
//   H40 default · H48 large. Each variant supports 2-4 mutually-exclusive slots.
//
// Naming: Figma calls this M-Switch but it's structurally a segmented control.
// Consumers who need RN's boolean Switch should rename on import:
//   import { Switch as DSSwitch } from "@field-ds/components";

const APPLE_EASE = Easing.bezier(0.32, 0.72, 0, 1);
const SLIDE_DURATION = 220;

const SIZE_CFG = {
  H40: {
    track: space["40"],
    thumb: space["32"],
    padding: space["4"],
    textStyle: textStyles.Body_B12_SemiBold,
  },
  H48: {
    track: space["48"],
    thumb: space["40"],
    padding: space["4"],
    textStyle: textStyles.Body_B14_SemiBold,
  },
} as const;

export type SwitchSize = keyof typeof SIZE_CFG;

export type SwitchOption<T> = {
  value: T;
  label: string;
  /** Optional override; defaults to `label`. */
  accessibilityLabel?: string;
};

export type SwitchProps<T = string> = {
  /** 2-4 mutually-exclusive slots. */
  options: SwitchOption<T>[];
  /** Controlled active value. Omit to use uncontrolled mode with `defaultValue`. */
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: SwitchSize;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Switch — pill-shaped segmented control for picking one of 2–4 options.
 *
 *   <Switch
 *     options={[{ value: "off", label: "Off" }, { value: "on", label: "On" }]}
 *     defaultValue="off"
 *     onChange={setMode}
 *   />
 *
 * The active slot is highlighted by a white thumb that slides between
 * positions using the same Apple-style ease-out curve used elsewhere in
 * the system. Honors `useReducedMotion()` by snapping instead of sliding.
 */
export function Switch<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  size = "H40",
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}: SwitchProps<T>) {
  const isControlled = controlledValue !== undefined;
  const fallback = (defaultValue ?? options[0]?.value) as T;
  const [internal, setInternal] = useState<T>(fallback);
  const value = isControlled ? controlledValue : internal;

  const foundIndex = options.findIndex((o) => o.value === value);
  const activeIndex = foundIndex < 0 ? 0 : foundIndex;

  const cfg = SIZE_CFG[size];
  const reducedMotion = useReducedMotion();

  const [trackWidth, setTrackWidth] = useState(0);
  const slotWidth =
    trackWidth > 0 ? (trackWidth - cfg.padding * 2) / options.length : 0;

  const indexProgress = useSharedValue(activeIndex);

  useEffect(() => {
    if (reducedMotion) {
      indexProgress.value = activeIndex;
    } else {
      indexProgress.value = withTiming(activeIndex, {
        duration: SLIDE_DURATION,
        easing: APPLE_EASE,
      });
    }
  }, [activeIndex, indexProgress, reducedMotion]);

  const thumbAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: indexProgress.value * slotWidth }],
    }),
    [slotWidth],
  );

  const handlePress = (option: SwitchOption<T>) => {
    if (disabled) return;
    if (option.value === value) return;
    if (!isControlled) setInternal(option.value);
    onChange?.(option.value);
  };

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== trackWidth) setTrackWidth(w);
  };

  return (
    <View
      onLayout={onTrackLayout}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      style={[
        {
          flexDirection: "row",
          height: cfg.track,
          padding: cfg.padding,
          borderRadius: radius.rounded,
          backgroundColor: colour.surface.secondary,
          opacity: disabled ? 0.5 : 1,
          alignSelf: "stretch",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {slotWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: cfg.padding,
              left: cfg.padding,
              height: cfg.thumb,
              width: slotWidth,
              borderRadius: radius.rounded,
              backgroundColor: colour.surface.primary,
              shadowColor: "#222222",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 1,
            },
            thumbAnimatedStyle,
          ]}
        />
      ) : null}

      {options.map((opt, i) => {
        const isActive = i === activeIndex;
        return (
          <Pressable
            key={`${String(opt.value)}-${i}`}
            onPress={() => handlePress(opt)}
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled }}
            accessibilityLabel={opt.accessibilityLabel ?? opt.label}
            hitSlop={space["4"]}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: space["10"],
              opacity: pressed && !disabled ? 0.85 : 1,
              borderRadius: radius.rounded,
            })}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                cfg.textStyle,
                {
                  color: isActive
                    ? colour["text-n-icon"].primary
                    : colour["text-n-icon"].tertiary,
                  textAlign: "center",
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
