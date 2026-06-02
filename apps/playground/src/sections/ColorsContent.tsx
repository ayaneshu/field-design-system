import { useMemo } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import { base, colour, radius, space, textStyles } from "@field-ds/tokens";

import { type ViewMode } from "../components/ViewToggle";
import { useShell } from "../theme/ThemeContext";
import {
  hexToRgb,
  rgbToCmyk,
  tintedInkOn,
} from "../utils/color";

// Column count for the swatch grid. Tuned so cells stay ~160–200px wide on
// every breakpoint — keeps the swatches a consistent rectangle instead of
// stretching the last row.
function gridColumns(width: number): number {
  if (width >= 1600) return 6;
  if (width >= 1280) return 5;
  if (width >= 960) return 4;
  if (width >= 720) return 3;
  return 2;
}
const GRID_GAP = 20;

type Entry = { name: string; hex: string };
type Group = { title: string; entries: Entry[] };

export function ColorsContent({
  copy,
  view,
}: {
  copy: (text: string, label?: string) => void;
  /**
   * View mode is owned by the parent screen so the Grid / List toggle can sit
   * in the page-header right slot (matches the Figma colours layout).
   */
  view: ViewMode;
}) {
  const semantic: Group[] = useMemo(
    () =>
      (Object.entries(colour) as [keyof typeof colour, Record<string, string>][]).map(
        ([group, slots]) => ({
          title: String(group),
          entries: Object.entries(slots).map(([name, hex]) => ({ name, hex })),
        }),
      ),
    [],
  );

  const baseGroups: Group[] = useMemo(
    () =>
      Object.entries(base.colour).map(([name, shades]) => ({
        title: String(name),
        entries: Object.entries(shades).map(([shade, hex]) => ({
          name: shade,
          hex: hex as string,
        })),
      })),
    [],
  );

  return (
    <View>
      {/* ─────────── Semantics ─────────── */}
      <SectionHeading>Semantics</SectionHeading>
      <View style={{ marginTop: space["32"], gap: space["48"] }}>
        {semantic.map((g) => (
          <Block key={g.title} group={g} view={view} onCopy={copy} />
        ))}
      </View>

      {/* ─────────── Base palettes ─────────── */}
      <View style={{ marginTop: space["72"] }}>
        <SectionHeading>Base palettes</SectionHeading>
        <View style={{ marginTop: space["32"], gap: space["48"] }}>
          {baseGroups.map((g) => (
            <Block key={g.title} group={g} view={view} onCopy={copy} />
          ))}
        </View>
      </View>
    </View>
  );
}

function Block({
  group,
  view,
  onCopy,
}: {
  group: Group;
  view: ViewMode;
  onCopy: (text: string, label?: string) => void;
}) {
  const shell = useShell();
  return (
    <View>
      <Text
        style={[
          textStyles.B16_Bold,
          { color: shell.textPrimary },
        ]}
      >
        {group.title}
      </Text>
      <Text
        style={[
          textStyles.B12_Regular,
          {
            color: shell.textTertiary,
            marginTop: space["4"],
          },
        ]}
      >
        {group.entries.length} {group.entries.length === 1 ? "token" : "tokens"}
      </Text>
      <View style={{ marginTop: space["20"] }}>
        {view === "grid" ? (
          <SwatchGrid entries={group.entries} onCopy={onCopy} />
        ) : (
          <SwatchList entries={group.entries} onCopy={onCopy} />
        )}
      </View>
    </View>
  );
}

// ─────────── Grid: simple swatch + name + hex (matches Figma) ───────────

function SwatchGrid({
  entries,
  onCopy,
}: {
  entries: Entry[];
  onCopy: (text: string, label?: string) => void;
}) {
  const { width } = useWindowDimensions();
  const cols = gridColumns(width);
  // Width % per cell — fixed by column count, not by content. Subtracting
  // out the gap keeps every cell exactly the same width and stops the last
  // row stretching to fill leftover space.
  const cellWidth = `calc((100% - ${(cols - 1) * GRID_GAP}px) / ${cols})`;

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GRID_GAP,
      }}
    >
      {entries.map((e) => (
        <SwatchCard
          key={e.name}
          entry={e}
          onCopy={onCopy}
          cellWidth={cellWidth}
        />
      ))}
    </View>
  );
}

function SwatchCard({
  entry,
  onCopy,
  cellWidth,
}: {
  entry: Entry;
  onCopy: (text: string, label?: string) => void;
  cellWidth: string;
}) {
  return (
    <Pressable
      onPress={() => onCopy(entry.hex)}
      accessibilityRole="button"
      accessibilityLabel={`Copy ${entry.hex}`}
      // @ts-expect-error — RN Web hover support
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: cellWidth as never,
        flexGrow: 0,
        flexShrink: 0,
        opacity: pressed ? 0.92 : 1,
        transform: [{ translateY: hovered ? -2 : 0 }],
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "transform",
        transitionDuration: "180ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      })}
    >
      {/* Swatch tile — fixed 100px tall, full cell width. */}
      <View
        style={{
          width: "100%",
          height: 100,
          borderRadius: radius["4"],
          backgroundColor: entry.hex,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
        }}
      />
      <SwatchMeta name={entry.name} hex={entry.hex} />
    </Pressable>
  );
}

function SwatchMeta({ name, hex }: { name: string; hex: string }) {
  const shell = useShell();
  return (
    <>
      <Text
        numberOfLines={1}
        style={[
          textStyles.B14_Bold,
          { color: shell.textPrimary, marginTop: space["12"] },
        ]}
      >
        {name}
      </Text>
      <Text
        style={[
          textStyles.B12_Regular,
          {
            color: shell.textTertiary,
            marginTop: space["2"],
            fontVariant: ["tabular-nums"],
          },
        ]}
      >
        {hex.toLowerCase()}
      </Text>
    </>
  );
}

// ─────────── List view ───────────

function SwatchList({
  entries,
  onCopy,
}: {
  entries: Entry[];
  onCopy: (text: string, label?: string) => void;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colour.border.subtle,
        borderRadius: radius["12"],
        overflow: "hidden",
      }}
    >
      {entries.map((e, i) => {
        const rgb = hexToRgb(e.hex);
        const cmyk = rgbToCmyk(rgb);
        return (
          <Pressable
            key={e.name}
            onPress={() => onCopy(e.hex)}
            accessibilityRole="button"
            accessibilityLabel={`Copy ${e.hex}`}
            // @ts-expect-error — RN Web hover support
            style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: space["16"],
              paddingHorizontal: space["16"],
              paddingVertical: space["14"],
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: colour.border.subtle,
              backgroundColor: hovered ? colour.surface.secondary : colour.surface.primary,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius["8"],
                backgroundColor: e.hex,
                borderWidth: 1,
                borderColor: colour.border.subtle,
              }}
            />
            <Text
              style={[
                textStyles.B14_SemiBold,
                { color: colour["text-n-icon"].primary, flex: 1 },
              ]}
            >
              {e.name}
            </Text>
            <Text
              style={[
                textStyles.B12_Regular,
                {
                  color: colour["text-n-icon"].tertiary,
                  fontVariant: ["tabular-nums"],
                  width: 80,
                  textAlign: "right",
                },
              ]}
            >
              {`${rgb.r}/${rgb.g}/${rgb.b}`}
            </Text>
            <Text
              style={[
                textStyles.B12_Regular,
                {
                  color: colour["text-n-icon"].muted,
                  fontVariant: ["tabular-nums"],
                  width: 110,
                  textAlign: "right",
                },
              ]}
            >
              {`${cmyk.c}/${cmyk.m}/${cmyk.y}/${cmyk.k}`}
            </Text>
            <Text
              style={[
                textStyles.B14_SemiBold,
                {
                  color: tintedInkOn("#ffffff"),
                  fontVariant: ["tabular-nums"],
                  width: 96,
                  textAlign: "right",
                },
              ]}
            >
              {e.hex.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionHeading({ children }: { children: string }) {
  const shell = useShell();
  return (
    <Text
      style={[
        textStyles.H32_Bold,
        { color: shell.textPrimary, letterSpacing: -0.5 },
      ]}
    >
      {children}
    </Text>
  );
}
