import { useState, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";
import {
  InputText,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type InputTextLabelMode,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "InputText">;

const LABEL_MODES: InputTextLabelMode[] = ["external", "inline", "none"];

export function InputTextScreen({ navigation }: Props) {
  const [labelMode, setLabelMode] = useState<InputTextLabelMode>("external");
  const [label, setLabel] = useState("Label");
  const [placeholder, setPlaceholder] = useState("Placeholder");
  const [helper, setHelper] = useState("Helper text goes here");
  const [required, setRequired] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showLeftSlot, setShowLeftSlot] = useState(false);
  const [showRightSlot, setShowRightSlot] = useState(false);
  const [value, setValue] = useState("");

  const slotIcon = (name: "system-search" | "system-info-circle") => (
    <Icon name={name} size={20} color={colour["text-n-icon"].tertiary} />
  );

  const playgroundPreview = (
    <PreviewSurface tall>
      <View style={{ width: 327 }}>
        <InputText
          label={label || undefined}
          labelMode={labelMode}
          placeholder={placeholder}
          helperText={helper}
          showHelperText={showHelper}
          showCounter={showCounter}
          maxLength={20}
          required={required}
          error={error}
          disabled={disabled}
          leftSlot={showLeftSlot ? slotIcon("system-search") : undefined}
          rightSlot={showRightSlot ? slotIcon("system-info-circle") : undefined}
          value={value}
          onChangeText={setValue}
        />
      </View>
    </PreviewSurface>
  );

  const statesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: 327 }}>
        <SectionLabel>Resting</SectionLabel>
        <InputText label="Label" placeholder="Placeholder" />
        <SectionLabel>Filled</SectionLabel>
        <InputText label="Label" defaultValue="iPhone 17 pro max" />
        <SectionLabel>Error</SectionLabel>
        <InputText
          label="Label"
          defaultValue="iPhone 17 pro max"
          error
          showHelperText
          helperText="That model isn't available."
        />
        <SectionLabel>Disabled</SectionLabel>
        <InputText
          label="Label"
          defaultValue="iPhone 17 pro max"
          disabled
        />
      </View>
    </PreviewSurface>
  );

  const labelModesPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: 327 }}>
        <SectionLabel>External</SectionLabel>
        <InputText
          label="Email"
          labelMode="external"
          placeholder="you@noon.com"
        />
        <SectionLabel>Inline</SectionLabel>
        <InputText label="Phone" labelMode="inline" />
        <SectionLabel>None</SectionLabel>
        <InputText labelMode="none" placeholder="Search products" />
      </View>
    </PreviewSurface>
  );

  const slotsPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: 327 }}>
        <InputText
          label="Search"
          labelMode="none"
          placeholder="Search products"
          leftSlot={
            <Icon
              name="system-search"
              size={20}
              color={colour["text-n-icon"].tertiary}
            />
          }
        />
        <InputText
          label="Promo code"
          rightSlot={
            <Icon
              name="system-info-circle"
              size={20}
              color={colour["text-n-icon"].tertiary}
            />
          }
        />
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="input text"
      subtitle="Single-line text input. Three label modes — external, inline, and none — with derived Resting / Active / Typing / Filled / Error / Disabled states. Optional left and right slots for icons or affordances."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/InputText/InputText.tsx"
      sidebar={componentsSidebar("InputText")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Label mode</PropLabel>
            <View style={{ minWidth: 280 }}>
              <FieldSwitch<InputTextLabelMode>
                options={LABEL_MODES.map((m) => ({ value: m, label: m }))}
                value={labelMode}
                onChange={setLabelMode}
              />
            </View>
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Label</PropLabel>
            <DSTextInput value={label} onChangeText={setLabel} />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Placeholder</PropLabel>
            <DSTextInput value={placeholder} onChangeText={setPlaceholder} />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Helper text</PropLabel>
            <DSTextInput value={helper} onChangeText={setHelper} />
          </PropRow>
          <PropRow>
            <PropLabel>Required</PropLabel>
            <DSSwitch value={required} onValueChange={setRequired} />
          </PropRow>
          <PropRow>
            <PropLabel>Show helper</PropLabel>
            <DSSwitch value={showHelper} onValueChange={setShowHelper} />
          </PropRow>
          <PropRow>
            <PropLabel>Show counter</PropLabel>
            <DSSwitch value={showCounter} onValueChange={setShowCounter} />
          </PropRow>
          <PropRow>
            <PropLabel>Left slot</PropLabel>
            <DSSwitch value={showLeftSlot} onValueChange={setShowLeftSlot} />
          </PropRow>
          <PropRow>
            <PropLabel>Right slot</PropLabel>
            <DSSwitch value={showRightSlot} onValueChange={setShowRightSlot} />
          </PropRow>
          <PropRow>
            <PropLabel>Error</PropLabel>
            <DSSwitch value={error} onValueChange={setError} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <DSSwitch value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>

        <Pressable
          onPress={() => {
            setLabelMode("external");
            setLabel("Label");
            setPlaceholder("Placeholder");
            setHelper("Helper text goes here");
            setRequired(false);
            setShowHelper(false);
            setShowCounter(false);
            setError(false);
            setDisabled(false);
            setShowLeftSlot(false);
            setShowRightSlot(false);
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
              textStyles.B12_SemiBold,
              { color: colour["text-n-icon"].action },
            ]}
          >
            Reset to defaults
          </Text>
        </Pressable>
      </DetailSection>

      <DetailSection heading="States" preview={statesPreview} />
      <DetailSection heading="Label modes" preview={labelModesPreview} />
      <DetailSection heading="Slots" preview={slotsPreview} />
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
        textStyles.B11_SemiBold,
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
        textStyles.B16_Medium,
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
          textStyles.B14_SemiBold,
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

