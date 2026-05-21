import { useEffect } from "react";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { motion } from "@field-ds/tokens";

/** Shared touchdown scale for every button in the family. */
export const BUTTON_PRESS_SCALE = 0.98;

/**
 * Press-and-release scale interaction shared across the Button family
 * (Primary, Secondary, SecondaryNeutral, Neutral, Icon, Round, Text,
 * NeutralTextButton). Honours an `inert` flag (disabled / loading) by
 * cancelling any in-flight animation and resetting to rest.
 *
 * Tokens:
 *   - `motion.duration.xs` — press-in scale-down timing.
 *   - `motion.spring.snappy` — press-out release back to 1.
 */
export function usePressScale(inert: boolean) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (!inert) return;
    cancelAnimation(scale);
    scale.value = 1;
  }, [inert, scale]);

  const onPressIn = () => {
    if (inert) return;
    scale.value = withTiming(BUTTON_PRESS_SCALE, {
      duration: motion.duration.xs,
    });
  };

  const onPressOut = () => {
    if (inert) return;
    scale.value = withSpring(1, motion.spring.snappy);
  };

  return { animatedStyle, onPressIn, onPressOut };
}
