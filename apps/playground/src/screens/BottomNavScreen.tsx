import { useMemo, useRef, useState, type ReactNode } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  BottomNav,
  Toggle as FieldToggle,
  type BottomNavIconName,
  type BottomNavTab,
  bottomNavIconNames,
} from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { Dropdown, type DropdownOption } from "../components/Dropdown";
import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "BottomNav">;

const MIN_TABS = 3;
const MAX_TABS = 5;

// Default Noon-shaped tab set, using the bottomnav icon family that ships
// with paired default + filled variants. The component auto-swaps to the
// `-filled` icon when a tab becomes active.
const DEFAULT_TABS: BottomNavTab[] = [
  { key: "home", label: "Home", icon: "bottomnav-home" },
  { key: "categories", label: "Categories", icon: "bottomnav-categories" },
  { key: "deals", label: "Deals", icon: "bottomnav-deals" },
  { key: "profile", label: "Profile", icon: "bottomnav-profile" },
  { key: "cart", label: "Cart", icon: "bottomnav-cart" },
];

// Picker is restricted to the bottomnav family (anything with both a default
// and a `-filled` sibling). Sourced from the runtime registry so adding new
// icons in @field-ds/icons surfaces them here automatically.
const ICON_OPTIONS: BottomNavIconName[] = bottomNavIconNames;

export function BottomNavScreen({ navigation }: Props) {
  const [tabs, setTabs] = useState<BottomNavTab[]>(DEFAULT_TABS);
  const [activeKey, setActiveKey] = useState("home");
  const [showHomeBar, setShowHomeBar] = useState(true);

  const updateTab = (idx: number, patch: Partial<BottomNavTab>) =>
    setTabs((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)),
    );

  const removeTab = (idx: number) =>
    setTabs((prev) => {
      if (prev.length <= MIN_TABS) return prev;
      const next = prev.filter((_, i) => i !== idx);
      // Keep activeKey valid after removal.
      if (!next.some((t) => t.key === activeKey) && next[0]) {
        setActiveKey(next[0].key);
      }
      return next;
    });

  // Pick an icon for a new tab that isn't already used, falling back to the
  // first option if everything's taken (rare — picker has 11+ options).
  const addTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const used = new Set(tabs.map((t) => t.icon));
    const fresh = ICON_OPTIONS.find((opt) => !used.has(opt)) ?? ICON_OPTIONS[0];
    const id = `tab${tabs.length + 1}`;
    setTabs((prev) => [...prev, { key: id, label: "New", icon: fresh }]);
  };

  // Drag-and-drop reorder. The drag handle on each row starts a pointer drag;
  // we track which row the cursor is over by comparing its Y to each row's
  // bounding rect midpoint, and commit on mouseup. The currently dragged row
  // and live drop target are kept in state so the UI can show a "lifted" look
  // and a drop indicator.
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const setRowRef = (idx: number) => (el: View | null) => {
    rowRefs.current[idx] = el as unknown as HTMLDivElement | null;
  };
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  const reorderTab = (from: number, to: number) =>
    setTabs((prev) => {
      if (from === to || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const startDrag = (idx: number, e: React.MouseEvent) => {
    if (Platform.OS !== "web") return;
    e.preventDefault();
    e.stopPropagation();
    const rects = rowRefs.current.map((el) =>
      el && typeof el.getBoundingClientRect === "function"
        ? el.getBoundingClientRect()
        : null,
    );
    setDragIdx(idx);
    setDropIdx(idx);

    let currentTarget = idx;

    const findTarget = (clientY: number): number => {
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        if (!r) continue;
        const mid = r.top + r.height / 2;
        if (clientY < mid) return i;
      }
      return rects.length - 1;
    };

    const onMove = (ev: MouseEvent) => {
      const target = findTarget(ev.clientY);
      currentTarget = target;
      setDropIdx(target);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setDragIdx(null);
      setDropIdx(null);
      if (currentTarget !== idx) reorderTab(idx, currentTarget);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const livePreview = (
    <DeviceFrame>
      <BottomNav
        tabs={tabs}
        activeKey={activeKey}
        onTabPress={setActiveKey}
        showHomeBar={showHomeBar}
      />
    </DeviceFrame>
  );

  // Build the icon-dropdown options once. Each entry pairs the bottomnav icon
  // with a humanised label ("home", "categories", etc.) so the dropdown reads
  // naturally even though the underlying value is the full slug.
  const iconOptions: DropdownOption<BottomNavIconName>[] = useMemo(
    () =>
      ICON_OPTIONS.map((opt) => {
        const stripped = opt.replace(/^bottomnav-/, "").replace(/-/g, " ");
        const label = stripped.charAt(0).toUpperCase() + stripped.slice(1);
        return {
          value: opt,
          label: `${label} icon`,
          icon: opt,
        };
      }),
    [],
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="bottom nav"
      subtitle="Primary bottom tab bar that drives navigation across noon's shopping flows. Supports 3 to 5 tabs, with one active at a time and an auto-swapping filled icon for the active state."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/BottomNav.tsx"
      sidebar={componentsSidebar("BottomNav")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={livePreview}
        spacingTop={0}
      >
        <View>
          <PropRow>
            <PropLabel>Active tab</PropLabel>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: space["6"],
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              {tabs.map((t) => {
                const on = t.key === activeKey;
                return (
                  <Pressable
                    key={t.key}
                    onPress={() => setActiveKey(t.key)}
                    style={{
                      paddingVertical: space["6"],
                      paddingHorizontal: space["12"],
                      borderRadius: radius.rounded,
                      backgroundColor: on
                        ? colour.surface["action-extrabold"]
                        : colour.surface.muted,
                    }}
                  >
                    <Text
                      style={[
                        textStyles.B12_SemiBold,
                        {
                          color: on
                            ? colour["text-n-icon"]["on-surface-bold"]
                            : colour["text-n-icon"].secondary,
                        },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </PropRow>
          <PropRow last>
            <PropLabel>Show home bar</PropLabel>
            <Toggle value={showHomeBar} onValueChange={setShowHomeBar} />
          </PropRow>
        </View>
      </DetailSection>

      <DetailSection
        heading={`Tabs (${tabs.length}/${MAX_TABS})`}
        preview={livePreview}
      >
        <Text
          style={[
            textStyles.B14_Medium,
            {
              color: colour["text-n-icon"].secondary,
              marginBottom: space["16"],
            },
          ]}
        >
          Edit a label, swap an icon, or remove a tab. The active icon is
          auto-derived from the same icon's `-filled` variant — pick once,
          both states stay in sync. Tabs must be between {MIN_TABS} and {MAX_TABS}.
        </Text>

        <View style={{ gap: space["12"] }}>
          {tabs.map((tab, idx) => (
            <TabEditor
              key={tab.key}
              rowRef={setRowRef(idx)}
              tab={tab}
              iconOptions={iconOptions}
              isDragging={dragIdx === idx}
              isDropTarget={dragIdx !== null && dropIdx === idx && dragIdx !== idx}
              dropDirection={
                dragIdx !== null && dropIdx === idx && dragIdx !== idx
                  ? dragIdx < idx
                    ? "below"
                    : "above"
                  : null
              }
              onDragStart={(e) => startDrag(idx, e)}
              onChange={(patch) => updateTab(idx, patch)}
              onRemove={tabs.length > MIN_TABS ? () => removeTab(idx) : undefined}
            />
          ))}
        </View>

        <Pressable
          onPress={addTab}
          disabled={tabs.length >= MAX_TABS}
          accessibilityRole="button"
          accessibilityLabel="Add tab"
          // @ts-expect-error hover is web-only
          style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
            marginTop: space["12"],
            paddingVertical: space["14"],
            paddingHorizontal: space["16"],
            borderRadius: radius["12"],
            backgroundColor:
              hovered && tabs.length < MAX_TABS
                ? colour.surface.secondary
                : colour.surface.primary,
            borderWidth: 1,
            borderColor: colour.border.subtle,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: space["8"],
            opacity: pressed || tabs.length >= MAX_TABS ? 0.6 : 1,
          })}
        >
          <Icon
            name="system-plus"
            size={16}
            color={colour["text-n-icon"].primary}
          />
          <Text
            style={[
              textStyles.B14_SemiBold,
              { color: colour["text-n-icon"].primary },
            ]}
          >
            Add tab
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setTabs(DEFAULT_TABS);
            setActiveKey("home");
            setShowHomeBar(true);
          }}
          style={({ pressed }) => ({
            marginTop: space["8"],
            alignSelf: "flex-start",
            paddingVertical: space["8"],
            paddingHorizontal: space["12"],
            borderRadius: radius["8"],
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={[
              textStyles.B12_SemiBold,
              { color: colour["text-n-icon"].secondary },
            ]}
          >
            Reset to defaults
          </Text>
        </Pressable>
      </DetailSection>
    </PageScaffold>
  );
}

// ─────────── Local building blocks ───────────

function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        marginTop: space["16"],
        padding: space["16"],
        backgroundColor: colour.surface.tertiary,
        borderRadius: radius["20"],
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 375,
          maxWidth: "100%",
          backgroundColor: colour.surface.primary,
          borderRadius: radius["16"],
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colour.border.subtle,
        }}
      >
        {/* Spacer to mimic the screen above the nav. */}
        <View style={{ height: 120, backgroundColor: colour.surface.secondary }} />
        {children}
      </View>
    </View>
  );
}

function TabEditor({
  rowRef,
  tab,
  iconOptions,
  onChange,
  onRemove,
  onDragStart,
  isDragging,
  isDropTarget,
  dropDirection,
}: {
  rowRef: (el: View | null) => void;
  tab: BottomNavTab;
  iconOptions: DropdownOption<BottomNavIconName>[];
  onChange: (patch: Partial<BottomNavTab>) => void;
  onRemove?: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  isDragging: boolean;
  isDropTarget: boolean;
  /** Where the dragged tab will land relative to this row. */
  dropDirection: "above" | "below" | null;
}) {
  const shell = useShell();
  return (
    <View
      ref={rowRef as never}
      style={{
        backgroundColor: colour.surface.secondary,
        borderRadius: radius["12"],
        padding: space["16"],
        flexDirection: "row",
        alignItems: "center",
        gap: space["16"],
        opacity: isDragging ? 0.45 : 1,
        // The drop indicator: a 3px coloured edge on the side of the row
        // where the dragged tab will land. Painting via borderTop/Bottom
        // keeps the row height stable (replaces a transparent edge instead
        // of growing the row).
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderTopColor:
          isDropTarget && dropDirection === "above"
            ? colour["text-n-icon"].action
            : "transparent",
        borderBottomColor:
          isDropTarget && dropDirection === "below"
            ? colour["text-n-icon"].action
            : "transparent",
      }}
    >
      <DragHandle onMouseDown={onDragStart} label={tab.label} />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: space["12"],
        }}
      >
        <View style={{ flex: 1, gap: space["6"], minWidth: 120 }}>
          <FieldLabel>Tab Name</FieldLabel>
          <TextInput
            value={tab.label}
            onChangeText={(v) => onChange({ label: v })}
            placeholder="Home"
            placeholderTextColor={colour["text-n-icon"].muted}
            // @ts-expect-error — outlineStyle is web-only and supported by RN-Web
            style={[
              textStyles.B14_Regular,
              {
                color: colour["text-n-icon"].primary,
                backgroundColor: colour.surface.primary,
                borderRadius: radius["8"],
                borderWidth: 1,
                borderColor: shell.border,
                paddingHorizontal: space["12"],
                paddingVertical: space["10"],
                outlineStyle: "none",
              },
            ]}
          />
        </View>

        <View style={{ flex: 1, gap: space["6"], minWidth: 160 }}>
          <FieldLabel>Icon</FieldLabel>
          <Dropdown<BottomNavIconName>
            value={tab.icon}
            options={iconOptions}
            onChange={(icon) => onChange({ icon })}
            menuWidth={260}
            minWidth={0}
            ariaLabel={`Pick icon for ${tab.label}`}
          />
        </View>
      </View>

      <Pressable
        onPress={onRemove}
        disabled={!onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${tab.label}`}
        // @ts-expect-error hover is web-only
        style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius["6"],
          backgroundColor: hovered && onRemove ? colour.surface.muted : "transparent",
          opacity: !onRemove ? 0.35 : pressed ? 0.7 : 1,
        })}
      >
        <Icon
          name="system-cross"
          size={18}
          color={colour["text-n-icon"].secondary}
        />
      </Pressable>
    </View>
  );
}

function DragHandle({
  onMouseDown,
  label,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  label: string;
}) {
  // The "≡" drag-handle glyph from the Figma. On web, mousedown starts a
  // drag-and-drop reorder owned by the parent screen; the parent listens to
  // mousemove/mouseup against the document so the drag continues even after
  // the cursor leaves the handle hitbox.
  // @ts-expect-error onMouseDown is web-only and supported by RN-Web Pressable
  const handleProps = Platform.OS === "web" ? { onMouseDown } : {};
  return (
    <Pressable
      {...handleProps}
      accessibilityRole="button"
      accessibilityLabel={`Drag to reorder ${label}`}
      // @ts-expect-error hover is web-only
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: 28,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        borderRadius: radius["6"],
        backgroundColor: hovered ? colour.surface.muted : "transparent",
        opacity: pressed ? 0.6 : 1,
        // @ts-expect-error cursor is web-only
        cursor: pressed ? "grabbing" : "grab",
      })}
    >
      <View
        style={{
          width: 14,
          height: 1.5,
          backgroundColor: colour["text-n-icon"].secondary,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          width: 14,
          height: 1.5,
          backgroundColor: colour["text-n-icon"].secondary,
          borderRadius: 1,
        }}
      />
    </Pressable>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        textStyles.B12_SemiBold,
        { color: colour["text-n-icon"].secondary, minWidth: 72 },
      ]}
    >
      {children}
    </Text>
  );
}

function PropRow({ children, last }: { children: ReactNode; last?: boolean }) {
  const shell = useShell();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: space["12"],
        paddingVertical: space["14"],
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: shell.border,
      }}
    >
      {children}
    </View>
  );
}

function PropLabel({ children }: { children: ReactNode }) {
  const shell = useShell();
  return (
    <Text
      style={[
        textStyles.B14_SemiBold,
        { color: shell.textPrimary, minWidth: 96 },
      ]}
    >
      {children}
    </Text>
  );
}

function Toggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return <FieldToggle on={value} onChange={onValueChange} size="H20" />;
}
