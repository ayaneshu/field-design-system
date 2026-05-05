import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { TopHeader } from "./TopHeader";
import { useTheme } from "../theme/ThemeContext";

const SIDEBAR_BREAKPOINT = 960;
const SPLIT_BREAKPOINT = 1100;

export type SidebarItem = {
  key: string;
  label: string;
  active?: boolean;
  /**
   * Optional flag — render an M-Divider after this row. Used for the "Components"
   * back-link / section break in component-detail sidebars (matches Figma).
   */
  dividerAfter?: boolean;
  /**
   * Optional flag — render the row at L1 (indented) under the previous L0 row.
   * Used for sub-tabs that should sit under a parent section (e.g. Library /
   * Playground under "Illustrations").
   */
  indent?: boolean;
};

/**
 * Detail-page scaffold matching the Figma component-detail layout: persistent
 * top header, left rail with section navigation, and a main content column
 * whose title sits to the right of the rail. The title block is constrained
 * (it does NOT span across the preview column) and there is no horizontal
 * divider beneath it. Per-section two-column layouts (controls left, preview
 * right) are composed by the screen using {@link DetailSection}.
 */
export function PageScaffold({
  topNavActive,
  title,
  // `subtitle` accepted for back-compat but no longer rendered — pages now
  // show only the title in the header (per the latest direction).
  subtitle: _subtitle,
  sidebar,
  onSidebarSelect,
  rightSlot,
  children,
}: {
  topNavActive?: "Foundations" | "Components" | "Patterns" | null;
  title: string;
  subtitle?: string;
  sidebar: SidebarItem[];
  onSidebarSelect?: (key: string) => void;
  /** Optional content rendered to the right of the title — e.g. view toggle
   * on the colours page or a Download button on typography. */
  rightSlot?: ReactNode;
  children: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const { shell } = useTheme();
  const showSidebar = width >= SIDEBAR_BREAKPOINT;
  const horizontalPad = width >= 1100 ? 60 : width >= 720 ? 32 : 20;
  const railGap = width >= 1100 ? 60 : width >= 720 ? 32 : space["32"];

  // Title scales toward the 100px Figma reference at full width.
  const titleSize =
    width >= 1440 ? 100 : width >= 1280 ? 88 : width >= 960 ? 72 : width >= 720 ? 56 : 40;
  const titleLineHeight = Math.round(titleSize * 0.95);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: shell.pageBg }}
      contentContainerStyle={{ paddingBottom: space["72"] }}
    >
      <TopHeader variant="light" active={topNavActive ?? null} />

      <View
        style={{
          paddingHorizontal: horizontalPad,
          paddingTop: 24,
          flexDirection: showSidebar ? "row" : "column",
          gap: showSidebar ? railGap : space["24"],
          // In row mode (desktop), keep the sticky sidebar from being
          // stretched by the main column. In column mode (tablet/mobile),
          // let pill row stretch to full width like before.
          alignItems: showSidebar ? "flex-start" : "stretch",
        }}
      >
        {showSidebar ? (
          <Sidebar items={sidebar} onSelect={onSidebarSelect} />
        ) : (
          <SidebarPills items={sidebar} onSelect={onSidebarSelect} />
        )}

        <View style={{ flex: 1, minWidth: 0, alignSelf: "stretch" }}>
          {/* Title row — constrained title block on the left, optional rightSlot
              (view toggle / download button / etc.) on the right. */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: space["32"],
              marginBottom: width >= SPLIT_BREAKPOINT ? space["56"] : space["32"],
            }}
          >
            <View style={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
              <Text
                style={{
                  fontFamily: "Noontree-SemiBold",
                  fontSize: titleSize,
                  lineHeight: titleLineHeight,
                  letterSpacing: width >= 960 ? -3 : width >= 720 ? -2 : -1.4,
                  color: shell.textPrimary,
                }}
              >
                {title}
              </Text>
            </View>
            {rightSlot ? (
              <View style={{ flexShrink: 0, marginTop: space["12"] }}>
                {rightSlot}
              </View>
            ) : null}
          </View>
          {children}
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * Per-section block matching the Figma layout: a two-column row where the
 * left column hosts the section heading + supporting controls/content and the
 * right column hosts the live preview specific to that section. On viewports
 * narrower than {@link SPLIT_BREAKPOINT} the preview stacks below.
 */
export function DetailSection({
  heading,
  preview,
  children,
  spacingTop,
  contentGap,
}: {
  heading: string;
  preview?: ReactNode;
  children?: ReactNode;
  /** Top margin for the section. Defaults to space.48. */
  spacingTop?: number;
  /** Gap between heading and `children`. Defaults to space.24. */
  contentGap?: number;
}) {
  const { width } = useWindowDimensions();
  const { mode, shell } = useTheme();
  const split = width >= SPLIT_BREAKPOINT && !!preview;
  // 50:50 split — both columns flex 1, separated by `gap`.
  const gap = width >= 1280 ? 40 : space["24"];

  const left = (
    <View style={{ flex: split ? 1 : undefined, minWidth: 0 }}>
      <Text
        style={[
          textStyles.Heading_H24_Bold,
          { color: shell.textPrimary },
        ]}
      >
        {heading}
      </Text>
      {children ? (
        <View style={{ marginTop: contentGap ?? space["24"] }}>{children}</View>
      ) : null}
    </View>
  );

  // Component preview is always rendered as a "light island" so the
  // M-Components inside (built in light mode only) stay visually correct
  // even when the rest of the playground is in dark mode. In light mode the
  // island disappears into the page (transparent), in dark mode it shows up
  // as an explicit white card with a subtle border.
  const islandPad = mode === "dark" ? space["16"] : 0;
  const islandStyle =
    mode === "dark"
      ? {
          backgroundColor: shell.previewIslandBg,
          borderRadius: radius["20"],
          padding: islandPad,
          borderWidth: 1,
          borderColor: shell.previewIslandBorder,
        }
      : null;

  const right = preview ? (
    <View
      style={
        split
          ? { flex: 1, minWidth: 0, ...(islandStyle ?? {}) }
          : { width: "100%", marginTop: space["24"], ...(islandStyle ?? {}) }
      }
    >
      {preview}
    </View>
  ) : null;

  return (
    <View
      style={{
        marginTop: spacingTop ?? space["48"],
        flexDirection: split ? "row" : "column",
        alignItems: "flex-start",
        gap: split ? gap : 0,
      }}
    >
      {left}
      {right}
    </View>
  );
}

function Sidebar({
  items,
  onSelect,
}: {
  items: SidebarItem[];
  onSelect?: (key: string) => void;
}) {
  const { width } = useWindowDimensions();
  const { shell } = useTheme();
  return (
    <View
      style={{
        width: width >= 1280 ? 240 : 200,
        flexShrink: 0,
        // @ts-expect-error sticky on web
        position: "sticky",
        top: 24,
        alignSelf: "flex-start",
        backgroundColor: shell.sidebarBg,
        borderRadius: radius["32"],
        padding: space["8"],
        gap: space["4"],
      }}
    >
      {items.map((item) => (
        <View key={item.key}>
          <SidebarRow item={item} onSelect={onSelect} />
          {item.dividerAfter ? (
            <View
              style={{
                height: 12,
                paddingHorizontal: space["16"],
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: 1,
                  backgroundColor: shell.sidebarDivider,
                }}
              />
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function SidebarRow({
  item,
  onSelect,
}: {
  item: SidebarItem;
  onSelect?: (key: string) => void;
}) {
  const { shell } = useTheme();
  return (
    <Pressable
      onPress={() => onSelect?.(item.key)}
      accessibilityRole="button"
      accessibilityState={item.active ? { selected: true } : {}}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        paddingLeft: item.indent ? space["32"] : space["16"],
        paddingRight: space["16"],
        paddingVertical: item.indent ? space["12"] : space["16"],
        borderRadius: radius.rounded,
        backgroundColor: item.active
          ? shell.sidebarRowActiveBg
          : hovered
            ? shell.sidebarRowHoverBg
            : "transparent",
        opacity: pressed ? 0.85 : 1,
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "background-color",
        transitionDuration: "180ms",
        transitionTimingFunction: "ease-out",
      })}
    >
      <Text
        style={{
          fontFamily: "Noontree-Medium",
          fontSize: item.indent ? 14 : 16,
          lineHeight: item.indent ? 18 : 20,
          letterSpacing: -0.15,
          color: item.active
            ? shell.textPrimary
            : item.indent
              ? shell.textTertiary
              : shell.textSecondary,
        }}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

function SidebarPills({
  items,
  onSelect,
}: {
  items: SidebarItem[];
  onSelect?: (key: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{
        gap: space["8"],
        paddingHorizontal: 0,
        alignItems: "flex-start",
      }}
    >
      {items.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => onSelect?.(item.key)}
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: radius.rounded,
            backgroundColor: item.active
              ? colour["text-n-icon"].primary
              : colour.surface.secondary,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: "Noontree-SemiBold",
              fontSize: 14,
              lineHeight: 18,
              color: item.active
                ? colour["text-n-icon"]["on-surface-bold"]
                : colour["text-n-icon"].primary,
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
