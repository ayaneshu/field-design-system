import { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { space } from "@field-ds/tokens";

import { TopHeader } from "../components/TopHeader";
import { useTheme } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

// Drift keyframes for the bloom particle field. Each particle picks a
// random delay/duration so the animation looks chaotic without using a
// requestAnimationFrame loop.
const BLOOM_KEYFRAMES_ID = "bloom-particle-keyframes";
const BLOOM_KEYFRAMES_CSS = `
@keyframes bloomParticleDrift {
  0%   { transform: translate3d(0,   0,   0); opacity: 0; }
  10%  {                                        opacity: 0.6; }
  50%  { transform: translate3d(40px, -60px, 0); opacity: 1; }
  90%  {                                        opacity: 0.5; }
  100% { transform: translate3d(80px, -120px, 0); opacity: 0; }
}
`;

// Idle shimmer keyframe — keeps the silver "field" title alive without any
// pointer interaction. Injected into <head> once on mount.
const METAL_KEYFRAMES_ID = "metal-title-keyframes";
const METAL_KEYFRAMES_CSS = `
@keyframes metalTitleShimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
`;

// Silver gradient (dark mode) — symmetric pattern that repeats every 50% so
// animating background-position from 0% to 100% (with background-size 200%)
// produces a perfectly seamless loop. The colors at stops 0%, 50% and 100%
// are identical (#7d8492); when the animation snaps from 100% back to 0%,
// the visible left and right edges are unchanged so the eye sees no jump.
const SILVER_GRADIENT =
  "linear-gradient(105deg, " +
  "#7d8492 0%, " +
  "#f4f6fb 7%, " +
  "#a4abb8 14%, " +
  "#ffffff 21%, " +
  "#6b7383 28%, " +
  "#d8dde6 35%, " +
  "#ffffff 42%, " +
  "#7d8492 50%, " +
  "#f4f6fb 57%, " +
  "#a4abb8 64%, " +
  "#ffffff 71%, " +
  "#6b7383 78%, " +
  "#d8dde6 85%, " +
  "#ffffff 92%, " +
  "#7d8492 100%)";

// Dark-steel gradient (light mode) — same shimmer technique, but tones
// pinned to the dark navy primary text colour so the title stays legible
// on a white page. Light-mode stops are still symmetric (anchor #1a2238 at
// 0%, 50% and 100%) so the loop snap is invisible.
const STEEL_GRADIENT =
  "linear-gradient(105deg, " +
  "#1a2238 0%, " +
  "#5a626d 7%, " +
  "#2a3144 14%, " +
  "#8b929e 21%, " +
  "#0d1220 28%, " +
  "#6b7383 35%, " +
  "#3a4254 42%, " +
  "#1a2238 50%, " +
  "#5a626d 57%, " +
  "#2a3144 64%, " +
  "#8b929e 71%, " +
  "#0d1220 78%, " +
  "#6b7383 85%, " +
  "#3a4254 92%, " +
  "#1a2238 100%)";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Entry = {
  key: keyof RootStackParamList;
  title: string;
  blurb: string;
};

const ENTRIES: Entry[] = [
  {
    key: "Foundations",
    title: "Foundations",
    blurb: "The Building Blocks of Design Systems",
  },
  {
    key: "Components",
    title: "Components",
    blurb: "Key Components in Design System Architecture",
  },
  {
    key: "Patterns",
    title: "Patterns",
    blurb: "Essential Elements for Effective Design",
  },
];

// Theme-aware color tokens for the home page. Shell tokens cover most pages
// but the home hero uses its own muted-vs-primary scale (the muted "design
// system" line and the dim version pill don't quite match the regular
// shell.textTertiary value).
function useHomePalette() {
  const { mode } = useTheme();
  if (mode === "dark") {
    return {
      pageBg: "#000000",
      titlePrimary: "#f4f6fb",
      titleMuted: "rgba(232,236,245,0.32)",
      bodyPrimary: "#f4f6fb",
      bodySecondary: "rgba(232,236,245,0.55)",
      bodyVersion: "rgba(232,236,245,0.85)",
      divider: "rgba(232,236,245,0.18)",
    } as const;
  }
  return {
    pageBg: "#ffffff",
    // Match the navy that the rest of the app uses for primary text — pulled
    // from the Field DS `text-n-icon.primary` token.
    titlePrimary: "#1a2238",
    titleMuted: "rgba(26,34,56,0.45)",
    bodyPrimary: "#1a2238",
    bodySecondary: "rgba(26,34,56,0.55)",
    bodyVersion: "rgba(26,34,56,0.75)",
    divider: "rgba(26,34,56,0.12)",
  } as const;
}

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const palette = useHomePalette();
  const { mode } = useTheme();
  const horizontalPad = width >= 1100 ? 60 : width >= 720 ? 32 : 20;
  const topPad = width >= 1100 ? 60 : width >= 720 ? 40 : 28;

  // Hover bloom state — works in both modes. When the cursor enters
  // the "field" title, an opposite-mode veil grows from the cursor
  // position so it looks like the inverted theme is "blooming" out of
  // the pointer. The veil contains a particle field for ambient depth.
  const [bloomActive, setBloomActive] = useState(false);
  const [cursor, setCursor] = useState({ x: -2000, y: -2000 });

  // Auto-fit the subtitle to the title's block width.
  //
  //   1. Two hidden off-screen probes render "field" and "design system"
  //      at the actual title font size. We read their widths via ref +
  //      `getBoundingClientRect()` after mount — this works reliably
  //      regardless of whether RN-Web's `onLayout` fires for offscreen
  //      Text (it sometimes doesn't).
  //   2. From the two widths we compute the font size that makes
  //      "design system" render at exactly the same block-width as
  //      "field", and use that for the visible subtitle.
  const tSize = titleSize(width);
  const [subtitleSize, setSubtitleSize] = useState<number>(
    Math.round(tSize * 0.32),
  );
  const fieldProbeRef = useRef<Text>(null);
  const subtitleProbeRef = useRef<Text>(null);
  // Re-measure whenever the title size changes (viewport resize / theme
  // toggle). useEffect runs after every commit so DOM widths are ready.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const fNode = fieldProbeRef.current as unknown as HTMLElement | null;
    const sNode = subtitleProbeRef.current as unknown as HTMLElement | null;
    if (!fNode || !sNode) return;
    const fW = fNode.getBoundingClientRect().width;
    const sW = sNode.getBoundingClientRect().width;
    if (fW <= 0 || sW <= 0) return;
    // Probes both render at fontSize tSize; subtitle should render at
    // (tSize * fW / sW) so its width matches field's width.
    const target = tSize * (fW / sW);
    setSubtitleSize(target);
  }, [tSize]);
  // Captured rendered width + viewport position of the visible "field" —
  // the width drives the V 0.1 rule, the rect is used to position a
  // duplicate silver title inside the bloom overlay so the dark version
  // sits exactly on top of the navy original.
  const titleRef = useRef<Text>(null);
  const [titleW, setTitleW] = useState<number | null>(null);
  const [titleRect, setTitleRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = titleRef.current as unknown as HTMLElement | null;
    if (!node) return;
    const r = node.getBoundingClientRect();
    setTitleW(r.width);
    setTitleRect({ x: r.left, y: r.top, w: r.width, h: r.height });
  }, [tSize, subtitleSize]);

  // Inject the bloom particle keyframes once; wire up hover + cursor
  // tracking on the visible "field" title. Only active in light mode —
  // dark mode is already dark, so the bloom would be a no-op.
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    if (!document.getElementById(BLOOM_KEYFRAMES_ID)) {
      const tag = document.createElement("style");
      tag.id = BLOOM_KEYFRAMES_ID;
      tag.textContent = BLOOM_KEYFRAMES_CSS;
      document.head.appendChild(tag);
    }
  }, []);
  // Reset bloom state on theme toggle so a stuck overlay can't survive
  // across modes.
  useEffect(() => {
    setBloomActive(false);
  }, [mode]);
  // Hover handlers — passed straight to <MetalTitle> so they land on
  // the actual rendered Text element. RN-Web's `pointerEvents="box-none"`
  // wrapper sets pointer-events:none on the wrapper while children stay
  // interactive, so the title element still receives these events.
  const onTitleEnter =
    Platform.OS === "web" ? () => setBloomActive(true) : undefined;
  const onTitleLeave =
    Platform.OS === "web" ? () => setBloomActive(false) : undefined;
  const onTitleMove =
    Platform.OS === "web"
      ? (e: { nativeEvent: MouseEvent }) =>
          setCursor({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY })
      : undefined;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.pageBg }}
      contentContainerStyle={{
        minHeight: "100%" as never,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: palette.pageBg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <TopHeader active={null} />

        {/* Divider directly under the header. */}
        <View
          style={{
            height: 1,
            backgroundColor: palette.divider,
          }}
        />

        {/* Title block — anchored top-left under the header. The title
            itself needs to receive hover events for the bloom effect, so
            this wrapper uses `box-none` (children are interactive, the
            wrapper itself doesn't catch clicks on its empty space). */}
        <View
          pointerEvents="box-none"
          style={{
            paddingHorizontal: horizontalPad,
            paddingTop: topPad,
            gap: space["32"],
            alignItems: "flex-start",
          }}
        >
          <View>
            <MetalTitle
              line="field"
              width={width}
              textRef={titleRef}
              onMouseEnter={onTitleEnter}
              onMouseLeave={onTitleLeave}
              onMouseMove={onTitleMove}
            />
            <SubTitle line="design system" fontSize={subtitleSize} />
          </View>

          {/* Hidden probes — measured at the title font size so we can
              compute the subtitle size that makes "design system" render
              at exactly the same block-width as "field". */}
          <FitProbe
            text="field"
            fontSize={tSize}
            textRef={fieldProbeRef}
          />
          <FitProbe
            text="design system"
            fontSize={tSize}
            textRef={subtitleProbeRef}
          />

          {/* Version + horizontal rule — locked to the same width as the
              "design system" line above so the rule never overshoots. */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 13,
              paddingLeft: 6,
              width: titleW ?? undefined,
            }}
          >
            <Text
              style={{
                fontFamily: "Noontree-Medium",
                fontSize: 16,
                lineHeight: 20,
                letterSpacing: -0.15,
                color: palette.bodyVersion,
              }}
            >
              V 0.1
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: palette.divider,
              }}
            />
          </View>
        </View>

        {/* Spacer pushes the nav row to the lower part of the screen. */}
        <View style={{ flex: 1, minHeight: 80 }} />

        {/* Bottom — full-width 3-column nav with cursor-nav blur on hover. */}
        <CursorNav
          entries={ENTRIES}
          width={width}
          horizontalPad={horizontalPad}
          onPress={(key) => navigation.navigate(key as never)}
        />

        {/* Divider above the footer. */}
        <View
          style={{
            height: 1,
            backgroundColor: palette.divider,
            marginHorizontal: horizontalPad,
          }}
        />

        {/* Footer */}
        <View
          pointerEvents="none"
          style={{
            flexDirection: width >= 720 ? "row" : "column",
            justifyContent: "space-between",
            alignItems: width >= 720 ? "center" : "flex-start",
            gap: width >= 720 ? 0 : 4,
            paddingHorizontal: horizontalPad,
            paddingBottom: width >= 1100 ? 32 : 20,
            paddingTop: width >= 1100 ? 32 : 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Noontree-Medium",
              fontSize: width >= 720 ? 14 : 12,
              lineHeight: width >= 720 ? 18 : 16,
              letterSpacing: -0.15,
              color: palette.bodySecondary,
            }}
          >
            One source of truth from Figma to React Native
          </Text>
          <Text
            style={{
              fontFamily: "Noontree-Medium",
              fontSize: width >= 720 ? 14 : 12,
              lineHeight: width >= 720 ? 18 : 16,
              letterSpacing: -0.15,
              color: palette.bodySecondary,
            }}
          >
            curated by noon
          </Text>
        </View>
      </View>

      {/* Inverted-mode bloom — works in both modes. The veil renders the
          opposite theme (light-mode page → dark veil, dark-mode page →
          light veil), clipped to a circle that grows from the cursor.
          Inside, a duplicate of the "field" title sits on top of the
          underlying original so the two transition cleanly in place. */}
      <BloomOverlay
        mode={mode}
        active={bloomActive}
        cursor={cursor}
        titleRect={titleRect}
        titleFontSize={tSize}
      />
    </ScrollView>
  );
}

// ─────────── Hover bloom overlay ───────────

const PARTICLE_COUNT = 180;

function BloomOverlay({
  mode,
  active,
  cursor,
  titleRect,
  titleFontSize,
}: {
  mode: "light" | "dark";
  active: boolean;
  cursor: { x: number; y: number };
  titleRect: { x: number; y: number; w: number; h: number };
  titleFontSize: number;
}) {
  const radius = active ? 2600 : 0;
  const tracking = -titleFontSize * 0.04;
  if (Platform.OS !== "web") return null;
  // Bloom shows the opposite theme: light-mode page reveals dark, dark
  // reveals light. Particles flip color so they remain visible.
  const isInvertedDark = mode === "light";
  const veilBg = isInvertedDark ? "#000000" : "#ffffff";
  const particleColor = isInvertedDark ? "#ffffff" : "#1a2238";
  const titleGradient = isInvertedDark ? SILVER_GRADIENT : STEEL_GRADIENT;
  return (
    <View
      pointerEvents="none"
      // @ts-expect-error position: fixed and clip-path are web only
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: veilBg,
        clipPath: `circle(${radius}px at ${cursor.x}px ${cursor.y}px)`,
        WebkitClipPath: `circle(${radius}px at ${cursor.x}px ${cursor.y}px)`,
        transitionProperty: "clip-path, -webkit-clip-path",
        transitionDuration: "650ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        zIndex: 50,
      }}
    >
      <ParticleField count={PARTICLE_COUNT} color={particleColor} />

      {/* Inverted-mode duplicate of the "field" title — positioned over
          the underlying original so when the bloom passes the title
          bounds the user sees it flip from one finish to the other in
          place. */}
      <Text
        // @ts-expect-error web-only background-clip / animation props
        style={{
          position: "absolute",
          left: titleRect.x,
          top: titleRect.y,
          fontFamily: TITLE_FAMILY,
          fontSize: titleFontSize,
          lineHeight: titleFontSize * 0.9,
          letterSpacing: tracking,
          color: "transparent",
          backgroundImage: titleGradient,
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animationName: "metalTitleShimmer",
          animationDuration: "6s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          userSelect: "none",
        }}
      >
        field
      </Text>
    </View>
  );
}

function ParticleField({ count, color }: { count: number; color: string }) {
  // Generate particle props once per mount so the layout stays stable.
  // Each dot has a random position, size, animation duration and delay
  // so the field looks chaotic rather than periodic.
  const particles = useMemo(() => {
    const out: {
      key: number;
      left: string;
      top: string;
      size: number;
      delay: number;
      duration: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      out.push({
        key: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() < 0.7 ? 2 : Math.random() < 0.85 ? 3 : 4,
        delay: -Math.random() * 12,
        duration: 8 + Math.random() * 10,
        opacity: 0.4 + Math.random() * 0.5,
      });
    }
    return out;
  }, [count]);

  return (
    <>
      {particles.map((p) => (
        <View
          key={p.key}
          // @ts-expect-error CSS animation props pass through on rn-web
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: 9999,
            backgroundColor: color,
            opacity: p.opacity,
            animationName: "bloomParticleDrift",
            animationDuration: `${p.duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${p.delay}s`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </>
  );
}


/**
 * Hidden off-screen probe that lets a parent measure a string's rendered
 * width at a given font size. The parent passes a ref and reads
 * `getBoundingClientRect()` after mount — this works reliably even when
 * `onLayout` doesn't fire for offscreen Text on RN-Web.
 */
function FitProbe({
  text,
  fontSize,
  textRef,
}: {
  text: string;
  fontSize: number;
  textRef: React.Ref<Text>;
}) {
  if (Platform.OS !== "web") return null;
  return (
    <Text
      ref={textRef}
      pointerEvents="none"
      // @ts-expect-error offscreen positioning + whiteSpace are web only
      style={{
        position: "absolute",
        opacity: 0,
        top: -9999,
        left: -9999,
        whiteSpace: "nowrap",
        fontFamily: TITLE_FAMILY,
        fontSize,
        lineHeight: fontSize,
        letterSpacing: -fontSize * 0.04,
      }}
    >
      {text}
    </Text>
  );
}

// ─────────── Title sizing ───────────

// Fluid title size — scales linearly with viewport width to keep the same
// visual proportions as the Figma reference (200px @ 1024 viewport ≈
// 19.5% of vw). Clamped so it stays readable at extremes.
function titleSize(width: number) {
  return Math.max(56, Math.min(280, width * 0.195));
}

const TITLE_FAMILY = "Noontree-SemiBold";

/**
 * "design system" — sized to render at the same block-width as "field"
 * by measuring both at runtime. After the first paint we read the
 * "field" width and the subtitle's width-per-fontSize via `onLayout`
 * and lock the subtitle font size to whatever value makes its width
 * match the title's. The starting font size is a close empirical guess
 * so the post-paint adjustment is small.
 */
function SubTitle({
  line,
  fontSize,
}: {
  line: string;
  fontSize: number;
}) {
  const palette = useHomePalette();
  const tracking = -fontSize * 0.04;
  return (
    <Text
      style={{
        fontFamily: TITLE_FAMILY,
        fontSize,
        lineHeight: fontSize * 1,
        letterSpacing: tracking,
        color: palette.titleMuted,
        marginTop: Math.round(fontSize * 0.2),
        alignSelf: "flex-start",
      }}
    >
      {line}
    </Text>
  );
}

/**
 * "field" title. The glyphs are filled with a sweeping metal gradient via
 * `background-clip: text`. Two palettes ship: a silver gradient for dark
 * mode and a dark-steel gradient (anchored on the navy primary text
 * color) for light mode — both kept legible without any blend-mode
 * compromises that would harm contrast.
 *
 * Both gradients are symmetric (color at 0%, 50% and 100% match) so the
 * keyframe loops seamlessly. Native falls back to the regular solid
 * render. Title size scales fluidly with viewport width.
 */
function MetalTitle({
  line,
  width,
  textRef,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: {
  line: string;
  width: number;
  textRef?: React.Ref<Text>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: { nativeEvent: MouseEvent }) => void;
}) {
  const palette = useHomePalette();
  const { mode } = useTheme();
  const fontSize = titleSize(width);
  const tracking = -fontSize * 0.04;

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    if (document.getElementById(METAL_KEYFRAMES_ID)) return;
    const tag = document.createElement("style");
    tag.id = METAL_KEYFRAMES_ID;
    tag.textContent = METAL_KEYFRAMES_CSS;
    document.head.appendChild(tag);
  }, []);

  if (Platform.OS !== "web") {
    return (
      <Text
        ref={textRef}
        style={{
          fontFamily: TITLE_FAMILY,
          fontSize,
          lineHeight: fontSize * 0.9,
          letterSpacing: tracking,
          color: palette.titlePrimary,
          alignSelf: "flex-start",
        }}
      >
        {line}
      </Text>
    );
  }

  const gradient = mode === "dark" ? SILVER_GRADIENT : STEEL_GRADIENT;

  return (
    <Text
      ref={textRef}
      // @ts-expect-error onMouseEnter/Leave/Move pass through to the DOM
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      // @ts-expect-error web-only style props passed through to the DOM
      style={{
        fontFamily: TITLE_FAMILY,
        fontSize,
        lineHeight: fontSize * 0.9,
        letterSpacing: tracking,
        color: "transparent",
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animationName: "metalTitleShimmer",
        animationDuration: "6s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        alignSelf: "flex-start",
        // The bloom effect needs the title to receive pointer events
        // even though its parent is `pointerEvents="box-none"`.
        pointerEvents: "auto",
        // Keep the default arrow cursor — the I-beam that browsers apply
        // to selectable text would distract from the bloom effect.
        cursor: "default",
        userSelect: "none",
      }}
    >
      {line}
    </Text>
  );
}

// ─────────── Bottom row: cursor-nav ───────────

/**
 * Three-column nav anchored to the bottom of the page. Hover behaviour
 * borrowed from https://experiments.thisiswhitespace.com/cursor-nav:
 * hovering one column blurs the other two so attention follows the
 * cursor. Vertical dividers separate the columns.
 */
function CursorNav({
  entries,
  width,
  horizontalPad,
  onPress,
}: {
  entries: Entry[];
  width: number;
  horizontalPad: number;
  onPress: (key: keyof RootStackParamList) => void;
}) {
  const palette = useHomePalette();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const isRow = width >= 720;

  return (
    <View
      style={{
        flexDirection: isRow ? "row" : "column",
        alignItems: "stretch",
        paddingHorizontal: horizontalPad,
        paddingBottom: width >= 1100 ? 80 : width >= 720 ? 60 : 40,
        gap: 0,
      }}
    >
      {entries.map((entry, i) => (
        <View
          key={entry.key}
          style={{
            flex: isRow ? 1 : undefined,
            flexDirection: "row",
            alignItems: "stretch",
          }}
        >
          {isRow && i > 0 ? (
            <View
              style={{
                width: 1,
                alignSelf: "stretch",
                backgroundColor: palette.divider,
                marginHorizontal: width >= 1100 ? 32 : 20,
              }}
            />
          ) : null}
          <View style={{ flex: 1 }}>
            <NavCol
              entry={entry}
              index={i}
              width={width}
              dimmed={hoverIdx !== null && hoverIdx !== i}
              onHoverIn={() => setHoverIdx(i)}
              onHoverOut={() =>
                setHoverIdx((prev) => (prev === i ? null : prev))
              }
              onPress={() => onPress(entry.key)}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function NavCol({
  entry,
  index,
  width,
  dimmed,
  onHoverIn,
  onHoverOut,
  onPress,
}: {
  entry: Entry;
  index: number;
  width: number;
  dimmed: boolean;
  onHoverIn: () => void;
  onHoverOut: () => void;
  onPress: () => void;
}) {
  const palette = useHomePalette();
  const desktop = width >= 1100;
  // Per the Figma: 48px Regular for the menu titles. Scales down on
  // narrower viewports so the row still fits without wrapping.
  const titleFontSize = desktop ? 48 : width >= 720 ? 40 : 32;
  const titleLine = Math.round(titleFontSize * 1.1);
  const blurbSize = desktop ? 14 : 13;
  const blurbLine = desktop ? 20 : 18;
  const numberLabel = String(index + 1).padStart(2, "0");
  const numberFromTop = Math.round(titleLine * 0.22);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      accessibilityRole="button"
      accessibilityLabel={entry.title}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexDirection: "column",
        alignItems: "flex-start",
        paddingVertical: width >= 720 ? 12 : 18,
        opacity: pressed ? 0.85 : 1,
        transform: [{ translateY: hovered ? -2 : 0 }],
        // @ts-expect-error filter passes through to DOM on rn-web
        filter: dimmed ? "blur(4px)" : "blur(0px)",
        // @ts-expect-error rn-web passes CSS transition props through
        transitionProperty: "filter, transform, opacity",
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <Text
          style={{
            fontFamily: "Noontree-Medium",
            fontSize: desktop ? 14 : 12,
            lineHeight: desktop ? 18 : 16,
            letterSpacing: 0.4,
            color: palette.bodySecondary,
            paddingTop: numberFromTop,
          }}
        >
          {numberLabel}
        </Text>
        <Text
          style={{
            fontFamily: "Noontree-Regular",
            fontSize: titleFontSize,
            lineHeight: titleLine,
            letterSpacing: -titleFontSize * 0.025,
            color: palette.bodyPrimary,
          }}
        >
          {entry.title}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Noontree-Medium",
          fontSize: blurbSize,
          lineHeight: blurbLine,
          letterSpacing: -0.15,
          color: palette.bodySecondary,
          marginTop: 8,
          paddingLeft: desktop ? 26 : 20,
        }}
      >
        {entry.blurb}
      </Text>
    </Pressable>
  );
}
