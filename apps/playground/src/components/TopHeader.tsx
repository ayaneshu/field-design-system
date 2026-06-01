import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { useNavigation, type NavigationProp } from "@react-navigation/native";

import { colour, space } from "@field-ds/tokens";

import { Logo } from "./Logo";
import { useTheme } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Variant = "light" | "yellow" | "dark";
type ActiveTab = "Foundations" | "Components" | "Patterns" | "I need" | null;

/** Shared header height per breakpoint — also used by screens to pad content
 *  down beneath the floating header. */
export const HEADER_HEIGHT_COMPACT = 64;
export const HEADER_HEIGHT_FULL = 92;
export function headerHeightFor(width: number): number {
  return width < 720 ? HEADER_HEIGHT_COMPACT : HEADER_HEIGHT_FULL;
}

/**
 * Persistent top nav — logo + "noon" wordmark on the left, route links and
 * the light/dark toggle on the right. The `variant` prop is used by the home
 * page (yellow / dark hero variants); regular pages pass "light" but the
 * actual chrome colour is driven by the global theme so the bar still flips
 * with light/dark mode.
 */
export function TopHeader({
  variant = "light",
  active = null,
  transparent = false,
  scrollY,
}: {
  variant?: Variant;
  active?: ActiveTab;
  /** Drop the header's background fill so whatever sits behind it (e.g. the
      home page's watercolour backdrop) shows through. Text colours stay
      themed. */
  transparent?: boolean;
  /** When provided, the header floats with a transparent fill that fades to a
      white bar (with a hairline + soft shadow) as the page scrolls. */
  scrollY?: SharedValue<number>;
}) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const { shell } = useTheme();
  const isCompact = width < 720;
  const horizontalPad = width >= 1100 ? 60 : width >= 720 ? 32 : 20;
  const headerHeight = isCompact ? 64 : 92;

  // Scroll-driven background. `floating` headers start transparent and fade in
  // a white bar over the first ~56px of scroll.
  const floating = !!scrollY;
  const fallbackScroll = useSharedValue(0);
  const sy = scrollY ?? fallbackScroll;
  const floatingBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sy.value, [0, 56], [0, 1], Extrapolation.CLAMP),
  }));

  // The home page uses fixed-colour hero variants (yellow / dark navy) that
  // shouldn't flip with the global theme. Other pages defer to the theme.
  const isYellow = variant === "yellow";
  const isFixedDark = variant === "dark";
  const isThemed = !isYellow && !isFixedDark;

  const bg =
    floating || transparent
      ? "transparent"
      : isYellow
        ? colour.surface["brand-primary"]
        : isFixedDark
          ? "transparent"
          : shell.headerBg;
  const brandColor = isFixedDark
    ? "#f4f6fb"
    : isThemed
      ? shell.textPrimary
      : colour["text-n-icon"].primary;
  const noonColor = isFixedDark
    ? "rgba(232,236,245,0.65)"
    : isYellow
      ? "rgba(29,37,57,0.7)"
      : shell.textSecondary;
  const dividerColor = isFixedDark
    ? "rgba(232,236,245,0.25)"
    : isYellow
      ? "rgba(29,37,57,0.25)"
      : shell.border;
  const navIdleColor = isFixedDark
    ? "rgba(232,236,245,0.65)"
    : isYellow
      ? colour["text-n-icon"].primary
      : shell.textTertiary;
  const navActiveColor = isFixedDark ? "#f4f6fb" : shell.textPrimary;

  return (
    <View
      // @ts-expect-error dataSet on web
      dataSet={{ slot: "top-header", variant }}
      style={{
        height: headerHeight,
        paddingHorizontal: horizontalPad,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: bg,
        // @ts-expect-error zIndex on web
        zIndex: 3,
        position: "relative",
      }}
    >
      {/* Scroll-driven white bar — fades in behind the content as you scroll. */}
      {floating ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: shell.headerBg,
              borderBottomWidth: 1,
              borderBottomColor: shell.border,
            },
            floatingBgStyle,
          ]}
        />
      ) : null}

      {/* Left: logo + brand mark + noon wordmark */}
      <Pressable
        onPress={() => navigation.navigate("Home" as never)}
        accessibilityRole="link"
        accessibilityLabel="Home"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["10"],
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: space["8"] }}
        >
          <Logo size={isCompact ? 20 : 24} color={brandColor} />
          <Text
            style={{
              fontFamily: "Noontree-Bold",
              fontSize: isCompact ? 16 : 18,
              lineHeight: isCompact ? 20 : 24,
              letterSpacing: -0.15,
              color: brandColor,
            }}
          >
            field
          </Text>
        </View>
        {/* Vertical hairline separator + noon wordmark — hidden on phones
            so the nav links have room without wrapping. */}
        {width >= 480 ? (
          <>
            <View
              style={{
                width: 1,
                height: 17,
                backgroundColor: dividerColor,
              }}
            />
            <Text
              style={{
                fontFamily: "Noontree-Bold",
                fontSize: isCompact ? 16 : 18,
                lineHeight: isCompact ? 20 : 24,
                letterSpacing: -0.15,
                color: noonColor,
              }}
            >
              noon
            </Text>
          </>
        ) : null}
      </Pressable>

      {/* Right: nav links + theme toggle */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: isCompact ? 4 : 16,
        }}
      >
        <NavLink
          label="Foundations"
          isActive={active === "Foundations"}
          idleColor={navIdleColor}
          activeColor={navActiveColor}
          compact={isCompact}
          onPress={() => navigation.navigate("Foundations" as never)}
        />
        <NavLink
          label="Components"
          isActive={active === "Components"}
          idleColor={navIdleColor}
          activeColor={navActiveColor}
          compact={isCompact}
          onPress={() => navigation.navigate("Components" as never)}
        />
        <NavLink
          label="Patterns"
          isActive={active === "Patterns"}
          idleColor={navIdleColor}
          activeColor={navActiveColor}
          compact={isCompact}
          onPress={() => navigation.navigate("Patterns" as never)}
        />
        <NavLink
          label="I need"
          isActive={active === "I need"}
          idleColor={navIdleColor}
          activeColor={navActiveColor}
          compact={isCompact}
          onPress={() => navigation.navigate("INeed" as never)}
        />
      </View>
    </View>
  );
}

function NavLink({
  label,
  isActive,
  idleColor,
  activeColor,
  compact,
  onPress,
}: {
  label: string;
  isActive: boolean;
  idleColor: string;
  activeColor: string;
  compact?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        paddingHorizontal: compact ? 8 : 16,
        paddingVertical: compact ? 8 : 12,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: "Noontree-Medium",
          fontSize: compact ? 13 : 16,
          lineHeight: compact ? 18 : 20,
          letterSpacing: -0.15,
          color: isActive ? activeColor : idleColor,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
