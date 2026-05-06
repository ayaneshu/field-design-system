import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles, type TextStyleName } from "@field-ds/tokens";

import { useShell } from "../theme/ThemeContext";

const NOONTREE_WEIGHTS = [
  "Light",
  "Regular",
  "Medium",
  "SemiBold",
  "Bold",
  "ExtraBold",
  "Black",
] as const;

const FONT_OTF: Record<string, unknown> = {
  Light: require("@field-ds/fonts/files/Noontree-Light.otf"),
  Regular: require("@field-ds/fonts/files/Noontree-Regular.otf"),
  Medium: require("@field-ds/fonts/files/Noontree-Medium.otf"),
  SemiBold: require("@field-ds/fonts/files/Noontree-SemiBold.otf"),
  Bold: require("@field-ds/fonts/files/Noontree-Bold.otf"),
  ExtraBold: require("@field-ds/fonts/files/Noontree-ExtraBold.otf"),
  Black: require("@field-ds/fonts/files/Noontree-Black.otf"),
};

type StyleSpec = {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
};

function readSpec(name: TextStyleName): StyleSpec {
  const s = textStyles[name] as StyleSpec;
  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
  };
}

type Family = "Heading" | "Body" | "Action";
type FamilyFilter = "All" | Family;

// Glyph groups for the character set.
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
const PUNCTUATION = [
  ".", ",", ":", ";", "!", "?",
  "¡", "¿", "‚", "„", "—", "–",
  "/", "\\", "|", "(", ")", "[",
  "]", "{", "}", "•", "·", "…",
  "·", "<", ">", "«", "»", "“",
  "”",
];
const MATH_SYMBOLS = ["+", "−", "×", "÷", "=", "≠", "<", ">", "/", "%", "‰", "#", "@", "&"];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const CURRENCY = ["$", "€", "£", "¥", "¢", "₹", "₽", "₩"];

/**
 * Top-right page slot. Kept exported for back-compat — the new Figma puts
 * the download CTA inside the Noontree banner so this is no longer used by
 * the typography page itself, but other surfaces can still call it.
 */
export function TypographyDownloadButton({
  onDone,
  variant = "dark",
}: {
  onDone?: () => void;
  variant?: "dark" | "light";
}) {
  const onLight = variant === "light";
  const downloadAll = async () => {
    if (Platform.OS !== "web") return;
    for (const w of NOONTREE_WEIGHTS) {
      downloadAsset(FONT_OTF[w], `Noontree-${w}.otf`);
      await new Promise((r) => setTimeout(r, 120));
    }
    onDone?.();
  };
  return (
    <Pressable
      onPress={downloadAll}
      accessibilityRole="button"
      accessibilityLabel="Download Noontree font (all weights)"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: space["8"],
        paddingHorizontal: space["16"],
        paddingVertical: space["12"],
        borderRadius: radius.rounded,
        backgroundColor: onLight ? colour.surface.primary : colour["text-n-icon"].primary,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Icon
        name="system-download"
        size={16}
        color={onLight ? colour["text-n-icon"].primary : colour.surface.primary}
      />
      <Text
        style={[
          textStyles.Body_B14_SemiBold,
          {
            color: onLight
              ? colour["text-n-icon"].primary
              : colour["text-n-icon"]["on-surface-bold"],
          },
        ]}
      >
        Download Font
      </Text>
    </Pressable>
  );
}

export function TypographyContent({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const [previewText, setPreviewText] = useState(
    "The quick brown fox jumps over the lazy dog",
  );
  const [activeFamily, setActiveFamily] = useState<FamilyFilter>("All");
  const [selectedGlyph, setSelectedGlyph] = useState<string>("C");
  const shell = useShell();

  const groups = useMemo(() => {
    const all = (Object.keys(textStyles) as TextStyleName[]).sort((a, b) => {
      const order = (n: TextStyleName) => {
        const fam = n.split("_")[0];
        const m = n.match(/_[HBA](\d+)/);
        const size = m ? parseInt(m[1], 10) : 0;
        const famIdx = fam === "Heading" ? 0 : fam === "Body" ? 1 : 2;
        return famIdx * 1_000_000 - size;
      };
      const oa = order(a);
      const ob = order(b);
      return oa !== ob ? oa - ob : a.localeCompare(b);
    });
    const g: Record<Family, TextStyleName[]> = { Heading: [], Body: [], Action: [] };
    for (const n of all) {
      const fam = n.split("_")[0] as Family;
      if (g[fam]) g[fam].push(n);
    }
    return g;
  }, []);

  const totalCount = groups.Heading.length + groups.Body.length + groups.Action.length;
  const filterCount = (f: FamilyFilter) =>
    f === "All" ? totalCount : groups[f].length;

  const visibleSections: { family: Family; rows: TextStyleName[] }[] =
    activeFamily === "All"
      ? (["Heading", "Body", "Action"] as Family[])
          .map((fam) => ({ family: fam, rows: groups[fam] }))
          .filter((s) => s.rows.length > 0)
      : [{ family: activeFamily, rows: groups[activeFamily] }];

  return (
    <View>
      {/* ─────────── Noontree banner ─────────── */}
      <NoontreeBanner
        onDownloaded={() => copy("Noontree", "all weights downloaded")}
      />

      {/* ─────────── Character set ─────────── */}
      <View style={{ marginTop: space["56"] }}>
        <SectionTitle>Character set</SectionTitle>
        <View
          style={{
            height: 1,
            backgroundColor: shell.border,
            marginTop: space["16"],
          }}
        />
        <Text
          style={[
            textStyles.Body_B14_Regular,
            {
              color: shell.textTertiary,
              marginTop: space["20"],
              maxWidth: 560,
            },
          ]}
        >
          Our font includes a standard character set along with glyphs including
          punctuation, math symbols, currency, and numbers.
        </Text>

        <CharacterSetBody
          selected={selectedGlyph}
          onSelect={setSelectedGlyph}
        />
      </View>

      {/* ─────────── Preview text input ─────────── */}
      <View style={{ marginTop: space["72"] }}>
        <Text
          style={[
            textStyles.Body_B11_SemiBold,
            {
              color: shell.textTertiary,
              textTransform: "uppercase",
              letterSpacing: 1.4,
              marginBottom: space["8"],
            },
          ]}
        >
          Preview text
        </Text>
        <TextInput
          value={previewText}
          onChangeText={setPreviewText}
          placeholder="Type to preview…"
          placeholderTextColor={shell.textMuted}
          // @ts-expect-error — outlineStyle is web-only
          style={[
            textStyles.Body_B14_Regular,
            {
              color: shell.textPrimary,
              paddingHorizontal: space["16"],
              paddingVertical: space["14"],
              borderWidth: 1,
              borderColor: shell.border,
              borderRadius: radius["12"],
              backgroundColor: "transparent",
              outlineStyle: "none",
            },
          ]}
        />
      </View>

      {/* ─────────── Family tabs ─────────── */}
      <View
        style={{
          flexDirection: "row",
          gap: space["4"],
          padding: space["4"],
          borderRadius: radius.rounded,
          backgroundColor: shell.sidebarBg,
          alignSelf: "flex-start",
          marginTop: space["32"],
          marginBottom: space["48"],
        }}
      >
        {(["All", "Heading", "Body", "Action"] as FamilyFilter[]).map((f) => {
          const active = f === activeFamily;
          return (
            <Pressable
              key={f}
              onPress={() => setActiveFamily(f)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                paddingHorizontal: space["16"],
                paddingVertical: space["10"],
                borderRadius: radius.rounded,
                backgroundColor: active ? shell.previewIslandBg : "transparent",
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text
                style={[
                  textStyles.Body_B14_SemiBold,
                  {
                    color: active
                      ? colour["text-n-icon"].primary
                      : shell.textTertiary,
                  },
                ]}
              >
                {f}{" "}
                <Text
                  style={[
                    textStyles.Body_B12_Regular,
                    {
                      color: active
                        ? colour["text-n-icon"].tertiary
                        : shell.textMuted,
                    },
                  ]}
                >
                  {filterCount(f)}
                </Text>
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ─────────── Style table ─────────── */}
      <View>
        {visibleSections.map(({ family, rows }) => (
          <View
            key={family}
            style={{ marginBottom: space["32"] }}
          >
            <Text
              style={[
                textStyles.Heading_H24_Bold,
                {
                  color: shell.textPrimary,
                  marginBottom: space["20"],
                },
              ]}
            >
              {family}
            </Text>
            {rows.map((name, i) => (
              <StyleRow
                key={name}
                name={name}
                spec={readSpec(name)}
                preview={previewText || "The quick brown fox jumps over the lazy dog"}
                onCopy={copy}
                isFirst={i === 0}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─────────── Noontree banner ───────────

function NoontreeBanner({ onDownloaded }: { onDownloaded?: () => void }) {
  const downloadAll = async () => {
    if (Platform.OS !== "web") return;
    for (const w of NOONTREE_WEIGHTS) {
      downloadAsset(FONT_OTF[w], `Noontree-${w}.otf`);
      await new Promise((r) => setTimeout(r, 120));
    }
    onDownloaded?.();
  };

  return (
    <View
      style={{
        backgroundColor: colour["text-n-icon"].action,
        borderRadius: radius["20"],
        overflow: "hidden",
        minHeight: 200,
        flexDirection: "row",
        alignItems: "stretch",
      }}
    >
      {/* Left: wordmark + download */}
      <View
        style={{
          flex: 1,
          padding: space["32"],
          justifyContent: "space-between",
          gap: space["32"],
        }}
      >
        <Text
          style={{
            fontFamily: "Noontree-Bold",
            fontSize: 56,
            lineHeight: 60,
            color: colour.surface.primary,
            letterSpacing: -1,
          }}
        >
          Noontree
        </Text>
        <Pressable
          onPress={downloadAll}
          accessibilityRole="button"
          accessibilityLabel="Download Noontree font (all weights)"
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: space["8"],
            paddingHorizontal: space["16"],
            paddingVertical: space["12"],
            borderRadius: radius.rounded,
            backgroundColor: colour.surface.primary,
            alignSelf: "flex-start",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Icon
            name="system-download"
            size={16}
            color={colour["text-n-icon"].primary}
          />
          <Text
            style={[
              textStyles.Body_B14_SemiBold,
              { color: colour["text-n-icon"].primary },
            ]}
          >
            Download Font
          </Text>
        </Pressable>
      </View>

      {/* Right: decorative giant letters in a slightly lighter blue */}
      <View
        pointerEvents="none"
        style={{
          width: 320,
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          paddingRight: space["32"],
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: space["16"] }}>
          <Text
            style={{
              fontFamily: "Noontree-Bold",
              fontSize: 240,
              lineHeight: 240,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: -8,
            }}
          >
            A
          </Text>
          <Text
            style={{
              fontFamily: "Noontree-Bold",
              fontSize: 200,
              lineHeight: 200,
              color: "rgba(255,255,255,0.12)",
              letterSpacing: -6,
            }}
          >
            Aa
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────── Character set ───────────

function CharacterSetBody({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (g: string) => void;
}) {
  const { width } = useWindowDimensions();
  const split = width >= 1100;

  const left = (
    <View style={{ flex: split ? 1 : undefined, minWidth: 0, gap: space["32"] }}>
      <GlyphGroup
        title="Uppercase"
        glyphs={UPPERCASE}
        selected={selected}
        onSelect={onSelect}
      />
      <GlyphGroup
        title="Lowercase"
        glyphs={LOWERCASE}
        selected={selected}
        onSelect={onSelect}
      />
      <GlyphGroup
        title="Punctuation"
        glyphs={PUNCTUATION}
        selected={selected}
        onSelect={onSelect}
      />
      <GlyphGroup
        title="Math and symbols"
        glyphs={MATH_SYMBOLS}
        selected={selected}
        onSelect={onSelect}
      />
      <GlyphGroup
        title="Numbers"
        glyphs={NUMBERS}
        selected={selected}
        onSelect={onSelect}
      />
      <GlyphGroup
        title="Currency"
        glyphs={CURRENCY}
        selected={selected}
        onSelect={onSelect}
      />
    </View>
  );

  const right = (
    <View
      style={
        split
          ? {
              flex: 1,
              minWidth: 0,
              alignSelf: "flex-start",
              // @ts-expect-error sticky on web
              position: "sticky",
              top: 24,
            }
          : { width: "100%", marginTop: space["24"] }
      }
    >
      <GlyphPreview char={selected} />
    </View>
  );

  return (
    <View
      style={{
        marginTop: space["32"],
        flexDirection: split ? "row" : "column",
        alignItems: "flex-start",
        gap: split ? 40 : 0,
      }}
    >
      {left}
      {right}
    </View>
  );
}

function GlyphGroup({
  title,
  glyphs,
  selected,
  onSelect,
}: {
  title: string;
  glyphs: string[];
  selected: string;
  onSelect: (g: string) => void;
}) {
  const shell = useShell();
  // 6 columns gives a tight Figma-style grid that scales to ~5 on narrow.
  const cols = 6;
  return (
    <View>
      <Text
        style={[
          textStyles.Body_B16_Bold,
          { color: shell.textPrimary, marginBottom: space["12"] },
        ]}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          // Negative-margin trick to align the 1-px borders into a single
          // grid without doubled lines, matching the Figma look.
          borderWidth: 1,
          borderColor: shell.border,
          borderRadius: radius["8"],
          overflow: "hidden",
        }}
      >
        {glyphs.map((g, i) => (
          <GlyphCell
            key={`${g}-${i}`}
            char={g}
            selected={g === selected}
            onPress={() => onSelect(g)}
            cols={cols}
            isLast={i === glyphs.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function GlyphCell({
  char,
  selected,
  onPress,
  cols,
  isLast,
}: {
  char: string;
  selected: boolean;
  onPress: () => void;
  cols: number;
  isLast: boolean;
}) {
  const shell = useShell();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Glyph ${char}`}
      accessibilityState={{ selected }}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: `${100 / cols}%` as never,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderRightColor: shell.border,
        borderBottomColor: shell.border,
        backgroundColor: selected
          ? colour["text-n-icon"].action
          : hovered
            ? shell.sidebarBg
            : "transparent",
        opacity: pressed ? 0.85 : 1,
        // @ts-expect-error rn-web passes through
        transitionProperty: "background-color",
        transitionDuration: "150ms",
        transitionTimingFunction: "ease-out",
      })}
    >
      <Text
        style={{
          fontFamily: "Noontree-SemiBold",
          fontSize: 18,
          lineHeight: 22,
          color: selected ? colour.surface.primary : shell.textPrimary,
        }}
      >
        {char}
      </Text>
    </Pressable>
  );
}

function GlyphPreview({ char }: { char: string }) {
  const shell = useShell();
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 4 / 3,
        backgroundColor: shell.sidebarBg,
        borderRadius: radius["20"],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Noontree-Bold",
          fontSize: 240,
          lineHeight: 240,
          color: shell.textPrimary,
          letterSpacing: -6,
        }}
      >
        {char}
      </Text>
    </View>
  );
}

// ─────────── Style row (redesigned per Figma) ───────────

function StyleRow({
  name,
  spec,
  preview,
  onCopy,
  isFirst,
}: {
  name: TextStyleName;
  spec: StyleSpec;
  preview: string;
  onCopy: (text: string, label?: string) => void;
  isFirst: boolean;
}) {
  const shell = useShell();
  return (
    <Pressable
      onPress={() => onCopy(`textStyles.${name}`, name)}
      accessibilityRole="button"
      accessibilityLabel={`Copy textStyles.${name}`}
      // @ts-expect-error — hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        paddingTop: space["28"],
        paddingBottom: space["28"],
        paddingHorizontal: space["8"],
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: shell.border,
        backgroundColor: hovered ? shell.sidebarRowHoverBg : "transparent",
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {/* Top row: style name on the left, four spec pills on the right */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: space["24"],
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={[
              textStyles.Body_B16_Bold,
              { color: shell.textPrimary },
            ]}
          >
            {prettyName(name)}
          </Text>
          <Text
            style={[
              textStyles.Body_B11_Regular,
              {
                color: shell.textMuted,
                marginTop: space["4"],
                fontVariant: ["tabular-nums"],
              },
            ]}
          >
            textStyles.{name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: space["32"],
            paddingTop: space["4"],
          }}
        >
          <Spec label="Font size" value={`${spec.fontSize}px`} />
          <Spec label="Font weight" value={spec.fontWeight} />
          <Spec label="Line height" value={`${spec.lineHeight}px`} />
          <Spec label="Tracking" value={`${spec.letterSpacing}px`} />
        </View>
      </View>

      {/* Sample below — full width in the actual style */}
      <Text
        numberOfLines={2}
        style={[
          textStyles[name],
          { color: shell.textPrimary, marginTop: space["20"] },
        ]}
      >
        {preview}
      </Text>
    </Pressable>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  const shell = useShell();
  return (
    <View>
      <Text
        style={[
          textStyles.Body_B11_Regular,
          {
            color: shell.textTertiary,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          textStyles.Body_B14_SemiBold,
          {
            color: shell.textPrimary,
            marginTop: space["4"],
            fontVariant: ["tabular-nums"],
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  const shell = useShell();
  return (
    <Text
      style={[
        textStyles.Heading_H24_Bold,
        { color: shell.textPrimary },
      ]}
    >
      {children}
    </Text>
  );
}

/** "Heading_H40_Bold" → "H40 Bold" */
function prettyName(name: string) {
  return name.replace(/^(Heading|Body|Action)_/, "").replace(/_/g, " ");
}

function downloadAsset(asset: unknown, filename: string) {
  if (typeof document === "undefined") return;
  const href =
    typeof asset === "string"
      ? asset
      : asset && typeof asset === "object" && "uri" in (asset as Record<string, unknown>)
        ? String((asset as { uri: string }).uri)
        : "";
  if (!href) return;
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
