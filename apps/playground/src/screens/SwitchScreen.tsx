import { useCallback, useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Switch, Toggle as FieldToggle, type SwitchSize } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import {
  SWITCH_AXIS_MS,
  switchSlotMotionTimeline,
} from "./motionTimelines/switchSlotMotionTimeline";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Switch">;

const SIZES: SwitchSize[] = ["H40", "H48"];

const ON_OFF = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
];

const RANGE = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const TSHIRT = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
];

export function SwitchScreen({ navigation }: Props) {
  const [value, setValue] = useState("off");
  const [size, setSize] = useState<SwitchSize>("H40");
  const [slotCount, setSlotCount] = useState<2 | 3 | 4>(2);
  const [disabled, setDisabled] = useState(false);

  const playhead = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const triggerPlay = useCallback(() => {
    if (reducedMotion) {
      playhead.value = 1;
      return;
    }
    playhead.value = 0;
    playhead.value = withTiming(1, {
      duration: SWITCH_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

  const options =
    slotCount === 2 ? ON_OFF : slotCount === 3 ? RANGE : TSHIRT;

  const playgroundPreview = (
    <PreviewSurface tall>
      <View style={{ width: size === "H48" ? 320 : 240 }}>
        <Switch
          options={options}
          value={options.find((o) => o.value === value) ? value : options[0].value}
          onChange={setValue}
          size={size}
          disabled={disabled}
          accessibilityLabel="Playground switch"
        />
      </View>
    </PreviewSurface>
  );

  const sizesPreview = (
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
          <View style={{ gap: space["12"] }}>
            <View style={{ width: 240 }}>
              <Switch size={s} options={ON_OFF} defaultValue="off" />
            </View>
            <View style={{ width: 320 }}>
              <Switch size={s} options={RANGE} defaultValue="week" />
            </View>
            <View style={{ width: 360 }}>
              <Switch size={s} options={TSHIRT} defaultValue="m" />
            </View>
          </View>
        </PreviewSurface>
      ))}
    </View>
  );

  const statesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"] }}>
        <StateRow label="Default">
          <View style={{ width: 240 }}>
            <Switch options={ON_OFF} defaultValue="off" />
          </View>
        </StateRow>
        <StateRow label="On">
          <View style={{ width: 240 }}>
            <Switch options={ON_OFF} defaultValue="on" />
          </View>
        </StateRow>
        <StateRow label="Disabled">
          <View style={{ width: 240 }}>
            <Switch options={ON_OFF} defaultValue="off" disabled />
          </View>
        </StateRow>
        <StateRow label="Disabled · selected">
          <View style={{ width: 240 }}>
            <Switch options={ON_OFF} defaultValue="on" disabled />
          </View>
        </StateRow>
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="switch"
      subtitle="Pill-shaped segmented control with 2–4 mutually-exclusive slots. Two sizes — H40 (compact) and H48 (regular). The active slot is marked by a white thumb that slides on selection."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Switch/Switch.tsx"
      sidebar={componentsSidebar("Switch")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...switchSlotMotionTimeline,
        playhead,
        preview: <SwitchSlotPreview onPlay={triggerPlay} />,
      }}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl
              options={SIZES}
              value={size}
              onChange={setSize}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Slots</PropLabel>
            <SegmentedControl
              options={[2, 3, 4] as const}
              value={slotCount}
              onChange={(v) => {
                setSlotCount(v);
                setValue(v === 2 ? "off" : v === 3 ? "day" : "xs");
              }}
              renderLabel={(n) => String(n)}
            />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Sizes" preview={sizesPreview} />
      <DetailSection heading="States" preview={statesPreview} />
    </PageScaffold>
  );
}

/**
 * Live preview of the Switch slot transition. Tapping a slot fires both the
 * Switch's own `withSpring(motion.spring.springLight)` and the playhead sweep
 * across the timesheet so the cursor and the visible thumb position stay
 * in sync.
 */
function SwitchSlotPreview({ onPlay }: { onPlay: () => void }) {
  const shell = useShell();
  const [value, setValue] = useState<string>("off");

  const handleChange = (next: string) => {
    setValue(next);
    onPlay();
  };

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
      <View style={{ width: 240 }}>
        <Switch options={ON_OFF} value={value} onChange={handleChange} />
      </View>
      <Text
        style={[
          textStyles.Body_B11_Regular,
          { color: shell.textMuted, textAlign: "center" },
        ]}
      >
        tap a slot
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
        minHeight: tall ? 240 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function StateRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: space["8"] }}>
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: colour["text-n-icon"].tertiary,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          },
        ]}
      >
        {label}
      </Text>
      {children}
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

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  renderLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  renderLabel?: (v: T) => string;
}) {
  return (
    <View style={{ minWidth: 200 }}>
      <Switch<T>
        options={options.map((opt) => ({
          value: opt,
          label: renderLabel ? renderLabel(opt) : String(opt),
        }))}
        value={value}
        onChange={onChange}
      />
    </View>
  );
}
