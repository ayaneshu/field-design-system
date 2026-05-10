import { useState, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";
import {
  SearchBar,
  Toggle as FieldToggle,
  type SearchBarSize,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SearchBar">;

const SIZES: SearchBarSize[] = ["H48", "H44"];

export function SearchBarScreen({ navigation }: Props) {
  const [size, setSize] = useState<SearchBarSize>("H48");
  const [placeholder, setPlaceholder] = useState(
    "Search for your building, area...",
  );
  const [elevation, setElevation] = useState(false);
  const [editable, setEditable] = useState(true);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(false);
  const [showRightTwo, setShowRightTwo] = useState(false);
  const [value, setValue] = useState("");

  const trailingIconSize = size === "H48" ? 24 : 20;

  const playgroundPreview = (
    <PreviewSurface tall>
      <View style={{ width: 327 }}>
        <SearchBar
          size={size}
          elevation={elevation}
          editable={editable}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          iconLeft={showLeft ? undefined : null}
          iconRight={
            showRight ? (
              <Icon
                name="system-camera"
                size={trailingIconSize}
                color={colour["text-n-icon"].primary}
              />
            ) : undefined
          }
          iconRightTwo={
            showRightTwo ? (
              <Icon
                name="system-mic"
                size={trailingIconSize}
                color={colour["text-n-icon"].primary}
              />
            ) : undefined
          }
        />
      </View>
    </PreviewSurface>
  );

  const sizesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: 327 }}>
        <SectionLabel>H48 — home / category</SectionLabel>
        <SearchBar size="H48" />
        <SectionLabel>H44 — PDP back-header</SectionLabel>
        <SearchBar size="H44" />
      </View>
    </PreviewSurface>
  );

  const statesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: 327 }}>
        <SectionLabel>Placeholder</SectionLabel>
        <SearchBar />
        <SectionLabel>Typed (auto-clear)</SectionLabel>
        <SearchBar defaultValue="iPhone 17 pro max" />
        <SectionLabel>Elevated</SectionLabel>
        <SearchBar elevation />
        <SectionLabel>Disabled</SectionLabel>
        <SearchBar editable={false} defaultValue="iPhone 17 pro max" />
      </View>
    </PreviewSurface>
  );

  const patternsPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: 327 }}>
        <SectionLabel>PDP back-header</SectionLabel>
        <SearchBar
          size="H44"
          iconLeft={
            <Icon
              name="system-arrow-left"
              size={20}
              color={colour["text-n-icon"].primary}
            />
          }
          iconRight={
            <Icon
              name="system-camera"
              size={20}
              color={colour["text-n-icon"].primary}
            />
          }
          placeholder="iPhone 17 pro max"
        />
        <SectionLabel>Two trailing icons (auto-divider)</SectionLabel>
        <SearchBar
          elevation
          iconRight={
            <Icon
              name="system-camera"
              size={24}
              color={colour["text-n-icon"].primary}
            />
          }
          iconRightTwo={
            <Icon
              name="system-mic"
              size={24}
              color={colour["text-n-icon"].primary}
            />
          }
        />
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="search bar"
      subtitle="Single-line search input. H48 for home/category screens, H44 for PDP back-headers. Up to two trailing icon slots with an auto-divider. State derives from focus + value."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/SearchBar/SearchBar.tsx"
      sidebar={componentsSidebar("SearchBar")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl options={SIZES} value={size} onChange={setSize} />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Placeholder</PropLabel>
            <DSTextInput value={placeholder} onChangeText={setPlaceholder} />
          </PropRow>
          <PropRow>
            <PropLabel>Elevation</PropLabel>
            <DSSwitch value={elevation} onValueChange={setElevation} />
          </PropRow>
          <PropRow>
            <PropLabel>Editable</PropLabel>
            <DSSwitch value={editable} onValueChange={setEditable} />
          </PropRow>
          <PropRow>
            <PropLabel>Left icon</PropLabel>
            <DSSwitch value={showLeft} onValueChange={setShowLeft} />
          </PropRow>
          <PropRow>
            <PropLabel>Right icon</PropLabel>
            <DSSwitch value={showRight} onValueChange={setShowRight} />
          </PropRow>
          <PropRow last>
            <PropLabel>Right icon 2</PropLabel>
            <DSSwitch value={showRightTwo} onValueChange={setShowRightTwo} />
          </PropRow>
        </PropList>

        <Pressable
          onPress={() => {
            setSize("H48");
            setPlaceholder("Search for your building, area...");
            setElevation(false);
            setEditable(true);
            setShowLeft(true);
            setShowRight(false);
            setShowRightTwo(false);
            setValue("");
          }}
          style={({ pressed }) => ({
            marginTop: space["12"],
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
              { color: colour["text-n-icon"].action },
            ]}
          >
            Reset to defaults
          </Text>
        </Pressable>
      </DetailSection>

      <DetailSection heading="Sizes" preview={sizesPreview} />
      <DetailSection heading="States" preview={statesPreview} />
      <DetailSection heading="Patterns" preview={patternsPreview} />
    </PageScaffold>
  );
}

// ─────────── Local building blocks (mirror InputTextScreen) ───────────

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
        alignItems: "center",
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
        },
      ]}
    >
      {children}
    </Text>
  );
}

function PropList({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

function PropRow({
  children,
  last,
  alignTop,
}: {
  children: ReactNode;
  last?: boolean;
  alignTop?: boolean;
}) {
  const shell = useShell();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: alignTop ? "flex-start" : "center",
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
        { color: shell.textPrimary, minWidth: 96, paddingTop: 2 },
      ]}
    >
      {children}
    </Text>
  );
}

function DSSwitch({
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
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View
      style={{
        width: 240,
        backgroundColor: colour.surface.primary,
        borderWidth: 1,
        borderColor: colour.border.primary,
        borderRadius: radius["12"],
        paddingHorizontal: space["16"],
        paddingVertical: space["12"],
        minHeight: 48,
        justifyContent: "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colour["text-n-icon"].muted}
        style={[
          textStyles.Body_B14_SemiBold,
          {
            color: colour["text-n-icon"].primary,
            paddingTop: 0,
            paddingBottom: 0,
            // @ts-expect-error — outlineWidth is web-only; ignored on native
            outlineWidth: 0,
          },
        ]}
      />
    </View>
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
              backgroundColor: active ? colour.surface.primary : "transparent",
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
