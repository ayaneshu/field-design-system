import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { base, colour, radius, space } from "@field-ds/tokens";

import { CopyToast } from "../components/CopyToast";
import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { ViewToggle, type ViewMode } from "../components/ViewToggle";
import { useCopy } from "../hooks/useCopy";
import { useTheme } from "../theme/ThemeContext";
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
// Hover palette — one of these tokens is picked at random every time the
// pointer enters a thumbnail, so the same card cycles through different hues
// across multiple hovers. Each entry is the saturated 700-shade pulled from
// the base colour ramps in @field-ds/tokens (mint = the emerald ramp, which
// is the system's green-teal mint).
const HOVER_PALETTE: readonly string[] = [
  base.colour["brand-blue"]["700"],
  base.colour.red["700"],
  base.colour.orange["700"],
  base.colour.noon["600"],
  base.colour.purple["700"],
  base.colour.green["700"],
  base.colour.emerald["700"],
];

function pickRandomHoverColor(prev?: string | null): string {
  // Bias toward "different from last" — if we'd repeat the previous colour,
  // re-roll once so consecutive hovers feel varied.
  const next = HOVER_PALETTE[Math.floor(Math.random() * HOVER_PALETTE.length)];
  if (next === prev && HOVER_PALETTE.length > 1) {
    return HOVER_PALETTE[(HOVER_PALETTE.indexOf(next) + 1) % HOVER_PALETTE.length];
  }
  return next;
}

// ─────────── Ink context ───────────
//
// Every illustration receives `tone` (the foreground ink) as a prop, but
// many also need `ambient` — the card's surface colour — so that "cut-outs"
// inside filled shapes (e.g. a checkmark stroke inside a filled checkbox,
// or a label sliver inside a filled button) always read against whatever
// colour the card is currently painting. Hardcoding white for cut-outs
// breaks the moment the card surface is also light (dark mode → light tone
// → light fill → white cut-out vanishes).
type InkValue = { tone: string; ambient: string };
const InkContext = createContext<InkValue>({
  tone: colour["text-n-icon"].primary,
  ambient: colour.surface.primary,
});
export function useInk() {
  return useContext(InkContext);
}

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
  const { mode, shell } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  // Active hover colour is rolled fresh on each hover-in so the thumbnail
  // doesn't always flash the same accent.
  const [activeBg, setActiveBg] = useState<string>(() =>
    pickRandomHoverColor(null),
  );
  // Idle thumbnail palette flips with the shell theme. In light mode we keep
  // the original soft surface + dark navy ink; in dark mode the card surface
  // matches the sidebar (rather than staying as a light island) and the
  // illustration ink lifts to the primary text token so the motif still
  // reads against the dark fill.
  const idleBg = mode === "dark" ? shell.sidebarBg : colour.surface.tertiary;
  const idleInk =
    mode === "dark" ? shell.textPrimary : colour["text-n-icon"].primary;
  const activeInk = colour.surface.primary;

  // Dot-grid backdrop. A radial-gradient dot every 12px is small enough to
  // disappear unless you look for it — it gives the tile a sense of "design
  // canvas" without competing with the skeleton on top. Idle uses the
  // primary ink at 6% alpha; hover keeps the same density but swaps to
  // white at 14% so the grid stays visible against the saturated accent.
  // RN-Web maps these CSS props straight through to the underlying div.
  const dotColor =
    hovered
      ? "rgba(255,255,255,0.14)"
      : mode === "dark"
        ? "rgba(244,246,251,0.07)"
        : "rgba(29,37,57,0.07)";
  const gridStyle = {
    backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
    backgroundSize: "12px 12px",
    backgroundPosition: "6px 6px",
  } as Record<string, string>;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => {
        setActiveBg((prev) => pickRandomHoverColor(prev));
        setHovered(true);
      }}
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
        style={{
          aspectRatio: 1.5,
          backgroundColor: hovered ? activeBg : idleBg,
          borderRadius: radius["16"],
          overflow: "hidden",
          // @ts-expect-error transition props pass through on rn-web
          transitionProperty: "background-color, box-shadow",
          transitionDuration: "260ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: hovered
            ? "0 10px 24px rgba(29, 37, 57, 0.10)"
            : "0 1px 0 rgba(29, 37, 57, 0.02)",
          ...gridStyle,
        }}
      >
        {/* Subtle inner stroke — adds a designer's hairline frame, kept very
            faint so it reads as polish rather than chrome. */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: radius["16"],
            borderWidth: 1,
            borderColor: hovered
              ? "rgba(255,255,255,0.18)"
              : mode === "dark"
                ? "rgba(244,246,251,0.06)"
                : "rgba(29,37,57,0.05)",
          }}
        />
        <View
          style={{
            flex: 1,
            padding: space["28"],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InkContext.Provider
            value={{
              tone: hovered ? activeInk : idleInk,
              // The card surface beneath the illustration. Cut-outs inside
              // filled shapes paint with this so they always show "what's
              // behind the fill" rather than a hardcoded white.
              ambient: hovered ? activeBg : idleBg,
            }}
          >
            {renderIllustration(hovered ? activeInk : idleInk)}
          </InkContext.Provider>
        </View>
      </View>
      <Text
        numberOfLines={1}
        style={{
          marginTop: 12,
          fontFamily: "Noontree-Bold",
          fontSize: 18,
          lineHeight: 24,
          letterSpacing: -0.15,
          color: shell.textPrimary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─────────── Card illustrations (minimal, monochrome) ───────────
//
// Family recipe applied to every tile in both Foundations and Components:
//   1. Hairline 1.5px strokes everywhere — same draftsmanship vocabulary.
//   2. Three-tier opacity ramp: 1.0 / 0.45 / 0.22 for clear hierarchy.
//   3. Focal element framed by ambient context (a label, a paragraph line,
//      a corner annotation) so the tile reads as "in use", not isolated.
//   4. Radii vocabulary stays consistent: 4 utility, 6 cards, 9999 pills.
//   5. One designer's note per tile — a tiny mark that elevates it from
//      sketch to spec.

const ILLO_W = 200;
const ILLO_H = 116;
const STROKE = 1.5;

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

/**
 * Tiny "label" sliver — a hairline rounded bar at the given width / alpha.
 * Used across every tile to evoke text without rendering Text (which would
 * change the family between glyphic and skeleton tiles).
 */
function LabelBar({
  width,
  alpha = 0.45,
  tone,
  height = STROKE + 1,
}: {
  width: number;
  alpha?: number;
  tone: string;
  height?: number;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 1.5,
        backgroundColor: tone,
        opacity: alpha,
      }}
    />
  );
}

function ColoursIllustration({ tone }: { tone: string }) {
  // Three large discs overlapping (the focal "palette") with a thinner
  // ring-only swatch at the back. Below: a ramp of four mini-swatches —
  // suggesting the underlying base palette ramp. The combination reads as
  // "tokens layered on a base scale" rather than a vague cluster.
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Outline-only "ghost" disc anchoring the back of the stack. */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              borderWidth: STROKE,
              borderColor: tone,
              opacity: 0.22,
              marginRight: -22,
            }}
          />
          {[0.22, 0.55, 1].map((opacity, i) => (
            <View
              key={i}
              style={{
                width: 48,
                height: 48,
                borderRadius: 9999,
                backgroundColor: tone,
                opacity,
                marginLeft: i === 0 ? 0 : -22,
              }}
            />
          ))}
        </View>
        {/* Mini ramp — 6 swatches stepping in alpha, evoking a token scale. */}
        <View style={{ flexDirection: "row", gap: 4 }}>
          {[0.18, 0.3, 0.45, 0.6, 0.8, 1].map((a, i) => (
            <View
              key={i}
              style={{
                width: 14,
                height: 8,
                borderRadius: 2,
                backgroundColor: tone,
                opacity: a,
              }}
            />
          ))}
        </View>
      </View>
    </IlloFrame>
  );
}

function IconsIllustration({ tone }: { tone: string }) {
  // A miniature "icon library card" — a hairline search field on top with
  // a magnifying glass + placeholder line, then a 4-column row of glyphs
  // below. The composition reads as "a system of icons" rather than four
  // disconnected shapes floating in space.
  const Glyph = ({ kind }: { kind: "circle" | "square" | "diamond" | "plus" }) => (
    <View
      style={{
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {kind === "circle" ? (
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 9999,
            borderWidth: STROKE,
            borderColor: tone,
          }}
        />
      ) : kind === "square" ? (
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            borderWidth: STROKE,
            borderColor: tone,
          }}
        />
      ) : kind === "diamond" ? (
        <View
          style={{
            width: 12,
            height: 12,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: 1.5,
            transform: [{ rotate: "45deg" }],
          }}
        />
      ) : (
        <>
          <View
            style={{
              position: "absolute",
              width: 12,
              height: STROKE,
              backgroundColor: tone,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: STROKE,
              height: 12,
              backgroundColor: tone,
            }}
          />
        </>
      )}
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 10 }}>
        {/* Search field at the top */}
        <View
          style={{
            width: 140,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: 9999,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
            <Circle cx="5" cy="5" r="3.25" stroke={tone} strokeWidth={1.25} />
            <Path d="M7.6 7.6 L10 10" stroke={tone} strokeWidth={1.25} strokeLinecap="round" />
          </Svg>
          <LabelBar width={70} height={STROKE} alpha={0.45} tone={tone} />
        </View>
        {/* Icon row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <Glyph kind="circle" />
          <Glyph kind="square" />
          <Glyph kind="diamond" />
          <Glyph kind="plus" />
        </View>
      </View>
    </IlloFrame>
  );
}

function IllustrationsIllustration({ tone }: { tone: string }) {
  // A scenic canvas — sun, mountain horizon (SVG polygon so the silhouette
  // reads cleanly at small sizes), and a thin foreground line. Below the
  // canvas: a tiny caption-line ribbon, as if this were a card with a name
  // tag. Reads as "art in a frame" with intent.
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 144,
            height: 76,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: radius["6"],
            overflow: "hidden",
            justifyContent: "flex-end",
          }}
        >
          <Svg
            width={144 - STROKE * 2}
            height={76 - STROKE * 2}
            viewBox="0 0 142 74"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {/* Sun */}
            <Circle cx={100} cy={22} r={10} fill={tone} opacity={0.55} />
            {/* Back mountain */}
            <Polygon
              points="0,74 36,32 70,74"
              fill={tone}
              opacity={0.45}
            />
            {/* Front mountain */}
            <Polygon
              points="36,74 80,20 122,74"
              fill={tone}
              opacity={0.92}
            />
            {/* Far mountain — small */}
            <Polygon
              points="90,74 116,42 142,74"
              fill={tone}
              opacity={0.6}
            />
            {/* Horizon hairline at the base */}
            <Path
              d={`M0 74 L142 74`}
              stroke={tone}
              strokeWidth={STROKE}
              opacity={0.18}
            />
          </Svg>
        </View>
        {/* Caption ribbon below the canvas */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 9999,
              backgroundColor: tone,
              opacity: 0.55,
            }}
          />
          <LabelBar width={64} alpha={0.4} tone={tone} />
        </View>
      </View>
    </IlloFrame>
  );
}

function RadiusIllustration({ tone }: { tone: string }) {
  // Four squares stepping from sharp to pill — each annotated with a small
  // L-shaped corner tick (the "spec annotation") at the top-left corner,
  // turning the row from a row of shapes into a corner-radius spec sheet.
  const Step = ({ r, alpha }: { r: number; alpha: number }) => (
    <View
      style={{
        width: 36,
        height: 36,
        borderWidth: STROKE,
        borderColor: tone,
        borderRadius: r,
        opacity: alpha,
      }}
    >
      {/* Corner annotation — a tiny L shape just outside the shape's top-left
          corner, only on the more-rounded steps so the eye picks up the
          progression of curvature. */}
      {r > 4 ? (
        <View
          style={{
            position: "absolute",
            top: r > 16 ? 8 : 4,
            left: r > 16 ? 8 : 4,
            width: 6,
            height: 6,
            borderTopWidth: STROKE,
            borderLeftWidth: STROKE,
            borderColor: tone,
            opacity: 0.55,
            borderTopLeftRadius: Math.min(r * 0.7, 4),
          }}
        />
      ) : null}
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {([
            [2, 0.45],
            [8, 0.6],
            [16, 0.78],
            [9999, 1],
          ] as const).map(([r, alpha], i) => (
            <Step key={i} r={r} alpha={alpha} />
          ))}
        </View>
        <LabelBar width={80} alpha={0.3} tone={tone} />
      </View>
    </IlloFrame>
  );
}

function SpacingIllustration({ tone }: { tone: string }) {
  // Stack of bars stepping in width plus a vertical measurement bracket
  // on the right side — the bracket is the designer's note that lifts this
  // from "stacked bars" to "a measurement spec".
  const widths = [40, 64, 88, 112, 136];
  const totalHeight = widths.length * 5 + (widths.length - 1) * 8;
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>
          <View style={{ alignItems: "flex-start", gap: 8 }}>
            {widths.map((w, i) => (
              <View
                key={i}
                style={{
                  width: w,
                  height: 5,
                  borderRadius: 1.5,
                  backgroundColor: tone,
                  opacity: 0.3 + i * 0.16,
                }}
              />
            ))}
          </View>
          {/* Right-side measurement bracket — top + bottom tick + vertical
              hairline = the spec mark. */}
          <View
            style={{
              width: 8,
              height: totalHeight,
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: 6, height: STROKE, backgroundColor: tone, opacity: 0.55 }} />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: STROKE,
                height: totalHeight,
                backgroundColor: tone,
                opacity: 0.4,
              }}
            />
            <View style={{ width: 6, height: STROKE, backgroundColor: tone, opacity: 0.55 }} />
          </View>
        </View>
      </View>
    </IlloFrame>
  );
}

function TypographyIllustration({ tone }: { tone: string }) {
  // "Aa" letterforms with cap-height and baseline guides, plus a sample
  // text line below the baseline (low-alpha) — turning the tile into a
  // type specimen card.
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 6 }}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 120,
              height: STROKE,
              backgroundColor: tone,
              opacity: 0.22,
              marginBottom: -2,
            }}
          />
          <Text
            style={{
              fontFamily: "Noontree-Bold",
              fontSize: 60,
              lineHeight: 60,
              letterSpacing: -1.5,
              color: tone,
            }}
          >
            Aa
          </Text>
          <View
            style={{
              marginTop: -2,
              width: 120,
              height: STROKE,
              backgroundColor: tone,
              opacity: 0.45,
            }}
          />
        </View>
        {/* Specimen line beneath the baseline */}
        <View style={{ gap: 3, alignItems: "center" }}>
          <LabelBar width={104} alpha={0.4} tone={tone} />
          <LabelBar width={72} alpha={0.28} tone={tone} />
        </View>
      </View>
    </IlloFrame>
  );
}
