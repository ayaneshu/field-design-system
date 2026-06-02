import { useState, type ReactNode } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { Icon } from "@field-ds/icons";
import { Switch as FieldSwitch } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { MotionTimesheet, type MotionTimesheetProps } from "./motionTimesheet";
import { Reveal } from "./Reveal";
import { TopHeader, headerHeightFor } from "./TopHeader";
import { createDefaultComponentMotionTimeline } from "../screens/motionTimelines/createDefaultComponentMotionTimeline";
import { useTheme } from "../theme/ThemeContext";

export type { MotionTimesheetProps, MotionTimesheetTokenRow } from "./motionTimesheet";

type DetailMode = "design" | "develop" | "motion";

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
  /**
   * Optional flag — render the row as a collapsible section header. Subsequent
   * `indent: true` rows are treated as the section's children and hidden when
   * the parent is collapsed. The parent shows a chevron on the right that
   * flips between right (collapsed) and down (expanded). Clicking the parent
   * toggles expansion locally — it does NOT call `onSelect`.
   */
  collapsible?: boolean;
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
  subtitle,
  sidebar,
  onSidebarSelect,
  rightSlot,
  version,
  repoUrl,
  motionTimeline,
  motionFooter,
  motionSpecs,
  heroImage,
  children,
}: {
  topNavActive?: "Foundations" | "Components" | "Patterns" | "I need" | null;
  title: string;
  /** Short description rendered under the title. Only renders on
   * component-style pages (i.e. when `version` or `repoUrl` is set). */
  subtitle?: string;
  sidebar: SidebarItem[];
  onSidebarSelect?: (key: string) => void;
  /** Optional content rendered to the right of the title — e.g. view toggle
   * on the colours page or a Download button on typography. Mutually
   * exclusive with `version` (which renders its own pill in the same slot). */
  rightSlot?: ReactNode;
  /** Component version pill (e.g. "V0.1") shown to the right of the title. */
  version?: string;
  /** GitHub URL for the Develop tab. When set, a Design / Develop / Motion specs segmented control renders. */
  repoUrl?: string;
  /** Declarative Gantt-like motion doc (token-led captions). Shown unless `motionSpecs` overrides entirely. */
  motionTimeline?: MotionTimesheetProps;
  /** Extra copy under {@link MotionTimesheet} — e.g. reduced-motion caveats. */
  motionFooter?: ReactNode;
  /** Full override for Motion specs tab layout (advanced). */
  motionSpecs?: ReactNode;
  /** Optional full-bleed sky image shown behind the (transparent) header and
   *  title at the top of the page, fading to white. Web-only. */
  heroImage?: string;
  children: ReactNode;
}) {
  const { width, height } = useWindowDimensions();
  const { shell } = useTheme();
  const showSidebar = width >= SIDEBAR_BREAKPOINT;
  const horizontalPad = width >= 1100 ? 60 : width >= 720 ? 32 : 20;
  const railGap = width >= 1100 ? 60 : width >= 720 ? 32 : space["32"];
  const headerHeight = headerHeightFor(width);

  // Scroll position drives the header background (transparent → white bar).
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const bandHeight = width >= 1100 ? 560 : width >= 720 ? 460 : 380;

  // Component-style pages get the subtitle / version pill / Design-Develop
  // tabs treatment. Foundations pages (no version, no repoUrl) keep the
  // older title-only layout.
  const isComponentStyle = !!version || !!repoUrl;
  const [mode, setMode] = useState<DetailMode>("design");

  // Title scales toward the 100px Figma reference at full width.
  const titleSize =
    width >= 1440 ? 100 : width >= 1280 ? 88 : width >= 960 ? 72 : width >= 720 ? 56 : 40;
  const titleLineHeight = Math.round(titleSize * 0.95);

  return (
    <View style={{ flex: 1, backgroundColor: shell.pageBg }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: space["72"] }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Optional sky backdrop behind the transparent header + title. */}
        {heroImage && Platform.OS === "web" ? (
          <View
            pointerEvents="none"
            // @ts-expect-error web-only background-image props
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: bandHeight,
              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.55) 46%, #ffffff 88%), url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : null}

        <View
          style={{
            paddingHorizontal: horizontalPad,
            paddingTop: headerHeight + 24,
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
              (view toggle / download button / etc.) on the right. Staggered:
              the title rises in first (index 0), the body follows (index 1). */}
          <Reveal
            index={0}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: space["32"],
              marginBottom: isComponentStyle
                ? space["20"]
                : width >= SPLIT_BREAKPOINT
                  ? space["56"]
                  : space["32"],
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
              {isComponentStyle && subtitle ? (
                <Text
                  style={[
                    textStyles.B16_Regular,
                    {
                      color: shell.textTertiary,
                      marginTop: space["16"],
                      maxWidth: 640,
                    },
                  ]}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {version ? (
              <View style={{ flexShrink: 0, marginTop: space["12"] }}>
                <VersionPill label={version} />
              </View>
            ) : rightSlot ? (
              <View style={{ flexShrink: 0, marginTop: space["12"] }}>
                {rightSlot}
              </View>
            ) : null}
          </Reveal>

          <Reveal index={1}>
          {isComponentStyle ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: shell.border,
                  marginBottom: 60,
                }}
              />
              {repoUrl ? (
                <View
                  style={{
                    alignItems: "flex-start",
                    marginBottom: space["32"],
                  }}
                >
                  <DesignDevelopToggle value={mode} onChange={setMode} />
                </View>
              ) : null}
            </>
          ) : null}

          {repoUrl && mode === "develop" ? (
            <DevelopPanel repoUrl={repoUrl} />
          ) : repoUrl && mode === "motion" ? (
            <MotionSpecsPanel
              title={title}
              motionSpecs={motionSpecs}
              motionTimeline={motionTimeline}
              motionFooter={motionFooter}
            />
          ) : (
            children
          )}
          </Reveal>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating header — fixed on top, transparent at the first fold and
          fading to a white bar as the page scrolls. */}
      <View
        pointerEvents="box-none"
        // @ts-expect-error zIndex on web keeps the header above content
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}
      >
        <TopHeader variant="light" active={topNavActive ?? null} scrollY={scrollY} />
      </View>
    </View>
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
        // SemiBold (600) over the H24 size — H24_Bold reads too
        // heavy as a section divider next to the prominent title above. The
        // numeric values mirror H24_Bold so leading + tracking stay
        // in sync; we override the family + weight to drop a notch.
        style={{
          fontFamily: "Noontree-SemiBold",
          fontWeight: "400",
          fontSize: 24,
          lineHeight: 32,
          letterSpacing: -0.25,
          color: shell.textPrimary,
        }}
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

// Top header height per breakpoint (mirrors TopHeader.tsx). Used to size
// the sticky sidebar so it never extends past the viewport bottom.
const HEADER_HEIGHT_COMPACT = 64;
const HEADER_HEIGHT_FULL = 92;
// Vertical breathing room above and below the sticky sidebar inside the
// viewport (matches the page's `paddingTop: 24`).
const SIDEBAR_VERTICAL_INSET = 24;

function Sidebar({
  items,
  onSelect,
}: {
  items: SidebarItem[];
  onSelect?: (key: string) => void;
}) {
  const { width, height } = useWindowDimensions();
  const { shell } = useTheme();
  const headerHeight =
    width < 720 ? HEADER_HEIGHT_COMPACT : HEADER_HEIGHT_FULL;
  // Sidebar fills the remaining viewport below the header, minus a top + bottom
  // gutter so it doesn't bump the screen edges.
  const sidebarMaxHeight =
    height - headerHeight - SIDEBAR_VERTICAL_INSET * 2;

  // Track which collapsible groups are expanded. Default: any group whose
  // direct `indent: true` children include an active row starts expanded so
  // the user can see where they are in the tree without expanding it manually.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (let i = 0; i < items.length; i++) {
      const parent = items[i];
      if (!parent.collapsible) continue;
      for (let j = i + 1; j < items.length; j++) {
        const child = items[j];
        if (!child.indent) break;
        if (child.active) {
          initial.add(parent.key);
          break;
        }
      }
    }
    return initial;
  });

  const toggleGroup = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Compute the visible item list — drop indented children whose parent
  // collapsible group is currently collapsed.
  const visibleItems: SidebarItem[] = [];
  let activeGroupKey: string | null = null;
  let activeGroupExpanded = true;
  for (const item of items) {
    if (item.collapsible) {
      activeGroupKey = item.key;
      activeGroupExpanded = expanded.has(item.key);
      visibleItems.push(item);
    } else if (item.indent && activeGroupKey) {
      if (activeGroupExpanded) visibleItems.push(item);
    } else {
      activeGroupKey = null;
      activeGroupExpanded = true;
      visibleItems.push(item);
    }
  }

  return (
    <View
      style={{
        width: width >= 1280 ? 240 : 200,
        flexShrink: 0,
        // @ts-expect-error sticky on web
        position: "sticky",
        // Sticks below the floating header.
        top: headerHeight + SIDEBAR_VERTICAL_INSET,
        alignSelf: "flex-start",
        // Cap to the visible viewport so a long item list scrolls inside the
        // sidebar instead of pushing past the screen edges.
        maxHeight: sidebarMaxHeight,
        backgroundColor: shell.sidebarBg,
        borderRadius: radius["32"],
        padding: space["8"],
        // Hide the rounded corner where the inner ScrollView meets the
        // padding so the scroll thumb doesn't paint over the rail.
        overflow: "hidden",
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ gap: space["4"] }}
        showsVerticalScrollIndicator={false}
      >
        {visibleItems.map((item) => (
          <View key={item.key}>
            <SidebarRow
              item={item}
              isExpanded={
                item.collapsible ? expanded.has(item.key) : undefined
              }
              onPress={() => {
                if (item.collapsible) {
                  toggleGroup(item.key);
                } else {
                  onSelect?.(item.key);
                }
              }}
            />
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
      </ScrollView>
    </View>
  );
}

function SidebarRow({
  item,
  isExpanded,
  onPress,
}: {
  item: SidebarItem;
  /** Defined only for collapsible parent rows; drives the chevron direction. */
  isExpanded?: boolean;
  onPress: () => void;
}) {
  const { shell } = useTheme();
  const labelColor = item.active
    ? shell.textPrimary
    : item.indent
      ? shell.textTertiary
      : shell.textSecondary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={
        item.collapsible
          ? { expanded: isExpanded === true }
          : item.active
            ? { selected: true }
            : {}
      }
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
          color: labelColor,
        }}
      >
        {item.label}
      </Text>
      {item.collapsible ? (
        <Icon
          name={isExpanded ? "system-chevron-down" : "system-chevron-right"}
          size={20}
          color={labelColor}
        />
      ) : null}
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

function VersionPill({ label }: { label: string }) {
  const { shell } = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: space["16"],
        paddingVertical: space["10"],
        borderRadius: radius.rounded,
        backgroundColor: shell.sidebarBg,
      }}
    >
      <Text
        style={[
          textStyles.B14_SemiBold,
          { color: shell.textSecondary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function MotionSpecsPanel({
  title,
  motionSpecs,
  motionTimeline,
  motionFooter,
}: {
  title: string;
  motionSpecs?: ReactNode;
  motionTimeline?: MotionTimesheetProps;
  motionFooter?: ReactNode;
}) {
  if (motionSpecs) {
    return (
      <View style={{ gap: space["32"], paddingBottom: space["40"], width: "100%", alignSelf: "stretch" }}>
        {motionSpecs}
        {motionFooter}
      </View>
    );
  }

  const resolvedTimeline =
    motionTimeline ?? createDefaultComponentMotionTimeline(title);

  return (
    <View style={{ gap: space["32"], paddingBottom: space["40"], width: "100%", alignSelf: "stretch" }}>
      <MotionTimesheet {...resolvedTimeline} />
      {motionFooter}
    </View>
  );
}

function DesignDevelopToggle({
  value,
  onChange,
}: {
  value: DetailMode;
  onChange: (next: DetailMode) => void;
}) {
  const options = [
    { value: "design" as const, label: "Design" },
    { value: "develop" as const, label: "Develop" },
    { value: "motion" as const, label: "Motion" },
  ];

  return (
    <View style={{ minWidth: 320, maxWidth: 420, alignSelf: "stretch" }}>
      <FieldSwitch<DetailMode>
        size="H48"
        options={options}
        value={value}
        onChange={onChange}
        accessibilityLabel="Switch between Design, Develop, and Motion specs"
      />
    </View>
  );
}

const COMPONENTS_SRC_BASE =
  "https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src";

/**
 * Normalise the per-screen `repoUrl` into the **component folder** URL we
 * want "Open Github" to land on. Each component on disk lives under
 * `packages/components/src/<Folder>/`; the screens historically passed file
 * paths in a couple of different shapes:
 *
 *   - `.../packages/components/src/Button/PrimaryButton.tsx`  → "Button"
 *   - `.../packages/components/src/Checkbox.tsx`              → "Checkbox"
 *   - `.../apps/playground/src/components/Accordion.tsx`      → "Accordion"
 *
 * Strategy:
 *   1. If the URL has `/components/src/`, take the next segment.
 *   2. Otherwise fall back to the URL's basename (strip the `.tsx`).
 *   3. Build the folder URL from the canonical components base.
 */
function repoFolderUrl(repoUrl: string): string {
  const marker = "/components/src/";
  let folder = "";
  const idx = repoUrl.indexOf(marker);
  if (idx !== -1) {
    folder = repoUrl.slice(idx + marker.length).split("/")[0];
  } else {
    const last = repoUrl.split("/").pop() ?? "";
    folder = last;
  }
  folder = folder.replace(/\.tsx$/i, "");
  if (!folder) return repoUrl;
  return `${COMPONENTS_SRC_BASE}/${folder}`;
}

function DevelopPanel({ repoUrl }: { repoUrl: string }) {
  const { shell } = useTheme();
  const folderUrl = repoFolderUrl(repoUrl);
  const open = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.open(folderUrl, "_blank", "noopener,noreferrer");
      return;
    }
    Linking.openURL(folderUrl).catch(() => {});
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: space["16"],
          borderBottomWidth: 1,
          borderBottomColor: shell.border,
        }}
      >
        <ColumnLabel flex={2} color={shell.textTertiary}>Library</ColumnLabel>
        <ColumnLabel flex={2} color={shell.textTertiary}>Version</ColumnLabel>
        <ColumnLabel flex={3} color={shell.textTertiary}>Link</ColumnLabel>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: space["20"],
        }}
      >
        <View style={{ flex: 2 }}>
          <Text
            style={[
              textStyles.B16_SemiBold,
              { color: shell.textPrimary },
            ]}
          >
            React Native
          </Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text
            style={[
              textStyles.B16_Regular,
              { color: shell.textSecondary },
            ]}
          >
            —
          </Text>
        </View>
        <View style={{ flex: 3 }}>
          <Pressable
            onPress={open}
            accessibilityRole="link"
            accessibilityLabel={`Open ${folderUrl} on GitHub`}
            // @ts-expect-error hover is web-only
            style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
              alignSelf: "flex-start",
              opacity: pressed ? 0.7 : 1,
              // @ts-expect-error cursor is web-only
              cursor: "pointer",
              // @ts-expect-error textDecoration is web-only
              textDecoration: hovered ? "underline" : "none",
            })}
          >
            <Text
              style={[
                textStyles.B16_SemiBold,
                { color: colour["text-n-icon"].action },
              ]}
            >
              Open Github
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ColumnLabel({
  children,
  flex,
  color,
}: {
  children: ReactNode;
  flex: number;
  color: string;
}) {
  return (
    <View style={{ flex }}>
      <Text style={[textStyles.B14_Regular, { color }]}>{children}</Text>
    </View>
  );
}
