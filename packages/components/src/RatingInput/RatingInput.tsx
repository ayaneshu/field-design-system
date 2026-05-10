import { useCallback, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@field-ds/icons";
import { colour, space } from "@field-ds/tokens";

// Figma: M-Rating/Input (1214:646) — interactive 5-star rating with optional
// emoji feedback at the selected star. Whole-star increments only.
//   - Stars below `value` render as filled gold stars.
//   - The star at `value` shows the emoji when `emojis` is on, otherwise filled.
//   - Stars above `value` render as outline grey stars.
//
// Tokens (resolved through @field-ds/tokens):
//   - colour.surface.yellow-bold      filled star gold (#f5c400)
//   - colour.text-n-icon.tertiary     outline star grey
//   - colour.text-n-icon.muted        disabled star grey (filled & outline)
//   - space.4 / space.6 / space.8     gap between stars by size
//
// Cross-family note: the gold fill uses a `surface.*` token because the
// `text-n-icon.*` family exposes only `yellow-light` (neon) and `yellow-dark`
// (brown) — neither matches the Figma gold. Flagged in the README for the DS
// team to consider adding `text-n-icon.yellow-bold`.

const STAR_COUNT = 5;

const SIZE_PX = { 20: 20, 28: 28, 32: 32 } as const;
const GAP = { 20: space["4"], 28: space["6"], 32: space["8"] } as const;

export type RatingInputSize = keyof typeof SIZE_PX;

export type RatingInputProps = {
  /** Controlled value (0–5). Omit for uncontrolled mode. */
  value?: number;
  /** Initial value in uncontrolled mode. */
  defaultValue?: number;
  onChange?: (next: number) => void;
  size?: RatingInputSize;
  /** Show an emoji at the selected star. Default true. */
  emojis?: boolean;
  /** Override the emoji glyph rendered at the selected star. Default `"😊"`. */
  emoji?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type StarMode = "outline" | "filled" | "emoji";

/**
 * M-Rating/Input — interactive 5-star rating input.
 *
 *   <RatingInput onChange={setRating} />
 *   <RatingInput value={rating} onChange={setRating} size={32} />
 *   <RatingInput defaultValue={4} emojis={false} />
 *
 * Use in review flows where a user submits a rating. For displaying a
 * read-only average, use `M-Rating/Badge` instead.
 */
export function RatingInput({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  size = 28,
  emojis = true,
  emoji = "😊",
  disabled = false,
  accessibilityLabel,
  style,
}: RatingInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(clamp(defaultValue));
  const rawValue = isControlled ? controlledValue : internalValue;
  const value = clamp(rawValue);

  const px = SIZE_PX[size];
  const gap = GAP[size];

  const handleSelect = useCallback(
    (next: number) => {
      if (disabled) return;
      // Tapping the current star a second time clears back to zero — common
      // pattern for "unset" without a separate clear control.
      const committed = next === value ? 0 : next;
      if (!isControlled) setInternalValue(committed);
      onChange?.(committed);
    },
    [disabled, isControlled, onChange, value],
  );

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel ?? `Rating, ${value} out of 5`}
      accessibilityState={{ disabled }}
      // @ts-expect-error — dataSet on View on web
      dataSet={{ component: "RatingInput", size, emojis: emojis ? "yes" : "no" }}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const index = i + 1;
        const mode: StarMode =
          index === value && emojis
            ? "emoji"
            : index <= value
              ? "filled"
              : "outline";

        return (
          <Star
            key={index}
            index={index}
            mode={mode}
            size={px}
            emoji={emoji}
            disabled={disabled}
            onPress={() => handleSelect(index)}
          />
        );
      })}
    </View>
  );
}

type StarProps = {
  index: number;
  mode: StarMode;
  size: number;
  emoji: string;
  disabled: boolean;
  onPress: () => void;
};

function Star({ index, mode, size, emoji, disabled, onPress }: StarProps) {
  const reducedMotion = useReducedMotion();

  // Press feedback — scale 1 → 0.92, spring back on release.
  const pressScale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || reducedMotion) return;
    pressScale.value = withSpring(0.92, { damping: 18, stiffness: 220 });
  };
  const handlePressOut = () => {
    if (disabled || reducedMotion) return;
    pressScale.value = withSpring(1, { damping: 18, stiffness: 220 });
  };

  // Cross-fade between the three visual layers driven by `mode`. We render
  // all three (filled icon, outline icon, emoji text) absolutely stacked
  // and animate their opacity. This gives the emoji a clean cross-fade
  // when `value` changes without remounting.
  const filledTarget = useDerivedValue(() => (mode === "filled" ? 1 : 0), [mode]);
  const outlineTarget = useDerivedValue(() => (mode === "outline" ? 1 : 0), [mode]);
  const emojiTarget = useDerivedValue(() => (mode === "emoji" ? 1 : 0), [mode]);

  const fadeDuration = reducedMotion ? 0 : 200;

  const filledStyle = useAnimatedStyle(
    () => ({ opacity: withTiming(filledTarget.value, { duration: fadeDuration }) }),
    [filledTarget, fadeDuration],
  );
  const outlineStyle = useAnimatedStyle(
    () => ({ opacity: withTiming(outlineTarget.value, { duration: fadeDuration }) }),
    [outlineTarget, fadeDuration],
  );
  const emojiStyle = useAnimatedStyle(
    () => ({ opacity: withTiming(emojiTarget.value, { duration: fadeDuration }) }),
    [emojiTarget, fadeDuration],
  );

  const containerStyle = useAnimatedStyle(
    () => ({ transform: [{ scale: pressScale.value }] }),
    [pressScale],
  );

  const filledColor = disabled
    ? colour["text-n-icon"].muted
    : colour.surface["yellow-bold"];
  const outlineColor = disabled
    ? colour["text-n-icon"].muted
    : colour["text-n-icon"].tertiary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ disabled, checked: mode !== "outline" }}
      accessibilityLabel={`Rate ${index} out of 5`}
      hitSlop={size <= 20 ? 8 : 4}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        component: "RatingInput.Star",
        index,
        mode,
        tokenColor:
          mode === "outline"
            ? "colour.text-n-icon.tertiary"
            : "colour.surface.yellow-bold",
      }}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          },
          containerStyle,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", width: size, height: size }, outlineStyle]}
        >
          <Icon name="system-star" size={size} color={outlineColor} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", width: size, height: size }, filledStyle]}
        >
          <Icon name="system-star-filled" size={size} color={filledColor} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              width: size,
              height: size,
              alignItems: "center",
              justifyContent: "center",
            },
            emojiStyle,
          ]}
        >
          <Text
            // Emoji glyph sized to roughly the star's bounding box. Slight
            // shrink so platform-default emoji rendering doesn't overflow.
            style={{
              fontSize: size * 0.95,
              lineHeight: size,
              textAlign: "center",
            }}
          >
            {emoji}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > STAR_COUNT) return STAR_COUNT;
  return Math.floor(n);
}
