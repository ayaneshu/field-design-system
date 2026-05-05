import type { SidebarItem } from "../components/PageScaffold";

/**
 * Sidebar entries for any "Components" detail screen. The first row is a
 * back-link to the components index (matches the "Components" entry in the
 * Figma reference), followed by an M-Divider, then one row per component.
 * `active` flips based on the screen the sidebar is rendered on.
 */
export function componentsSidebar(activeKey: string): SidebarItem[] {
  // Header back-link first; component entries alphabetised by label.
  return [
    { key: "all", label: "Components", dividerAfter: true },
    { key: "Accordion", label: "Accordion", active: activeKey === "Accordion" },
    { key: "BottomNav", label: "BottomNav", active: activeKey === "BottomNav" },
    { key: "Checkbox", label: "Checkbox", active: activeKey === "Checkbox" },
  ];
}
