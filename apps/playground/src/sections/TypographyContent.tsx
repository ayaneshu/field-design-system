import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
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

/**
 * Top-right download button for the typography page. Triggers a sequenced
 * download of every Noontree weight; consumed by FoundationsScreen's
 * `rightSlot` so it sits near the page heading.
 */
export function TypographyDownloadButton({
  onDone,
}: {
  onDone?: () => void;
}) {
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
        backgroundColor: colour["text-n-icon"].primary,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Icon name="system-download" size={16} color={colour.surface.primary} />
      <Text
        style={[
          textStyles.Body_B14_SemiBold,
          { color: colour["text-n-icon"]["on-surface-bold"] },
        ]}
      >
        Download
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
  const [activeFamily, setActiveFamily] = useState<Family>("Heading");
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

  return (
    <View>
      {/* ─────────── Typeface meta ─────────── */}
      <View style={{ marginBottom: space["72"] }}>
        <Text
          style={[
            textStyles.Body_B11_SemiBold,
            {
              color: shell.textTertiary,
              textTransform: "uppercase",
              letterSpacing: 1.4,
              marginBottom: space["12"],
            },
          ]}
        >
          Typeface
        </Text>
        <Text
          style={{
            fontFamily: "Noontree-Bold",
            color: shell.textPrimary,
            fontSize: 56,
            lineHeight: 60,
            letterSpacing: -1.2,
          }}
        >
          Noontree
        </Text>
        <Text
          style={[
            textStyles.Body_B14_Regular,
            {
              color: shell.textTertiary,
              marginTop: space["12"],
              maxWidth: 560,
            },
          ]}
        >
          7 weights · variable axis from Light to Black · noon's house typeface.
        </Text>
      </View>

      {/* ─────────── Preview text input ─────────── */}
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 1.4,
            marginBottom: space["12"],
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
          textStyles.Heading_H24_Bold,
          {
            color: shell.textPrimary,
            paddingVertical: space["18"],
            borderBottomWidth: 1,
            borderBottomColor: shell.border,
            outlineStyle: "none",
            marginBottom: space["56"],
          },
        ]}
      />

      {/* ─────────── Family tabs ─────────── */}
      <View
        style={{
          flexDirection: "row",
          gap: space["6"],
          padding: space["4"],
          borderRadius: radius.rounded,
          backgroundColor: colour.surface.secondary,
          alignSelf: "flex-start",
          marginBottom: space["48"],
        }}
      >
        {(["Heading", "Body", "Action"] as Family[]).map((f) => {
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
                backgroundColor: active ? colour.surface.primary : "transparent",
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text
                style={[
                  textStyles.Body_B14_SemiBold,
                  {
                    color: active
                      ? colour["text-n-icon"].primary
                      : colour["text-n-icon"].tertiary,
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
                        : colour["text-n-icon"].muted,
                    },
                  ]}
                >
                  {groups[f].length}
                </Text>
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ─────────── Style table — relaxed two-column rows ─────────── */}
      <View>
        {groups[activeFamily].map((name, i) => (
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
    </View>
  );
}

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
        flexDirection: "row",
        alignItems: "flex-start",
        gap: space["48"],
        paddingVertical: space["40"],
        paddingHorizontal: space["8"],
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: shell.border,
        backgroundColor: hovered ? shell.sidebarRowHoverBg : "transparent",
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {/* Left: name + token + numerical badge */}
      <View style={{ width: 220, flexShrink: 0 }}>
        <Text
          style={[
            textStyles.Body_B14_SemiBold,
            { color: shell.textPrimary, letterSpacing: -0.1 },
          ]}
        >
          {prettyName(name)}
        </Text>
        <Text
          style={[
            textStyles.Body_B12_Regular,
            {
              color: shell.textTertiary,
              marginTop: space["6"],
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          {spec.fontSize} / {spec.lineHeight}
        </Text>
        <Text
          style={[
            textStyles.Body_B11_Regular,
            {
              color: shell.textMuted,
              marginTop: space["10"],
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          textStyles.{name}
        </Text>
      </View>

      {/* Right: live sample + spec pills */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={2}
          style={[
            textStyles[name],
            { color: shell.textPrimary },
          ]}
        >
          {preview}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: space["8"],
            marginTop: space["20"],
          }}
        >
          <Pill label="weight" value={spec.fontWeight} />
          <Pill label="tracking" value={`${spec.letterSpacing}px`} />
          <Pill label="family" value={spec.fontFamily} />
        </View>
      </View>
    </Pressable>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: space["6"],
        paddingHorizontal: space["10"],
        paddingVertical: space["4"],
        borderRadius: radius.rounded,
        backgroundColor: colour.surface.secondary,
        borderWidth: 1,
        borderColor: colour.border.subtle,
      }}
    >
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: colour["text-n-icon"].tertiary,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          textStyles.Body_B12_SemiBold,
          { color: colour["text-n-icon"].primary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/** "Heading_H40_Bold" → "Heading H40 Bold" */
function prettyName(name: string) {
  return name.replace(/_/g, " ");
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
