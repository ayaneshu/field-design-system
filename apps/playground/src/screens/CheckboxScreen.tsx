import { useCallback, useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Checkbox,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type CheckboxSize,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import {
  CHECKBOX_AXIS_MS,
  checkboxSelectMotionTimeline,
} from "./motionTimelines/checkboxSelectMotionTimeline";
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

  // Motion-spec preview state.
  const [previewSelected, setPreviewSelected] = useState(false);
  const playhead = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const triggerPlay = useCallback(() => {
    if (reducedMotion) {
      playhead.value = 1;
      return;
    }
    playhead.value = 0;
    playhead.value = withTiming(1, {
      duration: CHECKBOX_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

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
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...checkboxSelectMotionTimeline,
        playhead,
        preview: (
          <SelectPreview
            kind="checkbox"
            selected={previewSelected}
            onToggle={() => {
              setPreviewSelected((prev) => !prev);
              triggerPlay();
            }}
          />
        ),
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
            <View style={{ minWidth: 240 }}>
              <FieldSwitch<CheckboxSize>
                options={SIZES.map((s) => ({ value: s, label: s }))}
                value={size}
                onChange={setSize}
              />
            </View>
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

/**
 * Live preview for the Checkbox / Radio select-transition timesheet. Tapping
 * the control toggles its state + triggers the playhead so the cursor
 * sweeps in sync with the visible morph.
 */
function SelectPreview({
  kind,
  selected,
  onToggle,
}: {
  kind: "checkbox" | "radio";
  selected: boolean;
  onToggle: () => void;
}) {
  const shell = useShell();
  return (
    <View style={{ alignItems: "center", gap: space["12"] }}>
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          },
        ]}
      >
        Live preview
      </Text>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`Play ${kind} select transition`}
      >
        <View pointerEvents="none">
          <Checkbox selected={selected} size="H24" />
        </View>
      </Pressable>
      <Text
        style={[
          textStyles.Body_B11_Regular,
          { color: shell.textMuted, textAlign: "center" },
        ]}
      >
        tap to play
      </Text>
    </View>
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
  return <FieldToggle on={value} onChange={onValueChange} size="H20" />;
}

