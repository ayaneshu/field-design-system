import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { colour, radius } from "@field-ds/tokens";

import { CopyToast } from "../components/CopyToast";
import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { ViewToggle, type ViewMode } from "../components/ViewToggle";
import { useCopy } from "../hooks/useCopy";
import { ColorsContent } from "../sections/ColorsContent";
import {
  TypographyContent,
  TypographyDownloadButton,
} from "../sections/TypographyContent";
import { IconsContent } from "../sections/IconsContent";
import type { FoundationsSection, RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Foundations">;

type SidebarKey = "all" | FoundationsSection | "illustrations";

// Header back-link first; remaining entries alphabetised by label.
const SIDEBAR_ITEMS: { key: SidebarKey; label: string }[] = [
  { key: "all", label: "Foundations" },
  { key: "colors", label: "Colours" },
  { key: "icons", label: "Icons" },
  { key: "illustrations", label: "Illustrations" },
  { key: "typography", label: "Typography" },
];

export function FoundationsScreen({ route, navigation }: Props) {
  const initial = route.params?.section ?? null;
  const [active, setActive] = useState<"all" | FoundationsSection>(
    initial ?? "all",
  );
  // Grid/List view mode for the Colours page; lives at this level so the
  // toggle can be rendered in the page-header right slot (Figma).
  const [coloursView, setColoursView] = useState<ViewMode>("grid");
  const { toast, copy } = useCopy();

  useEffect(() => {
    if (route.params?.section) setActive(route.params.section);
  }, [route.params?.section]);

  // First row is the section anchor — always rendered with a divider after,
  // never highlighted while on a sub-section. Subsequent rows toggle `active`
  // based on the selected sub-section.
  const sidebarItems: SidebarItem[] = SIDEBAR_ITEMS.map((s, i) => ({
    key: s.key,
    label: s.label,
    active: i === 0 ? active === "all" : s.key === active,
    dividerAfter: i === 0,
  }));

  const titleFor: Record<typeof active, string> = {
    all: "foundations",
    colors: "colours",
    typography: "typography",
    icons: "icons",
  };
  const subtitleFor: Record<typeof active, string> = {
    all: "The Building Blocks of Design Systems",
    colors:
      "Semantic tokens map app-wide intent; base palettes anchor the ramps. Tap any swatch to copy its hex.",
    typography:
      "Noontree at every size. Type your own preview, switch families and copy the token.",
    icons:
      "System icons on a 24×24 grid. Search, then copy the name or full SVG markup.",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colour.surface.primary }}>
      <PageScaffold
        topNavActive="Foundations"
        title={titleFor[active]}
        subtitle={subtitleFor[active]}
        sidebar={sidebarItems}
        rightSlot={
          active === "colors" ? (
            <ViewToggle value={coloursView} onChange={setColoursView} />
          ) : active === "typography" ? (
            <TypographyDownloadButton
              onDone={() => copy("Noontree", "all weights downloaded")}
            />
          ) : undefined
        }
        onSidebarSelect={(key) => {
          if (key === "illustrations") {
            navigation.navigate("Illustrations" as never);
            return;
          }
          setActive(key as typeof active);
        }}
      >
        {active === "all" ? (
          <FoundationsHub
            onSelect={setActive}
            onIllustrations={() => navigation.navigate("Illustrations" as never)}
          />
        ) : active === "colors" ? (
          <ColorsContent copy={copy} view={coloursView} />
        ) : active === "typography" ? (
          <TypographyContent copy={copy} />
        ) : (
          <IconsContent copy={copy} />
        )}
      </PageScaffold>
      <CopyToast message={toast} />
    </View>
  );
}

function FoundationsHub({
  onSelect,
  onIllustrations,
}: {
  onSelect: (k: FoundationsSection | "all") => void;
  onIllustrations: () => void;
}) {
  const { width } = useWindowDimensions();
  const cardsPerRow = width >= 1280 ? 4 : width >= 800 ? 3 : 2;

  type HubCard = {
    key: FoundationsSection | "illustrations";
    label: string;
  };

  const CARDS: HubCard[] = [
    { key: "colors", label: "Colours" },
    { key: "typography", label: "Typography" },
    { key: "icons", label: "Icons" },
    { key: "illustrations", label: "Illustrations" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 24,
      }}
    >
      {CARDS.map((c) => (
        <HubCardView
          key={c.key}
          label={c.label}
          cardsPerRow={cardsPerRow}
          onPress={() => {
            if (c.key === "illustrations") onIllustrations();
            else onSelect(c.key);
          }}
        />
      ))}
    </View>
  );
}

function HubCardView({
  label,
  cardsPerRow,
  onPress,
}: {
  label: string;
  cardsPerRow: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexBasis: `calc((100% - ${(cardsPerRow - 1) * 24}px) / ${cardsPerRow})` as never,
        flexGrow: 0,
        flexShrink: 0,
        opacity: pressed ? 0.92 : 1,
        transform: [{ translateY: hovered ? -2 : 0 }],
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      })}
    >
      <View
        style={{
          aspectRatio: 1.5,
          backgroundColor: colour.surface.tertiary,
          borderRadius: radius["16"],
        }}
      />
      <Text
        numberOfLines={1}
        style={{
          marginTop: 12,
          fontFamily: "Noontree-Bold",
          fontSize: 18,
          lineHeight: 24,
          letterSpacing: -0.15,
          color: colour["text-n-icon"].primary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
