import { useCallback, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

// Stagger timing. Each Reveal on a screen fires on focus with a delay of
// `BASE + index * STEP`, so giving content blocks ascending indices makes them
// cascade in one after another (an offset rise, not a flat page fade).
const BASE_DELAY = 0;
const STEP = 90;
const DURATION = 540;
const OFFSET = 24; // px the block rises from

/**
 * Reveal a content block on screen focus — fade + upward offset, delayed by
 * its `index` so sibling blocks stagger. Replays on every focus (so it plays
 * on each tab switch, including landing back on Home) and respects the OS
 * "reduce motion" setting.
 *
 * Uses a translateY transform, so never wrap a `position: sticky` / `fixed`
 * element (the sidebar, the home bloom) — a transformed ancestor would create
 * a containing block and break it. Wrap content blocks that sit *beside* that
 * chrome instead.
 */
export function Reveal({
  index = 0,
  offset = true,
  children,
  style,
}: {
  index?: number;
  /**
   * Whether to add the upward translateY rise. Set false to fade only — needed
   * when the block measures its own screen position or owns a fixed-position
   * effect (the home "field" title + bloom), which a transform would disturb.
   */
  offset?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      if (reducedMotion) {
        progress.value = 1;
        return;
      }
      progress.value = 0;
      progress.value = withDelay(
        BASE_DELAY + index * STEP,
        withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }),
      );
    }, [reducedMotion, progress, index]),
  );

  const animatedStyle = useAnimatedStyle(() =>
    offset
      ? {
          opacity: progress.value,
          transform: [{ translateY: (1 - progress.value) * OFFSET }],
        }
      : { opacity: progress.value },
  );

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
