import { useState, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { InputTextarea, Toggle as FieldToggle } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "InputTextarea">;

// When the user toggles "Error" on, the message stays visible until they
// type at least this many characters. Mirrors typical form-validation UX
// where "this field needs more detail" clears as soon as the user complies.
const MIN_REQUIRED_CHARS = 20;

export function InputTextareaScreen({ navigation }: Props) {
  const [label, setLabel] = useState("Label");
  const [placeholder, setPlaceholder] = useState("Placeholder");
  const [helper, setHelper] = useState(
    `Tell us about your experience (min ${MIN_REQUIRED_CHARS} characters).`,
  );
  const [required, setRequired] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [showCounter, setShowCounter] = useState(true);
  const [errorOn, setErrorOn] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("");

  // Auto-clear: error is active only while the value is below the minimum.
  // Once the user types past it, the validation message is satisfied.
  const effectiveError: boolean | string =
    errorOn && value.length < MIN_REQUIRED_CHARS
      ? `Please share at least ${MIN_REQUIRED_CHARS} characters.`
      : false;

  const playgroundPreview = (
    <PreviewSurface tall>
      <View style={{ width: 327 }}>
        <InputTextarea
          label={label || undefined}
          placeholder={placeholder}
          helperText={helper}
          showHelperText={showHelper}
          showCounter={showCounter}
          maxLength={200}
          required={required}
          error={effectiveError}
          disabled={disabled}
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
        <InputTextarea label="Label" placeholder="Placeholder" />
        <SectionLabel>Filled</SectionLabel>
        <InputTextarea
          label="Label"
          defaultValue="Loved the packaging — arrived in pristine condition. Charging speed feels noticeably faster than the previous model."
          showCounter
          maxLength={200}
        />
        <SectionLabel>Error</SectionLabel>
        <InputTextarea
          label="Review"
          defaultValue="Too short."
          error="Please share at least 20 characters."
          showHelperText
          showCounter
          maxLength={200}
        />
        <SectionLabel>Disabled</SectionLabel>
        <InputTextarea
          label="Label"
          defaultValue="Submitted on 02 May 2026."
          disabled
        />
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="input textarea"
      subtitle="Multi-line text input for long-form copy — reviews, notes, addresses, and messages. External label above a 180-tall field, with character counter and error helper."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/InputTextarea/InputTextarea.tsx"
      sidebar={componentsSidebar("InputTextarea")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
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
            <PropLabel>Error</PropLabel>
            <DSSwitch value={errorOn} onValueChange={setErrorOn} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <DSSwitch value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>

        <Pressable
          onPress={() => {
            setLabel("Label");
            setPlaceholder("Placeholder");
            setHelper("Helper text goes here");
            setRequired(false);
            setShowHelper(false);
            setShowCounter(true);
            setErrorOn(false);
            setDisabled(false);
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
        minHeight: tall ? 380 : undefined,
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
