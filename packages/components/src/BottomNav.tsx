import { useEffect, type ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Icon, type IconName, iconNames } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

// Apple-style ease-out — matches Accordion / Checkbox so selection across
// the system feels like one motion language.
const APPLE_EASE = Easing.bezier(0.32, 0.72, 0, 1);
const SELECT_DURATION = 260;

// Figma: M-Bottomnav — primary bottom tab bar.
//   • Highlight bar 4×43, top of each tab, action colour when active.
//   • Icon 32×32 area; icon glyph size 24 (Field DS bottomnav icons are 24×24).
//   • Label B11 — Bold + action when active, Medium + tertiary when not.
//   • Container padHorizontal 16; tabs flex 1 with center alignment.
//   • Min 3, max 5 tabs (Apple/Material parity; below 3 reads as a row of buttons,
//     above 5 the labels truncate).
const ICON_AREA = space["32"];
const ICON_SIZE = space["24"];
const HIGHLIGHT_HEIGHT = space["4"];
const HIGHLIGHT_WIDTH = 43; // No matching token; explicit per the spec.
const HIGHLIGHT_RADIUS = radius["2"];
const TAB_GAP = space["8"]; // highlight ↔ icon
const ITEM_GAP = space["6"]; // icon ↔ label
const SIDE_PADDING = space["16"];

const HOME_BAR_WIDTH = 124;
const HOME_BAR_HEIGHT = 5;
const HOME_BAR_RADIUS = radius["8"];
const HOME_BAR_TOP_PAD = space["12"];
const HOME_BAR_BOTTOM_PAD = space["8"];

const MIN_TABS = 3;
const MAX_TABS = 5;

/**
 * The subset of Field DS icons that ship as a bottomnav default + `-filled`
 * pair. Only these can be used in `BottomNavTab.icon` — the active state is
 * resolved by appending `-filled` to the same slug, so the outline/filled
 * pair is guaranteed to be the same icon.
 */
export type BottomNavIconName = Extract<
  IconName,
  `bottomnav-${string}`
> extends `bottomnav-${infer Rest}`
  ? Rest extends `${string}-filled`
    ? never
    : `bottomnav-${Rest}`
  : never;

/**
 * Runtime list of valid bottomnav default icons (have a matching `-filled`
 * sibling). Useful for building pickers in consumer apps and demos.
 */
export const bottomNavIconNames: BottomNavIconName[] = (iconNames as IconName[])
  .filter(
    (n): n is BottomNavIconName =>
      n.startsWith("bottomnav-") &&
      !n.endsWith("-filled") &&
      (iconNames as IconName[]).includes(`${n}-filled` as IconName),
  )
  .sort();

export type BottomNavTab = {
  /** Stable id used for `activeKey` and `onTabPress`. */
  key: string;
  /** Visible label rendered under the icon. */
  label: string;
  /**
   * Outline (default-state) icon. The active-state icon is auto-derived as
   * `${icon}-filled`, so the outline / filled pair is always the same icon.
   * Must be a `bottomnav-*` icon — those are the only ones with a guaranteed
   * filled counterpart.
   */
  icon: BottomNavIconName;
};

export type BottomNavProps = {
  /** 3–5 tabs. Anything outside that range is asserted in development. */
  tabs: BottomNavTab[];
  /** Key of the currently active tab. Must match one of `tabs[].key`. */
  activeKey: string;
  onTabPress?: (key: string) => void;
  /** Show the iOS home indicator below the tabs. Defaults to true. */
  showHomeBar?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-Bottomnav — primary bottom tab bar. One tab is active at a time and
 * drives the highlight, icon and label colour. Active state automatically
 * swaps the icon to its `-filled` sibling.
 *
 *   <BottomNav
 *     tabs={[
 *       { key: "home", label: "Home", icon: "bottomnav-home" },
 *       { key: "categories", label: "Categories", icon: "bottomnav-categories" },
 *       { key: "cart", label: "Cart", icon: "bottomnav-cart" },
 *     ]}
 *     activeKey={tab}
 *     onTabPress={setTab}
 *   />
 *
 * Use once per screen at the bottom of primary tabbed flows. Don't stack
 * above other fixed footers — the bottom nav owns that region.
 */
export function BottomNav({
  tabs,
  activeKey,
  onTabPress,
  showHomeBar = true,
  style,
}: BottomNavProps) {
  if (__DEV__ && (tabs.length < MIN_TABS || tabs.length > MAX_TABS)) {
    // Shout in dev so it's caught in playground / Storybook builds. We don't
    // throw — the layout still renders, just outside the spec.
    console.warn(
      `[BottomNav] received ${tabs.length} tabs; expected ${MIN_TABS}–${MAX_TABS}.`,
    );
  }

  return (
    <View
      // @ts-expect-error — dataSet on web
      dataSet={{
        component: "BottomNav",
        tokenBg: "colour.surface.primary",
      }}
      style={[
        {
          backgroundColor: colour.surface.primary,
          width: "100%",
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: SIDE_PADDING,
          backgroundColor: colour.surface.primary,
        }}
      >
        {tabs.map((tab) => (
          <BottomNavItem
            key={tab.key}
            tab={tab}
            active={tab.key === activeKey}
            onPress={() => onTabPress?.(tab.key)}
          />
        ))}
      </View>
      {showHomeBar ? <HomeBar /> : null}
    </View>
  );
}

function BottomNavItem({
  tab,
  active,
  onPress,
}: {
  tab: BottomNavTab;
  active: boolean;
  onPress: () => void;
}): ReactNode {
  const tint = active
    ? colour["text-n-icon"].action
    : colour["text-n-icon"].tertiary;
  // Filled variant is guaranteed at the type level via BottomNavIconName.
  const iconName = (active ? `${tab.icon}-filled` : tab.icon) as IconName;
  const label = active ? textStyles.Body_B11_Bold : textStyles.Body_B11_Medium;

  // Selection driver: 0 = inactive, 1 = active. Drives the highlight scale-in,
  // a subtle icon "pop", and label fade — kept on the same APPLE_EASE curve
  // as Accordion + Checkbox.
  const progress = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: SELECT_DURATION,
      easing: APPLE_EASE,
    });
  }, [active, progress]);

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scaleX: interpolate(progress.value, [0, 1], [0.4, 1], "clamp") },
    ],
  }));

  // Tiny pop on the icon when it lands as active (1 → 1.08 → 1).
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 0.6, 1],
          [1, 1.08, 1],
          "clamp",
        ),
      },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      // @ts-expect-error — dataSet on Pressable on web
      dataSet={{
        slot: "tab",
        active: active ? "true" : "false",
        tokenColor: active
          ? "colour.text-n-icon.action"
          : "colour.text-n-icon.tertiary",
      }}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: "center",
        gap: TAB_GAP,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Animated.View
        // @ts-expect-error — dataSet on web
        dataSet={{
          slot: "highlight",
          tokenBg: active ? "colour.text-n-icon.action" : "transparent",
        }}
        style={[
          {
            height: HIGHLIGHT_HEIGHT,
            width: HIGHLIGHT_WIDTH,
            borderRadius: HIGHLIGHT_RADIUS,
            backgroundColor: colour["text-n-icon"].action,
          },
          highlightStyle,
        ]}
      />
      <View style={{ alignItems: "center", gap: ITEM_GAP }}>
        <Animated.View
          style={[
            {
              width: ICON_AREA,
              height: ICON_AREA,
              alignItems: "center",
              justifyContent: "center",
            },
            iconStyle,
          ]}
        >
          <Icon name={iconName} size={ICON_SIZE} color={tint} />
        </Animated.View>
        <Text
          numberOfLines={1}
          // @ts-expect-error — dataSet on Text on web
          dataSet={{
            tokenTextStyle: active ? "Body_B11_Bold" : "Body_B11_Medium",
            tokenColor: active
              ? "colour.text-n-icon.action"
              : "colour.text-n-icon.tertiary",
          }}
          style={[
            label,
            {
              color: tint,
              // CSS-side colour transition for RN-Web (native ignores).
              // @ts-expect-error rn-web passes through to DOM
              transitionProperty: "color",
              transitionDuration: "200ms",
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
            },
          ]}
        >
          {tab.label}
        </Text>
      </View>
    </Pressable>
  );
}

/** iOS home indicator. Sits below the tab row on full-screen mobile layouts. */
function HomeBar() {
  return (
    <View
      // @ts-expect-error — dataSet on web
      dataSet={{ slot: "home-bar", tokenBg: "colour.text-n-icon.primary" }}
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: HOME_BAR_TOP_PAD,
        paddingBottom: HOME_BAR_BOTTOM_PAD,
      }}
    >
      <View
        style={{
          width: HOME_BAR_WIDTH,
          height: HOME_BAR_HEIGHT,
          borderRadius: HOME_BAR_RADIUS,
          backgroundColor: colour["text-n-icon"].primary,
        }}
      />
    </View>
  );
}
