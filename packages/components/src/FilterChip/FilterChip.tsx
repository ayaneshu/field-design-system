import { useEffect } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@field-ds/icons";
import { colour, motion, radius, space, textStyles } from "@field-ds/tokens";

// Maps to Figma M-FilterChip (1391:41). Height-36 filter / sort chip.
//   - content="label"  → preferences-style chip ("Filter ▼"). Independent
//                        left + right icon slots, optional count text in
//                        the Added state.
//   - content="slot"   → 40×36 chip with a 20×20 slot the consumer fills
//                        with any node (image, SVG, brand mark, custom view).
//
// Pressed visuals come from Pressable's `pressed` flag — there is no
// Pressed prop. `disabled` and `added` are exposed as standalone booleans
// so the runtime API maps cleanly to common filter-bar behaviour.

const HEIGHT = 36;
const SLOT_SIZE = 20;
const ICON_SIZE = 16;

// ─── Motion tokens for the default ↔ added state transition ───
// Opacity / colour use easeInOut for symmetric phasing; the shape-size +
// translate lane uses the `loft` curve (gentle out, settled finish) so the
// chip resize and cross slide-in feel less mechanical than a pure linear.
const TE = motion.easing.easeInOut;
const TRANSITION_EASING = Easing.bezier(TE[0], TE[1], TE[2], TE[3]);
const SE = motion.easing.loft;
const SHAPE_EASING = Easing.bezier(SE[0], SE[1], SE[2], SE[3]);
/** Duration of the FilterChip default ↔ added morph. */
export const FILTER_CHIP_TRANSITION_MS = motion.duration.xl;
/** Easing token reference for the chip resize + cross slide-in. */
export const FILTER_CHIP_SHAPE_EASING_TOKEN = "motion.easing.easeInOut" as const;
/** Reserved max width for the count text when fully expanded. */
export const FILTER_CHIP_COUNT_MAX_W = 40;
/** Reserved width for the divider + clear-cross zone when fully expanded. */
export const FILTER_CHIP_CLEAR_ZONE_W = 40;
/** Offset from which the cross icon slides in (px, leftward). */
export const FILTER_CHIP_CLEAR_TRANSLATE_FROM = -12;

export type FilterChipContent = "label" | "slot";

export type FilterChipProps = {
  /** Layout mode. `label` shows text + optional left/right icons; `slot`
   *  exposes a 20×20 child slot for an image, SVG or any custom node. */
  content?: FilterChipContent;
  /** Visible label. Verb-first, short ("Filter", "Sort", "Category"). */
  label?: string;
  /** Pre-formatted count rendered after the label when `added` is true
   *  (e.g. "(4)", "12"). The chip does not format this for you. */
  count?: string;
  /** Toggle the left icon. Defaults to on (renders `iconLeft`). */
  showIconLeft?: boolean;
  /** Toggle the right icon (caret). Defaults to on. Set false for static
   *  badges like a single applied filter pill. */
  showIconRight?: boolean;
  /** Glyph rendered before the label. Defaults to the preferences (filter)
   *  icon. */
  iconLeft?: IconName;
  /** Glyph rendered after the label. Defaults to caret-down. */
  iconRight?: IconName;
  /** Filters are applied. Switches to the bordered "Added" treatment, shows
   *  `count`, and exposes a clear-all cross handled by `onClear`. */
  added?: boolean;
  disabled?: boolean;
  /** Fires when the chip body is pressed (open the filter sheet / picker). */
  onPress?: () => void;
  /** Fires when the trailing clear-all cross is pressed. Only relevant when
   *  `added` is true. */
  onClear?: () => void;
  /** Children rendered inside the 20×20 slot when `content="slot"`. Can be
   *  an `<Image />`, `<Svg />` node, brand mark, or any custom view. */
  children?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type Surface = {
  bg: string;
  bgPressed: string;
  border: string;
  fg: string;
  fgToken: string;
};

const SURFACE_DEFAULT: Surface = {
  bg: colour.surface.primary,
  bgPressed: colour.surface.secondary,
  border: colour.border.subtle,
  fg: colour["text-n-icon"].primary,
  fgToken: "colour.text-n-icon.primary",
};

const SURFACE_DISABLED: Surface = {
  bg: colour.surface.secondary,
  bgPressed: colour.surface.secondary,
  border: colour.border.subtle,
  fg: colour["text-n-icon"].muted,
  fgToken: "colour.text-n-icon.muted",
};

const SURFACE_ADDED: Surface = {
  bg: colour.surface.primary,
  bgPressed: colour.surface.secondary,
  border: colour.border.extrabold,
  fg: colour["text-n-icon"].primary,
  fgToken: "colour.text-n-icon.primary",
};

/**
 * M-FilterChip — height-36 filter / sort chip.
 *
 *   <FilterChip label="Filter" onPress={openSheet} />
 *   <FilterChip label="Filter" count="(4)" added onPress={openSheet} onClear={clearAll} />
 *   <FilterChip content="slot" onPress={openSheet}>
 *     <Image source={brandLogo} style={{ width: 20, height: 20 }} />
 *   </FilterChip>
 *
 * The default ↔ added transition tweens border colour, count opacity / width,
 * and the clear-cross slide-in over `motion.duration.base` ·
 * `motion.easing.standard`. Honours `useReducedMotion()` by snapping.
 */
export function FilterChip({
  content = "label",
  label = "Filter",
  count,
  showIconLeft = true,
  showIconRight = true,
  iconLeft = "system-preferences",
  iconRight = "system-caret-down",
  added = false,
  disabled = false,
  onPress,
  onClear,
  children,
  accessibilityLabel,
  style,
}: FilterChipProps) {
  const surface = disabled
    ? SURFACE_DISABLED
    : added
      ? SURFACE_ADDED
      : SURFACE_DEFAULT;

  const stateName = disabled ? "disabled" : added ? "added" : "default";
  const isAddedActive = added && !disabled;

  // ─── State transition drivers ───
  // `progress` → opacity + border colour (easeInOut).
  // `shapeProgress` → width morph + cross translateX (loft easing) so the
  //                    resize and slide-in feel softer than the colour fade.
  const progress = useSharedValue(isAddedActive ? 1 : 0);
  const shapeProgress = useSharedValue(isAddedActive ? 1 : 0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const target = isAddedActive ? 1 : 0;
    if (reducedMotion) {
      progress.value = target;
      shapeProgress.value = target;
      return;
    }
    progress.value = withTiming(target, {
      duration: FILTER_CHIP_TRANSITION_MS,
      easing: TRANSITION_EASING,
    });
    shapeProgress.value = withTiming(target, {
      duration: FILTER_CHIP_TRANSITION_MS,
      easing: SHAPE_EASING,
    });
  }, [isAddedActive, reducedMotion, progress, shapeProgress]);

  // Border fades subtle → extrabold across the transition. Disabled state
  // always stays on the static subtle border (no animation).
  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: disabled
      ? colour.border.subtle
      : interpolateColor(
          progress.value,
          [0, 1],
          [colour.border.subtle, colour.border.extrabold],
        ),
  }));

  // Count text: opacity follows the colour driver; width / margin follow the
  // softer shape driver so the resize reads as a separate gesture.
  const animatedCountStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxWidth: shapeProgress.value * FILTER_CHIP_COUNT_MAX_W,
    marginLeft: shapeProgress.value * space["4"],
  }));

  // Clear zone (divider + cross): opacity follows the colour driver; width +
  // slide-in follow the shape driver.
  const animatedClearStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxWidth: shapeProgress.value * FILTER_CHIP_CLEAR_ZONE_W,
    transform: [
      {
        translateX:
          (1 - shapeProgress.value) * FILTER_CHIP_CLEAR_TRANSLATE_FROM,
      },
    ],
  }));

  const labelText = (
    <Text
      numberOfLines={1}
      // @ts-expect-error — dataSet on Text on web
      dataSet={{
        tokenTextStyle: "A14_SemiBold",
        tokenColor: surface.fgToken,
      }}
      style={[textStyles.A14_SemiBold, { color: surface.fg }]}
    >
      {label}
    </Text>
  );

  const leftIcon =
    showIconLeft && content === "label" ? (
      <Icon name={iconLeft} size={ICON_SIZE} color={surface.fg} />
    ) : null;

  const rightIcon =
    showIconRight && content === "label" ? (
      <Icon name={iconRight} size={ICON_SIZE} color={surface.fg} />
    ) : null;

  const slotChild = (
    <View
      style={{
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );

  // ─── Slot variant: single Pressable; only the border animates. ───
  if (content === "slot") {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        // @ts-expect-error — dataSet on Pressable on web
        dataSet={{ component: "FilterChip", content, state: stateName }}
        style={({ pressed }) => [
          {
            alignSelf: "flex-start",
          },
          style,
        ]}
      >
        {({ pressed }) => (
          <Animated.View
            style={[
              {
                minHeight: HEIGHT,
                maxHeight: HEIGHT,
                paddingHorizontal: space["10"],
                paddingVertical: space["8"],
                borderRadius: radius["8"],
                borderWidth: 1,
                backgroundColor:
                  pressed && !disabled ? surface.bgPressed : surface.bg,
                alignItems: "center",
                justifyContent: "center",
              },
              animatedBorderStyle,
            ]}
          >
            {slotChild}
          </Animated.View>
        )}
      </Pressable>
    );
  }

  // ─── Label variant: unified animated layout ───
  // The body Pressable owns `onPress`; the clear group (divider + cross) owns
  // `onClear`. When `added` is false the clear group collapses to width 0,
  // keeping it out of the hit-test region.
  return (
    <Animated.View
      // @ts-expect-error — dataSet on Animated.View on web
      dataSet={{ component: "FilterChip", content, state: stateName }}
      style={[
        {
          minHeight: HEIGHT,
          maxHeight: HEIGHT,
          borderRadius: radius["8"],
          borderWidth: 1,
          backgroundColor: surface.bg,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          overflow: "hidden",
        },
        animatedBorderStyle,
        style,
      ]}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        // @ts-expect-error — dataSet on Pressable on web
        dataSet={{ component: "FilterChip.Body" }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          paddingHorizontal: space["10"],
          paddingVertical: space["8"],
          backgroundColor:
            pressed && !disabled ? surface.bgPressed : "transparent",
        })}
      >
        {leftIcon ? (
          <View style={{ marginRight: space["4"] }}>{leftIcon}</View>
        ) : null}
        {labelText}
        <Animated.View style={[{ overflow: "hidden" }, animatedCountStyle]}>
          <Text
            numberOfLines={1}
            style={[textStyles.A14_SemiBold, { color: surface.fg }]}
          >
            {count ?? ""}
          </Text>
        </Animated.View>
        {rightIcon ? (
          <View style={{ marginLeft: space["4"] }}>{rightIcon}</View>
        ) : null}
      </Pressable>

      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "stretch",
            overflow: "hidden",
          },
          animatedClearStyle,
        ]}
      >
        <View
          style={{
            width: 1,
            height: 14,
            backgroundColor: colour.border.subtle,
            borderRadius: radius["2"],
            marginHorizontal: space["2"],
          }}
        />
        <Pressable
          onPress={disabled ? undefined : onClear}
          disabled={disabled || !isAddedActive}
          accessibilityRole="button"
          accessibilityState={{ disabled: disabled || !isAddedActive }}
          accessibilityLabel="Clear filters"
          hitSlop={6}
          // @ts-expect-error — dataSet on Pressable on web
          dataSet={{ component: "FilterChip.Clear" }}
          style={({ pressed }) => ({
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            paddingHorizontal: space["8"],
            backgroundColor:
              pressed && !disabled ? surface.bgPressed : "transparent",
          })}
        >
          <Icon name="system-cross" size={ICON_SIZE} color={surface.fg} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
