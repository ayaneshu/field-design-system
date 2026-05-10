import type { NavigationProp } from "@react-navigation/native";

import type { SidebarItem } from "../components/PageScaffold";

import type { RootStackParamList } from "./types";

// Reserved sidebar keys that don't map 1:1 to a stack route.
const ALL_KEY = "all";
const BUTTON_GROUP_KEY = "ButtonGroup";

// Children of the Button parent row. Used both for the sidebar list and to
// decide when the parent should highlight as active. Covers every Figma
// M-*Button family — rectangular variants, IconButton, RoundButton, and
// TextButton — so the whole button surface area lives under one parent row.
const BUTTON_CHILDREN = [
  "PrimaryButton",
  "SecondaryButton",
  "SecondaryNeutralButton",
  "NeutralButton",
  "IconButton",
  "RoundButton",
  "TextButton",
] as const;

type ButtonChildKey = (typeof BUTTON_CHILDREN)[number];

function isButtonChild(key: string): key is ButtonChildKey {
  return (BUTTON_CHILDREN as readonly string[]).includes(key);
}

/**
 * Sidebar entries for any "Components" detail screen. The first row is a
 * back-link to the components index, followed by an M-Divider, then one row
 * per component (alphabetised by display name).
 *
 * Every Button family — Primary / Secondary / Secondary-Neutral / Neutral /
 * Icon / Round / Text — sits indented under a single "Button" parent row, so
 * the sidebar stays tidy without flattening every variant into the top
 * level. The parent is itself clickable — selecting it routes to
 * PrimaryButton (the most-used default).
 */
export function componentsSidebar(activeKey: string): SidebarItem[] {
  const buttonGroupActive = isButtonChild(activeKey);
  return [
    { key: ALL_KEY, label: "Components", dividerAfter: true },
    { key: "Accordion", label: "Accordion", active: activeKey === "Accordion" },
    { key: "BottomNav", label: "BottomNav", active: activeKey === "BottomNav" },
    {
      key: BUTTON_GROUP_KEY,
      label: "Button",
      active: buttonGroupActive,
      collapsible: true,
    },
    {
      key: "PrimaryButton",
      label: "Primary",
      indent: true,
      active: activeKey === "PrimaryButton",
    },
    {
      key: "SecondaryButton",
      label: "Secondary",
      indent: true,
      active: activeKey === "SecondaryButton",
    },
    {
      key: "SecondaryNeutralButton",
      label: "Secondary Neutral",
      indent: true,
      active: activeKey === "SecondaryNeutralButton",
    },
    {
      key: "NeutralButton",
      label: "Neutral",
      indent: true,
      active: activeKey === "NeutralButton",
    },
    {
      key: "IconButton",
      label: "Icon",
      indent: true,
      active: activeKey === "IconButton",
    },
    {
      key: "RoundButton",
      label: "Round",
      indent: true,
      active: activeKey === "RoundButton",
    },
    {
      key: "TextButton",
      label: "Text",
      indent: true,
      active: activeKey === "TextButton",
    },
    { key: "Checkbox", label: "Checkbox", active: activeKey === "Checkbox" },
    { key: "Divider", label: "Divider", active: activeKey === "Divider" },
    {
      key: "FilterChip",
      label: "Filter Chip",
      active: activeKey === "FilterChip",
    },
    {
      key: "InfoBanner",
      label: "Info Banner",
      active: activeKey === "InfoBanner",
    },
    {
      key: "InputText",
      label: "Input Text",
      active: activeKey === "InputText",
    },
    {
      key: "InputTextarea",
      label: "Input Textarea",
      active: activeKey === "InputTextarea",
    },
    {
      key: "ListItem",
      label: "List Item",
      active: activeKey === "ListItem",
    },
    {
      key: "PageHeader",
      label: "Page Header",
      active: activeKey === "PageHeader",
    },
    { key: "Radio", label: "Radio", active: activeKey === "Radio" },
    {
      key: "RatingInput",
      label: "Rating Input",
      active: activeKey === "RatingInput",
    },
    {
      key: "SearchBar",
      label: "Search Bar",
      active: activeKey === "SearchBar",
    },
    { key: "Switch", label: "Switch", active: activeKey === "Switch" },
    { key: "Toggle", label: "Toggle", active: activeKey === "Toggle" },
  ];
}

/**
 * Resolve a sidebar item key to a navigation action. Centralised so every
 * detail screen handles the special keys the same way:
 *   - `all` → back to the Components index
 *   - `ButtonGroup` → PrimaryButton (the parent row defaults to its first
 *     child since we don't have a Button hub screen)
 *   - everything else → a 1:1 stack route
 */
export function navigateFromSidebar(
  navigation: NavigationProp<RootStackParamList>,
  key: string,
) {
  if (key === ALL_KEY) {
    navigation.navigate("Components");
    return;
  }
  if (key === BUTTON_GROUP_KEY) {
    navigation.navigate("PrimaryButton");
    return;
  }
  navigation.navigate(key as never);
}
