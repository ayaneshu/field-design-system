import { useCallback, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { BUTTON_PRESS_SCALE } from "@field-ds/components";
import { space, textStyles } from "@field-ds/tokens";

import { useShell } from "../../theme/ThemeContext";
import {
  BUTTON_AXIS_MS,
  BUTTON_PRESS_IN_MS,
  BUTTON_RELEASE_START_MS,
} from "./buttonPressMotionTimeline";

/**
 * Owns the playhead + a trigger callback for the Button-family press
 * timesheet. The same hook serves every variant — Primary, Secondary,
 * SecondaryNeutral, Neutral, Icon, Round, Text, NeutralText — because they
 * all share the same `usePressScale` interaction.
 */
export function useButtonPressMotion() {
  const playhead = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const triggerPlay = useCallback(() => {
    if (reducedMotion) {
      playhead.value = 1;
      return;
    }
    playhead.value = 0;
    playhead.value = withTiming(1, {
      duration: BUTTON_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

  return { playhead, triggerPlay };
}

/**
 * Live preview wrapper for a Button-family press timesheet. Renders the
 * supplied button visual inside an Animated.View whose scale is driven by the
 * shared `playhead` — tapping the wrapper triggers one sweep through the
 * timesheet.
 */
export function ButtonPressPreview({
  playhead,
  onPlay,
  children,
}: {
  playhead: ReturnType<typeof useButtonPressMotion>["playhead"];
  onPlay: () => void;
  children: ReactNode;
}) {
  const shell = useShell();

  const previewStyle = useAnimatedStyle(() => {
    const t = playhead.value * BUTTON_AXIS_MS;
    let scale = 1;
    if (t < BUTTON_PRESS_IN_MS) {
      scale = 1 + (BUTTON_PRESS_SCALE - 1) * (t / BUTTON_PRESS_IN_MS);
    } else if (t < BUTTON_RELEASE_START_MS) {
      scale = BUTTON_PRESS_SCALE;
    } else {
      const u =
        (t - BUTTON_RELEASE_START_MS) /
        Math.max(1, BUTTON_AXIS_MS - BUTTON_RELEASE_START_MS);
      scale = BUTTON_PRESS_SCALE + (1 - BUTTON_PRESS_SCALE) * u;
    }
    return { transform: [{ scale }] };
  });

  return (
    <View style={{ alignItems: "center", gap: space["12"] }}>
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          },
        ]}
      >
        Live preview
      </Text>
      <Pressable
        onPress={onPlay}
        accessibilityRole="button"
        accessibilityLabel="Play press interaction"
      >
        <Animated.View style={previewStyle}>
          <View pointerEvents="none">{children}</View>
        </Animated.View>
      </Pressable>
      <Text
        style={[
          textStyles.Body_B11_Regular,
          { color: shell.textMuted, textAlign: "center" },
        ]}
      >
        tap to play · scale → {BUTTON_PRESS_SCALE}
      </Text>
    </View>
  );
}
