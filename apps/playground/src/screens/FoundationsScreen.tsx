import { useEffect, useState, type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { colour, radius, space } from "@field-ds/tokens";

import { CopyToast } from "../components/CopyToast";
import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { ViewToggle, type ViewMode } from "../components/ViewToggle";
import { useCopy } from "../hooks/useCopy";
import { ColorsContent } from "../sections/ColorsContent";
import { TypographyContent } from "../sections/TypographyContent";
import { IconsContent } from "../sections/IconsContent";
import { SpacingContent } from "../sections/SpacingContent";
import { RadiusContent } from "../sections/RadiusContent";
import type { FoundationsSection, RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Foundations">;

type SidebarKey = "all" | FoundationsSection | "illustrations";

// Header back-link first; remaining entries alphabetised by label.
const SIDEBAR_ITEMS: { key: SidebarKey; label: string }[] = [
  { key: "all", label: "Foundations" },
  { key: "colors", label: "Colours" },
  { key: "icons", label: "Icons" },
  { key: "illustrations", label: "Illustrations" },
  { key: "radius", label: "Radius" },
  { key: "spacing", label: "Spacing" },
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
    spacing: "spacing",
    radius: "radius",
  };
  const subtitleFor: Record<typeof active, string> = {
    all: "The Building Blocks of Design Systems",
    colors:
      "Semantic tokens map app-wide intent; base palettes anchor the ramps. Tap any swatch to copy its hex.",
    typography:
      "Noontree at every size. Type your own preview, switch families and copy the token.",
    icons:
      "System icons on a 24×24 grid. Search, then copy the name or full SVG markup.",
    spacing:
      "A 4-pixel-aligned scale that drives layout, padding and gaps everywhere.",
    radius:
      "Corner radii from sharp to fully rounded — the same scale every M-Component reaches for.",
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
        ) : active === "icons" ? (
          <IconsContent copy={copy} />
        ) : active === "spacing" ? (
          <SpacingContent copy={copy} />
        ) : active === "radius" ? (
          <RadiusContent copy={copy} />
        ) : null}
      </PageScaffold>
      <CopyToast message={toast} />
    </View>
  );
}

type HubKey = FoundationsSection | "illustrations";

type HubCard = {
  key: HubKey;
  label: string;
  illustration: (props: { tone: string }) => React.ReactNode;
};

function FoundationsHub({
  onSelect,
  onIllustrations,
}: {
  onSelect: (k: FoundationsSection | "all") => void;
  onIllustrations: () => void;
}) {
  const { width } = useWindowDimensions();
  const cardsPerRow = width >= 1280 ? 4 : width >= 800 ? 3 : 2;

  // Alphabetised — matches the sidebar order.
  const CARDS: HubCard[] = [
    { key: "colors", label: "Colours", illustration: ColoursIllustration },
    { key: "icons", label: "Icons", illustration: IconsIllustration },
    { key: "illustrations", label: "Illustrations", illustration: IllustrationsIllustration },
    { key: "radius", label: "Radius", illustration: RadiusIllustration },
    { key: "spacing", label: "Spacing", illustration: SpacingIllustration },
    { key: "typography", label: "Typography", illustration: TypographyIllustration },
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
          illustration={c.illustration}
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
  illustration: Illustration,
  cardsPerRow,
  onPress,
}: {
  label: string;
  illustration: HubCard["illustration"];
  cardsPerRow: number;
  onPress: () => void;
}) {
  return (
    <HubCardShell
      label={label}
      cardsPerRow={cardsPerRow}
      onPress={onPress}
      renderIllustration={(tone) => <Illustration tone={tone} />}
    />
  );
}

/**
 * Shared shell for hub-style cards (foundation tiles, component tiles).
 * Idle state shows a soft surface tint with a primary-ink monochrome
 * illustration; hover fills the tile with the brand action colour and
 * inverts the illustration ink to white so the motif still reads.
 */
export function HubCardShell({
  label,
  cardsPerRow,
  onPress,
  renderIllustration,
}: {
  label: string;
  cardsPerRow: number;
  onPress: () => void;
  renderIllustration: (tone: string) => ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const idleBg = colour.surface.tertiary;
  const idleInk = colour["text-n-icon"].primary;
  const activeBg = colour["text-n-icon"].action;
  const activeInk = colour.surface.primary;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        flexBasis: `calc((100% - ${(cardsPerRow - 1) * 24}px) / ${cardsPerRow})` as never,
        flexGrow: 0,
        flexShrink: 0,
        opacity: pressed ? 0.92 : 1,
        transform: [{ translateY: hovered ? -4 : 0 }],
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "transform, opacity",
        transitionDuration: "260ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <View
        // @ts-expect-error transition props pass through on rn-web
        style={{
          aspectRatio: 1.5,
          backgroundColor: hovered ? activeBg : idleBg,
          borderRadius: radius["16"],
          overflow: "hidden",
          padding: space["28"],
          alignItems: "center",
          justifyContent: "center",
          transitionProperty: "background-color",
          transitionDuration: "260ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {renderIllustration(hovered ? activeInk : idleInk)}
      </View>
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

// ─────────── Card illustrations (minimal, monochrome) ───────────

const ILLO_W = 160;
const ILLO_H = 96;

function IlloFrame({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: ILLO_W,
        height: ILLO_H,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

function ColoursIllustration({ tone }: { tone: string }) {
  // Three overlapping circular swatches.
  return (
    <IlloFrame>
      <View style={{ flexDirection: "row" }}>
        {[1, 0.55, 0.18].map((opacity, i) => (
          <View
            key={i}
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.rounded,
              backgroundColor: tone,
              opacity,
              marginLeft: i === 0 ? 0 : -16,
            }}
          />
        ))}
      </View>
    </IlloFrame>
  );
}

function IconsIllustration({ tone }: { tone: string }) {
  // 3x2 grid of icon-shaped squares with rounded corners.
  return (
    <IlloFrame>
      <View
        style={{
          width: 132,
          height: 76,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {[
          { kind: "square" },
          { kind: "circle" },
          { kind: "tri" },
          { kind: "circle" },
          { kind: "square" },
          { kind: "tri" },
        ].map((g, i) => (
          <View
            key={i}
            style={{
              width: 38,
              height: 34,
              borderRadius: g.kind === "circle" ? radius.rounded : radius["6"],
              borderWidth: 2,
              borderColor: tone,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {g.kind === "tri" ? (
              <View
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: tone,
                  transform: [{ rotate: "45deg" }],
                }}
              />
            ) : g.kind === "square" ? (
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: tone,
                }}
              />
            ) : (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: radius.rounded,
                  backgroundColor: tone,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </IlloFrame>
  );
}

function IllustrationsIllustration({ tone }: { tone: string }) {
  // Picture frame with a horizon-line motif inside.
  return (
    <IlloFrame>
      <View
        style={{
          width: 120,
          height: 80,
          borderWidth: 2,
          borderColor: tone,
          borderRadius: radius["8"],
          padding: 8,
          gap: 6,
          flexDirection: "column",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: radius.rounded,
              backgroundColor: tone,
              opacity: 0.6,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 6,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 24,
              height: 28,
              backgroundColor: tone,
              opacity: 0.7,
            }}
          />
          <View
            style={{
              width: 18,
              height: 38,
              backgroundColor: tone,
            }}
          />
          <View
            style={{
              width: 30,
              height: 22,
              backgroundColor: tone,
              opacity: 0.5,
            }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function RadiusIllustration({ tone }: { tone: string }) {
  // Three squares moving from sharp → soft → fully rounded.
  return (
    <IlloFrame>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {[2, 12, radius.rounded].map((r, i) => (
          <View
            key={i}
            style={{
              width: 40,
              height: 40,
              borderWidth: 2,
              borderColor: tone,
              borderRadius: r,
              opacity: 0.55 + i * 0.225,
            }}
          />
        ))}
      </View>
    </IlloFrame>
  );
}

function SpacingIllustration({ tone }: { tone: string }) {
  // A stack of horizontal bars at different lengths to evoke a spacing
  // scale. Each bar steps up in width.
  return (
    <IlloFrame>
      <View style={{ alignItems: "flex-start", gap: 8 }}>
        {[40, 64, 96, 120].map((w, i) => (
          <View
            key={i}
            style={{
              width: w,
              height: 6,
              borderRadius: radius["2"],
              backgroundColor: tone,
              opacity: 0.45 + i * 0.18,
            }}
          />
        ))}
      </View>
    </IlloFrame>
  );
}

function TypographyIllustration({ tone }: { tone: string }) {
  // Big "Aa" with a baseline.
  return (
    <IlloFrame>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Noontree-Bold",
            fontSize: 64,
            lineHeight: 64,
            letterSpacing: -2,
            color: tone,
          }}
        >
          Aa
        </Text>
        <View
          style={{
            marginTop: 8,
            width: 96,
            height: 2,
            backgroundColor: tone,
            opacity: 0.4,
          }}
        />
      </View>
    </IlloFrame>
  );
}
