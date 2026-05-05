import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  BottomNav,
  type BottomNavIconName,
  type BottomNavTab,
  bottomNavIconNames,
} from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar } from "../navigation/sidebars";
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

  const moveTab = (idx: number, direction: -1 | 1) =>
    setTabs((prev) => {
      const next = [...prev];
      const target = idx + direction;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[target];
      next[target] = tmp;
      return next;
    });

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

  return (
    <PageScaffold
      topNavActive="Components"
      title="bottom nav"
      subtitle="Primary bottom tab bar. Drives navigation in shopping flows; one tab is active at a time."
      sidebar={componentsSidebar("BottomNav")}
      onSidebarSelect={(key) => {
        if (key === "all") navigation.navigate("Components" as never);
        else navigation.navigate(key as never);
      }}
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
                        textStyles.Body_B12_SemiBold,
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
            textStyles.Body_B14_Medium,
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
              tab={tab}
              position={idx + 1}
              total={tabs.length}
              onChange={(patch) => updateTab(idx, patch)}
              onRemove={tabs.length > MIN_TABS ? () => removeTab(idx) : undefined}
              onMoveUp={idx > 0 ? () => moveTab(idx, -1) : undefined}
              onMoveDown={idx < tabs.length - 1 ? () => moveTab(idx, 1) : undefined}
            />
          ))}
        </View>

        <Pressable
          onPress={addTab}
          disabled={tabs.length >= MAX_TABS}
          style={({ pressed }) => ({
            marginTop: space["16"],
            alignSelf: "flex-start",
            paddingVertical: space["10"],
            paddingHorizontal: space["16"],
            borderRadius: radius["10"],
            backgroundColor: colour.surface["action-subtle"],
            opacity: pressed || tabs.length >= MAX_TABS ? 0.6 : 1,
          })}
        >
          <Text
            style={[
              textStyles.Body_B14_SemiBold,
              { color: colour["text-n-icon"].action },
            ]}
          >
            + Add tab
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
              textStyles.Body_B12_SemiBold,
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
  tab,
  position,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  tab: BottomNavTab;
  position: number;
  total: number;
  onChange: (patch: Partial<BottomNavTab>) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: colour.surface.secondary,
        borderRadius: radius["12"],
        padding: space["16"],
        gap: space["12"],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space["8"],
        }}
      >
        <Text
          style={[
            textStyles.Body_B11_SemiBold,
            {
              color: colour["text-n-icon"].tertiary,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              flex: 1,
            },
          ]}
        >
          {tab.key} · #{position} of {total}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space["4"] }}>
          <ReorderButton
            direction="up"
            onPress={onMoveUp}
            accessibilityLabel={`Move ${tab.label} up`}
          />
          <ReorderButton
            direction="down"
            onPress={onMoveDown}
            accessibilityLabel={`Move ${tab.label} down`}
          />
          {onRemove ? (
            <Pressable
              onPress={onRemove}
              style={({ pressed }) => ({
                paddingVertical: 4,
                paddingHorizontal: space["8"],
                borderRadius: radius["6"],
                marginLeft: space["4"],
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={[
                  textStyles.Body_B12_SemiBold,
                  { color: colour["text-n-icon"].error },
                ]}
              >
                Remove
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: space["12"] }}>
        <FieldLabel>Label</FieldLabel>
        <TextInput
          value={tab.label}
          onChangeText={(v) => onChange({ label: v })}
          placeholder="Tab label"
          placeholderTextColor={colour["text-n-icon"].muted}
          style={[
            textStyles.Body_B14_Regular,
            {
              flex: 1,
              color: colour["text-n-icon"].primary,
              backgroundColor: colour.surface.primary,
              borderRadius: radius["8"],
              borderWidth: 1,
              borderColor: colour.border.medium,
              paddingHorizontal: space["10"],
              paddingVertical: space["8"],
            },
          ]}
        />
      </View>

      <IconPicker
        label="Icon"
        value={tab.icon}
        onChange={(icon) => onChange({ icon })}
      />
      <Text
        style={[
          textStyles.Body_B11_Medium,
          {
            color: colour["text-n-icon"].tertiary,
            paddingTop: space["2"],
          },
        ]}
      >
        Active state uses{" "}
        <Text
          style={[
            textStyles.Body_B11_Bold,
            { color: colour["text-n-icon"].secondary },
          ]}
        >
          {tab.icon}-filled
        </Text>{" "}
        automatically.
      </Text>
    </View>
  );
}

function IconPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BottomNavIconName;
  onChange: (next: BottomNavIconName) => void;
}) {
  return (
    <View style={{ gap: space["6"] }}>
      <FieldLabel>{label}</FieldLabel>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: space["6"], paddingVertical: 2 }}
      >
        {ICON_OPTIONS.map((opt) => {
          const on = value === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={{
                paddingVertical: space["6"],
                paddingHorizontal: space["10"],
                borderRadius: radius.rounded,
                backgroundColor: on
                  ? colour.surface["action-extrabold"]
                  : colour.surface.muted,
              }}
            >
              <Text
                style={[
                  textStyles.Body_B11_SemiBold,
                  {
                    color: on
                      ? colour["text-n-icon"]["on-surface-bold"]
                      : colour["text-n-icon"].secondary,
                  },
                ]}
              >
                {opt.replace(/^bottomnav-/, "")}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ReorderButton({
  direction,
  onPress,
  accessibilityLabel,
}: {
  direction: "up" | "down";
  onPress?: () => void;
  accessibilityLabel: string;
}) {
  const enabled = !!onPress;
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius["6"],
        backgroundColor: pressed && enabled
          ? colour.surface.muted
          : "transparent",
        opacity: enabled ? 1 : 0.35,
      })}
    >
      <Icon
        name={direction === "up" ? "system-arrow-up" : "system-arrow-down"}
        size={18}
        color={colour["text-n-icon"].secondary}
      />
    </Pressable>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      style={[
        textStyles.Body_B12_SemiBold,
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
        textStyles.Body_B14_SemiBold,
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
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={{
        paddingVertical: space["6"],
        paddingHorizontal: space["12"],
        borderRadius: radius.rounded,
        backgroundColor: value
          ? colour.surface["action-extrabold"]
          : colour.surface.muted,
      }}
    >
      <Text
        style={[
          textStyles.Body_B12_SemiBold,
          {
            color: value
              ? colour["text-n-icon"]["on-surface-bold"]
              : colour["text-n-icon"].secondary,
          },
        ]}
      >
        {value ? "On" : "Off"}
      </Text>
    </Pressable>
  );
}
