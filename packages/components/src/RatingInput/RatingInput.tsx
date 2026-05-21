import { useCallback, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@field-ds/icons";
import { colour, motion, space } from "@field-ds/tokens";

import { fieldEasingStandard } from "../fieldMotion";

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

// ─── Motion constants for the per-star fill animation ───
/** Total number of stars in a RatingInput. */
export const RATING_STAR_COUNT = STAR_COUNT;
/** Opacity cross-fade duration (filled ↔ outline ↔ emoji). */
export const RATING_FADE_MS = motion.duration.base;
/** Per-star delay applied to every animated property. */
export const RATING_STAGGER_MS = motion.delay.stagger;
/** Bounce ramp-up duration (1 → peak). */
export const RATING_BOUNCE_RAMP_MS = motion.duration.xs;
/** Peak scale reached at the top of the bounce. */
export const RATING_BOUNCE_PEAK_SCALE = 1.15;
/** Token reference for the spring that settles the bounce. */
export const RATING_BOUNCE_SPRING = motion.spring.springLight;

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
  emojis = false,
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
    pressScale.value = withSpring(0.92, motion.spring.interaction);
  };
  const handlePressOut = () => {
    if (disabled || reducedMotion) return;
    pressScale.value = withSpring(1, motion.spring.interaction);
  };

  // Cross-fade between the three visual layers driven by `mode`. We render
  // all three (filled icon, outline icon, emoji text) absolutely stacked
  // and animate their opacity. This gives the emoji a clean cross-fade
  // when `value` changes without remounting.
  const filledTarget = useDerivedValue(() => (mode === "filled" ? 1 : 0), [mode]);
  const outlineTarget = useDerivedValue(() => (mode === "outline" ? 1 : 0), [mode]);
  const emojiTarget = useDerivedValue(() => (mode === "emoji" ? 1 : 0), [mode]);

  // Direction-aware stagger:
  //   fill (outline → filled) sweeps left → right — star 1 leads
  //   un-fill (filled → outline) sweeps right → left — star 5 leads
  const fadeDuration = reducedMotion ? 0 : motion.duration.base;
  const fillDelay = reducedMotion
    ? 0
    : (index - 1) * motion.delay.stagger;
  const unfillDelay = reducedMotion
    ? 0
    : (RATING_STAR_COUNT - index) * motion.delay.stagger;

  // Standalone opacity shared values — driven explicitly by the reaction
  // below so we can pick the right per-star delay based on direction.
  const filledOpacity = useSharedValue(mode === "filled" ? 1 : 0);
  const outlineOpacity = useSharedValue(mode === "outline" ? 1 : 0);
  const emojiOpacity = useSharedValue(mode === "emoji" ? 1 : 0);

  useAnimatedReaction(
    () => ({
      filled: filledTarget.value,
      outline: outlineTarget.value,
      emoji: emojiTarget.value,
    }),
    (curr, prev) => {
      if (prev === null) return;
      if (reducedMotion) {
        filledOpacity.value = curr.filled;
        outlineOpacity.value = curr.outline;
        emojiOpacity.value = curr.emoji;
        return;
      }
      // `filledTarget` dropping is the cleanest signal that this star is
      // being un-filled — switch the stagger to right → left for the whole
      // cross-fade so all three layers stay aligned.
      const isUnfill = curr.filled < prev.filled;
      const delay = isUnfill ? unfillDelay : fillDelay;
      const timing = {
        duration: fadeDuration,
        easing: fieldEasingStandard,
      } as const;
      filledOpacity.value = withDelay(delay, withTiming(curr.filled, timing));
      outlineOpacity.value = withDelay(delay, withTiming(curr.outline, timing));
      emojiOpacity.value = withDelay(delay, withTiming(curr.emoji, timing));
    },
    [fillDelay, unfillDelay, fadeDuration, reducedMotion],
  );

  const filledStyle = useAnimatedStyle(
    () => ({ opacity: filledOpacity.value }),
    [filledOpacity],
  );
  const outlineStyle = useAnimatedStyle(
    () => ({ opacity: outlineOpacity.value }),
    [outlineOpacity],
  );
  const emojiStyle = useAnimatedStyle(
    () => ({ opacity: emojiOpacity.value }),
    [emojiOpacity],
  );

  // Subtle scale bounce that fires whenever the star transitions into the
  // "filled" mode (no bounce on un-fill). Up over `motion.duration.xs` to
  // `BOUNCE_PEAK_SCALE`, then springs back via `motion.spring.springLight`.
  // Honours the same per-star stagger as the opacity tweens so the pops
  // sweep left → right. Combined multiplicatively with the press scale so
  // touchdown feedback and the bounce can coexist — bumped above 1.02 so
  // the pop cuts through the concurrent press-release scaling.
  const bounceScale = useSharedValue(1);
  const BOUNCE_PEAK_SCALE = RATING_BOUNCE_PEAK_SCALE;

  useAnimatedReaction(
    () => filledTarget.value,
    (curr, prev) => {
      if (reducedMotion) return;
      if (curr === 1 && (prev === null || prev < 1)) {
        // Bounce only on fill-in, so it follows the fill (left → right) stagger.
        bounceScale.value = withDelay(
          fillDelay,
          withSequence(
            withTiming(BOUNCE_PEAK_SCALE, {
              duration: motion.duration.xs,
              easing: fieldEasingStandard,
            }),
            withSpring(1, motion.spring.springLight),
          ),
        );
      }
    },
    [fillDelay, reducedMotion],
  );

  const containerStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: pressScale.value * bounceScale.value }],
    }),
    [pressScale, bounceScale],
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
