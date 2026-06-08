import { type ReactNode } from "react";
import {
  I18nManager,
  Image,
  type ImageSourcePropType,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { Icon, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { IconButton } from "../Button/IconButton";
import { SearchBar } from "../SearchBar";

// Maps to Figma M-PageHeader (1753:285). Single component set with nine layout
// types — one component, nine `type` values, each owning the slots that make
// sense for it. Variants below correspond 1:1 to Figma `Type=*` children:
//   Title (1753:174), Title-Center (1753:197), Search-Bar (1753:209),
//   Location (1753:248), Breadcrumb (1753:265), Back-Only (1753:277),
//   Search-Pill (1753:223), Icons (1774:211), Search-Pill-Wide (1774:231).
//
// Slot rules:
//   • leading is an IconButton/H40 default (ghost on `back-only`).
//   • Up to 3 trailing icons; anything past 3 is sliced with a dev warning.
//   • search-bar / search-pill[-wide] don't take a leadingIcon-only override —
//     the surface is the search affordance itself.
//   • search-bar composes the real M-SearchBar primitive. M-SearchPill isn't
//     in the repo yet; the search-pill / search-pill-wide variants render
//     inline approximations using the same tokens. Swap to the real pill
//     primitive when it lands without changing this component's API.
export type PageHeaderType =
  | "title"
  | "title-center"
  | "search-bar"
  | "search-pill"
  | "search-pill-wide"
  | "location"
  | "breadcrumb"
  | "back-only"
  | "icons";

export type PageHeaderTrailing = {
  icon: IconName;
  onPress?: () => void;
  /** Required — icon-only affordances are opaque to screen readers without it. */
  accessibilityLabel: string;
};

export type PageHeaderProps = {
  type: PageHeaderType;

  // Title content (title / title-center).
  title?: string;
  subtitle?: string;
  /** title only — 38×38 image slot rendered between leading and content. */
  imageSource?: ImageSourcePropType;

  // Leading affordance (ignored for `search-bar`).
  leadingIcon?: IconName;
  onLeadingPress?: () => void;
  /** Defaults to "Back" — change when leadingIcon isn't a back chevron. */
  leadingAccessibilityLabel?: string;

  // Trailing affordances. Up to 3.
  trailing?: PageHeaderTrailing[];

  // Location / breadcrumb specifics.
  addressLabel?: string;
  /** Defaults to `"system-home-filled"`. */
  addressIcon?: IconName;
  onAddressPress?: () => void;
  /** breadcrumb only. */
  path?: string;

  // Search specifics.
  searchPlaceholder?: string;
  /** search-bar only — controlled value. */
  searchValue?: string;
  onSearchChangeText?: (s: string) => void;
  /** search-pill / search-pill-wide — pill is tap-to-open. */
  onSearchPillPress?: () => void;

  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const MAX_TRAILING = 3;
const ICON_SIZE = space["20"];
const SMALL_ICON_SIZE = space["16"];
// 38 has no matching DS space token (36 and 40 exist). Figma is explicit at
// 38 so the image slot lines up with the H40 IconButton's optical centre.
const IMAGE_SIZE = 38;
const HEADER_HEIGHT = space["56"];
const SEARCH_BAR_HEIGHT = space["64"];
const SEARCH_PILL_HEIGHT = space["40"];

/**
 * M-PageHeader — top-of-screen header. Pick a `type` to switch layout:
 *
 *   <PageHeader type="title" title="Page title" trailing={[{ icon: "system-upload", onPress, accessibilityLabel: "Share" }]} />
 *   <PageHeader type="title-center" title="Settings" />
 *   <PageHeader type="search-bar" searchPlaceholder="Search for your building, area..." onSearchChangeText={setQ} searchValue={q} />
 *   <PageHeader type="location" addressLabel="Home" subtitle="Villa 52, Springville, K, VGP Layout" trailing={[{ icon: "system-heart", onPress, accessibilityLabel: "Saved" }]} />
 *   <PageHeader type="back-only" onLeadingPress={goBack} />
 *
 * Always exactly one PageHeader per screen, anchored below the status bar.
 */
export function PageHeader(props: PageHeaderProps) {
  const { type, style, testID } = props;
  const trailing = clampTrailing(props.trailing);

  return (
    <View
      accessibilityRole="header"
      style={[styles.container, type === "search-bar" && styles.containerTall, style]}
      testID={testID}
    >
      {renderBody(type, props, trailing)}
    </View>
  );
}

function renderBody(
  type: PageHeaderType,
  props: PageHeaderProps,
  trailing: PageHeaderTrailing[],
): ReactNode {
  switch (type) {
    case "title":
      return <TitleBody {...props} trailing={trailing} centered={false} />;
    case "title-center":
      return <TitleBody {...props} trailing={trailing} centered />;
    case "search-bar":
      return <SearchBarBody {...props} />;
    case "search-pill":
    case "search-pill-wide":
      return <SearchPillBody {...props} trailing={trailing} wide={type === "search-pill-wide"} />;
    case "location":
      return <LocationBody {...props} trailing={trailing} />;
    case "breadcrumb":
      return <BreadcrumbBody {...props} trailing={trailing} />;
    case "back-only":
      return <BackOnlyBody {...props} />;
    case "icons":
      return <IconsBody {...props} trailing={trailing} />;
  }
}

function clampTrailing(t: PageHeaderTrailing[] | undefined): PageHeaderTrailing[] {
  if (!t) return [];
  if (t.length <= MAX_TRAILING) return t;
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(
      `[PageHeader] trailing has ${t.length} icons; only the first ${MAX_TRAILING} render.`,
    );
  }
  return t.slice(0, MAX_TRAILING);
}

// ─── shared bits ────────────────────────────────────────────────────────────

// Directional back/forward glyphs that must mirror under RTL. Symmetric
// glyphs (menu, close, etc.) passed via leadingIcon are left untouched.
const DIRECTIONAL_LEADING_ICONS = new Set<IconName>([
  "system-chevron-left",
  "system-chevron-right",
  "system-arrow-left",
  "system-arrow-right",
]);

function Leading({
  icon = "system-chevron-left",
  onPress,
  label = "Back",
  emphasis = "default",
}: {
  icon?: IconName;
  onPress?: () => void;
  label?: string;
  emphasis?: "default" | "ghost";
}) {
  const flip = I18nManager.isRTL && DIRECTIONAL_LEADING_ICONS.has(icon);
  return (
    <IconButton
      icon={icon}
      emphasis={emphasis}
      onPress={onPress}
      accessibilityLabel={label}
      style={flip ? styles.rtlFlip : undefined}
    />
  );
}

function TrailingRow({ trailing }: { trailing: PageHeaderTrailing[] }) {
  if (trailing.length === 0) return null;
  return (
    <View style={styles.trailingRow}>
      {trailing.map((t, i) => (
        <IconButton
          key={`${t.icon}-${i}`}
          icon={t.icon}
          onPress={t.onPress}
          accessibilityLabel={t.accessibilityLabel}
        />
      ))}
    </View>
  );
}

// ─── variant bodies ─────────────────────────────────────────────────────────

function TitleBody({
  title,
  subtitle,
  imageSource,
  leadingIcon,
  onLeadingPress,
  leadingAccessibilityLabel,
  trailing,
  centered,
}: PageHeaderProps & { trailing: PageHeaderTrailing[]; centered: boolean }) {
  const titleStyle = centered ? styles.titleCentered : styles.title;
  return (
    <View style={[styles.row, styles.gapTitle]}>
      <Leading
        icon={leadingIcon}
        onPress={onLeadingPress}
        label={leadingAccessibilityLabel}
      />
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={[styles.titleContent, centered && styles.titleContentCentered]}>
        {title ? (
          <Text style={titleStyle} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <TrailingRow trailing={trailing} />
    </View>
  );
}

function SearchBarBody({
  searchPlaceholder = "Search",
  searchValue,
  onSearchChangeText,
}: PageHeaderProps) {
  // Compose the real M-SearchBar. PageHeader's search props map onto
  // SearchBar 1:1: searchValue→value (controlled), onSearchChangeText→
  // onChangeText, searchPlaceholder→placeholder. SearchBar derives its
  // visual state from focus+value internally, so nothing else is wired.
  return (
    <View style={[styles.row, styles.gapZero]}>
      <SearchBar
        value={searchValue}
        onChangeText={onSearchChangeText}
        placeholder={searchPlaceholder}
        style={styles.searchBar}
      />
    </View>
  );
}

function SearchPillBody({
  leadingIcon,
  onLeadingPress,
  leadingAccessibilityLabel,
  searchPlaceholder = "Search",
  onSearchPillPress,
  trailing,
  wide,
}: PageHeaderProps & { trailing: PageHeaderTrailing[]; wide: boolean }) {
  return (
    <View style={[styles.row, styles.gapDefault, styles.spaceBetween]}>
      <Leading
        icon={leadingIcon}
        onPress={onLeadingPress}
        label={leadingAccessibilityLabel}
      />
      <View style={[styles.searchPillWrap, !wide && styles.searchPillWrapTight]}>
        <Pressable
          onPress={onSearchPillPress}
          accessibilityRole="search"
          accessibilityLabel={searchPlaceholder}
          style={({ pressed }) => [
            styles.searchPill,
            wide && styles.searchPillWide,
            pressed && styles.searchPillPressed,
          ]}
        >
          <Icon
            name="system-search"
            size={ICON_SIZE}
            color={colour["text-n-icon"].secondary}
          />
          <Text style={styles.searchPillText} numberOfLines={1}>
            {searchPlaceholder}
          </Text>
        </Pressable>
        <TrailingRow trailing={trailing} />
      </View>
    </View>
  );
}

function LocationBody({
  addressLabel,
  addressIcon = "system-home-filled",
  onAddressPress,
  subtitle,
  leadingIcon,
  onLeadingPress,
  leadingAccessibilityLabel,
  trailing,
}: PageHeaderProps & { trailing: PageHeaderTrailing[] }) {
  return (
    <View style={[styles.row, styles.gapDefault]}>
      <Leading
        icon={leadingIcon}
        onPress={onLeadingPress}
        label={leadingAccessibilityLabel}
      />
      <View style={styles.locationContent}>
        <Pressable
          onPress={onAddressPress}
          accessibilityRole="button"
          accessibilityLabel={addressLabel ?? "Change address"}
          style={styles.addressRow}
        >
          <Icon name={addressIcon} size={ICON_SIZE} color={colour["text-n-icon"].primary} />
          {addressLabel ? <Text style={styles.addressLabel}>{addressLabel}</Text> : null}
          <Icon
            name="system-chevron-down"
            size={SMALL_ICON_SIZE}
            color={colour["text-n-icon"].primary}
          />
        </Pressable>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <TrailingRow trailing={trailing} />
    </View>
  );
}

function BreadcrumbBody({
  addressLabel,
  addressIcon = "system-home-filled",
  path,
  onAddressPress,
  trailing,
}: PageHeaderProps & { trailing: PageHeaderTrailing[] }) {
  return (
    <View style={[styles.row, styles.gapDefault]}>
      <Pressable
        onPress={onAddressPress}
        accessibilityRole="button"
        accessibilityLabel={addressLabel ?? "Change location"}
        style={styles.crumbRow}
      >
        <Icon name={addressIcon} size={ICON_SIZE} color={colour["text-n-icon"].primary} />
        {addressLabel ? <Text style={styles.crumbHead}>{addressLabel}</Text> : null}
        {path ? (
          <Text style={styles.crumbPath} numberOfLines={1}>
            {path}
          </Text>
        ) : null}
        <Icon
          name="system-chevron-down"
          size={16}
          color={colour["text-n-icon"].primary}
        />
      </Pressable>
      <TrailingRow trailing={trailing} />
    </View>
  );
}

function BackOnlyBody({
  leadingIcon,
  onLeadingPress,
  leadingAccessibilityLabel,
}: PageHeaderProps) {
  return (
    <View style={[styles.row, styles.gapZero]}>
      <Leading
        icon={leadingIcon}
        onPress={onLeadingPress}
        label={leadingAccessibilityLabel}
        emphasis="ghost"
      />
    </View>
  );
}

function IconsBody({
  leadingIcon,
  onLeadingPress,
  leadingAccessibilityLabel,
  trailing,
}: PageHeaderProps & { trailing: PageHeaderTrailing[] }) {
  return (
    <View style={[styles.row, styles.gapDefault, styles.spaceBetween]}>
      <Leading
        icon={leadingIcon}
        onPress={onLeadingPress}
        label={leadingAccessibilityLabel}
      />
      <TrailingRow trailing={trailing} />
    </View>
  );
}

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colour.surface.primary,
    height: HEADER_HEIGHT,
    paddingVertical: space["8"],
    paddingHorizontal: space["12"],
    justifyContent: "center",
  },
  containerTall: {
    height: SEARCH_BAR_HEIGHT,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  gapDefault: { gap: space["8"] },
  gapTitle: { gap: space["4"] },
  gapZero: { gap: 0 },
  spaceBetween: { justifyContent: "space-between" },
  rtlFlip: { transform: [{ scaleX: -1 }] },

  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius["8"],
    backgroundColor: colour.surface.tertiary,
  },

  titleContent: {
    flex: 1,
    paddingHorizontal: space["4"],
    justifyContent: "center",
  },
  titleContentCentered: {
    alignItems: "center",
  },
  title: {
    ...textStyles.H16_Bold,
    color: colour["text-n-icon"].primary,
  },
  titleCentered: {
    ...textStyles.B16_SemiBold,
    color: colour["text-n-icon"].primary,
  },
  subtitle: {
    ...textStyles.B12_Regular,
    color: colour["text-n-icon"].secondary,
  },

  trailingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space["4"],
  },

  // Search bar (search-bar) — the real M-SearchBar stretched to fill the row.
  // Override SearchBar's H48 minWidth (320) so it flexes inside the header.
  searchBar: {
    flex: 1,
    minWidth: 0,
  },

  // Search pill (search-pill / search-pill-wide)
  searchPillWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: space["4"],
  },
  searchPillWrapTight: {
    justifyContent: "flex-end",
  },
  searchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space["8"],
    height: SEARCH_PILL_HEIGHT,
    paddingHorizontal: space["12"],
    backgroundColor: colour.surface.tertiary,
    borderRadius: radius.rounded,
    borderWidth: 1,
    borderColor: colour.border.subtle,
    minWidth: 120,
  },
  searchPillWide: {
    flex: 1,
  },
  searchPillPressed: {
    backgroundColor: colour.surface.secondary,
  },
  searchPillText: {
    ...textStyles.B12_Medium,
    color: colour["text-n-icon"].secondary,
    flexShrink: 1,
  },

  // Location
  locationContent: {
    flex: 1,
    justifyContent: "center",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space["4"],
    alignSelf: "flex-start",
  },
  addressLabel: {
    ...textStyles.B16_SemiBold,
    color: colour["text-n-icon"].primary,
  },

  // Breadcrumb
  crumbRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space["4"],
  },
  crumbHead: {
    ...textStyles.B14_SemiBold,
    color: colour["text-n-icon"].primary,
  },
  crumbPath: {
    ...textStyles.B14_Regular,
    color: colour["text-n-icon"].secondary,
    flexShrink: 1,
  },
});
