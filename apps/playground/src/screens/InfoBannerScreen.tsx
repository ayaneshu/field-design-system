import { useState, type ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  InfoBanner,
  Switch as FieldSwitch,
  Toggle as FieldToggle,
  type InfoBannerColor,
  type InfoBannerShape,
  type InfoBannerSize,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { base, colour, radius, space, textStyles } from "@field-ds/tokens";

import { Dropdown, type DropdownOption } from "../components/Dropdown";
import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "InfoBanner">;

const COLORS: InfoBannerColor[] = [
  "green",
  "grey",
  "blue",
  "orange",
  "supermall",
  "purple",
  "red",
];
const SIZES: InfoBannerSize[] = ["small", "large"];
const SHAPES: InfoBannerShape[] = ["rounded", "rectangular"];

// Curated icon set covering the glyphs designers reach for when configuring
// an inline status pill.
const ICONS: IconName[] = [
  "system-verified",
  "system-check-circle",
  "system-info-circle",
  "system-bag",
  "system-heart",
];

// Swatch hex used as the dropdown preview. Picked to match the foreground
// tone the InfoBanner paints for that colour, so the dropdown row reads as a
// faithful preview rather than a generic chip.
const COLOR_SWATCH: Record<InfoBannerColor, string> = {
  green: base.colour.green["500"],
  grey: base.colour.grey["400"],
  blue: base.colour["brand-blue"]["500"],
  orange: base.colour.orange["500"],
  supermall: base.colour.supermall["500"],
  purple: base.colour.purple["500"],
  red: base.colour.red["500"],
};

const COLOR_LABEL: Record<InfoBannerColor, string> = {
  green: "Green · success",
  grey: "Grey · neutral",
  blue: "Blue · info",
  orange: "Orange · warning",
  supermall: "Supermall",
  purple: "Purple · exclusive",
  red: "Red · error",
};

const ICON_LABEL: Record<IconName, string> = {
  "system-verified": "Verified",
  "system-check-circle": "Check",
  "system-info-circle": "Info",
  "system-bag": "Bag",
  "system-heart": "Heart",
} as Record<IconName, string>;

export function InfoBannerScreen({ navigation }: Props) {
  const [color, setColor] = useState<InfoBannerColor>("green");
  const [size, setSize] = useState<InfoBannerSize>("small");
  const [shape, setShape] = useState<InfoBannerShape>("rounded");
  const [showIcon, setShowIcon] = useState(true);
  const [icon, setIcon] = useState<IconName>("system-verified");
  const [label, setLabel] = useState("Verified seller");

  const playgroundPreview = (
    <PreviewSurface tall>
      <InfoBanner
        color={color}
        size={size}
        shape={shape}
        showIcon={showIcon}
        icon={icon}
        // Empty label collapses the pill — keep a visible placeholder so
        // designers don't think the component disappeared.
        label={label || "Label text goes here"}
      />
    </PreviewSurface>
  );

  const colorsPreview = (
    <PreviewSurface>
      <View
        style={{
          flexDirection: "row",
          gap: space["12"],
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {COLORS.map((c) => (
          <StateCell key={c} label={c}>
            <InfoBanner color={c} label={LABEL_BY_COLOR[c]} />
          </StateCell>
        ))}
      </View>
    </PreviewSurface>
  );

  const shapesPreview = (
    <View style={{ gap: space["20"] }}>
      <PreviewSurface>
        <SectionLabel>Small</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SHAPES.map((s) => (
            <StateCell key={s} label={s}>
              <InfoBanner label="Verified" size="small" shape={s} />
            </StateCell>
          ))}
        </View>
      </PreviewSurface>
      <PreviewSurface>
        <SectionLabel>Large</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SHAPES.map((s) => (
            <StateCell key={s} label={s}>
              <InfoBanner label="Verified" size="large" shape={s} />
            </StateCell>
          ))}
        </View>
      </PreviewSurface>
    </View>
  );

  const iconTogglePreview = (
    <PreviewSurface>
      <View
        style={{
          flexDirection: "row",
          gap: space["12"],
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <StateCell label="With icon">
          <InfoBanner label="Verified seller" />
        </StateCell>
        <StateCell label="No icon">
          <InfoBanner label="Updated 2h ago" color="grey" showIcon={false} />
        </StateCell>
        <StateCell label="Custom icon">
          <InfoBanner
            label="Member exclusive"
            color="purple"
            icon="system-heart"
          />
        </StateCell>
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="info banner"
      subtitle="Single-line status pill that sits inline beside product info, CTAs, or list rows. Non-interactive: success confirmations, ETAs, promo tags. Two sizes × seven semantic colors × two shapes. Background fades left-to-right from the colour's subtle tint to white."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/InfoBanner/InfoBanner.tsx"
      sidebar={componentsSidebar("InfoBanner")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Label</PropLabel>
            <DSTextInput
              value={label}
              onChangeText={setLabel}
              placeholder="Label text goes here"
            />
          </PropRow>
          <PropRow>
            <PropLabel>Color</PropLabel>
            <Dropdown<InfoBannerColor>
              value={color}
              onChange={setColor}
              menuWidth={240}
              options={COLORS.map<DropdownOption<InfoBannerColor>>((c) => ({
                value: c,
                label: COLOR_LABEL[c],
                swatch: COLOR_SWATCH[c],
              }))}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <View style={{ minWidth: 220 }}>
              <FieldSwitch<InfoBannerSize>
                options={SIZES.map((s) => ({ value: s, label: s }))}
                value={size}
                onChange={setSize}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Shape</PropLabel>
            <View style={{ minWidth: 240 }}>
              <FieldSwitch<InfoBannerShape>
                options={SHAPES.map((s) => ({ value: s, label: s }))}
                value={shape}
                onChange={setShape}
              />
            </View>
          </PropRow>
          <PropRow>
            <PropLabel>Show icon</PropLabel>
            <Toggle value={showIcon} onValueChange={setShowIcon} />
          </PropRow>
          <PropRow last>
            <PropLabel>Glyph</PropLabel>
            <Dropdown<IconName>
              value={icon}
              onChange={setIcon}
              menuWidth={240}
              options={ICONS.map<DropdownOption<IconName>>((g) => ({
                value: g,
                label: ICON_LABEL[g] ?? g,
                icon: g,
              }))}
            />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Colors" preview={colorsPreview} />

      <DetailSection heading="Sizes & shapes" preview={shapesPreview} />

      <DetailSection heading="Icon" preview={iconTogglePreview} />
    </PageScaffold>
  );
}

const LABEL_BY_COLOR: Record<InfoBannerColor, string> = {
  green: "Verified",
  grey: "Coming soon",
  blue: "New",
  orange: "Low stock",
  supermall: "Supermall",
  purple: "Member exclusive",
  red: "Out of stock",
};

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
        minWidth: 220,
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

