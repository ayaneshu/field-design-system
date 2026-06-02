import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

// Column count for the illustration grid — tuned so cards stay ~200–240px wide
// at every breakpoint, matching the swatch grid on the colours page.
function illustrationGridColumns(width: number): number {
  if (width >= 1600) return 6;
  if (width >= 1280) return 5;
  if (width >= 960) return 4;
  if (width >= 720) return 3;
  return 2;
}
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { CopyToast } from "../components/CopyToast";
import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { useCopy } from "../hooks/useCopy";
import {
  illustrationBrands,
  illustrations,
  type Illustration,
  type IllustrationBrand,
} from "../data/illustrations";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Illustrations">;
type Tab = "library" | "playground";

export function IllustrationsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>("library");
  const { toast, copy } = useCopy();

  // Retain the L0 Foundations rail and slot the Library / Playground sub-tabs
  // *under* "Illustrations" as indented L1 entries. "Illustrations" is now a
  // collapsible parent — clicking the row toggles its chevron and shows /
  // hides Library and Playground beneath it (the shared Sidebar component
  // handles the expand/collapse + chevron). L0 and L1 each sorted A–Z.
  const sidebar: SidebarItem[] = [
    { key: "all", label: "Foundations", dividerAfter: true },
    { key: "colors", label: "Colours" },
    { key: "icons", label: "Icons" },
    {
      key: "illustrations",
      label: "Illustrations",
      collapsible: true,
      // Mark active so the parent row keeps the highlighted state while we
      // sit on this page; the child rows still drive their own active state
      // via the `tab` prop below.
      active: true,
    },
    { key: "library", label: "Library", indent: true, active: tab === "library" },
    { key: "playground", label: "Playground", indent: true, active: tab === "playground" },
    { key: "radius", label: "Radius" },
    { key: "spacing", label: "Spacing" },
    { key: "typography", label: "Typography" },
  ];
  // L0 entries are alphabetised (Colours, Icons, Illustrations, Radius,
  // Spacing, Typography); the Library / Playground L1 sub-tabs sit under
  // their parent.

  return (
    <View style={{ flex: 1, backgroundColor: colour.surface.primary }}>
      <PageScaffold
        topNavActive="Foundations"
        title="illustrations"
        subtitle="Brand illustrations from the noon system. Pick a brand, tune hue & saturation, copy any piece — or compose a scene in the playground."
        sidebar={sidebar}
        onSidebarSelect={(key) => {
          if (key === "library" || key === "playground") {
            setTab(key as Tab);
            return;
          }
          if (key === "illustrations") return; // already here
          if (key === "all") {
            navigation.navigate("Foundations" as never);
            return;
          }
          // Jump to a sibling foundation section.
          navigation.navigate("Foundations" as never, { section: key } as never);
        }}
      >
        {tab === "library" ? <Library copy={copy} /> : <Playground copy={copy} />}
      </PageScaffold>
      <CopyToast message={toast} />
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={active ? { selected: true } : {}}
      style={({ pressed }) => ({
        paddingHorizontal: space["14"],
        paddingVertical: space["8"],
        borderRadius: radius.rounded,
        backgroundColor: active ? colour.surface.primary : "transparent",
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Text
        style={[
          textStyles.B12_SemiBold,
          {
            color: active
              ? colour["text-n-icon"].primary
              : colour["text-n-icon"].tertiary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─────────── Library ───────────

function Library({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const { width: vw } = useWindowDimensions();
  const cols = illustrationGridColumns(vw);
  const [brand, setBrand] = useState<IllustrationBrand>("base");
  const [hue, setHue] = useState(0); // -180 .. 180
  const [sat, setSat] = useState(100); // 0 .. 200
  const [bright, setBright] = useState(100); // 50 .. 150
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return illustrations.filter(
      (il) => il.brand === brand && (!q || il.name.includes(q)),
    );
  }, [brand, query]);

  const filterStyle = useMemo<Record<string, string>>(
    () => ({
      filter: `hue-rotate(${hue}deg) saturate(${sat}%) brightness(${bright}%)`,
    }),
    [hue, sat, bright],
  );

  return (
    <View>
      {/* Brand pills */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: space["6"],
          marginBottom: space["20"],
        }}
      >
        {illustrationBrands.map((b) => (
          <Pressable
            key={b}
            onPress={() => setBrand(b)}
            accessibilityRole="button"
            accessibilityState={b === brand ? { selected: true } : {}}
            style={({ pressed }) => ({
              paddingHorizontal: space["12"],
              paddingVertical: space["8"],
              borderRadius: radius.rounded,
              backgroundColor:
                b === brand
                  ? colour["text-n-icon"].primary
                  : colour.surface.secondary,
              borderWidth: 1,
              borderColor:
                b === brand
                  ? colour["text-n-icon"].primary
                  : colour.border.subtle,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Text
              style={[
                textStyles.B12_SemiBold,
                {
                  color:
                    b === brand
                      ? colour["text-n-icon"]["on-surface-bold"]
                      : colour["text-n-icon"].primary,
                },
              ]}
            >
              {b}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* HSB controls */}
      <View
        style={{
          padding: space["20"],
          borderRadius: radius["16"],
          backgroundColor: colour.surface.secondary,
          borderWidth: 1,
          borderColor: colour.border.subtle,
          marginBottom: space["20"],
          gap: space["16"],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 1.4,
              },
            ]}
          >
            Hue · Saturation · Brightness
          </Text>
          <Pressable
            onPress={() => {
              setHue(0);
              setSat(100);
              setBright(100);
            }}
            // @ts-expect-error — hover is web-only
            style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: space["6"],
              paddingHorizontal: space["10"],
              paddingVertical: space["6"],
              borderRadius: radius.rounded,
              backgroundColor: hovered
                ? colour.surface.tertiary
                : colour.surface.primary,
              borderWidth: 1,
              borderColor: colour.border.subtle,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Icon
              name="system-refresh"
              size={12}
              color={colour["text-n-icon"].primary}
            />
            <Text
              style={[
                textStyles.B11_SemiBold,
                { color: colour["text-n-icon"].primary },
              ]}
            >
              Reset
            </Text>
          </Pressable>
        </View>
        <View style={{ gap: space["14"] }}>
          <Slider label="Hue" min={-180} max={180} value={hue} onChange={setHue} suffix="°" />
          <Slider label="Saturation" min={0} max={200} value={sat} onChange={setSat} suffix="%" />
          <Slider
            label="Brightness"
            min={50}
            max={150}
            value={bright}
            onChange={setBright}
            suffix="%"
          />
        </View>
      </View>

      {/* Search + count */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["12"],
          marginBottom: space["16"],
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: space["10"],
            paddingHorizontal: space["14"],
            paddingVertical: space["10"],
            borderRadius: radius.rounded,
            backgroundColor: colour.surface.secondary,
            borderWidth: 1,
            borderColor: colour.border.subtle,
          }}
        >
          <Icon name="system-search" size={16} color={colour["text-n-icon"].tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search illustrations…"
            placeholderTextColor={colour["text-n-icon"].muted}
            // @ts-expect-error — outlineStyle is web-only
            style={[
              textStyles.B14_Regular,
              {
                flex: 1,
                color: colour["text-n-icon"].primary,
                paddingVertical: 0,
                outlineStyle: "none",
              },
            ]}
          />
        </View>
        <Text
          style={[
            textStyles.B11_SemiBold,
            {
              color: colour["text-n-icon"].tertiary,
              textTransform: "uppercase",
              letterSpacing: 1.4,
            },
          ]}
        >
          {list.length} pieces
        </Text>
      </View>

      {/* Grid */}
      {Platform.OS === "web"
        ? React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: 16,
              },
            },
            list.map((il) =>
              React.createElement(IllustrationCard, {
                key: il.id,
                illustration: il,
                filterStyle,
                onCopy: copy,
              }),
            ),
          )
        : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: space["16"],
            }}
          >
            {list.map((il) => (
              <IllustrationCard
                key={il.id}
                illustration={il}
                filterStyle={filterStyle}
                onCopy={copy}
              />
            ))}
          </View>
        )}
    </View>
  );
}

// Inject custom range-input styling once for the whole module. Using a tagged
// className lets us style the track + thumb consistently across browsers — the
// default `accentColor` only paints the filled portion and ignores the thumb.
const SLIDER_CSS = `
.fds-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  background: transparent;
  cursor: pointer;
  margin: 0;
  padding: 0;
}
.fds-slider:focus { outline: none; }
.fds-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: var(--fds-slider-fill, #1d2539);
}
.fds-slider::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(29, 37, 57, 0.12);
}
.fds-slider::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: #1d2539;
}
.fds-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
  border: 2px solid #1d2539;
  margin-top: -6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18), 0 0 0 0 rgba(29, 37, 57, 0.0);
  transition: box-shadow 120ms ease, transform 120ms ease;
}
.fds-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
  border: 2px solid #1d2539;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: box-shadow 120ms ease, transform 120ms ease;
}
.fds-slider:hover::-webkit-slider-thumb {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(29, 37, 57, 0.08);
}
.fds-slider:hover::-moz-range-thumb {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(29, 37, 57, 0.08);
}
.fds-slider:active::-webkit-slider-thumb { transform: scale(1.05); }
.fds-slider:active::-moz-range-thumb { transform: scale(1.05); }
`;

let sliderStylesInjected = false;
function ensureSliderStyles() {
  if (Platform.OS !== "web" || sliderStylesInjected) return;
  if (typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.setAttribute("data-fds-slider", "");
  tag.appendChild(document.createTextNode(SLIDER_CSS));
  document.head.appendChild(tag);
  sliderStylesInjected = true;
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  suffix,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  ensureSliderStyles();
  // Pre-compute the % fill so we can paint a gradient on the WebKit track —
  // -moz-range-progress handles this natively in Firefox.
  const pct = ((value - min) / (max - min)) * 100;
  const fill = `linear-gradient(to right, #1d2539 0%, #1d2539 ${pct}%, rgba(29, 37, 57, 0.12) ${pct}%, rgba(29, 37, 57, 0.12) 100%)`;

  const labelEl = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text
        style={[
          textStyles.B12_SemiBold,
          { color: colour["text-n-icon"].secondary },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          textStyles.B12_SemiBold,
          {
            color: colour["text-n-icon"].primary,
            fontVariant: ["tabular-nums"],
            paddingHorizontal: space["8"],
            paddingVertical: 2,
            borderRadius: radius.rounded,
            backgroundColor: colour.surface.primary,
            borderWidth: 1,
            borderColor: colour.border.subtle,
            overflow: "hidden",
          },
        ]}
      >
        {value}
        {suffix ?? ""}
      </Text>
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <View>
        {labelEl}
        {React.createElement("input", {
          type: "range",
          min,
          max,
          value,
          className: "fds-slider",
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(Number(e.target.value)),
          style: {
            // CSS custom prop drives the WebKit track gradient.
            ["--fds-slider-fill" as never]: fill,
          },
        })}
      </View>
    );
  }
  // Native fallback — shows the static track; would need react-native-community/slider for drag.
  return (
    <View>
      {labelEl}
      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: colour.surface.muted,
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 3,
            backgroundColor: colour["text-n-icon"].primary,
          }}
        />
      </View>
    </View>
  );
}

function IllustrationCard({
  illustration,
  filterStyle,
  onCopy,
}: {
  illustration: Illustration;
  filterStyle: Record<string, string>;
  onCopy: (text: string, label?: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onCopy(illustration.svg, `svg · ${illustration.name}`)}
      accessibilityRole="button"
      accessibilityLabel={`Copy SVG ${illustration.name}`}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        // On web the card sits inside a CSS grid cell, so it should fill the
        // cell. On native we fall back to flex wrap with a sensible basis.
        flexGrow: 1,
        flexBasis: Platform.OS === "web" ? 0 : 200,
        width: Platform.OS === "web" ? "100%" : undefined,
        minWidth: 0,
        borderRadius: radius["16"],
        backgroundColor: colour.surface.primary,
        borderWidth: 1,
        borderColor: hovered ? colour.border.medium : colour.border.subtle,
        overflow: "hidden",
        opacity: pressed ? 0.92 : 1,
        transform: [{ translateY: hovered ? -2 : 0 }],
        transitionProperty: "border-color, transform, box-shadow",
        transitionDuration: "160ms",
        boxShadow: hovered
          ? "0 6px 16px rgba(29, 37, 57, 0.08)"
          : "0 0 0 rgba(0,0,0,0)",
      })}
    >
      <View
        style={{
          aspectRatio: 1,
          backgroundColor: colour.surface.secondary,
          alignItems: "center",
          justifyContent: "center",
          padding: space["20"],
        }}
      >
        <SvgInline svg={illustration.svg} filterStyle={filterStyle} />
      </View>
      <View
        style={{
          padding: space["12"],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space["8"],
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={[
              textStyles.B14_SemiBold,
              { color: colour["text-n-icon"].primary },
            ]}
          >
            {illustration.name}
          </Text>
          <Text
            style={[
              textStyles.B11_Regular,
              { color: colour["text-n-icon"].tertiary, marginTop: 1 },
            ]}
          >
            {illustration.brand}
          </Text>
        </View>
        <Icon name="system-copy" size={14} color={colour["text-n-icon"].tertiary} />
      </View>
    </Pressable>
  );
}

/** Renders raw SVG string. Web uses dangerouslySetInnerHTML for native filter support;
 *  on native it falls back to a placeholder block. */
function SvgInline({
  svg,
  filterStyle,
  size = "100%",
}: {
  svg: string;
  filterStyle?: Record<string, string>;
  size?: number | string;
}) {
  if (Platform.OS !== "web") {
    return (
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: colour.surface.muted,
          borderRadius: 8,
        }}
      />
    );
  }
  return React.createElement("div", {
    style: {
      width: size,
      aspectRatio: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...(filterStyle ?? {}),
      transition: "filter 120ms linear",
    },
    dangerouslySetInnerHTML: { __html: makeSvgFlexible(svg) },
  });
}

/**
 * Strip fixed width/height attrs from SVG markup so it scales to its container.
 * Preserves the `viewBox` so aspect is maintained.
 */
function makeSvgFlexible(svg: string): string {
  return svg
    .replace(/<svg([^>]*)\swidth="[^"]*"/i, "<svg$1")
    .replace(/<svg([^>]*)\sheight="[^"]*"/i, "<svg$1")
    .replace(
      /<svg([^>]*)>/i,
      '<svg$1 width="100%" height="100%" preserveAspectRatio="xMidYMid meet">',
    );
}

// ─────────── Playground ───────────

type PlacedItem = {
  uid: string;
  illustrationId: string;
  x: number; // 0..1 of canvas width
  y: number; // 0..1 of canvas height
  scale: number;
};

function Playground({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const { width: vw } = useWindowDimensions();
  const sidebarWide = vw >= 900;

  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [bg, setBg] = useState<string>(colour.surface.secondary);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });
  const [selected, setSelected] = useState<string | null>(null);

  // Track canvas size for accurate placement maths.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const addItem = (illustrationId: string) => {
    setPlaced((prev) => [
      ...prev,
      {
        uid: `${illustrationId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        illustrationId,
        x: 0.4 + Math.random() * 0.2,
        y: 0.4 + Math.random() * 0.2,
        scale: 1,
      },
    ]);
  };

  const updateItem = (uid: string, patch: Partial<PlacedItem>) => {
    setPlaced((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, ...patch } : p)),
    );
  };

  const removeItem = (uid: string) => {
    setPlaced((prev) => prev.filter((p) => p.uid !== uid));
    if (selected === uid) setSelected(null);
  };

  const clear = () => {
    setPlaced([]);
    setSelected(null);
  };

  const copyComposition = () => {
    const compositionSvg = buildCompositionSvg(placed, canvasSize, bg);
    copy(compositionSvg, "playground · composition svg");
  };

  return (
    <View
      style={{
        flexDirection: sidebarWide ? "row" : "column",
        gap: space["20"],
      }}
    >
      {/* Sidebar — illustration palette */}
      <View
        style={{
          flexBasis: sidebarWide ? 280 : undefined,
          flexShrink: 0,
        }}
      >
        <Text
          style={[
            textStyles.B11_SemiBold,
            {
              color: colour["text-n-icon"].tertiary,
              textTransform: "uppercase",
              letterSpacing: 1.4,
              marginBottom: space["12"],
            },
          ]}
        >
          Drag in pieces
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: space["8"],
            maxHeight: sidebarWide ? 540 : 280,
            overflow: "scroll" as never,
          }}
        >
          {illustrations
            .filter((i) => i.brand === "base")
            .map((il) => (
              <Pressable
                key={il.id}
                onPress={() => addItem(il.id)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${il.name}`}
                // @ts-expect-error hover
                style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
                  width: 76,
                  height: 76,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: space["8"],
                  borderRadius: radius["8"],
                  borderWidth: 1,
                  borderColor: hovered ? colour.border.medium : colour.border.subtle,
                  backgroundColor: hovered
                    ? colour.surface.secondary
                    : colour.surface.primary,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <SvgInline svg={il.svg} />
              </Pressable>
            ))}
        </View>

        <View
          style={{
            marginTop: space["20"],
            padding: space["12"],
            borderRadius: radius["12"],
            backgroundColor: colour.surface.secondary,
            borderWidth: 1,
            borderColor: colour.border.subtle,
          }}
        >
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 1.4,
                marginBottom: space["8"],
              },
            ]}
          >
            Canvas background
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {[
              colour.surface.primary,
              colour.surface.secondary,
              colour.surface.tertiary,
              colour.surface["yellow-subtle"],
              colour.surface["action-subtle"],
              colour.surface["brand-primary"],
              colour["text-n-icon"].primary,
            ].map((c) => (
              <Pressable
                key={c}
                onPress={() => setBg(c)}
                accessibilityRole="button"
                accessibilityLabel={`Background ${c}`}
                style={({ pressed }) => ({
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: c,
                  borderWidth: bg === c ? 2 : 1,
                  borderColor:
                    bg === c
                      ? colour["text-n-icon"].primary
                      : colour.border.medium,
                  opacity: pressed ? 0.85 : 1,
                })}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Canvas */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: space["12"],
          }}
        >
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 1.4,
              },
            ]}
          >
            {placed.length} {placed.length === 1 ? "piece" : "pieces"} placed
          </Text>
          <View style={{ flexDirection: "row", gap: space["8"] }}>
            <Pressable
              onPress={clear}
              style={({ pressed }) => ({
                paddingHorizontal: space["12"],
                paddingVertical: space["8"],
                borderRadius: radius.rounded,
                backgroundColor: colour.surface.secondary,
                borderWidth: 1,
                borderColor: colour.border.subtle,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={[
                  textStyles.B12_SemiBold,
                  { color: colour["text-n-icon"].primary },
                ]}
              >
                Clear
              </Text>
            </Pressable>
            <Pressable
              onPress={copyComposition}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: space["6"],
                paddingHorizontal: space["12"],
                paddingVertical: space["8"],
                borderRadius: radius.rounded,
                backgroundColor: colour["text-n-icon"].primary,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Icon name="system-copy" size={12} color={colour.surface.primary} />
              <Text
                style={[
                  textStyles.B12_SemiBold,
                  { color: colour["text-n-icon"]["on-surface-bold"] },
                ]}
              >
                Copy SVG
              </Text>
            </Pressable>
          </View>
        </View>

        <PlaygroundCanvas
          canvasRef={canvasRef}
          bg={bg}
          placed={placed}
          selected={selected}
          onSelect={setSelected}
          onUpdate={updateItem}
          onRemove={removeItem}
        />

        {selected ? (
          <SelectionInspector
            placed={placed.find((p) => p.uid === selected)}
            onUpdate={(patch) => selected && updateItem(selected, patch)}
            onRemove={() => selected && removeItem(selected)}
          />
        ) : (
          <Text
            style={[
              textStyles.B12_Regular,
              {
                color: colour["text-n-icon"].tertiary,
                marginTop: space["12"],
              },
            ]}
          >
            Click a piece to select. Drag to reposition. Use the inspector to scale or remove.
          </Text>
        )}
      </View>
    </View>
  );
}

function PlaygroundCanvas({
  canvasRef,
  bg,
  placed,
  selected,
  onSelect,
  onUpdate,
  onRemove,
}: {
  canvasRef: React.MutableRefObject<HTMLDivElement | null>;
  bg: string;
  placed: PlacedItem[];
  selected: string | null;
  onSelect: (uid: string | null) => void;
  onUpdate: (uid: string, patch: Partial<PlacedItem>) => void;
  onRemove: (uid: string) => void;
}) {
  if (Platform.OS !== "web") {
    return (
      <View
        style={{
          height: 480,
          borderRadius: radius["16"],
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: colour.border.subtle,
        }}
      />
    );
  }
  return React.createElement("div", {
    ref: canvasRef,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onSelect(null);
    },
    style: {
      position: "relative",
      width: "100%",
      height: 540,
      borderRadius: 16,
      background: bg,
      border: `1px solid ${colour.border.subtle}`,
      overflow: "hidden",
      cursor: "default",
      // backdrop pattern of dots for depth
      backgroundImage:
        "radial-gradient(circle at 1px 1px, rgba(29,37,57,0.08) 1px, transparent 0)",
      backgroundSize: "24px 24px",
      backgroundColor: bg,
    },
    children: placed.map((p) =>
      React.createElement(PlacedItemView, {
        key: p.uid,
        item: p,
        selected: selected === p.uid,
        canvasRef,
        onSelect,
        onUpdate,
        onRemove,
      }),
    ),
  });
}

function PlacedItemView({
  item,
  selected,
  canvasRef,
  onSelect,
  onUpdate,
  onRemove,
}: {
  item: PlacedItem;
  selected: boolean;
  canvasRef: React.MutableRefObject<HTMLDivElement | null>;
  onSelect: (uid: string | null) => void;
  onUpdate: (uid: string, patch: Partial<PlacedItem>) => void;
  onRemove: (uid: string) => void;
}) {
  const il = useMemo(
    () => illustrations.find((x) => x.id === item.illustrationId),
    [item.illustrationId],
  );
  if (!il) return null;
  const sizePx = 120 * item.scale;

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.uid);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCx = item.x;
    const startCy = item.y;

    const move = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) / rect.width;
      const dy = (ev.clientY - startY) / rect.height;
      onUpdate(item.uid, {
        x: Math.max(0.02, Math.min(0.98, startCx + dx)),
        y: Math.max(0.02, Math.min(0.98, startCy + dy)),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return React.createElement("div", {
    onMouseDown,
    style: {
      position: "absolute",
      left: `${item.x * 100}%`,
      top: `${item.y * 100}%`,
      transform: `translate(-50%, -50%)`,
      width: sizePx,
      height: sizePx,
      cursor: "grab",
      userSelect: "none",
      boxShadow: selected
        ? `0 0 0 2px ${colour.surface["brand-primary"]}, 0 0 0 3px ${colour["text-n-icon"].primary}`
        : "none",
      borderRadius: 8,
    },
    children: [
      React.createElement("div", {
        key: "svg",
        style: { width: "100%", height: "100%", pointerEvents: "none" },
        dangerouslySetInnerHTML: { __html: makeSvgFlexible(il.svg) },
      }),
      selected
        ? React.createElement("button", {
            key: "del",
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              onRemove(item.uid);
            },
            "aria-label": "Remove piece",
            style: {
              position: "absolute",
              top: -10,
              right: -10,
              width: 22,
              height: 22,
              borderRadius: 11,
              border: "none",
              background: colour["text-n-icon"].primary,
              color: "#fff",
              fontSize: 14,
              lineHeight: "22px",
              cursor: "pointer",
              padding: 0,
            },
            children: "×",
          })
        : null,
    ],
  });
}

function SelectionInspector({
  placed,
  onUpdate,
  onRemove,
}: {
  placed: PlacedItem | undefined;
  onUpdate: (patch: Partial<PlacedItem>) => void;
  onRemove: () => void;
}) {
  if (!placed) return null;
  return (
    <View
      style={{
        marginTop: space["12"],
        padding: space["12"],
        borderRadius: radius["12"],
        backgroundColor: colour.surface.secondary,
        borderWidth: 1,
        borderColor: colour.border.subtle,
        flexDirection: "row",
        alignItems: "center",
        gap: space["12"],
        flexWrap: "wrap",
      }}
    >
      <Text
        style={[
          textStyles.B12_SemiBold,
          { color: colour["text-n-icon"].primary },
        ]}
      >
        Selected
      </Text>
      <View style={{ flex: 1, minWidth: 200 }}>
        <Slider
          label="Scale"
          min={50}
          max={300}
          value={Math.round(placed.scale * 100)}
          onChange={(v) => onUpdate({ scale: v / 100 })}
          suffix="%"
        />
      </View>
      <Pressable
        onPress={onRemove}
        style={({ pressed }) => ({
          paddingHorizontal: space["12"],
          paddingVertical: space["8"],
          borderRadius: radius.rounded,
          backgroundColor: colour.surface["error-subtle"],
          borderWidth: 1,
          borderColor: colour.surface["error-bold"],
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          style={[
            textStyles.B12_SemiBold,
            { color: colour.surface["error-bold"] },
          ]}
        >
          Remove
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Build a single SVG document from the placed items. Each item is wrapped in a
 * <g> with a translate + scale transform; the source SVG's children are
 * extracted (we strip the wrapper <svg> tag) and re-emitted.
 */
function buildCompositionSvg(
  placed: PlacedItem[],
  canvas: { w: number; h: number },
  bg: string,
): string {
  const W = Math.round(canvas.w);
  const H = Math.round(canvas.h);
  const pieces = placed.map((p, idx) => {
    const il = illustrations.find((x) => x.id === p.illustrationId);
    if (!il) return "";
    const inner = extractSvgInner(il.svg);
    const viewBox = extractViewBox(il.svg) ?? { w: 400, h: 400 };
    const placedSize = 120 * p.scale; // matches preview
    const cx = p.x * W;
    const cy = p.y * H;
    const sx = placedSize / viewBox.w;
    const sy = placedSize / viewBox.h;
    return [
      `  <g id="piece-${idx}" transform="translate(${(cx - placedSize / 2).toFixed(1)} ${(cy - placedSize / 2).toFixed(1)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})">`,
      inner,
      `  </g>`,
    ].join("\n");
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
    `  <rect width="100%" height="100%" fill="${bg}"/>`,
    ...pieces,
    `</svg>`,
  ].join("\n");
}

function extractSvgInner(svg: string): string {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return m ? m[1].trim() : svg;
}

function extractViewBox(svg: string): { w: number; h: number } | null {
  const m = svg.match(/viewBox="\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*"/i);
  if (!m) return null;
  return { w: parseFloat(m[3]), h: parseFloat(m[4]) };
}
