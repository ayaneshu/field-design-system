import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@field-ds/tokens";

/** Cross-fade duration between idle content and loader. */
export const LOADING_FADE_DURATION_MS = motion.duration.sm;

const se = motion.easing.standard;
/** Standard easing token wrapped for Reanimated. */
export const LOADING_FADE_EASING = Easing.bezier(se[0], se[1], se[2], se[3]);

/**
 * Drives a 0↔1 progress shared value when the consumer's `loading` flag
 * flips, then exposes two animated styles:
 *
 *   - `contentStyle`: opacity 1 (idle) → 0 (loading)
 *   - `loaderStyle`: opacity 0 (idle) → 1 (loading)
 *
 * Honours `useReducedMotion` by snapping to the target instead of tweening.
 */
export function useLoadingFade(loading: boolean) {
  const progress = useSharedValue(loading ? 1 : 0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const target = loading ? 1 : 0;
    if (reducedMotion) {
      progress.value = target;
      return;
    }
    progress.value = withTiming(target, {
      duration: LOADING_FADE_DURATION_MS,
      easing: LOADING_FADE_EASING,
    });
  }, [loading, reducedMotion, progress]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return { contentStyle, loaderStyle };
}
