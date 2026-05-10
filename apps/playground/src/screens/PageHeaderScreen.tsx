import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  PageHeader,
  type PageHeaderType,
  type PageHeaderTrailing,
} from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

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

export function PageHeaderScreen({ navigation }: Props) {
  const [type, setType] = useState<PageHeaderType>("title");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [longTitle, setLongTitle] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const titleText = longTitle
    ? "A very long page title that should truncate gracefully"
    : "Page title";

  const playgroundPreview = (
    <PreviewSurface tall>
      <PhoneFrame>
        <PageHeader
          type={type}
          title={titleText}
          subtitle={showSubtitle ? "Subtitle text below the title" : undefined}
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
            <SegmentedControl
              options={TYPES}
              value={type}
              onChange={setType}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Subtitle</PropLabel>
            <SegmentedControl
              options={["off", "on"] as const}
              value={showSubtitle ? "on" : "off"}
              onChange={(v) => setShowSubtitle(v === "on")}
            />
          </PropRow>
          <PropRow last>
            <PropLabel>Long title</PropLabel>
            <SegmentedControl
              options={["off", "on"] as const}
              value={longTitle ? "on" : "off"}
              onChange={(v) => setLongTitle(v === "on")}
            />
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
        flexWrap: "wrap",
        backgroundColor: colour.surface.muted,
        borderRadius: radius.rounded,
        padding: 2,
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={String(opt)}
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
              {String(opt)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
