import { useState, type ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  PageHeader,
  Toggle as FieldToggle,
  type PageHeaderType,
  type PageHeaderTrailing,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { Dropdown, type DropdownOption } from "../components/Dropdown";
import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { componentsSidebar, navigateFromSidebar } from "../navigation/sidebars";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PageHeader">;

const TYPES: PageHeaderType[] = [
  "title",
  "title-center",
  "search-bar",
  "search-pill",
  "search-pill-wide",
  "location",
  "breadcrumb",
  "back-only",
  "icons",
];

const TYPE_LABEL: Record<PageHeaderType, string> = {
  title: "Title",
  "title-center": "Title · centred",
  "search-bar": "Search bar",
  "search-pill": "Search pill",
  "search-pill-wide": "Search pill · wide",
  location: "Location",
  breadcrumb: "Breadcrumb",
  "back-only": "Back only",
  icons: "Icons",
};

const SHARE: PageHeaderTrailing = {
  icon: "system-upload",
  onPress: () => {},
  accessibilityLabel: "Share",
};
const HEART: PageHeaderTrailing = {
  icon: "system-heart",
  onPress: () => {},
  accessibilityLabel: "Saved",
};
const MORE: PageHeaderTrailing = {
  icon: "system-horizontal-three-dot-menu",
  onPress: () => {},
  accessibilityLabel: "More",
};
const SEARCH: PageHeaderTrailing = {
  icon: "system-search",
  onPress: () => {},
  accessibilityLabel: "Search",
};

const TRAILING_BY_TYPE: Record<PageHeaderType, PageHeaderTrailing[]> = {
  title: [SHARE],
  "title-center": [MORE],
  "search-bar": [],
  "search-pill": [HEART],
  "search-pill-wide": [HEART, SHARE],
  location: [HEART],
  breadcrumb: [HEART],
  "back-only": [],
  icons: [SEARCH, HEART, SHARE],
};

const DEFAULT_TITLE = "Page title";
const DEFAULT_SUBTITLE = "Subtitle text below the title";

export function PageHeaderScreen({ navigation }: Props) {
  const [type, setType] = useState<PageHeaderType>("title");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [searchValue, setSearchValue] = useState("");

  const playgroundPreview = (
    <PreviewSurface tall>
      <PhoneFrame>
        <PageHeader
          type={type}
          title={title || DEFAULT_TITLE}
          subtitle={showSubtitle ? (subtitle || DEFAULT_SUBTITLE) : undefined}
          addressLabel="Home"
          path="- BDA Complex, 100 Feet Rd Block, Koramangla"
          searchPlaceholder={
            type === "search-bar"
              ? "Search for your building, area..."
              : "Search"
          }
          searchValue={searchValue}
          onSearchChangeText={setSearchValue}
          trailing={TRAILING_BY_TYPE[type]}
        />
      </PhoneFrame>
    </PreviewSurface>
  );

  const allVariantsPreview = (
    <PreviewSurface>
      <View style={{ gap: space["20"], width: "100%" }}>
        {TYPES.map((t) => (
          <View key={t} style={{ gap: space["8"] }}>
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
              {t}
            </Text>
            <PhoneFrame>
              <PageHeader
                type={t}
                title="Page title"
                subtitle={
                  t === "location" ? "Villa 52, Springville, K, VGP Layout" : undefined
                }
                addressLabel="Home"
                path="- BDA Complex, 100 Feet Rd Block, Koramangla"
                searchPlaceholder={
                  t === "search-bar"
                    ? "Search for your building, area..."
                    : "Search"
                }
                trailing={TRAILING_BY_TYPE[t]}
              />
            </PhoneFrame>
          </View>
        ))}
      </View>
    </PreviewSurface>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="page header"
      subtitle="Top-of-screen header. One component, nine `type` values — pick the layout that matches the screen. Always exactly one PageHeader per screen, anchored below the status bar."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/PageHeader/PageHeader.tsx"
      sidebar={componentsSidebar("PageHeader")}
      onSidebarSelect={(key) => navigateFromSidebar(navigation, key)}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Type</PropLabel>
            <Dropdown<PageHeaderType>
              value={type}
              onChange={setType}
              menuWidth={240}
              options={TYPES.map<DropdownOption<PageHeaderType>>((t) => ({
                value: t,
                label: TYPE_LABEL[t],
              }))}
            />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Title</PropLabel>
            <DSTextInput
              value={title}
              onChangeText={setTitle}
              placeholder={DEFAULT_TITLE}
            />
          </PropRow>
          <PropRow alignTop>
            <PropLabel>Subtitle</PropLabel>
            <DSTextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder={DEFAULT_SUBTITLE}
            />
          </PropRow>
          <PropRow last>
            <PropLabel>Show subtitle</PropLabel>
            <Toggle value={showSubtitle} onValueChange={setShowSubtitle} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="All types" preview={allVariantsPreview} />
    </PageScaffold>
  );
}

// ─────────── Local building blocks ───────────

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        width: 390,
        maxWidth: "100%",
        borderRadius: radius["16"],
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colour.border.subtle,
      }}
    >
      {children}
      <View
        style={{ height: space["40"], backgroundColor: colour.surface.tertiary }}
      />
    </View>
  );
}

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
        borderWidth: 1,
        borderColor: colour.border.primary,
        borderRadius: radius["12"],
        padding: space["20"],
        justifyContent: "center",
        alignItems: tall ? "center" : undefined,
        minHeight: tall ? 200 : undefined,
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
        { color: shell.textPrimary, minWidth: 96, paddingTop: 2 },
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
        width: 280,
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
