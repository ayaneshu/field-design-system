import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Checkbox, type CheckboxSize } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Checkbox">;

const SIZES: CheckboxSize[] = ["H24", "H20", "H16"];

export function CheckboxScreen({ navigation }: Props) {
  const [selected, setSelected] = useState(true);
  const [size, setSize] = useState<CheckboxSize>("H24");
  const [disabled, setDisabled] = useState(false);

  // Multi-select list demo state.
  const [picks, setPicks] = useState<Record<string, boolean>>({
    fast: true,
    organic: false,
    veg: true,
  });
  const togglePick = (key: string) =>
    setPicks((prev) => ({ ...prev, [key]: !prev[key] }));

  const playgroundPreview = (
    <PreviewSurface tall>
      <Checkbox
        selected={selected}
        onChange={setSelected}
        size={size}
        disabled={disabled}
        accessibilityLabel="Playground checkbox"
      />
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <PreviewSurface key={s}>
          <Text
            style={[
              textStyles.Body_B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: space["12"],
              },
            ]}
          >
            {s}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: space["20"],
              alignItems: "center",
            }}
          >
            <StateCell label="Default">
              <Checkbox size={s} />
            </StateCell>
            <StateCell label="Selected">
              <Checkbox size={s} defaultSelected />
            </StateCell>
            <StateCell label="Disabled">
              <Checkbox size={s} disabled />
            </StateCell>
            <StateCell label="Disabled · selected">
              <Checkbox size={s} disabled defaultSelected />
            </StateCell>
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const multiSelectPreview = (
    <PreviewSurface>
      <View>
        {[
          { key: "fast", label: "Fast delivery" },
          { key: "organic", label: "Organic only" },
          { key: "veg", label: "Vegetarian" },
        ].map((opt, i, arr) => (
          <Pressable
            key={opt.key}
            onPress={() => togglePick(opt.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space["12"],
              paddingVertical: space["12"],
              borderBottomWidth: i === arr.length - 1 ? 0 : 1,
              borderBottomColor: colour.border.subtle,
            }}
          >
            <Checkbox
              size="H20"
              selected={!!picks[opt.key]}
              onChange={() => togglePick(opt.key)}
            />
            <Text
              style={[
                textStyles.Body_B14_Medium,
                { color: colour["text-n-icon"].primary },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="checkbox"
      subtitle="Selection control for multi-select lists, consent, and filter groups. Available in three sizes — H24, H20, and H16 — with selected, disabled, and disabled-selected states."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Checkbox.tsx"
      sidebar={componentsSidebar("Checkbox")}
      onSidebarSelect={(key) => {
        if (key === "all") navigation.navigate("Components" as never);
        else navigation.navigate(key as never);
      }}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Selected</PropLabel>
            <Toggle value={selected} onValueChange={setSelected} />
          </PropRow>
          <PropRow>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
          <PropRow last>
            <PropLabel>Size</PropLabel>
            <SegmentedControl options={SIZES} value={size} onChange={setSize} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="States" preview={statesPreview} />

      <DetailSection
        heading="Multi-select list"
        preview={multiSelectPreview}
      />
    </PageScaffold>
  );
}

// ─────────── Local building blocks ───────────

function PreviewSurface({
  children,
  tall,
}: {
  children: ReactNode;
  tall?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: colour.surface.tertiary,
        borderRadius: radius["12"],
        padding: space["20"],
        justifyContent: "center",
        alignItems: tall ? "center" : undefined,
        minHeight: tall ? 320 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function StateCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ alignItems: "center", gap: space["8"], flex: 1 }}>
      {children}
      <Text
        style={[
          textStyles.Body_B11_Medium,
          {
            color: colour["text-n-icon"].tertiary,
            textAlign: "center",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function PropList({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
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
        paddingVertical: space["16"],
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
        textStyles.Body_B16_Medium,
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

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colour.surface.muted,
        borderRadius: radius.rounded,
        padding: 2,
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingVertical: space["6"],
              paddingHorizontal: space["12"],
              borderRadius: radius.rounded,
              backgroundColor: active
                ? colour.surface.primary
                : "transparent",
            }}
          >
            <Text
              style={[
                textStyles.Body_B12_SemiBold,
                {
                  color: active
                    ? colour["text-n-icon"].primary
                    : colour["text-n-icon"].tertiary,
                },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
