import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  type LayoutChangeEvent,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colour, motion, radius, space } from "@field-ds/tokens";

import { ActionBar } from "../ActionBar";
import { SHADOW_TINT } from "../internal/elevation";

// Figma: M-BottomSheet (3207:15). Floats with 12px horizontal inset, all
// four corners rounded, grabber + home indicator sit OUTSIDE the sheet
// body. Slides up on `motion.spring.springLight` (per the spec). Scrim
// fades in alongside the slide so the rhythm reads as one gesture.

/** Sheet body caps at this height; consumers must add their own scroll
 *  view inside the body slot when content exceeds the cap. */
const SHEET_MAX_HEIGHT = 680;
const SHEET_HORIZONTAL_INSET = space["12"];
const GRABBER_BAR_W = 36;
const GRABBER_BAR_H = 4;
const HOME_INDICATOR_W = 134;
const HOME_INDICATOR_H = 5;
const HEADER_MIN_H = 48;
/** Fixed height for the home-indicator chrome row — kept constant even
 *  when the bar is hidden, so toggling `showHomeIndicator` doesn't shift
 *  the sheet down. */
const HOME_INDICATOR_BLOCK_H = space["20"] + HOME_INDICATOR_H + space["8"];
/** Figma source: ⚠️ base.colour.alpha-light.64 is not currently re-exported
 *  through `@field-ds/tokens` `colour`, so the grabber bar inlines the value
 *  until the foundations team publishes a semantic surface for it. */
const GRABBER_BAR_COLOR = "rgba(255, 255, 255, 0.64)";

/** Pull-down distance past which a grabber drag dismisses the sheet. */
const CLOSE_DRAG_THRESHOLD_PX = 60;
/** Pull-up distance that maps to the fully-expanded state. */
const EXPAND_TRAVEL_PX = 80;
/** Max marginBottom inserted between sheet sections at full expansion. */
const EXPAND_GAP_PX = 16;

export type BottomSheetProps = {
  /** Controlled visibility. */
  open: boolean;
  /** Fires when the user dismisses via scrim tap, grabber pull-down, or the
   *  device back button. */
  onClose?: () => void;

  /** Toggle the semi-transparent scrim that dims the underlying screen. Default true. */
  showScrim?: boolean;
  /** Toggle the grabber bar above the sheet. Default true. When visible, the
   *  grabber is draggable: pull down past the threshold dismisses; pull up
   *  expands the gap between sheet sections. */
  showGrabber?: boolean;
  /** Toggle the 48 px header slot. Default true. */
  showHeader?: boolean;
  /** Toggle the footer slot. Default true. */
  showFooter?: boolean;
  /** Toggle the home indicator bar. The chrome row stays reserved either
   *  way so the sheet doesn't shift vertically. Default true. */
  showHomeIndicator?: boolean;
  /** Toggle the optional top / leading slot inside the default ActionBar
   *  footer (the placeholder "Drop your custom content here" row). Only
   *  applies when `footer` is omitted. Default true. */
  showFooterSlot?: boolean;

  headerSlot?: ReactNode;
  bodySlot?: ReactNode;
  /** Override the footer entirely. When omitted, a default `ActionBar`
   *  (single layout, action tone) renders using `primaryLabel` +
   *  `onPrimaryPress`. */
  footer?: ReactNode;
  primaryLabel?: string;
  onPrimaryPress?: () => void;

  /**
   * Render strategy.
   *
   * - **`modal`** (default) — wraps the sheet in a fullscreen `<Modal>`. Use
   *   in production: covers the entire screen, restores stack history, and
   *   handles the Android back button.
   * - **`inline`** — renders the sheet absolutely within the nearest
   *   positioned ancestor. Use inside playgrounds or any contained preview
   *   where the sheet should be scoped to a frame.
   *
   *   Requirements for `inline`: the parent View must have a definite size
   *   and `overflow: "hidden"` so the off-screen portion of the sheet is
   *   clipped.
   */
  presentation?: "modal" | "inline";

  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-BottomSheet — bottom-anchored sheet that slides up over the current
 * screen for secondary content, actions, or short flows.
 *
 *   <BottomSheet
 *     open={isOpen}
 *     onClose={() => setOpen(false)}
 *     headerSlot={<Title>Filter</Title>}
 *     bodySlot={<FiltersForm />}
 *     primaryLabel="Apply"
 *     onPrimaryPress={apply}
 *   />
 *
 * The entry animation springs in on `motion.spring.springLight`; the scrim
 * fades in alongside. The grabber is draggable — pull it down to dismiss,
 * pull it up to expand the gap between sheet sections. Honours
 * `useReducedMotion` by snapping.
 */
export function BottomSheet({
  open,
  onClose,
  showScrim = true,
  showGrabber = true,
  showHeader = true,
  showFooter = true,
  showHomeIndicator = true,
  showFooterSlot = true,
  headerSlot,
  bodySlot,
  footer,
  primaryLabel = "Continue",
  onPrimaryPress,
  presentation = "modal",
  accessibilityLabel,
  style,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const { height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Drive the home-indicator chrome off the real bottom safe-area inset so it
  // clears the device home indicator / gesture bar on notched + gesture-nav
  // devices. Fall back to the fixed block height when there's no inset (older
  // devices, web, contained previews).
  const homeIndicatorBlockH =
    insets.bottom > 0
      ? space["20"] + HOME_INDICATOR_H + insets.bottom
      : HOME_INDICATOR_BLOCK_H;

  const [containerH, setContainerH] = useState(screenH);
  const slideDistance = presentation === "inline" ? containerH : screenH;

  /** Live drag offset from the grabber pan responder (downward only). */
  const dragOffsetY = useSharedValue(0);
  /** Expansion state (0 = collapsed, 1 = expanded). Driven by upward grabber pulls. */
  const expansionProgress = useSharedValue(0);

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: progress.value * (1 - Math.min(1, dragOffsetY.value / 200)),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - progress.value) * slideDistance + dragOffsetY.value },
    ],
  }));

  // Inserted between sections when the user pulls the grabber up. Header gets
  // bottom-margin only if both header AND body are visible; body only if
  // body AND footer are visible.
  const headerGapStyle = useAnimatedStyle(
    () => ({
      marginBottom:
        showHeader && bodySlot != null ? expansionProgress.value * EXPAND_GAP_PX : 0,
    }),
    [showHeader, bodySlot],
  );
  const bodyGapStyle = useAnimatedStyle(
    () => ({
      marginBottom: showFooter ? expansionProgress.value * EXPAND_GAP_PX : 0,
    }),
    [showFooter],
  );

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (reducedMotion) {
        progress.value = 1;
        return;
      }
      progress.value = withSpring(1, motion.spring.springLight);
    } else if (mounted) {
      // Animate drag state back to rest in parallel with the close spring
      // (don't snap it — otherwise a grabber-driven close jumps the sheet
      // back to its rest position for one frame before sliding down).
      if (reducedMotion) {
        dragOffsetY.value = 0;
        expansionProgress.value = 0;
        progress.value = 0;
        setMounted(false);
        return;
      }
      dragOffsetY.value = withSpring(0, motion.spring.springLight);
      expansionProgress.value = withSpring(0, motion.spring.springLight);
      progress.value = withSpring(0, motion.spring.springLight, (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      });
    }
  }, [open, reducedMotion, mounted, progress, dragOffsetY, expansionProgress]);

  /** Grabber pan responder — drives drag-to-dismiss and pull-to-expand. */
  const dragStartOffset = useRef(0);
  const dragStartExpansion = useRef(0);
  const grabberPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          dragStartOffset.current = dragOffsetY.value;
          dragStartExpansion.current = expansionProgress.value;
        },
        onPanResponderMove: (_, g) => {
          if (g.dy >= 0) {
            // Pull down — preview close, no expansion.
            dragOffsetY.value = dragStartOffset.current + g.dy;
            expansionProgress.value = 0;
          } else {
            // Pull up — expand inner gaps, no drag offset.
            dragOffsetY.value = 0;
            const expand = Math.max(
              0,
              Math.min(
                1,
                dragStartExpansion.current + -g.dy / EXPAND_TRAVEL_PX,
              ),
            );
            expansionProgress.value = expand;
          }
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy > CLOSE_DRAG_THRESHOLD_PX) {
            if (onClose) onClose();
            return;
          }
          // Always spring drag + expansion back to rest on release —
          // expansion is a transient peek, not a sticky state.
          if (reducedMotion) {
            dragOffsetY.value = 0;
            expansionProgress.value = 0;
            return;
          }
          dragOffsetY.value = withSpring(0, motion.spring.springLight);
          expansionProgress.value = withSpring(0, motion.spring.springBouncy);
        },
        onPanResponderTerminate: () => {
          if (reducedMotion) {
            dragOffsetY.value = 0;
            expansionProgress.value = 0;
            return;
          }
          dragOffsetY.value = withSpring(0, motion.spring.springLight);
          expansionProgress.value = withSpring(0, motion.spring.springLight);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, reducedMotion],
  );

  if (!mounted) return null;

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && Math.abs(h - containerH) > 0.5) setContainerH(h);
  };

  const content = (
    <View
      style={
        presentation === "inline"
          ? StyleSheet.absoluteFillObject
          : { flex: 1 }
      }
      onLayout={presentation === "inline" ? onContainerLayout : undefined}
    >
      {showScrim ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: colour.surface["overlay-bold"] },
            scrimStyle,
          ]}
        />
      ) : null}

      {showScrim ? (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss bottom sheet"
        />
      ) : null}

      <Animated.View
        pointerEvents="box-none"
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            // Anchored above the home-indicator chrome so the indicator
            // stays put when the sheet slides / drags.
            bottom: homeIndicatorBlockH,
            alignItems: "center",
          },
          sheetStyle,
          style,
        ]}
      >
        {showGrabber ? (
          <View
            {...grabberPan.panHandlers}
            // Generous hit slop so the 4px-tall bar is easy to grab.
            style={{
              paddingVertical: space["12"],
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                width: GRABBER_BAR_W,
                height: GRABBER_BAR_H,
                borderRadius: radius["2"],
                backgroundColor: GRABBER_BAR_COLOR,
              }}
            />
          </View>
        ) : null}

        {/* Sheet wrapper — 12px horizontal inset. The Sheet itself owns
            the white surface, rounded corners, and shadow. */}
        <View
          style={{
            width: "100%",
            paddingHorizontal: SHEET_HORIZONTAL_INSET,
            maxHeight: SHEET_MAX_HEIGHT,
          }}
        >
          <View
            style={{
              width: "100%",
              maxHeight: SHEET_MAX_HEIGHT,
              backgroundColor: colour.surface.primary,
              borderRadius: radius["16"],
              shadowColor: SHADOW_TINT,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 16,
              overflow: "hidden",
            }}
          >
            {showHeader ? (
              <Animated.View
                style={[
                  {
                    minHeight: HEADER_MIN_H,
                    width: "100%",
                  },
                  headerGapStyle,
                ]}
              >
                {headerSlot}
              </Animated.View>
            ) : null}

            <Animated.View style={[{ width: "100%" }, bodyGapStyle]}>
              {bodySlot}
            </Animated.View>

            {showFooter
              ? (footer ?? (
                  <ActionBar
                    layout="single"
                    tone="action"
                    showSlot={showFooterSlot}
                    primaryLabel={primaryLabel}
                    onPrimaryPress={onPrimaryPress}
                  />
                ))
              : null}
          </View>
        </View>

      </Animated.View>

      {/* Home indicator chrome — pinned to the bottom of the container,
          OUTSIDE the animated sheet bundle, so the bar stays put while
          the sheet slides / drags. Height stays reserved either way. */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: homeIndicatorBlockH,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showHomeIndicator ? (
          <View
            style={{
              width: HOME_INDICATOR_W,
              height: HOME_INDICATOR_H,
              borderRadius: radius.rounded,
              backgroundColor: colour.surface.primary,
            }}
          />
        ) : null}
      </View>
    </View>
  );

  if (presentation === "inline") {
    return content;
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel}
    >
      {content}
    </Modal>
  );
}
