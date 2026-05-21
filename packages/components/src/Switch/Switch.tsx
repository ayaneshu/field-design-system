import { useEffect, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Platform,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colour, motion, radius, space, textStyles } from "@field-ds/tokens";

const SPRING_TAB_THUMB = motion.spring.springLight;

function clampN(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// Figma: M-Switch — pill-shaped segmented control.
//   H40 default · H48 large. Each variant supports 2-4 mutually-exclusive slots.
//
// Naming: Figma calls this M-Switch but it's structurally a segmented control.
// Consumers who need RN's boolean Switch should rename on import:
//   import { Switch as DSSwitch } from "@field-ds/components";

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
 * The active slot is highlighted by a white thumb that moves between
 * positions using **`motion.spring.springLight`** (`withSpring`). Honors
 * `useReducedMotion()` by snapping instead of sliding.
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
      indexProgress.value = withSpring(activeIndex, {
        ...SPRING_TAB_THUMB,
      });
    }
  }, [activeIndex, indexProgress, reducedMotion]);

  // Press / drag feedback — the thumb squishes horizontally while the user
  // is holding it, then springs back to 1 on release. Same spring token
  // (`motion.spring.springLight`) so the squeeze matches the slide rhythm.
  const THUMB_GRAB_SCALE_X = 0.94;
  const grabScaleX = useSharedValue(1);
  const grabThumb = () => {
    if (disabled) return;
    if (reducedMotion) {
      grabScaleX.value = THUMB_GRAB_SCALE_X;
      return;
    }
    grabScaleX.value = withSpring(THUMB_GRAB_SCALE_X, { ...SPRING_TAB_THUMB });
  };
  const releaseThumb = () => {
    if (reducedMotion) {
      grabScaleX.value = 1;
      return;
    }
    grabScaleX.value = withSpring(1, { ...SPRING_TAB_THUMB });
  };

  const thumbAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: indexProgress.value * slotWidth },
        { scaleX: grabScaleX.value },
      ],
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

  // ─── Drag-to-select ───────────────────────────────────────────────
  // PanResponder lets the thumb track the finger. It only takes over the
  // gesture once horizontal movement exceeds the threshold, so taps on the
  // inner slot Pressables still register as taps. Vertical scrolling stays
  // unaffected for the same reason.
  const DRAG_THRESHOLD_PX = 4;
  const dragStartProgress = useRef(0);
  const commitToIndex = (target: number) => {
    const opt = options[target];
    if (!opt) return;
    if (opt.value === value) return;
    if (!isControlled) setInternal(opt.value);
    onChange?.(opt.value);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          !disabled &&
          slotWidth > 0 &&
          Math.abs(g.dx) > DRAG_THRESHOLD_PX &&
          Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          dragStartProgress.current = indexProgress.value;
          grabThumb();
        },
        onPanResponderMove: (_, g) => {
          if (slotWidth <= 0) return;
          const next = clampN(
            dragStartProgress.current + g.dx / slotWidth,
            0,
            options.length - 1,
          );
          indexProgress.value = next;
        },
        onPanResponderRelease: (_, g) => {
          if (slotWidth <= 0) return;
          const target = Math.round(
            clampN(
              dragStartProgress.current + g.dx / slotWidth,
              0,
              options.length - 1,
            ),
          );
          if (reducedMotion) {
            indexProgress.value = target;
          } else {
            indexProgress.value = withSpring(target, { ...SPRING_TAB_THUMB });
          }
          commitToIndex(target);
          releaseThumb();
        },
        onPanResponderTerminate: () => {
          // System interrupt — snap to nearest slot.
          const target = Math.round(indexProgress.value);
          if (reducedMotion) {
            indexProgress.value = target;
          } else {
            indexProgress.value = withSpring(target, { ...SPRING_TAB_THUMB });
          }
          commitToIndex(target);
          releaseThumb();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, slotWidth, options.length, value, isControlled, reducedMotion],
  );

  return (
    <View
      onLayout={onTrackLayout}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      {...panResponder.panHandlers}
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
        // Web-only: tell the user it's draggable and disable text selection
        // so dragging on a label doesn't start a selection. Cast via unknown
        // — RN's ViewStyle types omit "grab"/"userSelect", but rn-web honours
        // them at runtime.
        Platform.OS === "web"
          ? ({
              cursor: disabled ? "default" : "grab",
              userSelect: "none",
              WebkitUserSelect: "none",
            } as unknown as ViewStyle)
          : null,
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
            onPressIn={grabThumb}
            onPressOut={releaseThumb}
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
              selectable={false}
              style={[
                cfg.textStyle,
                {
                  color: isActive
                    ? colour["text-n-icon"].primary
                    : colour["text-n-icon"].tertiary,
                  textAlign: "center",
                },
                // Web: belt + suspenders — disables the text cursor and the
                // double-click word-select that breaks the drag gesture.
                Platform.OS === "web"
                  ? ({
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    } as unknown as ViewStyle)
                  : null,
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
