import { useState, type ReactNode } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Checkbox,
  ListItem,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
} from "@field-ds/components";

const BOOL_OPTIONS = [
  { value: false, label: "Off" },
  { value: true, label: "On" },
] as const;
import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ListItem">;

const SAMPLE_TITLE = "Address";
const SAMPLE_SUBTITLE = "123 Sheikh Zayed Rd, Dubai";

type LeadingMode = "icon" | "checkbox" | "avatar" | "none";

export function ListItemScreen({ navigation }: Props) {
  // Playground state — drives the live demo on the right of the controls.
  const [title, setTitle] = useState(SAMPLE_TITLE);
  const [subtitle, setSubtitle] = useState(SAMPLE_SUBTITLE);
  const [size, setSize] = useState<"small" | "big">("small");
  const [leadingMode, setLeadingMode] = useState<LeadingMode>("icon");
  const [showChevron, setShowChevron] = useState(true);
  const [pressable, setPressable] = useState(true);
  const [checkboxOn, setCheckboxOn] = useState(true);

  const playgroundLeading: ReactNode = (() => {
    switch (leadingMode) {
      case "none":
        return undefined;
      case "checkbox":
        return (
          <Checkbox
            selected={checkboxOn}
            onChange={setCheckboxOn}
            size="H24"
          />
        );
      case "avatar":
        return (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 9999,
              backgroundColor: colour["text-n-icon"].action,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                textStyles.Body_B12_Bold,
                { color: colour.surface.primary },
              ]}
            >
              LA
            </Text>
          </View>
        );
      case "icon":
      default:
        return (
          <Icon
            name="system-location"
            size={24}
            color={colour["text-n-icon"].primary}
          />
        );
    }
  })();

  const trailing = showChevron ? (
    <Icon
      name="system-chevron-right"
      size={20}
      color={colour["text-n-icon"].secondary}
    />
  ) : undefined;

  const playgroundPreview = (
    <PreviewSurface tall>
      <View
        style={{
          backgroundColor: colour.surface.primary,
          borderRadius: radius["12"],
          overflow: "hidden",
        }}
      >
        <ListItem
          title={title || "Title"}
          subtitle={subtitle || undefined}
          size={size}
          leading={playgroundLeading}
          trailing={trailing}
          onPress={
            pressable
              ? () => Alert.alert("Pressed", "ListItem onPress fired")
              : undefined
          }
        />
      </View>
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["24"] }}>
      <PreviewSurface>
        <View
          style={{
            backgroundColor: colour.surface.primary,
            borderRadius: radius["12"],
            overflow: "hidden",
          }}
        >
          <ListItem
            title="Address"
            subtitle="123 Sheikh Zayed Rd, Dubai"
            leading={
              <Icon
                name="system-location"
                size={24}
                color={colour["text-n-icon"].primary}
              />
            }
            trailing={
              <Icon
                name="system-chevron-right"
                size={20}
                color={colour["text-n-icon"].secondary}
              />
            }
            onPress={() => {}}
          />
          <ListItem
            title="Order history"
            subtitle="12 orders"
            leading={
              <Icon
                name="system-bag"
                size={24}
                color={colour["text-n-icon"].primary}
              />
            }
            trailing={
              <Icon
                name="system-chevron-right"
                size={20}
                color={colour["text-n-icon"].secondary}
              />
            }
            onPress={() => {}}
          />
          <ListItem
            title="Notifications"
            subtitle="Daily digest"
            leading={
              <Icon
                name="system-notification"
                size={24}
                color={colour["text-n-icon"].primary}
              />
            }
            trailing={
              <View style={{ width: 120 }}>
                <FieldSwitch<boolean>
                  options={BOOL_OPTIONS}
                  defaultValue={true}
                />
              </View>
            }
          />
        </View>
      </PreviewSurface>

      <PreviewSurface>
        <View
          style={{
            backgroundColor: colour.surface.primary,
            borderRadius: radius["12"],
            overflow: "hidden",
          }}
        >
          <ListItem
            size="big"
            title="Big density title"
            subtitle="H16 Bold — used in denser hubs"
            leading={
              <Icon
                name="system-location"
                size={24}
                color={colour["text-n-icon"].primary}
              />
            }
          />
          <ListItem
            title="Title only"
            leading={
              <Icon
                name="system-call"
                size={24}
                color={colour["text-n-icon"].primary}
              />
            }
          />
          <ListItem
            title="With title slot"
            subtitle="Inline 16×16 status badge"
            leading={
              <Icon
                name="system-location"
                size={24}
                color={colour["text-n-icon"].primary}
              />
            }
            titleSlot={
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: colour["text-n-icon"].error,
                }}
              />
            }
          />
        </View>
      </PreviewSurface>
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="list item"
      subtitle="An atomic stackable row primitive. The leading slot is a 24×24 area where developers can drop any custom node — Icon, avatar, Checkbox, badge, or anything bespoke. Use inside a list; do not stack standalone."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/ListItem/ListItem.tsx"
      sidebar={componentsSidebar("ListItem")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow alignTop>
            <PropLabel>Title</PropLabel>
            <DSTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Subtitle</PropLabel>
            <DSTextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="Subtitle (leave blank to hide)"
            />
          </PropRow>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedToggle
              value={size}
              onChange={setSize}
              options={[
                { label: "Small", value: "small" },
                { label: "Big", value: "big" },
              ]}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Leading slot</PropLabel>
            <SegmentedToggle
              value={leadingMode}
              onChange={setLeadingMode}
              options={[
                { label: "Icon", value: "icon" },
                { label: "Checkbox", value: "checkbox" },
                { label: "Avatar", value: "avatar" },
                { label: "None", value: "none" },
              ]}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Show chevron</PropLabel>
            <DSSwitch value={showChevron} onValueChange={setShowChevron} />
          </PropRow>
          <PropRow last>
            <PropLabel>Pressable</PropLabel>
            <DSSwitch value={pressable} onValueChange={setPressable} />
          </PropRow>
        </PropList>

        <Pressable
          onPress={() => {
            setTitle(SAMPLE_TITLE);
            setSubtitle(SAMPLE_SUBTITLE);
            setSize("small");
            setLeadingMode("icon");
            setShowChevron(true);
            setPressable(true);
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
        minHeight: tall ? 240 : undefined,
      }}
    >
      {children}
    </View>
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
        {
          color: shell.textPrimary,
          minWidth: 96,
          paddingTop: 2,
        },
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
  placeholder,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View
      style={{
        width: 320,
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

function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  const shell = useShell();
  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: shell.border,
        borderRadius: radius["8"],
        overflow: "hidden",
      }}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => ({
              paddingHorizontal: space["12"],
              paddingVertical: space["8"],
              backgroundColor: active
                ? colour["text-n-icon"].action
                : colour.surface.primary,
              borderLeftWidth: i === 0 ? 0 : 1,
              borderLeftColor: shell.border,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={[
                textStyles.Body_B12_SemiBold,
                {
                  color: active
                    ? colour.surface.primary
                    : shell.textPrimary,
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
