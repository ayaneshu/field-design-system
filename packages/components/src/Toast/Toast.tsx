import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  PanResponder,
  Platform,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon, type IconName } from "@field-ds/icons";
import { base, colour, motion, radius, space, textStyles } from "@field-ds/tokens";

// Figma: M-Toast (4227:76702) + M-Stacked Toast (4229:76747) +
// M-Toast/ActionContainer (4227:76655).
//
// A transient, non-blocking notification (snackbar): leading 40px asset, a
// one-line title, a one-line subtitle with an optional trailing chevron, and a
// trailing action slot that holds either a button or a close (✕). Anchored to
// the bottom of the screen and auto-dismissed after a short delay. Slides up +
// fades on enter, swipes DOWN to dismiss, and — when `stacked` — shows a second
// card peeking behind to signal a queue of 2+ toasts (M-Stacked Toast).
//
// Tokens (via @field-ds/tokens):
//   surface   colour.surface[secondary-inverted | primary | error-bold | success-bold]
//   text      colour.text-n-icon[on-surface-bold | on-surface-subtle | primary | tertiary]
//   border    colour.border.subtle (light) / base.colour.alpha-light.8 (dark/error/success)
//   action    base.colour.alpha-light.16 / .8 (dark), surface.primary + border.primary /
//             surface.tertiary (light)
//   radius    radius/14 (card), radius/8 (button), radius/rounded (close)
//   spacing   space/12 (content pad), space/10 (action pad), space/8 (gap)
//   type      B14/SemiBold (title), B12/Regular (subtitle), A12/SemiBold (action)

export type ToastType = "dark" | "light" | "error" | "success";

/** What sits in the trailing action slot. */
export type ToastAction = "button" | "close" | "none";

export type ToastProps = {
  /** Semantic type. Drives surface and text colours. Reserve error/success
   *  for status that maps to those meanings; dark/light are neutral. */
  type?: ToastType;
  /** Title — one line, truncates with an ellipsis. */
  title?: string;
  /** Subtitle — one short line, truncates. */
  subtitle?: string;
  /** Toggle the subtitle row (Figma: Show Subtitle). Default true. */
  showSubtitle?: boolean;
  /** Toggle the 40px leading asset slot (Figma: Show Asset). Default true. */
  showAsset?: boolean;
  /** Glyph rendered in the asset slot at 24px. Ignored when `asset` is set. */
  icon?: IconName;
  /** Custom leading asset (avatar/image). Overrides `icon`. */
  asset?: ReactNode;
  /** Toggle the trailing icon (chevron) in the subtitle row (Figma: Show Icon).
   *  Default true. */
  showChevron?: boolean;
  /** What sits in the trailing action slot: a `button`, a `close` (✕), or
   *  `none`. Default `"button"`. */
  action?: ToastAction;
  /** Button label (when `action` is `"button"`). Default "Button". */
  actionLabel?: string;
  /** Action press handler. For `close` this fires alongside the dismiss. */
  onActionPress?: () => void;
  /** Press handler for the toast body (the chevron implies navigation). */
  onPress?: () => void;
  /** Render the stacked presentation — a second card peeking behind the front
   *  toast to signal a queue of 2+ (Figma: M-Stacked Toast). Default false. */
  stacked?: boolean;
  /** Controlled visibility. `false` animates the toast out, then `onDismiss`.
   *  Default true. */
  visible?: boolean;
  /** Auto-dismiss after N milliseconds — fades out while dropping down a little,
   *  then fires `onDismiss`. Default 3000. Pass `null` (or `0`) to persist. */
  autoDismissMs?: number | null;
  /** Allow a downward swipe to dismiss. Default true. */
  swipeToDismiss?: boolean;
  /** Fired after the exit settles, a swipe completes, or auto-dismiss elapses. */
  onDismiss?: () => void;
  /** Screen-reader label. Defaults to the title + subtitle. */
  accessibilityLabel?: string;
  /** Layout-level escape hatch on the outer container only. */
  style?: StyleProp<ViewStyle>;
};

type Palette = {
  surface: string;
  border: string;
  title: string;
  subtitle: string;
};

/** Action-slot tone — derived from the toast type. Light toast → light
 *  treatment; dark/error/success → white-overlay treatment. */
type ActionTone = "dark" | "light";

// Figma drop shadow 0 12 14 rgba(11,12,14,0.1) — shadow tint is not tokenised.
const SHADOW_COLOR = "#0b0c0e";

const PALETTES: Record<ToastType, Palette> = {
  dark: {
    surface: colour.surface["secondary-inverted"],
    border: base.colour["alpha-light"]["8"],
    title: colour["text-n-icon"]["on-surface-bold"],
    subtitle: colour["text-n-icon"]["on-surface-subtle"],
  },
  light: {
    surface: colour.surface.primary,
    border: colour.border.subtle,
    title: colour["text-n-icon"].primary,
    subtitle: colour["text-n-icon"].tertiary,
  },
  error: {
    surface: colour.surface["error-bold"],
    border: base.colour["alpha-light"]["8"],
    title: colour["text-n-icon"]["on-surface-bold"],
    subtitle: colour["text-n-icon"]["on-surface-subtle"],
  },
  success: {
    surface: colour.surface["success-bold"],
    border: base.colour["alpha-light"]["8"],
    title: colour["text-n-icon"]["on-surface-bold"],
    subtitle: colour["text-n-icon"]["on-surface-subtle"],
  },
};

const CARD_RADIUS = radius["14"];
/** Asset slot bounds — hugs its content (icon/svg/image/lottie) between these. */
const ASSET_MIN = 20;
const ASSET_MAX = 40;
const ASSET_ICON_SIZE = 24;
const CHEVRON_SIZE = 16;
const CLOSE_ICON_SIZE = 20;
const DEFAULT_AUTO_DISMISS_MS = 3000;
/** How far the back (stacked) card peeks above the front card's top edge. */
const STACK_PEEK = 10;
/** How much the receding card shrinks as it drops behind the front toast. */
const STACK_SHRINK = 0.06;
/** Enter slide distance (also the downward exit drop). */
const ENTER_TRAVEL = 16;
/** Distance the incoming front toast rises from when a stack forms. */
const FRONT_ENTER_TRAVEL = 24;
/** Downward swipe distance / velocity past which the drag dismisses. */
const SWIPE_DISMISS_PX = 72;
const SWIPE_DISMISS_VELOCITY = 600;
/** Drag distance over which the toast fades to fully transparent. */
const SWIPE_FADE_DISTANCE = 200;

// Easing curves built from the `motion.easing` design tokens (Reanimated
// `Easing.bezier`), so enter / exit / stacked all ride the system timing
// curves rather than ad-hoc springs.
const EASE_STANDARD = Easing.bezier(
  motion.easing.standard[0],
  motion.easing.standard[1],
  motion.easing.standard[2],
  motion.easing.standard[3],
);
const EASE_DECELERATE = Easing.bezier(
  motion.easing.decelerate[0],
  motion.easing.decelerate[1],
  motion.easing.decelerate[2],
  motion.easing.decelerate[3],
);
const EASE_ACCELERATE = Easing.bezier(
  motion.easing.accelerate[0],
  motion.easing.accelerate[1],
  motion.easing.accelerate[2],
  motion.easing.accelerate[3],
);

const TOAST_SHADOW = Platform.select<ViewStyle>({
  android: { elevation: 8 },
  default: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },
});

/**
 * M-Toast — transient bottom-anchored notification.
 *
 *   <Toast type="success" title="Saved" subtitle="Your changes are live" />
 *   <Toast type="error" title="Upload failed" actionLabel="Retry" onActionPress={retry} />
 *   <Toast type="dark" title="Link copied" action="close" />
 *   <Toast title="3 items queued" stacked />            // M-Stacked Toast
 *   <Toast visible={open} onDismiss={() => setOpen(false)} autoDismissMs={null} />
 *
 * Keep the title to a few words and the subtitle to one short line — both
 * truncate and never wrap. Auto-dismisses after 3s by default. For a single
 * notification use the default; once two or more are active, set `stacked`. For
 * persistent/blocking messages use a banner or dialog instead.
 */
export function Toast({
  type = "dark",
  title,
  subtitle,
  showSubtitle = true,
  showAsset = true,
  icon,
  asset,
  showChevron = true,
  action = "button",
  actionLabel = "Button",
  onActionPress,
  onPress,
  stacked = false,
  visible = true,
  autoDismissMs = DEFAULT_AUTO_DISMISS_MS,
  swipeToDismiss = true,
  onDismiss,
  accessibilityLabel,
  style,
}: ToastProps) {
  const palette = PALETTES[type];
  const actionTone: ActionTone = type === "light" ? "light" : "dark";
  const reducedMotion = useReducedMotion();

  // Enter/exit envelope: 0 = off-screen/faded, 1 = resting.
  const progress = useSharedValue(reducedMotion ? 1 : 0);
  // Live downward swipe offset.
  const dragY = useSharedValue(0);
  // Recede envelope for the back card (the present toast dropping behind):
  // 0 = aligned with the front card, 1 = fully receded + peeking.
  const recede = useSharedValue(stacked ? 1 : 0);
  // Entrance envelope for the incoming front toast: 0 = below + hidden,
  // 1 = resting. Masked at t0 by the back card sitting at the front position.
  const frontEnter = useSharedValue(1);
  const didMount = useRef(false);
  const exiting = useRef(false);
  // Keep the back card mounted through its exit so un-stacking is smooth too.
  const [renderBack, setRenderBack] = useState(stacked);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // Animate the toast out — fade while dropping down a little — then fire
  // `onDismiss`. Guarded so auto-dismiss, the close button, a swipe, and a
  // `visible=false` can't double-fire.
  const requestDismiss = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    if (reducedMotion) {
      progress.value = 0;
      handleDismiss();
      return;
    }
    progress.value = withTiming(
      0,
      { duration: motion.duration.base, easing: EASE_ACCELERATE },
      (finished) => {
        if (finished) runOnJS(handleDismiss)();
      },
    );
  }, [reducedMotion, progress, handleDismiss]);

  // Enter on mount; drive the exit when `visible` flips to false.
  useEffect(() => {
    if (visible) {
      exiting.current = false;
      progress.value = reducedMotion ? 1 : withSpring(1, motion.spring.springLight);
    } else {
      requestDismiss();
    }
  }, [visible, reducedMotion, progress, requestDismiss]);

  // Stacked choreography (all on `motion` timing tokens):
  //   1. the present toast recedes to the back — `recede` 0→1 on
  //      `motion.duration.emphasized` × `easing.standard`.
  //   2. after `motion.delay.beat`, the new toast rises into the front —
  //      `frontEnter` 0→1 on `easing.decelerate`. The snap to 0 is hidden
  //      because the back card sits at the front position at t0.
  // Un-stacking reverses the recede on `easing.standard`, then unmounts the
  // back card on settle. The first render (mounting already-stacked) snaps.
  useEffect(() => {
    if (stacked) setRenderBack(true);

    if (reducedMotion) {
      recede.value = stacked ? 1 : 0;
      frontEnter.value = 1;
      setRenderBack(stacked);
      didMount.current = true;
      return;
    }

    if (stacked) {
      recede.value = withTiming(1, {
        duration: motion.duration.emphasized,
        easing: EASE_STANDARD,
      });
      if (didMount.current) {
        // Snap below + hidden (masked by the back card at the front position),
        // hold for a beat while the present toast recedes, then rise in.
        frontEnter.value = withSequence(
          withTiming(0, { duration: 0 }),
          withDelay(
            motion.delay.beat,
            withTiming(1, {
              duration: motion.duration.emphasized,
              easing: EASE_DECELERATE,
            }),
          ),
        );
      } else {
        frontEnter.value = 1;
      }
    } else {
      frontEnter.value = 1;
      recede.value = withTiming(
        0,
        { duration: motion.duration.base, easing: EASE_STANDARD },
        (finished) => {
          if (finished) runOnJS(setRenderBack)(false);
        },
      );
    }
    didMount.current = true;
  }, [stacked, reducedMotion, recede, frontEnter]);

  // Auto-dismiss timer (default 3s; `null`/`0` disables).
  useEffect(() => {
    if (!visible || autoDismissMs == null || autoDismissMs <= 0) return;
    const id = setTimeout(() => requestDismiss(), autoDismissMs);
    return () => clearTimeout(id);
  }, [visible, autoDismissMs, requestDismiss]);

  // Downward swipe-to-dismiss. PanResponder (core RN, like BottomSheet) only
  // claims the responder on a clearly downward drag, so taps and horizontal
  // scrolls pass through. The drag is clamped to downward only.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          swipeToDismiss && g.dy > 8 && g.dy > Math.abs(g.dx),
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, g) => {
          dragY.value = Math.max(0, g.dy);
        },
        onPanResponderRelease: (_, g) => {
          const fling =
            g.dy > SWIPE_DISMISS_PX || g.vy * 1000 > SWIPE_DISMISS_VELOCITY;
          if (fling) {
            exiting.current = true;
            dragY.value = withTiming(600, {
              duration: motion.duration.base,
              easing: EASE_ACCELERATE,
            });
            progress.value = withTiming(
              0,
              { duration: motion.duration.base, easing: EASE_ACCELERATE },
              (finished) => {
                if (finished) runOnJS(handleDismiss)();
              },
            );
          } else {
            dragY.value = withSpring(0, motion.spring.springLight);
          }
        },
      }),
    [swipeToDismiss, dragY, progress, handleDismiss],
  );

  // Enter slides up + fades; a live downward drag offsets and fades the toast.
  const containerStyle = useAnimatedStyle(() => ({
    opacity:
      progress.value * (1 - Math.min(1, dragY.value / SWIPE_FADE_DISTANCE)),
    transform: [
      { translateY: (1 - progress.value) * ENTER_TRAVEL + dragY.value },
    ],
  }));

  // The receding (present) toast: starts exactly over the front card (masking
  // the front's entrance snap), then shrinks uniformly and rises so its top
  // edge peeks above as it drops behind.
  const backCardStyle = useAnimatedStyle(() => {
    const p = recede.value;
    return {
      transform: [
        { translateY: -STACK_PEEK * p },
        { scale: 1 - STACK_SHRINK * p },
      ],
    };
  });

  // The incoming front toast: rises from below and fades in.
  const frontEnterStyle = useAnimatedStyle(() => ({
    opacity: frontEnter.value,
    transform: [{ translateY: (1 - frontEnter.value) * FRONT_ENTER_TRAVEL }],
  }));

  const derivedLabel =
    accessibilityLabel ??
    [title, showSubtitle ? subtitle : undefined].filter(Boolean).join(", ");

  // Card chrome shared by the front (interactive) and back (receding) cards,
  // so the back card is a pixel-match of the front and masks its entrance.
  const cardChrome = [
    {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface,
      overflow: "hidden" as const,
    },
    TOAST_SHADOW,
  ];

  const cardBody = (
    <>
      {/* Content — Figma pads the left/vertical by space/12; the right edge is
          owned by the action slot's own padding, so it's flush (0) unless there
          is no action. */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: space["8"],
          minWidth: 0,
          paddingLeft: space["12"],
          paddingVertical: space["12"],
          paddingRight: action === "none" ? space["12"] : 0,
        }}
      >
        {showAsset ? (
          // Hugs its content (icon / svg / image / lottie) within the Figma
          // bounds — min 20×20, max 40×40 — so the toast height follows the
          // asset rather than a fixed 40px slot.
          <View
            style={{
              minWidth: ASSET_MIN,
              minHeight: ASSET_MIN,
              maxWidth: ASSET_MAX,
              maxHeight: ASSET_MAX,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {asset ??
              (icon ? (
                <Icon name={icon} size={ASSET_ICON_SIZE} color={palette.title} />
              ) : null)}
          </View>
        ) : null}

        <View style={{ flex: 1, minWidth: 0, gap: space["2"] }}>
          {title ? (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              // @ts-expect-error — dataSet on Text on web
              dataSet={{ tokenTextStyle: "B14_SemiBold" }}
              style={[textStyles.B14_SemiBold, { color: palette.title }]}
            >
              {title}
            </Text>
          ) : null}

          {showSubtitle && subtitle ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                // @ts-expect-error — dataSet on Text on web
                dataSet={{ tokenTextStyle: "B12_Regular" }}
                style={[
                  textStyles.B12_Regular,
                  { flexShrink: 1, color: palette.subtitle },
                ]}
              >
                {subtitle}
              </Text>
              {showChevron ? (
                <Icon
                  name="system-chevron-right-bold"
                  size={CHEVRON_SIZE}
                  color={palette.subtitle}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* Action slot — space/10 padding all round (Figma ActionContainer). */}
      {action !== "none" ? (
        <View
          style={{
            padding: space["10"],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActionSlot
            variant={action}
            tone={actionTone}
            label={actionLabel}
            onPress={
              action === "close"
                ? () => {
                    onActionPress?.();
                    requestDismiss();
                  }
                : onActionPress
            }
          />
        </View>
      ) : null}
    </>
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      accessibilityRole={
        type === "error" || type === "success" ? "alert" : "summary"
      }
      accessibilityLabel={derivedLabel || undefined}
      accessibilityLiveRegion="polite"
      pointerEvents={visible ? "auto" : "none"}
      style={[{ width: "100%", maxWidth: 440, alignSelf: "center" }, containerStyle, style]}
    >
      {/* Back card — the receding present toast. Absolutely filled to the
          front card's box and a pixel-match of its content. */}
      {renderBack ? (
        <Animated.View
          pointerEvents="none"
          style={[
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
            cardChrome,
            backCardStyle,
          ]}
        >
          {cardBody}
        </Animated.View>
      ) : null}

      {/* Front card — the newest toast; interactive. */}
      <Animated.View style={frontEnterStyle}>
        <Pressable
          onPress={onPress}
          disabled={onPress == null}
          // @ts-expect-error — dataSet on Pressable on web
          dataSet={{ component: "Toast", type, stacked: String(stacked) }}
          style={cardChrome}
        >
          {cardBody}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

/**
 * Internal action-slot content — Figma M-Toast/ActionContainer (4227:76655).
 *
 *   button · dark   filled white-16% pill, white label, radius/8, pad 8
 *   button · light  white M-SecondaryNeutralButton, border, radius/8, h32
 *   close  · dark   round white-8% chip, white ✕, radius/rounded, pad 4
 *   close  · light  round surface/tertiary chip, ink ✕, radius/rounded, pad 4
 *
 * Press feedback scales via a Reanimated shared value (not TouchableOpacity).
 */
function ActionSlot({
  variant,
  tone,
  label,
  onPress,
}: {
  variant: "button" | "close";
  tone: ActionTone;
  label: string;
  onPress?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const pressed = useSharedValue(0);
  const isLight = tone === "light";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.05 }],
  }));

  const onPressIn = () => {
    pressed.value = reducedMotion ? 1 : withSpring(1, motion.spring.snappy);
  };
  const onPressOut = () => {
    pressed.value = reducedMotion ? 0 : withSpring(0, motion.spring.snappy);
  };

  if (variant === "close") {
    const bg = isLight
      ? colour.surface.tertiary
      : base.colour["alpha-light"]["8"];
    const iconColor = isLight
      ? colour["text-n-icon"].primary
      : colour["text-n-icon"]["on-surface-bold"];
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label || "Dismiss"}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Animated.View
          style={[
            {
              padding: space["4"],
              borderRadius: radius.rounded,
              backgroundColor: bg,
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
        >
          <Icon name="system-cross" size={CLOSE_ICON_SIZE} color={iconColor} />
        </Animated.View>
      </Pressable>
    );
  }

  // button
  const bg = isLight ? colour.surface.primary : base.colour["alpha-light"]["16"];
  const fg = isLight
    ? colour["text-n-icon"].primary
    : colour["text-n-icon"]["on-surface-bold"];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          {
            minHeight: 32,
            paddingHorizontal: space["10"],
            paddingVertical: isLight ? 0 : space["8"],
            borderRadius: radius["8"],
            backgroundColor: bg,
            borderWidth: isLight ? 1 : 0,
            borderColor: isLight ? colour.border.primary : undefined,
            alignItems: "center",
            justifyContent: "center",
          },
          animatedStyle,
        ]}
      >
        <Text
          numberOfLines={1}
          // @ts-expect-error — dataSet on Text on web
          dataSet={{ tokenTextStyle: "A12_SemiBold" }}
          style={[textStyles.A12_SemiBold, { color: fg }]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
