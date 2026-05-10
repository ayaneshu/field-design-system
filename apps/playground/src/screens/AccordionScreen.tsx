import { useState, type ReactNode } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { Accordion, Toggle as FieldToggle } from "@field-ds/components";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Accordion">;

const SAMPLE_TITLE = "Shipping & returns";
const SAMPLE_BODY =
  "Free standard shipping on orders over AED 100. Returns accepted within 14 days of delivery. Items must be unused and in original packaging.";

export function AccordionScreen({ navigation }: Props) {
  // Playground state — drives the live demo on the right of the controls.
  const [expanded, setExpanded] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [title, setTitle] = useState(SAMPLE_TITLE);
  const [body, setBody] = useState(SAMPLE_BODY);

  // Controlled-group state for the States section — one open at a time.
  const [openItem, setOpenItem] = useState<string | null>("specs");

  const playgroundPreview = (
    <PreviewSurface tall>
      <Accordion
        title={title || "Title"}
        expanded={expanded}
        onExpandedChange={setExpanded}
        iconLeft={
          showIcon ? (
            <Icon
              name="system-info-circle"
              size={20}
              color={colour["text-n-icon"].primary}
            />
          ) : undefined
        }
      >
        {body || "Body text…"}
      </Accordion>
    </PreviewSurface>
  );

  const statesPreview = (
    <View style={{ gap: space["24"] }}>
      <PreviewSurface>
        <Accordion title="Title">
          A compact, high-performance wall charger built with GaN technology for
          faster, cooler, more efficient charging. 65W output handles laptops,
          tablets and phones at top speed.
        </Accordion>
      </PreviewSurface>

      <PreviewSurface>
        <Accordion
          title="Shipping & returns"
          defaultExpanded
          iconLeft={
            <Icon
              name="system-info-circle"
              size={20}
              color={colour["text-n-icon"].primary}
            />
          }
        >
          Free standard shipping on orders over AED 100. Returns accepted within
          14 days of delivery. Items must be unused and in original packaging.
        </Accordion>
      </PreviewSurface>

      <PreviewSurface>
        <View style={{ gap: space["8"] }}>
          <Accordion
            title="Specifications"
            expanded={openItem === "specs"}
            onExpandedChange={(next) => setOpenItem(next ? "specs" : null)}
          >
            65W GaN output · 1× USB-C PD · 1× USB-A QC 3.0 · folding pins · MFi
            certified.
          </Accordion>
          <Accordion
            title="What's in the box"
            expanded={openItem === "box"}
            onExpandedChange={(next) => setOpenItem(next ? "box" : null)}
          >
            Charger · 1m USB-C to USB-C cable · quick-start guide · 2-year
            warranty card.
          </Accordion>
          <Accordion
            title="FAQ"
            expanded={openItem === "faq"}
            onExpandedChange={(next) => setOpenItem(next ? "faq" : null)}
          >
            Compatible with most laptops that support USB-C PD. Works in 100–240V
            regions; pin adapter not included.
          </Accordion>
        </View>
      </PreviewSurface>
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="accordion"
      subtitle="An accordion is a tool used to hide and reveal content as part of progressive disclosure. Tapping the icon button on each accordion row will expand or collapse the content."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/apps/playground/src/components/Accordion.tsx"
      sidebar={componentsSidebar("Accordion")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Expanded</PropLabel>
            <DSSwitch value={expanded} onValueChange={setExpanded} />
          </PropRow>
          <PropRow>
            <PropLabel>Show left icon</PropLabel>
            <DSSwitch value={showIcon} onValueChange={setShowIcon} />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Title</PropLabel>
            <DSTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </PropRow>
          <PropRow alignTop last>
            <PropLabel>Body</PropLabel>
            <DSTextInput
              value={body}
              onChangeText={setBody}
              placeholder="Body text…"
              multiline
            />
          </PropRow>
        </PropList>

        <Pressable
          onPress={() => {
            setExpanded(false);
            setShowIcon(true);
            setTitle(SAMPLE_TITLE);
            setBody(SAMPLE_BODY);
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
        minHeight: tall ? 320 : undefined,
      }}
    >
      {children}
    </View>
  );
}

function PropList({ children }: { children: ReactNode }) {
  // Plain rows separated by hairlines — matches the Figma reference (no card
  // background, no surrounding panel).
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
  multiline,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
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
        minHeight: multiline ? 100 : 48,
        justifyContent: multiline ? "flex-start" : "center",
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colour["text-n-icon"].muted}
        multiline={multiline}
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
