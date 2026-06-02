import { useEffect, useState, type ReactNode } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@field-ds/icons";
import { colour, motion, radius, space, textStyles } from "@field-ds/tokens";

import { fieldEasingStandard } from "../fieldMotion";

// Sizes lifted from the Figma component spec — every value is a token reference.
const HEADER_MIN_HEIGHT = space["44"];          // header.height = 44
const HAIRLINE_GAP = space["1"];                // 1px gap; surface.primary shows through
const ICON_SIZE = space["20"];                  // 20×20 chevron + iconLeft slot
const CONTENT_GAP = space["4"];                 // gap between iconLeft and title
const HEADER_GAP = space["8"];                  // gap between title block and chevron
const PADDING = space["12"];                    // header & body padding
const CONTAINER_RADIUS = radius["12"];          // outer container radius

// Open/close timing from `motion.duration` — accordion closes slightly quicker.

export type AccordionProps = {
  title: string;
  /**
   * Content slot. Anything passed as children renders inside the expanded
   * body. Strings are auto-wrapped in `B14_Regular`; nodes render as-is,
   * letting consumers compose custom content (lists, tables, controls, etc).
   */
  children?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (next: boolean) => void;
  defaultExpanded?: boolean;
  iconLeft?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-Accordion — disclosure control that reveals supplementary content on tap.
 *
 * Animation strategy (Apple-style):
 *   1. The body content is always rendered at its intrinsic, natural size.
 *      It never resizes during the animation, so text never squeezes.
 *   2. A wrapper around the body has overflow:hidden and animates its height
 *      from 0 ↔ measured. The body is revealed by uncovering, not by stretching.
 *   3. Body height is sampled once via a hidden measurement copy positioned
 *      off-screen, so we know the target before the first reveal.
 *   4. A subtle opacity ramp on the wrapper (0 → 1 by progress 0.5) softens
 *      the edge as content emerges from under the header.
 *   5. Chevron rotates with the same progress driver, keeping motion in sync.
 *
 * Easing follows `motion.easing.standard` — motion.duration.{xl|lg}.
 */
export function Accordion({
  title,
  children,
  expanded: controlledExpanded,
  onExpandedChange,
  defaultExpanded = false,
  iconLeft,
  style,
}: AccordionProps) {
  const isControlled = controlledExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  // Intrinsic body height (incl. the hairline gap above it). null until measured.
  const [bodyHeight, setBodyHeight] = useState<number | null>(null);

  // Drive open/close progress. 0 = collapsed, 1 = expanded.
  const progress = useSharedValue(defaultExpanded ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: expanded
        ? motion.duration.xl
        : motion.duration.lg,
      easing: fieldEasingStandard,
    });
  }, [expanded, progress]);

  const onMeasureBody = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== bodyHeight) setBodyHeight(h);
  };

  // Explicit dep arrays — Reanimated requires them on web without the Babel plugin.
  const wrapperStyle = useAnimatedStyle(() => {
    if (bodyHeight == null) {
      // First render before measurement — show or hide instantly per default.
      return {
        height: defaultExpanded ? undefined : 0,
        opacity: defaultExpanded ? 1 : 0,
      };
    }
    return {
      height: progress.value * bodyHeight,
      // Fade reaches 1 by 50% of the open animation; on close it fades out
      // during the second half. Keeps text fully readable while it slides.
      opacity: interpolate(progress.value, [0, 0.5, 1], [0, 1, 1], "clamp"),
    };
  }, [progress, bodyHeight, defaultExpanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }), [progress]);

  const toggle = () => {
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  // Body content is rendered twice with the same layout: once visible inside
  // the animated clipping wrapper, once hidden offscreen for measurement.
  // Both render at intrinsic size; only the wrapper's height animates.
  //
  // Structure mirrors the Figma "Details > Content Slot" hierarchy:
  //   Details — surface.secondary background, space.12 padding (the body fill).
  //   Content Slot — wraps whatever children the consumer passes, centered.
  // Strings get auto-wrapped in B14_Regular as a convenience; ReactNodes
  // render untouched so consumers can compose any layout in the slot.
  const renderBodyContent = () => (
    <View
      // @ts-expect-error — dataSet on web
      dataSet={{
        slot: "details",
        tokenBg: "colour.surface.secondary",
        tokenPadding: "space.12",
      }}
      style={{
        backgroundColor: colour.surface.secondary,
        paddingHorizontal: PADDING,
        paddingVertical: PADDING,
      }}
    >
      <View
        // @ts-expect-error — dataSet on web
        dataSet={{ slot: "content-slot" }}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {typeof children === "string" ? (
          <Text
            // @ts-expect-error — dataSet on Text on web
            dataSet={{
              tokenTextStyle: "textStyles.B14_Regular",
              tokenColor: "colour.text-n-icon.primary",
            }}
            style={[textStyles.B14_Regular, { color: colour["text-n-icon"].primary }]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );

  return (
    <View
      // @ts-expect-error — dataSet is a valid web prop
      dataSet={{
        component: "Accordion",
        tokenBg: "colour.surface.primary",
        tokenRadius: "radius.12",
      }}
      style={[
        {
          backgroundColor: colour.surface.primary,
          borderRadius: CONTAINER_RADIUS,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={title}
        // @ts-expect-error — RN Web supports dataSet on Pressable
        dataSet={{
          slot: "header",
          tokenBg: "colour.surface.secondary",
          tokenMinHeight: "space.44",
          tokenPadding: "space.12",
          tokenGap: "space.8",
        }}
        style={({ pressed }) => ({
          backgroundColor: colour.surface.secondary,
          opacity: pressed ? 0.85 : 1,
          minHeight: HEADER_MIN_HEIGHT,
          paddingHorizontal: PADDING,
          paddingVertical: PADDING,
          flexDirection: "row",
          alignItems: "center",
          gap: HEADER_GAP,
        })}
      >
        <View
          // @ts-expect-error — dataSet on web
          dataSet={{ slot: "title-block", tokenGap: "space.4" }}
          style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: CONTENT_GAP, minWidth: 0 }}
        >
          {iconLeft}
          <Text
            numberOfLines={1}
            // @ts-expect-error — dataSet on Text on web
            dataSet={{
              tokenTextStyle: "textStyles.B14_SemiBold",
              tokenColor: "colour.text-n-icon.primary",
            }}
            style={[textStyles.B14_SemiBold, { color: colour["text-n-icon"].primary, flex: 1 }]}
          >
            {title}
          </Text>
        </View>
        <Animated.View
          // @ts-expect-error — dataSet on Animated.View on web
          dataSet={{ slot: "chevron", tokenSize: "space.20" }}
          style={[
            {
              width: ICON_SIZE,
              height: ICON_SIZE,
              alignItems: "center",
              justifyContent: "center",
            },
            chevronStyle,
          ]}
        >
          <Icon name="system-chevron-down" size={ICON_SIZE} color={colour["text-n-icon"].primary} />
        </Animated.View>
      </Pressable>

      {/* Visible animated wrapper — clips body content at natural size. */}
      <Animated.View
        // @ts-expect-error — dataSet on Animated.View on web
        dataSet={{
          slot: "body",
          tokenBg: "colour.surface.secondary",
          tokenPadding: "space.12",
          tokenGap: "space.1 (hairline above)",
        }}
        style={[{ overflow: "hidden" }, wrapperStyle]}
      >
        {/* Hairline gap — surface.primary shows through */}
        <View style={{ height: HAIRLINE_GAP, backgroundColor: colour.surface.primary }} />
        {renderBodyContent()}
      </Animated.View>

      {/* Hidden measurement layer — identical layout, positioned off-screen. */}
      <View
        // @ts-expect-error — dataSet + aria-hidden on web
        dataSet={{ slot: "body-measurement" }}
        aria-hidden
        pointerEvents="none"
        onLayout={onMeasureBody}
        style={{ position: "absolute", opacity: 0, left: 0, right: 0, top: -9999 }}
      >
        {/* Match the visible wrapper exactly so the measured height is faithful. */}
        <View style={{ height: HAIRLINE_GAP }} />
        {renderBodyContent()}
      </View>
    </View>
  );
}
