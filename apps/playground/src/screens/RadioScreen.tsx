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
  Radio,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type RadioSize,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import {
  RADIO_AXIS_MS,
  radioSelectMotionTimeline,
} from "./motionTimelines/radioSelectMotionTimeline";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Radio">;

const SIZES: RadioSize[] = ["H24", "H20", "H16"];

type Speed = "fast" | "standard" | "economy";

export function RadioScreen({ navigation }: Props) {
  const [selected, setSelected] = useState(true);
  const [size, setSize] = useState<RadioSize>("H24");
  const [disabled, setDisabled] = useState(false);

  const [pick, setPick] = useState<Speed>("standard");

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
      duration: RADIO_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

  const playgroundPreview = (
    <PreviewSurface tall>
      <Radio
        selected={selected}
        onChange={() => setSelected(true)}
        size={size}
        disabled={disabled}
        accessibilityLabel="Playground radio"
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
              <Radio size={s} />
            </StateCell>
            <StateCell label="Selected">
              <Radio size={s} defaultSelected />
            </StateCell>
            <StateCell label="Disabled">
              <Radio size={s} disabled />
            </StateCell>
            <StateCell label="Disabled · selected">
              <Radio size={s} disabled defaultSelected />
            </StateCell>
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const groupPreview = (
    <PreviewSurface>
      <View>
        {(
          [
            { key: "fast", label: "Fast — 2 hours" },
            { key: "standard", label: "Standard — same day" },
            { key: "economy", label: "Economy — 2 days" },
          ] as const
        ).map((opt, i, arr) => (
          <Pressable
            key={opt.key}
            onPress={() => setPick(opt.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space["12"],
              paddingVertical: space["12"],
              borderBottomWidth: i === arr.length - 1 ? 0 : 1,
              borderBottomColor: colour.border.subtle,
            }}
          >
            <Radio
              size="H20"
              selected={pick === opt.key}
              onChange={() => setPick(opt.key)}
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
      title="radio"
      subtitle="Single-select control for mutually exclusive choices — shipping speed, payment method, plan tier. Available in three sizes — H24, H20, and H16 — with selected, disabled, and disabled-selected states."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Radio.tsx"
      sidebar={componentsSidebar("Radio")}
      motionTimeline={{
        ...radioSelectMotionTimeline,
        playhead,
        preview: (
          <SelectPreview
            selected={previewSelected}
            onToggle={() => {
              setPreviewSelected((prev) => !prev);
              triggerPlay();
            }}
          />
        ),
      }}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
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
              <FieldSwitch<RadioSize>
                options={SIZES.map((s) => ({ value: s, label: s }))}
                value={size}
                onChange={setSize}
              />
            </View>
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="States" preview={statesPreview} />

      <DetailSection heading="Single-select group" preview={groupPreview} />
    </PageScaffold>
  );
}

/**
 * Live preview for the Radio select-transition timesheet. Tapping the radio
 * toggles it + triggers the playhead so the cursor sweeps in sync with the
 * visible morph.
 */
function SelectPreview({
  selected,
  onToggle,
}: {
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
        accessibilityLabel="Play radio select transition"
      >
        <View pointerEvents="none">
          <Radio selected={selected} size="H24" />
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
