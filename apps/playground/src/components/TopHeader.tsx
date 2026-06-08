import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
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
type ActiveTab =
  | "Foundations"
  | "Components"
  | "Patterns"
  | "Install"
  | "I need"
  | null;

type TabDef = {
  label: string;
  route: keyof RootStackParamList;
  key: Exclude<ActiveTab, null>;
};

const TABS: TabDef[] = [
  { label: "Foundations", route: "Foundations", key: "Foundations" },
  { label: "Components", route: "Components", key: "Components" },
  { label: "Patterns", route: "Patterns", key: "Patterns" },
  { label: "Install", route: "Install", key: "Install" },
  { label: "I need", route: "INeed", key: "I need" },
];

/** Below this width the nav links collapse into a hamburger menu. */
const HAMBURGER_BREAKPOINT = 860;

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
  const showHamburger = width < HAMBURGER_BREAKPOINT;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu whenever this screen loses focus / the viewport grows past
  // the hamburger breakpoint, so a stale overlay can't linger over the next
  // screen (native-stack freezes the previous screen with its Modal mounted).
  useEffect(() => {
    const unsub = navigation.addListener("blur", () => setMenuOpen(false));
    return unsub;
  }, [navigation]);
  useEffect(() => {
    if (!showHamburger) setMenuOpen(false);
  }, [showHamburger]);

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

      {/* Right: nav links (wide) or hamburger (narrow) */}
      {showHamburger ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={() => setMenuOpen(true)}
          style={({ pressed }) => ({
            padding: space["8"],
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <HamburgerIcon color={navActiveColor} />
        </Pressable>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          {TABS.map((t) => (
            <NavLink
              key={t.key}
              label={t.label}
              isActive={active === t.key}
              idleColor={navIdleColor}
              activeColor={navActiveColor}
              compact={false}
              onPress={() => navigation.navigate(t.route as never)}
            />
          ))}
        </View>
      )}

      {/* Mobile menu */}
      <Modal
        visible={menuOpen && showHamburger}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            accessibilityLabel="Close menu"
            onPress={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(13,18,32,0.35)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: headerHeight - 4,
              right: horizontalPad,
              minWidth: 220,
              maxWidth: 280,
              backgroundColor: shell.headerBg,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: shell.border,
              paddingVertical: space["8"],
              shadowColor: "#0d1220",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.18,
              shadowRadius: 24,
              elevation: 16,
            }}
          >
            {TABS.map((t) => {
              const isActive = active === t.key;
              return (
                <Pressable
                  key={t.key}
                  accessibilityRole="link"
                  accessibilityLabel={t.label}
                  onPress={() => {
                    setMenuOpen(false);
                    navigation.navigate(t.route as never);
                  }}
                  style={({ pressed }) => ({
                    paddingHorizontal: space["18"],
                    paddingVertical: space["12"],
                    backgroundColor: pressed
                      ? shell.sidebarBg
                      : "transparent",
                  })}
                >
                  <Text
                    style={{
                      fontFamily: isActive
                        ? "Noontree-SemiBold"
                        : "Noontree-Medium",
                      fontSize: 16,
                      lineHeight: 22,
                      letterSpacing: -0.15,
                      color: isActive ? navActiveColor : navIdleColor,
                    }}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** Three-line hamburger glyph. */
function HamburgerIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 16, justifyContent: "space-between" }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{ height: 2, borderRadius: 1, backgroundColor: color }}
        />
      ))}
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
