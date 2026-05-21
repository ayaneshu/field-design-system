import { useCallback, useState, type ReactNode } from "react";
import { Image, Text, TextInput, View } from "react-native";
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  FilterChip,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type FilterChipContent,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { Dropdown, type DropdownOption } from "../components/Dropdown";
import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import {
  FILTER_CHIP_AXIS_MS,
  filterChipAddedMotionTimeline,
} from "./motionTimelines/filterChipAddedMotionTimeline";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "FilterChip">;

const CONTENTS: FilterChipContent[] = ["label", "slot"];

// Curated icon picker — the chips designers actually reach for. Surfaced
// via the generic <Dropdown> so the row stays compact and consistent with
// the rest of the playground.
const ICONS: IconName[] = [
  "system-preferences",
  "system-sort",
  "system-search",
  "system-heart",
  "system-bag",
];

const ICON_LABEL: Record<string, string> = {
  "system-preferences": "Preferences",
  "system-sort": "Sort",
  "system-search": "Search",
  "system-heart": "Heart",
  "system-bag": "Bag",
};

export function FilterChipScreen({ navigation }: Props) {
  const [content, setContent] = useState<FilterChipContent>("label");
  const [label, setLabel] = useState("Filter");
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [iconLeft, setIconLeft] = useState<IconName>("system-preferences");
  const [added, setAdded] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Interactive demo state.
  const [activeCount, setActiveCount] = useState(4);

  // Motion-spec preview state.
  const playhead = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const [previewAdded, setPreviewAdded] = useState(false);

  // Playhead sweeps linearly over the full axis (longest lane = spring settle)
  // so the cursor lines up with the slowest visible lane on the timesheet.
  const triggerPlay = useCallback(() => {
    if (reducedMotion) {
      playhead.value = 1;
      return;
    }
    playhead.value = 0;
    playhead.value = withTiming(1, {
      duration: FILTER_CHIP_AXIS_MS,
      easing: Easing.linear,
    });
  }, [playhead, reducedMotion]);

  const playgroundPreview = (
    <PreviewSurface tall>
      <FilterChip
        content={content}
        label={label}
        count={`(${activeCount || 1})`}
        showIconLeft={showLeft}
        showIconRight={showRight}
        iconLeft={iconLeft}
        added={added}
        disabled={disabled}
        onPress={() => {}}
        onClear={() => {}}
      >
        {content === "slot" ? <SlotDot /> : null}
      </FilterChip>
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["20"] }}>
      <PreviewSurface>
        <SectionLabel>Label</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <StateCell label="Default">
            <FilterChip label="Filter" />
          </StateCell>
          <StateCell label="Disabled">
            <FilterChip label="Filter" disabled />
          </StateCell>
          <StateCell label="Added">
            <FilterChip label="Filter" count="(4)" added />
          </StateCell>
          <StateCell label="No right icon">
            <FilterChip label="Filter" showIconRight={false} />
          </StateCell>
          <StateCell label="No left icon">
            <FilterChip label="Filter" showIconLeft={false} />
          </StateCell>
        </View>
      </PreviewSurface>

      <PreviewSurface>
        <SectionLabel>Slot</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <StateCell label="Default">
            <FilterChip content="slot">
              <SlotDot />
            </FilterChip>
          </StateCell>
          <StateCell label="Disabled">
            <FilterChip content="slot" disabled>
              <SlotDot />
            </FilterChip>
          </StateCell>
          <StateCell label="Added">
            <FilterChip content="slot" added>
              <SlotDot />
            </FilterChip>
          </StateCell>
        </View>
      </PreviewSurface>
    </View>
  );

  const slotContentPreview = (
    <PreviewSurface>
      <View
        style={{
          flexDirection: "row",
          gap: space["12"],
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <StateCell label="Image">
          <FilterChip content="slot">
            <Image
              source={{
                uri: "https://placehold.co/40x40/0f7eff/ffffff?text=N",
              }}
              style={{ width: 20, height: 20, borderRadius: 4 }}
            />
          </FilterChip>
        </StateCell>
        <StateCell label="SVG">
          <FilterChip content="slot">
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="9" fill={colour.surface["action-bold"]} />
              <Path
                d="M8 12.5l2.5 2.5L16 9.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </FilterChip>
        </StateCell>
        <StateCell label="Custom node">
          <FilterChip content="slot">
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: colour.surface["yellow-bold"],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  textStyles.Body_B11_SemiBold,
                  { color: colour["text-n-icon"].primary, fontSize: 10 },
                ]}
              >
                ★
              </Text>
            </View>
          </FilterChip>
        </StateCell>
      </View>
    </PreviewSurface>
  );

  const interactivePreview = (
    <PreviewSurface>
      <View style={{ gap: space["12"], alignItems: "flex-start" }}>
        <FilterChip
          label="Filter"
          count={`(${activeCount})`}
          added={activeCount > 0}
          onPress={() => setActiveCount((c) => c + 1)}
          onClear={() => setActiveCount(0)}
        />
        <Text
          style={[
            textStyles.Body_B12_Medium,
            { color: colour["text-n-icon"].tertiary },
          ]}
        >
          Tap the chip to add a filter, the cross to clear all.
        </Text>
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="filter chip"
      subtitle="Height-36 filter / sort chip. Two content modes — label and slot — with default, disabled, and added states. The slot accepts any node: image, SVG, brand mark, custom view."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/FilterChip/FilterChip.tsx"
      sidebar={componentsSidebar("FilterChip")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
      motionTimeline={{
        ...filterChipAddedMotionTimeline,
        playhead,
        preview: (
          <AddedPreview
            added={previewAdded}
            onAdd={() => {
              setPreviewAdded(true);
              triggerPlay();
            }}
            onClear={() => {
              setPreviewAdded(false);
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
            <PropLabel>Content</PropLabel>
            <View style={{ minWidth: 220 }}>
              <FieldSwitch<FilterChipContent>
                options={CONTENTS.map((c) => ({ value: c, label: c }))}
                value={content}
                onChange={setContent}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Label</PropLabel>
            <DSTextInput
              value={label}
              onChangeText={setLabel}
              placeholder="Filter"
            />
          </PropRow>
          <PropRow>
            <PropLabel>Left icon</PropLabel>
            <Toggle value={showLeft} onValueChange={setShowLeft} />
          </PropRow>
          <PropRow>
            <PropLabel>Right icon</PropLabel>
            <Toggle value={showRight} onValueChange={setShowRight} />
          </PropRow>
          <PropRow>
            <PropLabel>Glyph</PropLabel>
            <Dropdown<IconName>
              value={iconLeft}
              onChange={setIconLeft}
              menuWidth={240}
              options={ICONS.map<DropdownOption<IconName>>((g) => ({
                value: g,
                label: ICON_LABEL[g] ?? g,
                icon: g,
              }))}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Added</PropLabel>
            <Toggle value={added} onValueChange={setAdded} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="States" preview={statesPreview} />

      <DetailSection heading="Slot content" preview={slotContentPreview} />

      <DetailSection heading="Interactive" preview={interactivePreview} />
    </PageScaffold>
  );
}

/**
 * Live preview for the FilterChip default ↔ added timesheet. Tapping the
 * chip body flips into the added state and triggers the playhead sweep;
 * tapping the clear cross flips it back. Both transitions share the same
 * tokens with the timesheet so the cursor and the visible morph agree.
 */
function AddedPreview({
  added,
  onAdd,
  onClear,
}: {
  added: boolean;
  onAdd: () => void;
  onClear: () => void;
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
      <FilterChip
        label="Filter"
        count="(4)"
        added={added}
        onPress={onAdd}
        onClear={onClear}
      />
      <Text
        style={[
          textStyles.Body_B11_Regular,
          { color: shell.textMuted, textAlign: "center" },
        ]}
      >
        tap chip to add · cross to clear
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </Text>
  );
}

function StateCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ alignItems: "center", gap: space["8"] }}>
      {children}
      <Text
        style={[
          textStyles.Body_B11_Medium,
          { color: colour["text-n-icon"].tertiary, textAlign: "center" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function SlotDot() {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colour.surface["action-bold"],
      }}
    />
  );
}

function PropList({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

function PropRow({
  children,
  last,
}: {
  children: ReactNode;
  last?: boolean;
}) {
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

function DSTextInput({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View
      style={{
        width: 240,
        backgroundColor: colour.surface.primary,
        borderWidth: 1,
        borderColor: colour.border.primary,
        borderRadius: radius["10"],
        paddingHorizontal: space["12"],
        paddingVertical: space["8"],
        justifyContent: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colour["text-n-icon"].muted}
        // @ts-expect-error — outlineStyle is web-only and supported by RN-Web
        style={[
          textStyles.Body_B14_SemiBold,
          {
            color: colour["text-n-icon"].primary,
            paddingTop: 0,
            paddingBottom: 0,
            outlineStyle: "none",
          },
        ]}
      />
    </View>
  );
}
